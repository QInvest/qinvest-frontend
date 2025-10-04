import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/investment/SearchBar";
import { FiltersPanel } from "@/components/investment/FiltersPanel";
import { CardOportunidade } from "@/components/investment/CardOportunidade";
import { Logo } from "@/components/ui/logo";
import { mockOportunidades } from "@/data/mockData";

export default function Opportunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRiscos, setSelectedRiscos] = useState<string[]>([]);
  const [tempoRange, setTempoRange] = useState<[number, number]>([6, 36]);
  const [captacaoRange, setCaptacaoRange] = useState<[number, number]>([0, 100]);

  // Filter opportunities
  const filteredOportunidades = mockOportunidades.filter(opp => {
    const matchesSearch = opp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.setor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisco = selectedRiscos.length === 0 || selectedRiscos.includes(opp.risco);
    const matchesTempo = opp.prazo >= tempoRange[0] && opp.prazo <= tempoRange[1];
    const matchesCaptacao = opp.percentualCaptacao >= captacaoRange[0] && 
                           opp.percentualCaptacao <= captacaoRange[1];

    return matchesSearch && matchesRisco && matchesTempo && matchesCaptacao;
  });

  return (
    <div className="min-h-screen bg-muted/30 font-inter">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Logo />
            </Link>
            <div className="hidden md:block h-6 w-px bg-border" />
            <h1 className="hidden md:block text-xl font-semibold">Oportunidades de Investimento</h1>
          </div>
          
          <div className="text-right hidden sm:block">
            <div className="text-sm text-muted-foreground">Saldo disponível</div>
            <div className="text-2xl font-bold text-success">R$ 25.347,89</div>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="hidden lg:block">
              <FiltersPanel
                onRiscoChange={setSelectedRiscos}
                onTempoChange={(min, max) => setTempoRange([min, max])}
                onCaptacaoChange={(min, max) => setCaptacaoRange([min, max])}
              />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
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
                {filteredOportunidades.length === mockOportunidades.length ? (
                  `Mostrando todas as ${filteredOportunidades.length} oportunidades`
                ) : (
                  `${filteredOportunidades.length} de ${mockOportunidades.length} oportunidades encontradas`
                )}
              </div>

              {/* Opportunities Grid */}
              {filteredOportunidades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredOportunidades.map((oportunidade) => (
                    <CardOportunidade
                      key={oportunidade.id}
                      oportunidade={oportunidade}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg mb-4">
                    Nenhuma oportunidade encontrada com esses filtros.
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRiscos([]);
                      setTempoRange([6, 36]);
                      setCaptacaoRange([0, 100]);
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}

              {/* Load More */}
              {filteredOportunidades.length > 0 && filteredOportunidades.length < mockOportunidades.length && (
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
    </div>
  );
}
