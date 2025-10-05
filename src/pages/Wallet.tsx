import { useState, useEffect } from "react";
import { CreditCard, Download, Upload, History, PiggyBank, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useWallet } from "@/hooks/useWallet";
import { apiService, TransactionData } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

const Wallet = () => {
  const { toast } = useToast();
  const { carteira, walletData, loading, error, refreshWallet } = useWallet();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);

  // Fetch transactions when wallet data is available
  useEffect(() => {
    refreshTransactions();
  }, [walletData?.wallet_id]);

  const refreshTransactions = async () => {
    if (!walletData?.wallet_id) return;
    
    setLoadingTransactions(true);
    try {
      const fetchedTransactions = await apiService.fetchTransactions();
      setTransactions(fetchedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Erro ao carregar histórico",
        description: "Não foi possível carregar o histórico de transações.",
        variant: "destructive",
      });
      // Set empty array on error instead of keeping old data
      setTransactions([]);
    } finally {
      setLoadingTransactions(false);
    }
  };

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
      refreshWallet();
      refreshTransactions();
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
      refreshWallet();
      refreshTransactions();
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

  const getTransactionIcon = (type: 'credit' | 'debit') => {
    switch (type) {
      case "credit": return <Upload className="h-4 w-4 text-green-600" />;
      case "debit": return <Download className="h-4 w-4 text-red-600" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: 'credit' | 'debit') => {
    switch (type) {
      case "credit":
        return "text-green-600";
      case "debit":
        return "text-red-600";
      default:
        return "text-foreground";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando carteira...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <span className="ml-2">Erro ao carregar carteira: {error}</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!carteira || !walletData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <span>Nenhuma carteira encontrada</span>
        </div>
      </DashboardLayout>
    );
  }

  const balance = carteira?.saldoDisponivel || 0;

  return (
    <DashboardLayout title="Carteira Virtual">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Carteira Virtual</h1>
            <p className="text-muted-foreground">Gerencie seus recursos e acompanhe suas transações</p>
          </div>

          {/* Balance Card */}
          <Card className="mb-8 shadow-card border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Saldo Disponível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-success">
                    R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-muted-foreground mt-1">Disponível para investimento</p>
                </div>
                <div className="flex gap-2">
                  <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
                    <DialogTrigger asChild>
                      <Button className="gradient-primary text-white">
                        <Upload className="h-4 w-4 mr-2" />
                        Depositar
                      </Button>
                    </DialogTrigger>
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

                  <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Sacar
                      </Button>
                    </DialogTrigger>
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
                          Saldo disponível: R$ {balance.toLocaleString('pt-BR')}
                        </p>
                        <Button onClick={handleWithdraw} className="w-full">
                          Solicitar Saque
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions History */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Histórico de Transações</CardTitle>
              <CardDescription>
                Acompanhe todas as suas movimentações financeiras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingTransactions ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        <span className="ml-2">Carregando transações...</span>
                      </TableCell>
                    </TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhuma transação encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((transaction) => (
                      <TableRow key={transaction.transaction_id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTransactionIcon(transaction.type)}
                            <span className="capitalize">
                              {transaction.type === 'credit' ? 'Depósito' : 'Saque'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.type === 'credit' ? 'Depósito na carteira' : 'Saque da carteira'}
                        </TableCell>
                        <TableCell>{new Date(transaction.created_at).toLocaleDateString('pt-BR')}</TableCell>
                        <TableCell className={`font-medium ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? '+' : '-'}R$ {(transaction.amount / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                            {transaction.status === 'completed' ? 'Concluído' : transaction.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;