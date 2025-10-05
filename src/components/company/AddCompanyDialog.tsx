import { useState } from 'react';
import { Building2, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { apiService, Company } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface AddCompanyDialogProps {
  onCompanyAdded?: (company: Company) => void;
}

export function AddCompanyDialog({ onCompanyAdded }: AddCompanyDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    cnpj: '',
    company_name: '',
    cnae_primary: '',
    cnae_secondary: '',
    annual_revenue: '',
    employees_count: '',
    founded_date: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    zipcode: '',
    status: 'active',
    business_sector: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const companyData = {
        cnpj: formData.cnpj,
        company_name: formData.company_name,
        cnae_primary: formData.cnae_primary,
        cnae_secondary: formData.cnae_secondary || undefined,
        annual_revenue: parseFloat(formData.annual_revenue.replace(/[^\d.,]/g, '').replace(',', '.')) || 0,
        employees_count: parseInt(formData.employees_count) || 0,
        founded_date: formData.founded_date,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        phone: formData.phone,
        zipcode: formData.zipcode,
        status: formData.status,
        business_sector: formData.business_sector || undefined
      };

      const newCompany = await apiService.createCompany(companyData);
      
      toast({
        title: "Empresa criada!",
        description: `${formData.company_name} foi criada com sucesso.`,
      });

      // Reset form
      setFormData({
        cnpj: '',
        company_name: '',
        cnae_primary: '',
        cnae_secondary: '',
        annual_revenue: '',
        employees_count: '',
        founded_date: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        zipcode: '',
        status: 'active',
        business_sector: ''
      });

      setOpen(false);
      
      if (onCompanyAdded) {
        onCompanyAdded(newCompany);
      }
    } catch (error) {
      console.error('Error creating company:', error);
      toast({
        title: "Erro ao criar empresa",
        description: "Não foi possível criar a empresa. Verifique os dados e tente novamente.",
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
          Adicionar Empresa
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Adicionar Nova Empresa
          </DialogTitle>
          <DialogDescription>
            Preencha as informações da empresa para cadastrá-la no sistema
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CNPJ */}
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={(e) => handleInputChange("cnpj", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="company_name">Nome da Empresa *</Label>
              <Input
                id="company_name"
                placeholder="Nome da empresa"
                value={formData.company_name}
                onChange={(e) => handleInputChange("company_name", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* CNAE Primary */}
            <div className="space-y-2">
              <Label htmlFor="cnae_primary">CNAE Principal *</Label>
              <Input
                id="cnae_primary"
                placeholder="Ex: 6201-5/00"
                value={formData.cnae_primary}
                onChange={(e) => handleInputChange("cnae_primary", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* CNAE Secondary */}
            <div className="space-y-2">
              <Label htmlFor="cnae_secondary">CNAE Secundário</Label>
              <Input
                id="cnae_secondary"
                placeholder="Ex: 6209-1/00"
                value={formData.cnae_secondary}
                onChange={(e) => handleInputChange("cnae_secondary", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Annual Revenue */}
            <div className="space-y-2">
              <Label htmlFor="annual_revenue">Faturamento Anual *</Label>
              <Input
                id="annual_revenue"
                placeholder="R$ 0,00"
                value={formData.annual_revenue}
                onChange={(e) => handleInputChange("annual_revenue", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Employees Count */}
            <div className="space-y-2">
              <Label htmlFor="employees_count">Número de Funcionários *</Label>
              <Input
                id="employees_count"
                type="number"
                placeholder="0"
                value={formData.employees_count}
                onChange={(e) => handleInputChange("employees_count", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Founded Date */}
            <div className="space-y-2">
              <Label htmlFor="founded_date">Data de Fundação *</Label>
              <Input
                id="founded_date"
                type="date"
                value={formData.founded_date}
                onChange={(e) => handleInputChange("founded_date", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="inactive">Inativa</SelectItem>
                  <SelectItem value="suspended">Suspensa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Endereço *</Label>
              <Input
                id="address"
                placeholder="Rua, número"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                placeholder="Cidade"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                placeholder="SP"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Zipcode */}
            <div className="space-y-2">
              <Label htmlFor="zipcode">CEP *</Label>
              <Input
                id="zipcode"
                placeholder="00000-000"
                value={formData.zipcode}
                onChange={(e) => handleInputChange("zipcode", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Business Sector */}
            <div className="space-y-2">
              <Label htmlFor="business_sector">Setor de Negócio</Label>
              <Input
                id="business_sector"
                placeholder="Ex: Desenvolvimento de Software"
                value={formData.business_sector}
                onChange={(e) => handleInputChange("business_sector", e.target.value)}
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
                  Criando empresa...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Empresa
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
