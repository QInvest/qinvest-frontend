import { CreditCard, TrendingUp, Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Carteira } from "@/data/mockData";

interface WalletSummaryProps {
  carteira: Carteira;
  onDepositar: () => void;
  onSacar: () => void;
  variant?: 'compact' | 'expanded';
}

export function WalletSummary({ carteira, onDepositar, onSacar, variant = 'expanded' }: WalletSummaryProps) {
  const isCompact = variant === 'compact';

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
            +{((carteira.lucroHistorico / carteira.patrimonioInvestido) * 100).toFixed(1)}% de retorno
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
