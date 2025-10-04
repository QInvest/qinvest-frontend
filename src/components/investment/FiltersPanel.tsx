import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FiltersPanelProps {
  onRiscoChange: (risco: string[]) => void;
  onTempoChange: (min: number, max: number) => void;
  onCaptacaoChange: (min: number, max: number) => void;
  isMobile?: boolean;
}

export function FiltersPanel({ 
  onRiscoChange, 
  onTempoChange, 
  onCaptacaoChange,
  isMobile = false 
}: FiltersPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRiscos, setSelectedRiscos] = useState<string[]>([]);
  const [tempoRange, setTempoRange] = useState<[number, number]>([6, 36]);
  const [captacaoRange, setCaptacaoRange] = useState<[number, number]>([0, 100]);

  const handleRiscoToggle = (risco: string) => {
    const newRiscos = selectedRiscos.includes(risco)
      ? selectedRiscos.filter(r => r !== risco)
      : [...selectedRiscos, risco];
    setSelectedRiscos(newRiscos);
    onRiscoChange(newRiscos);
  };

  const handleTempoChange = (values: number[]) => {
    setTempoRange([values[0], values[1]]);
    onTempoChange(values[0], values[1]);
  };

  const handleCaptacaoChange = (values: number[]) => {
    setCaptacaoRange([values[0], values[1]]);
    onCaptacaoChange(values[0], values[1]);
  };

  const handleLimpar = () => {
    setSelectedRiscos([]);
    setTempoRange([6, 36]);
    setCaptacaoRange([0, 100]);
    onRiscoChange([]);
    onTempoChange(6, 36);
    onCaptacaoChange(0, 100);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Nível de Risco */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Nível de Risco</Label>
        <div className="space-y-2">
          {['baixo', 'medio', 'alto'].map((risco) => (
            <div key={risco} className="flex items-center space-x-2">
              <Checkbox
                id={`risco-${risco}`}
                checked={selectedRiscos.includes(risco)}
                onCheckedChange={() => handleRiscoToggle(risco)}
              />
              <label
                htmlFor={`risco-${risco}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {risco === 'baixo' ? '🔵 Baixo' : risco === 'medio' ? '🟡 Médio' : '🔴 Alto'}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Prazo */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Prazo: {tempoRange[0]} - {tempoRange[1]} meses
        </Label>
        <Slider
          min={6}
          max={36}
          step={6}
          value={tempoRange}
          onValueChange={handleTempoChange}
          className="w-full"
        />
      </div>

      {/* Captação */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          % Captação: {captacaoRange[0]}% - {captacaoRange[1]}%
        </Label>
        <Slider
          min={0}
          max={100}
          step={10}
          value={captacaoRange}
          onValueChange={handleCaptacaoChange}
          className="w-full"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4">
        <Button variant="outline" className="flex-1" onClick={handleLimpar}>
          <X className="h-4 w-4 mr-2" />
          Limpar
        </Button>
        {isMobile && (
          <Button className="flex-1" onClick={() => setIsOpen(false)}>
            Aplicar Filtros
          </Button>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {selectedRiscos.length > 0 && (
              <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {selectedRiscos.length}
              </span>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" role="dialog" aria-labelledby="filtros-titulo">
          <SheetHeader>
            <SheetTitle id="filtros-titulo">Filtros de Busca</SheetTitle>
            <SheetDescription>
              Refine sua busca por oportunidades de investimento
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Card className="shadow-card border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FilterContent />
      </CardContent>
    </Card>
  );
}
