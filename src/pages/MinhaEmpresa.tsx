import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, FileText, DollarSign, Calendar, Plus, Eye, CheckCircle, Clock, Loader2, AlertCircle, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddCompanyDialog } from "@/components/company/AddCompanyDialog";
import { apiService, Company, Captation, CaptationCreate, Opportunity } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const MinhaEmpresa = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [captations, setCaptations] = useState<Captation[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingCaptations, setLoadingCaptations] = useState(false);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user's company
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setLoading(true);
        setError(null);
        const userCompany = await apiService.getMyCompany();
        setCompany(userCompany);
      } catch (error) {
        console.error('Error fetching company:', error);
        setError('Empresa não encontrada');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  // Fetch captations when company is available
  useEffect(() => {
    if (company) {
      fetchCaptations();
      fetchOpportunities();
    }
  }, [company]);

  const fetchCaptations = async () => {
    if (!company) return;
    
    try {
      setLoadingCaptations(true);
      const userCaptations = await apiService.listCaptations();
      setCaptations(userCaptations);
    } catch (error) {
      console.error('Error fetching captations:', error);
      toast({
        title: "Erro ao carregar solicitações",
        description: "Não foi possível carregar as solicitações de crédito.",
        variant: "destructive"
      });
    } finally {
      setLoadingCaptations(false);
    }
  };

  const fetchOpportunities = async () => {
    if (!company) return;
    
    try {
      setLoadingOpportunities(true);
      const companyOpportunities = await apiService.getMyCompanyOpportunities();
      setOpportunities(companyOpportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: "Erro ao carregar oportunidades",
        description: "Não foi possível carregar as oportunidades criadas.",
        variant: "destructive"
      });
    } finally {
      setLoadingOpportunities(false);
    }
  };

  const [formData, setFormData] = useState({
    requestedAmount: "",
    duration: "",
    purpose: "",
    description: "",
    monthlyInterestRate: "",
    expectedReturn: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyAdded = (newCompany: Company) => {
    setCompany(newCompany);
    toast({
      title: "Empresa criada!",
      description: `${newCompany.company_name} foi criada com sucesso.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!company) {
      toast({
        title: "Empresa não encontrada",
        description: "Por favor, crie uma empresa primeiro.",
        variant: "destructive"
      });
      return;
    }

    const requestedAmount = parseFloat(formData.requestedAmount.replace(/[^\d.,]/g, '').replace(',', '.'));
    const duration = parseInt(formData.duration);
    const monthlyInterestRate = parseFloat(formData.monthlyInterestRate);
    const expectedReturn = parseFloat(formData.expectedReturn);

    if (!requestedAmount || !duration || !formData.purpose || !monthlyInterestRate || !expectedReturn) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const captationData: CaptationCreate = {
        company_id: company.company_id,
        requested_amount: Math.round(requestedAmount * 100), // Convert to cents
        purpose: formData.purpose,
        description: formData.description || undefined,
        duration_months: duration,
        monthly_interest_rate: monthlyInterestRate,
        expected_return: expectedReturn
      };

      await apiService.createCaptation(captationData);
      
      toast({
        title: "Solicitação enviada!",
        description: "Sua solicitação de crédito foi enviada com sucesso.",
      });

      setShowSuccessDialog(true);
      setShowNewRequestDialog(false);
      
      // Reset form
      setFormData({
        requestedAmount: "",
        duration: "",
        purpose: "",
        description: "",
        monthlyInterestRate: "",
        expectedReturn: ""
      });

      // Refresh captations list
      fetchCaptations();
      fetchOpportunities();
    } catch (error) {
      console.error('Error creating captation:', error);
      toast({
        title: "Erro ao enviar solicitação",
        description: "Não foi possível enviar sua solicitação. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default" className="bg-success text-white">Aprovado</Badge>;
      case "pending":
        return <Badge variant="secondary" className="bg-warning text-white">Pendente</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejeitado</Badge>;
      case "cancelled":
        return <Badge variant="outline">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getOpportunityStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default" className="bg-blue-500 text-white">Aberta</Badge>;
      case "funding":
        return <Badge variant="default" className="bg-orange-500 text-white">Captando</Badge>;
      case "funded":
        return <Badge variant="default" className="bg-green-500 text-white">Captada</Badge>;
      case "active":
        return <Badge variant="default" className="bg-purple-500 text-white">Ativa</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-gray-500 text-white">Finalizada</Badge>;
      case "defaulted":
        return <Badge variant="destructive">Inadimplente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getOpportunityStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "funding":
        return <DollarSign className="h-5 w-5 text-orange-500" />;
      case "funded":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "active":
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
      case "defaulted":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "pending":
        return <Clock className="h-5 w-5 text-warning" />;
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "cancelled":
        return <Eye className="h-5 w-5 text-muted-foreground" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Minha Empresa">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando empresa...</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !company) {
    return (
      <DashboardLayout title="Minha Empresa">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <Card className="shadow-card border-0">
              <CardContent className="text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhuma empresa encontrada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Você ainda não possui uma empresa cadastrada. Crie uma empresa para começar.
                </p>
                <AddCompanyDialog onCompanyAdded={handleCompanyAdded} />
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Minha Empresa">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Gestão Empresarial</h2>
              <p className="text-muted-foreground">
                Gerencie suas solicitações de crédito e oportunidades de investimento
              </p>
            </div>
            <div className="flex gap-2">
              <AddCompanyDialog onCompanyAdded={handleCompanyAdded} />
              <Button 
                onClick={() => setShowNewRequestDialog(true)}
                className="gradient-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Solicitação
              </Button>
            </div>
          </div>

          <Tabs defaultValue="captations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="captations">Solicitações de Crédito</TabsTrigger>
              <TabsTrigger value="opportunities">Oportunidades Criadas</TabsTrigger>
            </TabsList>
            
            <TabsContent value="captations" className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-blue-900 mb-2">📋 Status das Solicitações</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-orange-600 font-semibold text-lg">
                      {captations.filter(c => c.status === 'pending').length}
                    </div>
                    <div className="text-muted-foreground">Pendentes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600 font-semibold text-lg">
                      {captations.filter(c => c.status === 'approved').length}
                    </div>
                    <div className="text-muted-foreground">Aprovadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-600 font-semibold text-lg">
                      {captations.filter(c => c.status === 'rejected').length}
                    </div>
                    <div className="text-muted-foreground">Rejeitadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 font-semibold text-lg">
                      {captations.filter(c => c.status === 'cancelled').length}
                    </div>
                    <div className="text-muted-foreground">Canceladas</div>
                  </div>
                </div>
              </div>

              {loadingCaptations ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="text-muted-foreground mt-2">Carregando solicitações...</p>
                </div>
              ) : captations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {captations.map((captation) => (
                    <Card key={captation.captation_id} className="shadow-card border-0">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {getStatusIcon(captation.status)}
                              {company?.company_name || "Sua Empresa"}
                            </CardTitle>
                            <CardDescription>
                              CNPJ: {company?.cnpj || "Não informado"}
                            </CardDescription>
                          </div>
                          {getStatusBadge(captation.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Valor Solicitado</p>
                            <p className="text-lg font-semibold">
                              R$ {(captation.requested_amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Prazo</p>
                            <p className="text-lg font-semibold">{captation.duration_months} meses</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Taxa de Juros Mensal</p>
                            <p className="text-lg font-semibold">{captation.monthly_interest_rate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Retorno Esperado</p>
                            <p className="text-lg font-semibold">{captation.expected_return}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Data da Solicitação</p>
                            <p className="text-sm font-medium">
                              {new Date(captation.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          {captation.approved_at && (
                            <div>
                              <p className="text-sm text-muted-foreground">Data da Aprovação</p>
                              <p className="text-sm font-medium">
                                {new Date(captation.approved_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Finalidade</p>
                          <p className="text-sm">{captation.purpose}</p>
                        </div>
                        {captation.description && (
                          <div>
                            <p className="text-sm text-muted-foreground">Descrição</p>
                            <p className="text-sm">{captation.description}</p>
                          </div>
                        )}
                        
                        {/* Status Specific Information */}
                        {captation.status === 'approved' && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm text-green-800 font-medium mb-1">✅ Solicitação Aprovada!</p>
                            <p className="text-xs text-green-700">
                              Sua captação foi automaticamente convertida em uma oportunidade de investimento. 
                              Verifique a aba "Oportunidades Criadas" para acompanhar os investimentos.
                            </p>
                          </div>
                        )}
                        
                        {captation.status === 'pending' && (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <p className="text-sm text-orange-800 font-medium mb-1">⏳ Aguardando Aprovação</p>
                            <p className="text-xs text-orange-700">
                              Sua solicitação está sendo analisada. Com o sistema de auto-aprovação ativo, 
                              ela será aprovada automaticamente em breve.
                            </p>
                          </div>
                        )}

                        <Button variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalhes
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-card border-0">
                  <CardContent className="text-center py-12">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Nenhuma solicitação encontrada
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Você ainda não fez nenhuma solicitação de crédito.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <AddCompanyDialog onCompanyAdded={handleCompanyAdded} />
                      <Button 
                        onClick={() => setShowNewRequestDialog(true)}
                        className="gradient-primary text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Fazer Primeira Solicitação
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="opportunities" className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <h3 className="font-medium text-purple-900 mb-2">🎯 Status das Oportunidades</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-blue-600 font-semibold text-lg">
                      {opportunities.filter(o => o.status === 'open').length}
                    </div>
                    <div className="text-muted-foreground">Abertas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-orange-600 font-semibold text-lg">
                      {opportunities.filter(o => o.status === 'funding').length}
                    </div>
                    <div className="text-muted-foreground">Captando</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-600 font-semibold text-lg">
                      {opportunities.filter(o => o.status === 'funded').length}
                    </div>
                    <div className="text-muted-foreground">Captadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-600 font-semibold text-lg">
                      {opportunities.filter(o => o.status === 'active').length}
                    </div>
                    <div className="text-muted-foreground">Ativas</div>
                  </div>
                </div>
              </div>

              {loadingOpportunities ? (
                <div className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  <p className="text-muted-foreground mt-2">Carregando oportunidades...</p>
                </div>
              ) : opportunities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {opportunities.map((opportunity) => (
                    <Card key={opportunity.opportunity_id} className="shadow-card border-0">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {getOpportunityStatusIcon(opportunity.status)}
                              {company?.company_name || "Sua Empresa"}
                            </CardTitle>
                            <CardDescription>
                              ID: {opportunity.opportunity_id.slice(-8).toUpperCase()}
                            </CardDescription>
                          </div>
                          {getOpportunityStatusBadge(opportunity.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Valor Alvo</p>
                            <p className="text-lg font-semibold">
                              R$ {(opportunity.target_amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Valor Captado</p>
                            <p className="text-lg font-semibold">
                              R$ {(opportunity.funded_amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Preço por Cota</p>
                            <p className="text-lg font-semibold">
                              R$ {(opportunity.quota_price / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Cotas Disponíveis</p>
                            <p className="text-lg font-semibold">{opportunity.available_quotas}/{opportunity.total_quotas}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Investidores</p>
                            <p className="text-lg font-semibold flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {opportunity.investors_count}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Progresso</p>
                            <p className="text-lg font-semibold">
                              {Math.round((opportunity.funded_amount / opportunity.target_amount) * 100)}%
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Data de Criação</p>
                            <p className="text-sm font-medium">
                              {new Date(opportunity.created_at).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          {opportunity.funding_deadline && (
                            <div>
                              <p className="text-sm text-muted-foreground">Prazo Final</p>
                              <p className="text-sm font-medium">
                                {new Date(opportunity.funding_deadline).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {/* Progress bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progresso da captação</span>
                            <span>{Math.round((opportunity.funded_amount / opportunity.target_amount) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(100, (opportunity.funded_amount / opportunity.target_amount) * 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Oportunidade
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="shadow-card border-0">
                  <CardContent className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      Nenhuma oportunidade criada
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Suas captações aprovadas aparecerão aqui como oportunidades de investimento.
                    </p>
                    <Button 
                      onClick={() => setShowNewRequestDialog(true)}
                      className="gradient-primary text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Nova Solicitação
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Dialog para Nova Solicitação */}
          <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Nova Solicitação de Crédito
                </DialogTitle>
                <DialogDescription>
                  Selecione uma empresa e preencha as informações para solicitar crédito
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Info */}
                <div className="space-y-2">
                  <Label>Empresa</Label>
                  {company ? (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Empresa:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Nome:</span>
                          <p className="font-medium">{company.company_name}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">CNPJ:</span>
                          <p className="font-medium">{company.cnpj}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Faturamento Anual:</span>
                          <p className="font-medium">R$ {company.annual_revenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Funcionários:</span>
                          <p className="font-medium">{company.employees_count}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-muted-foreground mb-2">Nenhuma empresa encontrada</p>
                      <AddCompanyDialog onCompanyAdded={handleCompanyAdded} />
                    </div>
                  )}
                </div>

                {/* Requested Amount */}
                <div className="space-y-2">
                  <Label htmlFor="requestedAmount">Valor Solicitado *</Label>
                  <Input
                    id="requestedAmount"
                    placeholder="R$ 0,00"
                    value={formData.requestedAmount}
                    onChange={(e) => handleInputChange("requestedAmount", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration">Prazo Desejado *</Label>
                  <Select
                    value={formData.duration}
                    onValueChange={(value) => handleInputChange("duration", value)}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o prazo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 meses</SelectItem>
                      <SelectItem value="12">12 meses</SelectItem>
                      <SelectItem value="18">18 meses</SelectItem>
                      <SelectItem value="24">24 meses</SelectItem>
                      <SelectItem value="36">36 meses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Monthly Interest Rate */}
                <div className="space-y-2">
                  <Label htmlFor="monthlyInterestRate">Taxa de Juros Mensal (%) *</Label>
                  <Input
                    id="monthlyInterestRate"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 2.5"
                    value={formData.monthlyInterestRate}
                    onChange={(e) => handleInputChange("monthlyInterestRate", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Expected Return */}
                <div className="space-y-2">
                  <Label htmlFor="expectedReturn">Retorno Esperado Total (%) *</Label>
                  <Input
                    id="expectedReturn"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 15.0"
                    value={formData.expectedReturn}
                    onChange={(e) => handleInputChange("expectedReturn", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Purpose */}
                <div className="space-y-2">
                  <Label htmlFor="purpose">Finalidade do Crédito *</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Descreva brevemente a finalidade do crédito..."
                    value={formData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                    rows={2}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição Detalhada (Opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva detalhadamente como o crédito será utilizado..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full gradient-primary text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Enviar Solicitação
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Success Dialog */}
          <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-success rounded-full"></div>
                  </div>
                  Solicitação Enviada!
                </DialogTitle>
                <DialogDescription>
                  Sua solicitação de crédito foi enviada com sucesso. Nossa equipe analisará 
                  os dados e entrará em contato em até 48 horas com o resultado.
                </DialogDescription>
              </DialogHeader>
              <Button onClick={handleCloseSuccess} className="w-full">
                Continuar
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MinhaEmpresa;