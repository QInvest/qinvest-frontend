import { useState } from 'react';
import { TrendingUp, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiService, Opportunity } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AddOpportunityDialogProps {
  onOpportunityAdded?: (opportunity: Opportunity) => void;
}

export function AddOpportunityDialog({ onOpportunityAdded }: AddOpportunityDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    captation_id: '', // This would need to be linked to the company's captation
    target_amount: '',
    quota_price: '',
    total_quotas: '',
    min_investment_quotas: '',
    max_investment_quotas: '',
    funding_deadline: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const opportunityData = {
        captation_id: formData.captation_id || 'temp-captation-id', // TODO: Get from company
        target_amount: parseFloat(formData.target_amount.replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
        quota_price: parseFloat(formData.quota_price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
        total_quotas: parseInt(formData.total_quotas) || 0,
        min_investment_quotas: parseInt(formData.min_investment_quotas) || 1,
        max_investment_quotas: formData.max_investment_quotas ? parseInt(formData.max_investment_quotas) : undefined,
        funding_deadline: formData.funding_deadline || undefined
      };

      const newOpportunity = await apiService.createOpportunity(opportunityData);
      
      toast({
        title: "Oportunidade criada!",
        description: `Oportunidade de investimento criada com sucesso.`,
      });

      // Reset form
      setFormData({
        captation_id: '',
        target_amount: '',
        quota_price: '',
        total_quotas: '',
        min_investment_quotas: '',
        max_investment_quotas: '',
        funding_deadline: ''
      });

      setOpen(false);
      
      if (onOpportunityAdded) {
        onOpportunityAdded(newOpportunity);
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast({
        title: "Erro ao criar oportunidade",
        description: "Não foi possível criar a oportunidade. Verifique os dados e tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Criar Oportunidade
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Criar Nova Oportunidade de Investimento
          </DialogTitle>
          <DialogDescription>
            Crie uma nova oportunidade de investimento para sua empresa
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Target Amount */}
            <div className="space-y-2">
              <Label htmlFor="target_amount">Valor Alvo *</Label>
              <Input
                id="target_amount"
                placeholder="R$ 100.000,00"
                value={formData.target_amount}
                onChange={(e) => handleInputChange("target_amount", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Quota Price */}
            <div className="space-y-2">
              <Label htmlFor="quota_price">Valor por Cota *</Label>
              <Input
                id="quota_price"
                placeholder="R$ 500,00"
                value={formData.quota_price}
                onChange={(e) => handleInputChange("quota_price", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Total Quotas */}
            <div className="space-y-2">
              <Label htmlFor="total_quotas">Total de Cotas *</Label>
              <Input
                id="total_quotas"
                type="number"
                placeholder="200"
                value={formData.total_quotas}
                onChange={(e) => handleInputChange("total_quotas", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Min Investment Quotas */}
            <div className="space-y-2">
              <Label htmlFor="min_investment_quotas">Mínimo de Cotas por Investimento *</Label>
              <Input
                id="min_investment_quotas"
                type="number"
                placeholder="1"
                value={formData.min_investment_quotas}
                onChange={(e) => handleInputChange("min_investment_quotas", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Max Investment Quotas */}
            <div className="space-y-2">
              <Label htmlFor="max_investment_quotas">Máximo de Cotas por Investimento</Label>
              <Input
                id="max_investment_quotas"
                type="number"
                placeholder="50"
                value={formData.max_investment_quotas}
                onChange={(e) => handleInputChange("max_investment_quotas", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Funding Deadline */}
            <div className="space-y-2">
              <Label htmlFor="funding_deadline">Prazo Final para Captação</Label>
              <Input
                id="funding_deadline"
                type="date"
                value={formData.funding_deadline}
                onChange={(e) => handleInputChange("funding_deadline", e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 gradient-primary text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando oportunidade...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Oportunidade
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}