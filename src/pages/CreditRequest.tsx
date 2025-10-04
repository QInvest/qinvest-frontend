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
import { Header } from "@/components/layout/header";
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Solicitar Crédito</h1>
            <p className="text-muted-foreground">
              Preencha as informações da sua empresa para solicitar crédito
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Informações da Empresa
              </CardTitle>
              <CardDescription>
                Forneça os dados da sua empresa para análise de crédito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0001-00"
                      value={formData.cnpj}
                      onChange={(e) => handleInputChange("cnpj", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Razão Social</Label>
                    <Input
                      id="companyName"
                      placeholder="Nome da empresa"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="sector">Setor de Atuação</Label>
                  <Select onValueChange={(value) => handleInputChange("sector", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
                      <SelectItem value="comercio">Comércio</SelectItem>
                      <SelectItem value="servicos">Serviços</SelectItem>
                      <SelectItem value="industria">Indústria</SelectItem>
                      <SelectItem value="agricultura">Agricultura</SelectItem>
                      <SelectItem value="construcao">Construção</SelectItem>
                      <SelectItem value="alimentacao">Alimentação</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="revenue" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Faturamento Anual (R$)
                    </Label>
                    <Input
                      id="revenue"
                      placeholder="0,00"
                      value={formData.revenue}
                      onChange={(e) => handleInputChange("revenue", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="requestedAmount" className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Valor Solicitado (R$)
                    </Label>
                    <Input
                      id="requestedAmount"
                      placeholder="0,00"
                      value={formData.requestedAmount}
                      onChange={(e) => handleInputChange("requestedAmount", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="term" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Prazo Desejado
                  </Label>
                  <Select onValueChange={(value) => handleInputChange("term", value)}>
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

                <div>
                  <Label htmlFor="purpose" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Finalidade do Crédito
                  </Label>
                  <Textarea
                    id="purpose"
                    placeholder="Descreva como pretende utilizar o crédito solicitado..."
                    value={formData.purpose}
                    onChange={(e) => handleInputChange("purpose", e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? "Enviando Solicitação..." : "Enviar Solicitação"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Solicitação Enviada com Sucesso!</DialogTitle>
                <DialogDescription className="space-y-4">
                  <p>
                    Sua solicitação de crédito foi recebida e está sendo analisada por nossa equipe.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-800">Próximos passos:</h4>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Análise inicial em até 24 horas</li>
                      <li>• Solicitação de documentos complementares</li>
                      <li>• Resposta final em até 48 horas</li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Você receberá atualizações por email sobre o status da sua solicitação.
                  </p>
                </DialogDescription>
              </DialogHeader>
              <Button onClick={handleCloseSuccess} className="w-full">
                Voltar ao Dashboard
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default CreditRequest;