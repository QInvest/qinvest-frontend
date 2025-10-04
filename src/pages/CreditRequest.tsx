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
import { useToast } from "@/hooks/use-toast";

const CreditRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    cnpj: "",
    companyName: "",
    sector: "",
    revenue: "",
    requestedAmount: "",
    term: "",
    purpose: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <DashboardLayout title="Solicitar Crédito">
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Solicitar Crédito</h1>
            <p className="text-muted-foreground">
              Preencha as informações da sua empresa para solicitar crédito
            </p>
          </div>

          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Dados necessários para análise de crédito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* CNPJ */}
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={(e) => handleInputChange("cnpj", e.target.value)}
                    required
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa *</Label>
                  <Input
                    id="companyName"
                    placeholder="Nome da sua empresa"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    required
                  />
                </div>

                {/* Sector */}
                <div className="space-y-2">
                  <Label htmlFor="sector">Setor de Atuação *</Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => handleInputChange("sector", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Tecnologia</SelectItem>
                      <SelectItem value="agriculture">Agronegócio</SelectItem>
                      <SelectItem value="retail">Varejo</SelectItem>
                      <SelectItem value="manufacturing">Indústria</SelectItem>
                      <SelectItem value="services">Serviços</SelectItem>
                      <SelectItem value="healthcare">Saúde</SelectItem>
                      <SelectItem value="education">Educação</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Revenue */}
                <div className="space-y-2">
                  <Label htmlFor="revenue">Faturamento Mensal *</Label>
                  <Input
                    id="revenue"
                    placeholder="R$ 0,00"
                    value={formData.revenue}
                    onChange={(e) => handleInputChange("revenue", e.target.value)}
                    required
                  />
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
                  />
                </div>

                {/* Term */}
                <div className="space-y-2">
                  <Label htmlFor="term">Prazo Desejado *</Label>
                  <Select
                    value={formData.term}
                    onValueChange={(value) => handleInputChange("term", value)}
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