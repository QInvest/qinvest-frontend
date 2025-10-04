import { Link } from "react-router-dom";
import { Building2, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Oportunidade } from "@/data/mockData";

interface CardOportunidadeProps {
  oportunidade: Oportunidade;
  variant?: 'compact' | 'expanded';
}

const getRiscoBadgeClass = (risco: 'baixo' | 'medio' | 'alto') => {
  switch (risco) {
    case 'baixo':
      return "bg-primary/10 text-primary hover:bg-primary/20";
    case 'medio':
      return "bg-warning/10 text-warning hover:bg-warning/20";
    case 'alto':
      return "bg-destructive/10 text-destructive hover:bg-destructive/20";
  }
};

const getRiscoTooltip = (risco: 'baixo' | 'medio' | 'alto') => {
  switch (risco) {
    case 'baixo':
      return "Empresa com histórico sólido, garantias reais e baixo índice de inadimplência.";
    case 'medio':
      return "Empresa em crescimento com garantias parciais. Risco moderado de inadimplência.";
    case 'alto':
      return "Empresa em estágio inicial ou setor volátil. Maior potencial de retorno, mas com risco elevado.";
  }
};

export function CardOportunidade({ oportunidade, variant = 'expanded' }: CardOportunidadeProps) {
  const isCompact = variant === 'compact';

  return (
    <Card 
      className="shadow-card hover:shadow-card-hover transition-all duration-300 border-card-border animate-fade-in hover-scale"
      role="article"
      aria-label={`Oportunidade ${oportunidade.nome}`}
    >
      <CardHeader className={isCompact ? "p-4" : ""}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <img 
                src={oportunidade.foto} 
                alt={`Logo da empresa ${oportunidade.nome}`}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <CardTitle className={`${isCompact ? 'text-lg' : 'text-xl'} truncate`}>
                  {oportunidade.nome}
                </CardTitle>
                <CardDescription className="text-sm truncate">
                  {oportunidade.setor}
                </CardDescription>
              </div>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className={getRiscoBadgeClass(oportunidade.risco)}>
                  🔵 {oportunidade.risco === 'baixo' ? 'Baixo' : oportunidade.risco === 'medio' ? 'Médio' : 'Alto'}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{getRiscoTooltip(oportunidade.risco)}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className={isCompact ? "p-4 pt-0" : "space-y-4"}>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Retorno</div>
              <div className="font-semibold text-success truncate">{oportunidade.retornoBruto}% a.a.</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Prazo</div>
              <div className="font-semibold truncate">{oportunidade.prazo} meses</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Cota mínima</div>
              <div className="font-semibold truncate">
                R$ {oportunidade.valorCota.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="min-w-0">
              <div className="text-xs text-muted-foreground">Garantia</div>
              <div className="font-semibold text-xs truncate">{oportunidade.garantia}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Captação</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium cursor-help">{oportunidade.percentualCaptacao}%</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Percentual já captado do valor total solicitado pela empresa.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="gradient-hero h-2 rounded-full transition-all duration-800 animate-fade-in"
              style={{ width: `${oportunidade.percentualCaptacao}%` }}
              role="progressbar"
              aria-valuenow={oportunidade.percentualCaptacao}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full gradient-primary text-white" 
          asChild
        >
          <Link to={`/company/${oportunidade.id}`}>
            Mais Detalhes
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
