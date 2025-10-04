import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Building2, TrendingUp, Clock, AlertCircle, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { useToast } from "@/hooks/use-toast";
import { getEmpresaDetalhes } from "@/data/mockData";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CompanyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isInvesting, setIsInvesting] = useState(false);

  const empresa = getEmpresaDetalhes(id || "opp-001");

  if (!empresa) {
    return <div>Empresa não encontrada</div>;
  }

  const handleInvest = () => {
    setIsInvesting(true);
    setTimeout(() => {
      toast({
        title: "Investimento realizado!",
        description: `Você investiu com sucesso em ${empresa.nome}.`,
      });
      setIsInvesting(false);
      navigate("/meus-investimentos");
    }, 2000);
  };

  const getRiscoBadgeClass = (risco: string) => {
    switch (risco) {
      case 'baixo': return "bg-primary/10 text-primary";
      case 'medio': return "bg-warning/10 text-warning";
      case 'alto': return "bg-destructive/10 text-destructive";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 font-inter">
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Logo />
            <div className="hidden md:block h-6 w-px bg-border" />
            <h1 className="hidden md:block text-xl font-semibold">Detalhes da Oportunidade</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate("/opportunities")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <img src={empresa.foto} alt={empresa.nome} className="w-20 h-20 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-2xl mb-1">{empresa.nome}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            {empresa.setor}
                          </CardDescription>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge className={getRiscoBadgeClass(empresa.risco)}>
                                {empresa.risco === 'baixo' ? '🔵 Baixo' : empresa.risco === 'medio' ? '🟡 Médio' : '🔴 Alto'}
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>{empresa.riscoExplicacao}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">CNPJ</p>
                      <p className="font-medium">{empresa.cnpj}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Faturamento Anual</p>
                      <p className="font-medium">R$ {(empresa.faturamentoAnual / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Capital Social</p>
                      <p className="font-medium">R$ {(empresa.capitalSocial / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Site
                      </p>
                      {empresa.site ? (
                        <a href={empresa.site} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                          Visitar site
                        </a>
                      ) : (
                        <p className="text-sm text-muted-foreground">Não disponível</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Garantias</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{empresa.garantia}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Progresso da Captação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Captado: R$ {empresa.valorCaptado.toLocaleString('pt-BR')}</span>
                    <span>Meta: R$ {empresa.valorSolicitado.toLocaleString('pt-BR')}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="gradient-hero h-3 rounded-full transition-all" style={{ width: `${empresa.percentualCaptacao}%` }} />
                  </div>
                  <p className="text-sm text-muted-foreground">{empresa.percentualCaptacao}% da meta • {empresa.prazoRestante} dias restantes</p>
                </CardContent>
              </Card>
            </div>

            {/* Investment Panel */}
            <div className="space-y-6">
              <Card className="shadow-card border-0">
                <CardHeader>
                  <CardTitle>Investir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-2xl font-bold text-success">{empresa.retornoBruto}% a.a.</p>
                      <p className="text-sm text-muted-foreground">Retorno bruto</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-lg font-semibold">{empresa.prazo} meses</p>
                      <p className="text-sm text-muted-foreground">Prazo</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <p className="text-sm text-muted-foreground">Cota mínima</p>
                    <p className="text-xl font-bold">R$ {empresa.valorCota.toLocaleString('pt-BR')}</p>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium">Projeção de Investimento</p>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Investindo:</span>
                        <span className="font-medium">R$ {empresa.projecaoInvestimento.investindo.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Receberá:</span>
                        <span className="font-medium text-success">R$ {empresa.projecaoInvestimento.receberaApos12Meses.toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span>Lucro líquido:</span>
                        <span className="font-bold text-success">R$ {empresa.projecaoInvestimento.lucroLiquido.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleInvest} disabled={isInvesting} className="w-full gradient-primary text-white" size="lg">
                    {isInvesting ? "Processando..." : "Investir Agora"}
                  </Button>

                  <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <p className="text-xs text-warning-foreground">
                      Este investimento possui riscos. Leia atentamente os documentos antes de investir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDetail;
