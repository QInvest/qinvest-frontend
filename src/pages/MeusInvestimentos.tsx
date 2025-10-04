import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardInvestimento } from "@/components/investment/CardInvestimento";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { mockInvestimentos } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";

export default function MeusInvestimentos() {
  const { toast } = useToast();
  const [selectedInvestimento, setSelectedInvestimento] = useState<string | null>(null);
  const [showVenderDialog, setShowVenderDialog] = useState(false);

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

  const investimentoSelecionado = mockInvestimentos.find(inv => inv.id === selectedInvestimento);
  const taxaAdmin = 0.02;
  const valorAReceber = investimentoSelecionado 
    ? investimentoSelecionado.valorAReceber * (1 - taxaAdmin)
    : 0;

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
                R$ {mockInvestimentos.reduce((acc, inv) => acc + inv.valorInvestido, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-success" />
                <p className="text-sm text-muted-foreground">Total Recebido</p>
              </div>
              <p className="text-3xl font-bold text-success">
                R$ {mockInvestimentos.reduce((acc, inv) => acc + inv.valorRecebido, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <p className="text-sm text-muted-foreground">Investimentos Ativos</p>
              </div>
              <p className="text-3xl font-bold">
                {mockInvestimentos.filter(inv => inv.status === 'aberto').length}
              </p>
            </div>
          </div>

          {/* Investments List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockInvestimentos.map((investimento) => (
              <CardInvestimento
                key={investimento.id}
                investimento={investimento}
                onVenderClick={handleVenderClick}
              />
            ))}
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