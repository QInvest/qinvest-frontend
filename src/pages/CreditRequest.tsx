import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, FileText, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AddCompanyDialog } from "@/components/company/AddCompanyDialog";
import { useCompany, Company } from "@/contexts/CompanyContext";
import { useToast } from "@/hooks/use-toast";

const CreditRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { companies } = useCompany();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");

  const [formData, setFormData] = useState({
    requestedAmount: "",
    term: "",
    purpose: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCompanyAdded = (company: Company) => {
    setSelectedCompanyId(company.id);
    toast({
      title: "Empresa selecionada!",
      description: `${company.companyName} foi selecionada para a solicitação.`,
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
      toast({
        title: "Solicitação enviada!",
        description: "Analisaremos sua solicitação em até 48 horas.",
      });
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setShowSuccessDialog(false);
    navigate("/dashboard");
  };

  const selectedCompany = companies.find(company => company.id === selectedCompanyId);

  return (
    <DashboardLayout title="Solicitar Crédito">
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Solicitar Crédito</h1>
            <p className="text-muted-foreground">
              Selecione uma empresa e preencha as informações para solicitar crédito
            </p>
          </div>

          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Selecionar Empresa
              </CardTitle>
              <CardDescription>
                Escolha a empresa para a qual deseja solicitar crédito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          {selectedCompany && (
            <Card className="shadow-card border-0 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações da Solicitação
                </CardTitle>
                <CardDescription>
                  Dados necessários para análise de crédito
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
              </CardContent>
            </Card>
          )}

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
                Voltar ao Dashboard
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreditRequest;