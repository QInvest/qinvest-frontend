import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";
import type { Investimento } from "@/data/mockData";

interface CardInvestimentoProps {
  investimento: Investimento;
  onVenderClick?: (id: string) => void;
}

const getRiscoBadgeClass = (risco: 'baixo' | 'medio' | 'alto') => {
  switch (risco) {
    case 'baixo':
      return "bg-primary/10 text-primary";
    case 'medio':
      return "bg-warning/10 text-warning";
    case 'alto':
      return "bg-destructive/10 text-destructive";
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
    <Card 
      className="shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
      aria-label={`Investimento em ${investimento.nome}`}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img 
              src={investimento.foto} 
              alt={`Logo da empresa ${investimento.nome}`}
              className="w-12 h-12 rounded-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1">
              <CardTitle className="text-lg truncate">{investimento.nome}</CardTitle>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={getRiscoBadgeClass(investimento.risco)}>
                  {investimento.risco === 'baixo' ? '🔵 Baixo' : investimento.risco === 'medio' ? '🟡 Médio' : '🔴 Alto'}
                </Badge>
                {getStatusBadge(investimento.status)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Investment Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Cotas</p>
            <p className="text-lg font-semibold">{investimento.numCotas}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Valor Investido</p>
            <p className="text-lg font-semibold">
              R$ {investimento.valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {investimento.status === 'finalizado' ? 'Valor Recebido' : 'A Receber'}
            </p>
            <p className="text-lg font-semibold text-success">
              R$ {(investimento.status === 'finalizado' 
                ? investimento.valorRecebido 
                : investimento.valorAReceber
              ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {investimento.status === 'finalizado' ? 'Finalizado em' : 'Vencimento'}
            </p>
            <p className="text-sm font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(investimento.vencimento).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Parcelas Info */}
        {investimento.status === 'aberto' && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Parcelas pagas</span>
              <span className="font-medium">{parcelasPagas}/{parcelasTotal}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-2">
              <div 
                className="bg-success h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(parcelasPagas / parcelasTotal) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link to={`/investment/${investimento.id}`}>
              Ver Detalhes
            </Link>
          </Button>
          {investimento.status === 'aberto' && onVenderClick && (
            <Button 
              variant="secondary" 
              className="flex-1"
              onClick={() => onVenderClick(investimento.id)}
            >
              Vender Posição
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
