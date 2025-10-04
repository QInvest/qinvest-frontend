import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Investimento } from "@/data/mockData";

interface CardInvestimentoProps {
  investimento: Investimento;
  onVenderClick?: (id: string) => void;
}

const getRiscoBadgeClass = (risco: 'A' | 'B' | 'C' | 'D') => {
  switch (risco) {
    case 'A':
      return "bg-success/10 text-success";
    case 'B':
      return "bg-primary/10 text-primary";
    case 'C':
      return "bg-warning/10 text-warning";
    case 'D':
      return "bg-destructive/10 text-destructive";
  }
};

const getRiscoIcon = (risco: 'A' | 'B' | 'C' | 'D') => {
  switch (risco) {
    case 'A':
      return "🟢";
    case 'B':
      return "🔵";
    case 'C':
      return "🟡";
    case 'D':
      return "🔴";
  }
};

const getStatusBadge = (status: 'aberto' | 'finalizado' | 'analise') => {
  switch (status) {
    case 'aberto':
      return <Badge className="bg-success/10 text-success">🟢 Aberto</Badge>;
    case 'finalizado':
      return <Badge className="bg-muted-foreground/10 text-muted-foreground">✅ Finalizado</Badge>;
    case 'analise':
      return <Badge className="bg-warning/10 text-warning">⏳ Em Análise</Badge>;
  }
};

export function CardInvestimento({ investimento, onVenderClick }: CardInvestimentoProps) {
  const parcelasPagas = investimento.parcelas.filter(p => p.status === 'pago').length;
  const parcelasTotal = investimento.parcelas.length;

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 border-card-border animate-fade-in">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <img 
                src={investimento.foto} 
                alt={`Logo da empresa ${investimento.nome}`}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{investimento.nome}</CardTitle>
                <CardDescription className="text-sm truncate">
                  {investimento.numCotas} cotas • Vence em {new Date(investimento.vencimento).toLocaleDateString('pt-BR')}
                </CardDescription>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Badge className={getRiscoBadgeClass(investimento.risco)}>
              {getRiscoIcon(investimento.risco)} Risco {investimento.risco}
            </Badge>
            {getStatusBadge(investimento.status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Investment Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Valor Investido</p>
            <p className="text-lg font-semibold">
              R$ {investimento.valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor Recebido</p>
            <p className="text-lg font-semibold text-success">
              R$ {investimento.valorRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">A Receber</p>
            <p className="text-lg font-semibold">
              R$ {investimento.valorAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lucro Esperado</p>
            <p className="text-lg font-semibold text-success">
              R$ {investimento.lucroEsperado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso dos Pagamentos</span>
            <span className="font-medium">{parcelasPagas}/{parcelasTotal} parcelas</span>
          </div>
          <Progress value={(parcelasPagas / parcelasTotal) * 100} className="h-2" />
        </div>

        {/* Action Button */}
        {investimento.status === 'aberto' && (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onVenderClick?.(investimento.id)}
          >
            Vender Cotas
          </Button>
        )}
      </CardContent>
    </Card>
  );
}