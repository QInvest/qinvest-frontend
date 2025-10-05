import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/investment/SearchBar";
import { FiltersPanel } from "@/components/investment/FiltersPanel";
import { CardOportunidade } from "@/components/investment/CardOportunidade";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { apiService, OpportunityWithCompany } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

// Define the Oportunidade interface locally to match frontend expectations
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

// Transform API OpportunityWithCompany to frontend Oportunidade interface
const transformOpportunity = (opportunity: OpportunityWithCompany): Oportunidade => {
  return {
    id: opportunity.opportunity_id,
    foto: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    nome: opportunity.company_name,
    risco: 'A', // This would need to come from risk assessment
    retornoBruto: opportunity.expected_return,
    prazo: opportunity.duration_months,
    percentualCaptacao: Math.round((opportunity.funded_amount / opportunity.target_amount) * 100),
    valorCota: opportunity.quota_price / 100, // Convert from cents
    cnpj: opportunity.company_cnpj,
    faturamentoAnual: opportunity.company_annual_revenue || 0,
    setor: opportunity.company_sector || "Não informado",
    site: null,
    garantia: "A definir",
    capitalSocial: opportunity.target_amount / 100 // Convert from cents
  };
};

export default function Opportunities() {
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<OpportunityWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRiscos, setSelectedRiscos] = useState<string[]>([]);
  const [tempoRange, setTempoRange] = useState<[number, number]>([6, 36]);
  const [captacaoRange, setCaptacaoRange] = useState<[number, number]>([0, 100]);

  // Fetch opportunities on component mount
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiOpportunities = await apiService.getOpportunities();
        setOpportunities(apiOpportunities);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
        setError('Erro ao carregar oportunidades');
        toast({
          title: "Erro ao carregar oportunidades",
          description: "Não foi possível carregar as oportunidades. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [toast]);

  // Transform API opportunities to frontend format
  const oportunidadesData = opportunities.map(transformOpportunity);

  // Filter opportunities
  const filteredOportunidades = oportunidadesData.filter(opp => {
    const matchesSearch = opp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.setor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisco = selectedRiscos.length === 0 || selectedRiscos.includes(opp.risco);
    const matchesTempo = opp.prazo >= tempoRange[0] && opp.prazo <= tempoRange[1];
    const matchesCaptacao = opp.percentualCaptacao >= captacaoRange[0] && 
                           opp.percentualCaptacao <= captacaoRange[1];

    return matchesSearch && matchesRisco && matchesTempo && matchesCaptacao;
  });

  if (loading) {
    return (
      <DashboardLayout title="Oportunidades de Investimento">
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Carregando oportunidades...</span>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Oportunidades de Investimento">
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header without Create Opportunity Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Oportunidades de Investimento</h2>
              <p className="text-muted-foreground">
                Descubra oportunidades de investimento aprovadas automaticamente
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Filters Sidebar */}
            <div className="hidden lg:block">
              <FiltersPanel
                onRiscoChange={setSelectedRiscos}
                onTempoChange={(min, max) => setTempoRange([min, max])}
                onCaptacaoChange={(min, max) => setCaptacaoRange([min, max])}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-4 sm:space-y-6">
              {/* Search and Mobile Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <SearchBar
                    placeholder="Buscar por nome da empresa..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                  />
                </div>
                <div className="lg:hidden">
                  <FiltersPanel
                    onRiscoChange={setSelectedRiscos}
                    onTempoChange={(min, max) => setTempoRange([min, max])}
                    onCaptacaoChange={(min, max) => setCaptacaoRange([min, max])}
                    isMobile
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground">
                {filteredOportunidades.length === oportunidadesData.length ? (
                  `Mostrando todas as ${filteredOportunidades.length} oportunidades`
                ) : (
                  `${filteredOportunidades.length} de ${oportunidadesData.length} oportunidades encontradas`
                )}
              </div>

              {/* Opportunities Grid */}
              {filteredOportunidades.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {filteredOportunidades.map((oportunidade) => (
                    <CardOportunidade
                      key={oportunidade.id}
                      oportunidade={oportunidade}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-muted-foreground/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">
                    Nenhuma oportunidade encontrada
                  </h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros para encontrar mais oportunidades.
                  </p>
                </div>
              )}

              {/* Load More */}
              {filteredOportunidades.length > 0 && filteredOportunidades.length < oportunidadesData.length && (
                <div className="text-center pt-6">
                  <Button variant="outline" size="lg">
                    Carregar mais oportunidades
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}