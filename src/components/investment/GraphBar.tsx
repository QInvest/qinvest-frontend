import { SimpleAreaChart } from "@/components/ui/simple-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface GraphBarProps {
  data: Array<{ mes: string; valor: number }>;
  height?: number;
  showLegend?: boolean;
  loading?: boolean;
}

export function GraphBar({ data, height = 300, showLegend = true, loading = false }: GraphBarProps) {
  if (loading) {
    return (
      <Card className="shadow-card border-0">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full" style={{ height: `${height}px` }} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-card border-0">
        <CardHeader>
          <CardTitle>Evolução do Patrimônio</CardTitle>
          <CardDescription>Nenhum dado disponível no momento</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height: `${height}px` }}>
          <p className="text-muted-foreground">Sem dados para exibir</p>
        </CardContent>
      </Card>
    );
  }

  // Transform data to match SimpleAreaChart format
  const chartData = data.map(item => ({ name: item.mes, value: item.valor }));

  return (
    <Card className="shadow-card border-0">
      <CardHeader>
        <CardTitle>📈 Evolução do Patrimônio</CardTitle>
        <CardDescription>
          Acompanhe o crescimento dos seus investimentos ao longo do tempo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SimpleAreaChart 
          data={chartData} 
          className="w-full"
        />
      </CardContent>
    </Card>
  );
}
