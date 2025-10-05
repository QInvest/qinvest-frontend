import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraphBar } from "@/components/investment/GraphBar";
import { WalletSummary } from "@/components/investment/WalletSummary";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockCarteira, mockInvestimentos } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Target, 
  AlertCircle
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const handleDeposit = () => {
    toast({
      title: "Depósito solicitado!",
      description: "Você receberá as instruções por email.",
    });
    setShowDepositDialog(false);
  };

  const handleWithdraw = () => {
    toast({
      title: "Saque solicitado!",
      description: "O valor será transferido em até 1 dia útil.",
    });
    setShowWithdrawDialog(false);
  };

  const investimentosAtivos = mockInvestimentos.filter(inv => inv.status === 'aberto');
  const totalInvestido = mockInvestimentos.reduce((acc, inv) => acc + inv.valorInvestido, 0);

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Wallet Summary */}
          <WalletSummary
            carteira={mockCarteira}
            onDepositar={() => setShowDepositDialog(true)}
            onSacar={() => setShowWithdrawDialog(true)}
          />

          {/* Top Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="shadow-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Investimentos Ativos
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {totalInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-success mt-1">{investimentosAtivos.length} investimento(s)</p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Rentabilidade Média
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((mockCarteira.lucroHistorico / mockCarteira.patrimonioInvestido) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Últimos 12 meses</p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Novas Oportunidades
                </CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">Disponíveis hoje</p>
              </CardContent>
            </Card>

            <Card className="shadow-card border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Meu Score
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">850</div>
                <p className="text-xs text-success mt-1">Excelente</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Portfolio Evolution */}
            <div className="lg:col-span-2">
              <GraphBar data={mockCarteira.graficoPatrimonio} />
            </div>

            {/* Quick Actions */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full gradient-primary text-white" asChild>
                  <Link to="/opportunities">Ver Oportunidades</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/meus-investimentos">Meus Investimentos</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/wallet">Gerenciar Carteira</Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/credit-request">Solicitar Crédito</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Investments */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Meus Investimentos Recentes</CardTitle>
              <CardDescription>
                Acompanhe seus investimentos ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Empresa</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Risco</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Cotas</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Valor</th>
                      <th className="text-left py-2 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-right py-2 text-sm font-medium text-muted-foreground">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockInvestimentos.map((investment) => (
                      <tr key={investment.id} className="border-b border-border">
                        <td className="py-3 font-medium">{investment.nome}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            investment.risco === "A" ? "bg-success/10 text-success" :
                            investment.risco === "B" ? "bg-primary/10 text-primary" :
                            investment.risco === "C" ? "bg-warning/10 text-warning" :
                            "bg-destructive/10 text-destructive"
                          }`}>
                            Risco {investment.risco}
                          </span>
                        </td>
                        <td className="py-3">{investment.numCotas}</td>
                        <td className="py-3 font-medium">
                          R$ {investment.valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            investment.status === "aberto" ? "bg-success/10 text-success" :
                            investment.status === "finalizado" ? "bg-muted/10 text-muted-foreground" :
                            "bg-warning/10 text-warning"
                          }`}>
                            {investment.status === "aberto" ? "Aberto" : investment.status === "finalizado" ? "Finalizado" : "Análise"}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link to={`/investment/${investment.id}`}>Ver detalhes</Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {mockInvestimentos.map((investment) => (
                  <div key={investment.id} className="border border-border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-base">{investment.nome}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        investment.status === "aberto" ? "bg-success/10 text-success" :
                        investment.status === "finalizado" ? "bg-muted/10 text-muted-foreground" :
                        "bg-warning/10 text-warning"
                      }`}>
                        {investment.status === "aberto" ? "Aberto" : investment.status === "finalizado" ? "Finalizado" : "Análise"}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Risco:</span>
                        <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          investment.risco === "A" ? "bg-success/10 text-success" :
                          investment.risco === "B" ? "bg-primary/10 text-primary" :
                          investment.risco === "C" ? "bg-warning/10 text-warning" :
                          "bg-destructive/10 text-destructive"
                        }`}>
                          Risco {investment.risco}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cotas:</span>
                        <span className="ml-2 font-medium">{investment.numCotas}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-muted-foreground text-sm">Valor investido:</span>
                        <div className="font-medium">
                          R$ {investment.valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link to={`/investment/${investment.id}`}>Ver detalhes</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deposit Dialog */}
      <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Depositar Fundos</DialogTitle>
            <DialogDescription>
              Adicione recursos à sua carteira virtual
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input id="amount" placeholder="0,00" type="number" />
            </div>
            <Button onClick={handleDeposit} className="w-full">
              Solicitar Depósito
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sacar Fundos</DialogTitle>
            <DialogDescription>
              Transfira recursos para sua conta bancária
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="withdraw-amount">Valor (R$)</Label>
              <Input id="withdraw-amount" placeholder="0,00" type="number" />
            </div>
            <p className="text-sm text-muted-foreground">
              Saldo disponível: R$ {mockCarteira.saldoDisponivel.toLocaleString('pt-BR')}
            </p>
            <Button onClick={handleWithdraw} className="w-full">
              Solicitar Saque
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}