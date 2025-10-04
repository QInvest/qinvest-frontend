import { useState } from "react";
import { CreditCard, Download, Upload, History, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

const Wallet = () => {
  const { toast } = useToast();
  const [balance] = useState(25000);
  const [showDepositDialog, setShowDepositDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);

  const transactions = [
    { id: 1, type: "deposit", amount: 5000, date: "2024-01-15", description: "Depósito via PIX", status: "completed" },
    { id: 2, type: "investment", amount: -2000, date: "2024-01-12", description: "Investimento - TechSolutions", status: "completed" },
    { id: 3, type: "return", amount: 350, date: "2024-01-10", description: "Retorno - EcoEnergy", status: "completed" },
    { id: 4, type: "deposit", amount: 10000, date: "2024-01-08", description: "Depósito via TED", status: "completed" },
    { id: 5, type: "investment", amount: -5000, date: "2024-01-05", description: "Investimento - AgriTech", status: "completed" },
    { id: 6, type: "withdraw", amount: -1500, date: "2024-01-03", description: "Saque via PIX", status: "completed" },
  ];

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

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit": return <Upload className="h-4 w-4 text-green-600" />;
      case "withdraw": return <Download className="h-4 w-4 text-red-600" />;
      case "investment": return <PiggyBank className="h-4 w-4 text-blue-600" />;
      case "return": return <CreditCard className="h-4 w-4 text-green-600" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
      case "return":
        return "text-green-600";
      case "withdraw":
      case "investment":
        return "text-red-600";
      default:
        return "text-foreground";
    }
  };

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
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(transaction.type)}
                          <span className="capitalize">{transaction.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{new Date(transaction.date).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell className={`font-medium ${getTransactionColor(transaction.type)}`}>
                        {transaction.amount > 0 ? '+' : ''}R$ {Math.abs(transaction.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          Concluído
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
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