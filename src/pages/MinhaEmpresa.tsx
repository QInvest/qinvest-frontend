import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, FileText, DollarSign, Calendar, Plus, Eye, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddCompanyDialog } from "@/components/company/AddCompanyDialog";
import { useCompany } from "@/contexts/CompanyContext";
import { useToast } from "@/hooks/use-toast";

const MinhaEmpresa = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { companies } = useCompany();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  // Mock data para solicitações existentes
  const [solicitacoes] = useState([
    {
      id: 1,
      empresa: "TechSolutions LTDA",
      valor: 50000,
      prazo: 12,
      status: "aprovado",
      dataSolicitacao: "2024-01-15",
      dataAprovacao: "2024-01-18"
    },
    {
      id: 2,
      empresa: "TechSolutions LTDA",
      valor: 25000,
      prazo: 6,
      status: "pendente",
      dataSolicitacao: "2024-01-20"
    }
  ]);

  const [formData, setFormData] = useState({
    requestedAmount: "",
    term: "",
    purpose: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyAdded = (company: any) => {
    setSelectedCompanyId(company.id);
    toast({
      title: "Empresa adicionada!",
      description: `${company.companyName} foi adicionada e selecionada.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCompanyId) {
      toast({
        title: "Empresa não selecionada",
        description: "Por favor, selecione uma empresa para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessDialog(true);
      setShowNewRequestDialog(false);
      toast({
        title: "Solicitação enviada!",
        description: "Analisaremos sua solicitação em até 48 horas.",
      });
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovado":
        return <Badge className="bg-success/10 text-success">✅ Aprovado</Badge>;
      case "pendente":
        return <Badge className="bg-warning/10 text-warning">⏳ Pendente</Badge>;
      case "rejeitado":
        return <Badge className="bg-destructive/10 text-destructive">❌ Rejeitado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "aprovado":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "pendente":
        return <Clock className="h-5 w-5 text-warning" />;
      case "rejeitado":
        return <Eye className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const selectedCompany = companies.find(company => company.id === selectedCompanyId);

  return (
    <DashboardLayout title="Minha Empresa">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Solicitações de Crédito</h2>
              <p className="text-muted-foreground">
                Acompanhe o status das suas solicitações de crédito
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

          {solicitacoes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {solicitacoes.map((solicitacao) => (
                <Card key={solicitacao.id} className="shadow-card border-0">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getStatusIcon(solicitacao.status)}
                          {solicitacao.empresa}
                        </CardTitle>
                        <CardDescription>
                          CNPJ: {selectedCompany?.cnpj || "12.345.678/0001-90"}
                        </CardDescription>
                      </div>
                      {getStatusBadge(solicitacao.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Solicitado</p>
                        <p className="text-lg font-semibold">
                          R$ {solicitacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Prazo</p>
                        <p className="text-lg font-semibold">{solicitacao.prazo} meses</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Data da Solicitação</p>
                        <p className="text-sm font-medium">
                          {new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      {solicitacao.dataAprovacao && (
                        <div>
                          <p className="text-sm text-muted-foreground">Data da Aprovação</p>
                          <p className="text-sm font-medium">
                            {new Date(solicitacao.dataAprovacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      )}
                    </div>
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
                {/* Company Selection */}
                <div className="space-y-2">
                  <Label>Empresa *</Label>
                  <div className="flex gap-2">
                    <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione uma empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.id} value={company.id}>
                            {company.companyName} - {company.cnpj}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <AddCompanyDialog onCompanyAdded={handleCompanyAdded} />
                  </div>
                </div>

                {selectedCompany && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Empresa Selecionada:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Nome:</span>
                        <p className="font-medium">{selectedCompany.companyName}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">CNPJ:</span>
                        <p className="font-medium">{selectedCompany.cnpj}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Setor:</span>
                        <p className="font-medium">{selectedCompany.sector}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Faturamento:</span>
                        <p className="font-medium">R$ {selectedCompany.revenue}</p>
                      </div>
                    </div>
                  </div>
                )}

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

                {/* Term */}
                <div className="space-y-2">
                  <Label htmlFor="term">Prazo Desejado *</Label>
                  <Select
                    value={formData.term}
                    onValueChange={(value) => handleInputChange("term", value)}
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

                {/* Purpose */}
                <div className="space-y-2">
                  <Label htmlFor="purpose">Finalidade do Crédito *</Label>
                  <Textarea
                    id="purpose"
                    placeholder="Descreva para que será utilizado o crédito..."
                    value={formData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                    rows={4}
                    required
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