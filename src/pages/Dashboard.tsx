import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraphBar } from "@/components/investment/GraphBar";
import { WalletSummary } from "@/components/investment/WalletSummary";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useWallet } from "@/hooks/useWallet";
import { apiService, Investment } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Target, 
  AlertCircle,
  Loader2
} from "lucide-react";

// Transform API Investment to dashboard format
const transformInvestmentForDashboard = (investment: Investment): {
  id: string;
  nome: string;
  risco: "A" | "B" | "C" | "D";
  numCotas: number;
  valorInvestido: number;
  status: "aberto" | "finalizado" | "analise";
} => {
  return {
    id: investment.investment_id,
    nome: `Investimento ${investment.investment_id.slice(-4)}`, // Would need opportunity/company name
    risco: 'A', // This would need to come from opportunity risk assessment
    numCotas: investment.quotas_purchased,
    valorInvestido: investment.investment_amount / 100, // Convert from cents
    status: investment.status === 'confirmed' ? 'aberto' : investment.status === 'cancelled' ? 'finalizado' : 'analise'
  };
};

export default function Dashboard() {
  const { toast } = useToast();
  const { carteira, walletData, loading, error, refreshWallet } = useWallet();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  // Fetch user investments for dashboard
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoadingInvestments(true);
        const userInvestments = await apiService.getUserInvestments();
        setInvestments(userInvestments);
      } catch (error) {
        console.error('Error fetching investments for dashboard:', error);
        // Silently fall back to empty array for dashboard
        setInvestments([]);
      } finally {
        setLoadingInvestments(false);
      }
    };

    fetchInvestments();
  }, []);

  const handleDeposit = async () => {
    if (!carteira || !walletData || !depositAmount) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido para o depósito.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(depositAmount.replace(",", "."));
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido maior que zero.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingDeposit(true);

    try {
      // Convert to cents for API (assuming backend expects cents)
      const amountInCents = Math.round(amount * 100);

      await apiService.createTransaction({
        wallet_id: walletData.wallet_id,
        amount: amountInCents,
        type: "credit",
        status: "completed"
      });

      toast({
        title: "Depósito realizado!",
        description: `Depósito de R$ ${amount.toFixed(2)} realizado com sucesso.`,
      });

      setDepositAmount("");
      setShowDepositDialog(false);
      
      // Refresh wallet data to show updated balance
      refreshWallet();
    } catch (error) {
      toast({
        title: "Erro no depósito",
        description: "Não foi possível realizar o depósito. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingDeposit(false);
    }
  };

  const handleWithdraw = async () => {
    if (!carteira || !walletData || !withdrawAmount) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido para o saque.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(withdrawAmount.replace(",", "."));
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido maior que zero.",
        variant: "destructive",
      });
      return;
    }

    if (amount > carteira.saldoDisponivel) {
      toast({
        title: "Saldo insuficiente",
        description: "O valor do saque é maior que o saldo disponível.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingWithdraw(true);

    try {
      // Convert to cents for API
      const amountInCents = Math.round(amount * 100);

      await apiService.createTransaction({
        wallet_id: walletData.wallet_id,
        amount: amountInCents,
        type: "debit",
        status: "completed"
      });

      toast({
        title: "Saque realizado!",
        description: `Saque de R$ ${amount.toFixed(2)} realizado com sucesso.`,
      });

      setWithdrawAmount("");
      setShowWithdrawDialog(false);
      
      // Refresh wallet data to show updated balance
      refreshWallet();
    } catch (error) {
      toast({
        title: "Erro no saque",
        description: "Não foi possível realizar o saque. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingWithdraw(false);
    }
  };

  // Transform real investments for dashboard display
  const dashboardInvestments = investments.map(transformInvestmentForDashboard);
  const investimentosAtivos = dashboardInvestments.filter(inv => inv.status === 'aberto');
  const totalInvestido = dashboardInvestments.reduce((acc, inv) => acc + inv.valorInvestido, 0);

  return (
    <DashboardLayout title="Dashboard">
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Wallet Summary */}
          <WalletSummary
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
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : error || !carteira || carteira.patrimonioInvestido === 0 ? (
                    "0.0%"
                  ) : (
                    `${((carteira.lucroHistorico / carteira.patrimonioInvestido) * 100).toFixed(1)}%`
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Últimos 12 meses</p>
              </CardContent>
            </Card>
          </div>

          {/* Chart and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Portfolio Evolution */}
            <div className="lg:col-span-2">
              {loading ? (
                <Card className="shadow-card border-0">
                  <CardContent className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </CardContent>
                </Card>
              ) : error || !carteira ? (
                <Card className="shadow-card border-0">
                  <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Dados não disponíveis</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <GraphBar data={carteira.graficoPatrimonio} />
              )}
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
                    {loadingInvestments ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                          <p className="text-muted-foreground mt-2">Carregando investimentos...</p>
                        </td>
                      </tr>
                    ) : dashboardInvestments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          Nenhum investimento encontrado
                        </td>
                      </tr>
                    ) : (
                      dashboardInvestments.map((investment) => (
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {loadingInvestments ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    <p className="text-muted-foreground mt-2">Carregando investimentos...</p>
                  </div>
                ) : dashboardInvestments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum investimento encontrado
                  </div>
                ) : (
                  dashboardInvestments.map((investment) => (
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
                  ))
                )}
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
              <Label htmlFor="deposit-amount">Valor (R$)</Label>
              <Input 
                id="deposit-amount" 
                placeholder="0,00" 
                type="number" 
                step="0.01"
                min="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={isProcessingDeposit}
              />
            </div>
            <Button 
              onClick={handleDeposit} 
              className="w-full"
              disabled={isProcessingDeposit || !depositAmount}
            >
              {isProcessingDeposit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando Depósito...
                </>
              ) : (
                "Realizar Depósito"
              )}
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
              <Input 
                id="withdraw-amount" 
                placeholder="0,00" 
                type="number"
                step="0.01"
                min="0"
                max={carteira?.saldoDisponivel || 0}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={isProcessingWithdraw}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Saldo disponível: R$ {carteira ? carteira.saldoDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
            </p>
            <Button 
              onClick={handleWithdraw} 
              className="w-full"
              disabled={isProcessingWithdraw || !withdrawAmount || !carteira}
            >
              {isProcessingWithdraw ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando Saque...
                </>
              ) : (
                "Realizar Saque"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}