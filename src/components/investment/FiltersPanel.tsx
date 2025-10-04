import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FiltersPanelProps {
  onRiscoChange: (riscos: string[]) => void;
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
  const [selectedRiscos, setSelectedRiscos] = React.useState<string[]>([]);
  const [tempoRange, setTempoRange] = React.useState<[number, number]>([6, 36]);
  const [captacaoRange, setCaptacaoRange] = React.useState<[number, number]>([0, 100]);

  const handleRiscoToggle = (risco: string) => {
    const newRiscos = selectedRiscos.includes(risco)
      ? selectedRiscos.filter(r => r !== risco)
      : [...selectedRiscos, risco];
    
    setSelectedRiscos(newRiscos);
    onRiscoChange(newRiscos);
  };

  const handleTempoChange = (value: number[]) => {
    const [min, max] = value as [number, number];
    setTempoRange([min, max]);
    onTempoChange(min, max);
  };

  const handleCaptacaoChange = (value: number[]) => {
    const [min, max] = value as [number, number];
    setCaptacaoRange([min, max]);
    onCaptacaoChange(min, max);
  };

  const clearFilters = () => {
    setSelectedRiscos([]);
    setTempoRange([6, 36]);
    setCaptacaoRange([0, 100]);
    onRiscoChange([]);
    onTempoChange(6, 36);
    onCaptacaoChange(0, 100);
  };

  const getRiscoIcon = (risco: string) => {
    switch (risco) {
      case 'A':
        return "🟢";
      case 'B':
        return "🔵";
      case 'C':
        return "🟡";
      case 'D':
        return "🔴";
      default:
        return "⚪";
    }
  };

  const getRiscoLabel = (risco: string) => {
    switch (risco) {
      case 'A':
        return "Risco A";
      case 'B':
        return "Risco B";
      case 'C':
        return "Risco C";
      case 'D':
        return "Risco D";
      default:
        return risco;
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Limpar
        </Button>
      </div>

      {/* Risk Level */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Nível de Risco</Label>
        <div className="space-y-2">
          {['A', 'B', 'C', 'D'].map((risco) => (
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
                {getRiscoIcon(risco)} {getRiscoLabel(risco)}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Time Range */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Prazo: {tempoRange[0]} - {tempoRange[1]} meses
        </Label>
        <Slider
          value={tempoRange}
          onValueChange={handleTempoChange}
          max={60}
          min={1}
          step={1}
          className="w-full"
        />
      </div>

      {/* Funding Range */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">
          Captação: {captacaoRange[0]}% - {captacaoRange[1]}%
        </Label>
        <Slider
          value={captacaoRange}
          onValueChange={handleCaptacaoChange}
          max={100}
          min={0}
          step={5}
          className="w-full"
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Card className="lg:hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          {content}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hidden lg:block">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Filtros</CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}

// Add React import
import React from "react";