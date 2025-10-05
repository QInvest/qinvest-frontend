import { CreditCard, TrendingUp, Coins, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from "@/hooks/useWallet";

interface WalletSummaryProps {
  onDepositar: () => void;
  onSacar: () => void;
  variant?: 'compact' | 'expanded';
}

export function WalletSummary({ onDepositar, onSacar, variant = 'expanded' }: WalletSummaryProps) {
  const { carteira, walletData, loading, error, refreshWallet } = useWallet();
  const isCompact = variant === 'compact';

  // Loading state
  if (loading) {
    return (
      <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="shadow-card border-0">
            <CardContent className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Erro ao carregar dados da carteira: {error}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshWallet}
            className="ml-4"
          >
            Tentar novamente
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // No wallet data
  if (!carteira) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Nenhuma carteira encontrada. Crie uma carteira para começar.</span>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshWallet}
            className="ml-4"
          >
            Atualizar
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Success state with data
  return (
    <div className={`grid gap-4 ${isCompact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
      {/* Saldo Disponível */}
      <Card className="shadow-card border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            💰 Saldo Disponível
          </CardTitle>
          <CreditCard className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-success">
            R$ {carteira.saldoDisponivel.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Disponível para investir</p>
          {!isCompact && (
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button size="sm" onClick={onDepositar} className="flex-1">
                Depositar
              </Button>
              <Button size="sm" variant="outline" onClick={onSacar} className="flex-1">
                Sacar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patrimônio Investido */}
      <Card className="shadow-card border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            📊 Patrimônio Investido
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold">
            R$ {carteira.patrimonioInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Valor total investido</p>
        </CardContent>
      </Card>

      {/* Lucro Histórico */}
      <Card className="shadow-card border-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            💵 Lucro Histórico
          </CardTitle>
          <Coins className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold text-success">
            R$ {carteira.lucroHistorico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-success mt-1">
            {carteira.patrimonioInvestido > 0 
              ? `+${((carteira.lucroHistorico / carteira.patrimonioInvestido) * 100).toFixed(1)}% de retorno`
              : 'Sem investimentos ainda'
            }
          </p>
        </CardContent>
      </Card>

      {/* Refresh button for compact variant */}
      {isCompact && (
        <div className="flex justify-end mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshWallet}
            className="text-xs"
          >
            🔄 Atualizar
          </Button>
        </div>
      )}
    </div>
  );
}
