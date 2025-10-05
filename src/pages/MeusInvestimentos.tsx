import { useState, useEffect } from "react";
import { Loader2, AlertCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardInvestimento } from "@/components/investment/CardInvestimento";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiService, Investment } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// Define the Investimento interface locally to match frontend expectations
interface Parcela {
  numero: number;
  data: string;
  valor: number;
  status: 'pago' | 'aguardando' | 'atrasado';
  dataPagamento: string | null;
}

interface Investimento {
  id: string;
  empresaId: string;
  foto: string;
  nome: string;
  risco: 'A' | 'B' | 'C' | 'D';
  numCotas: number;
  valorInvestido: number;
  valorRecebido: number;
  valorAReceber: number;
  lucroEsperado: number;
  vencimento: string;
  status: 'aberto' | 'finalizado' | 'analise';
  parcelas: Parcela[];
}

// Transform API Investment to frontend Investimento interface
const transformInvestment = (investment: Investment): Investimento => {
  return {
    id: investment.investment_id,
    empresaId: investment.opportunity_id,
    foto: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop", // Default image
    nome: `Investimento ${investment.investment_id.slice(-4)}`, // Will need opportunity/company name
    risco: 'A', // This would need to come from opportunity
    numCotas: investment.quotas_purchased,
    valorInvestido: investment.investment_amount / 100, // Convert from cents
    valorRecebido: 0, // This would need to be calculated from returns
    valorAReceber: investment.investment_amount / 100, // Initial placeholder
    lucroEsperado: 0, // This would need to be calculated
    vencimento: investment.created_at, // Placeholder
    status: investment.status === 'confirmed' ? 'aberto' : investment.status === 'cancelled' ? 'finalizado' : 'analise',
    parcelas: [] // Would need to come from returns/payments
  };
};

export default function MeusInvestimentos() {
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvestimento, setSelectedInvestimento] = useState<string | null>(null);
  const [showVenderDialog, setShowVenderDialog] = useState(false);

  // Fetch user investments
  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setLoading(true);
        setError(null);
        const userInvestments = await apiService.getUserInvestments();
        setInvestments(userInvestments);
      } catch (error) {
        console.error('Error fetching investments:', error);
        setError('Erro ao carregar investimentos');
        toast({
          title: "Erro ao carregar investimentos",
          description: "Não foi possível carregar os investimentos. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, [toast]);

  const handleVenderClick = (id: string) => {
    setSelectedInvestimento(id);
    setShowVenderDialog(true);
  };

  const handleConfirmarVenda = () => {
    toast({
      title: "Venda realizada!",
      description: "Sua posição foi colocada no mercado secundário.",
    });
    setShowVenderDialog(false);
    setSelectedInvestimento(null);
  };

  // Transform API investments to frontend format
  const investimentosData = investments.map(transformInvestment);

  const investimentoSelecionado = investimentosData.find(inv => inv.id === selectedInvestimento);
  const taxaAdmin = 0.02;
  const valorAReceber = investimentoSelecionado 
    ? investimentoSelecionado.valorAReceber * (1 - taxaAdmin)
    : 0;

  if (loading) {
    return (
      <DashboardLayout title="Meus Investimentos">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando investimentos...</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Meus Investimentos">
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Total Investido</p>
              </div>
              <p className="text-3xl font-bold">
                R$ {investimentosData.reduce((acc, inv) => acc + inv.valorInvestido, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <p className="text-sm text-muted-foreground">Total Recebido</p>
              </div>
              <p className="text-3xl font-bold text-success">
                R$ {investimentosData.reduce((acc, inv) => acc + inv.valorRecebido, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Investimentos Ativos</p>
              </div>
              <p className="text-3xl font-bold">
                {investimentosData.filter(inv => inv.status === 'aberto').length}
              </p>
            </div>
          </div>

          {/* Investments List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {investimentosData.length > 0 ? (
              investimentosData.map((investimento) => (
                <CardInvestimento
                  key={investimento.id}
                  investimento={investimento}
                  onVenderClick={handleVenderClick}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhum investimento encontrado
                </h3>
                <p className="text-muted-foreground">
                  Você ainda não fez nenhum investimento. Explore as oportunidades disponíveis.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vender Posição Dialog */}
      <Dialog open={showVenderDialog} onOpenChange={setShowVenderDialog}>
        <DialogContent role="alertdialog">
          <DialogHeader>
            <DialogTitle>Mercado Secundário</DialogTitle>
            <DialogDescription>
              Você está vendendo sua posição em {investimentoSelecionado?.nome}
            </DialogDescription>
          </DialogHeader>

          {investimentoSelecionado && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">💵 Valor investido</span>
                  <span className="font-medium">
                    R$ {investimentoSelecionado.valorInvestido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">💰 Juros recebidos</span>
                  <span className="font-medium text-success">
                    R$ {investimentoSelecionado.valorRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">💸 Valor a receber</span>
                  <span className="font-medium">
                    R$ {investimentoSelecionado.valorAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground text-sm">
                    📉 Taxa adm (2%)
                    <span className="ml-1 text-xs cursor-help" title="Taxa de 2% sobre o valor a receber para cobrir custos operacionais da transação">
                      ℹ️
                    </span>
                  </span>
                  <span className="font-medium text-destructive">
                    -R$ {(investimentoSelecionado.valorAReceber * taxaAdmin).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="bg-success/10 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-success">🟢 Você receberá:</span>
                  <span className="text-2xl font-bold text-success">
                    R$ {valorAReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setShowVenderDialog(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1 gradient-primary text-white"
                  onClick={handleConfirmarVenda}
                >
                  Confirmar Venda
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}