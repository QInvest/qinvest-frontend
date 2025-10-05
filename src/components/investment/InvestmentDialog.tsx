import { useState } from 'react';
import { TrendingUp, DollarSign, Calculator, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiService, Investment } from '@/services/api';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';

// Define the Oportunidade interface locally
interface Oportunidade {
  id: string;
  foto: string;
  nome: string;
  risco: 'A' | 'B' | 'C' | 'D';
  retornoBruto: number;
  prazo: number;
  percentualCaptacao: number;
  valorCota: number;
  cnpj: string;
  faturamentoAnual: number;
  setor: string;
  site: string | null;
  garantia: string;
  capitalSocial: number;
}

interface InvestmentDialogProps {
  oportunidade: Oportunidade;
  onInvestmentComplete?: (investment: Investment) => void;
}

export function InvestmentDialog({ oportunidade, onInvestmentComplete }: InvestmentDialogProps) {
  const { toast } = useToast();
  const { carteira, refreshWallet } = useWallet();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotas, setQuotas] = useState<number>(1);

  const valorInvestimento = quotas * oportunidade.valorCota;
  const projecaoRetorno = valorInvestimento * (1 + oportunidade.retornoBruto / 100);
  const lucroEsperado = projecaoRetorno - valorInvestimento;

  const handleInvest = async () => {
    if (!carteira || valorInvestimento > carteira.saldoDisponivel) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não possui saldo suficiente para este investimento.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create investment
      const investmentData = {
        opportunity_id: oportunidade.id,
        quotas_to_purchase: quotas
      };

      const newInvestment = await apiService.createInvestment(investmentData);
      
      toast({
        title: "Investimento realizado!",
        description: `Investimento de R$ ${valorInvestimento.toFixed(2)} realizado com sucesso.`,
      });

      setOpen(false);
      setQuotas(1);
      refreshWallet(); // Update wallet balance
      
      if (onInvestmentComplete) {
        onInvestmentComplete(newInvestment);
      }
    } catch (error) {
      console.error('Error creating investment:', error);
      toast({
        title: "Erro no investimento",
        description: "Não foi possível realizar o investimento. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canInvest = carteira && valorInvestimento <= carteira.saldoDisponivel;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gradient-primary text-white">
          <TrendingUp className="h-4 w-4 mr-2" />
          Investir
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Investir em {oportunidade.nome}
          </DialogTitle>
          <DialogDescription>
            Configure sua proposta de investimento
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Opportunity Summary */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Valor por cota:</span>
                  <p className="font-semibold">R$ {oportunidade.valorCota.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Retorno esperado:</span>
                  <p className="font-semibold text-success">{oportunidade.retornoBruto}% a.a.</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Prazo:</span>
                  <p className="font-semibold">{oportunidade.prazo} meses</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Risco:</span>
                  <p className="font-semibold">Classe {oportunidade.risco}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Investment Configuration */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quotas">Número de Cotas</Label>
              <Input
                id="quotas"
                type="number"
                min="1"
                value={quotas}
                onChange={(e) => setQuotas(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={isSubmitting}
              />
            </div>

            {/* Investment Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor do investimento:</span>
                    <span className="font-semibold">R$ {valorInvestimento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Projeção após {oportunidade.prazo} meses:</span>
                    <span className="font-semibold text-success">R$ {projecaoRetorno.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm text-muted-foreground">Lucro esperado:</span>
                    <span className="font-bold text-success">R$ {lucroEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Wallet Balance Check */}
            {carteira && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Saldo disponível:</span>
                <span className={`font-semibold ${canInvest ? 'text-success' : 'text-destructive'}`}>
                  R$ {carteira.saldoDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {/* Warning if insufficient balance */}
            {!canInvest && carteira && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Saldo insuficiente. Você precisa de R$ {(valorInvestimento - carteira.saldoDisponivel).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} adicionais.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleInvest}
              disabled={!canInvest || isSubmitting}
              className="flex-1 gradient-primary text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Investindo...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Confirmar Investimento
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}