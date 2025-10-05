import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCompany, Company } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/use-toast';

interface AddCompanyDialogProps {
  onCompanyAdded?: (company: Company) => void;
}

export function AddCompanyDialog({ onCompanyAdded }: AddCompanyDialogProps) {
  const { addCompany } = useCompany();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    cnpj: '',
    companyName: '',
    sector: '',
    revenue: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    zipcode: '',
    businessSector: '',
    foundedDate: '',
    employeesCount: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newCompany = {
        cnpj: formData.cnpj,
        companyName: formData.companyName,
        sector: formData.sector,
        revenue: formData.revenue,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        phone: formData.phone,
        zipcode: formData.zipcode,
        businessSector: formData.businessSector,
        foundedDate: formData.foundedDate,
        employeesCount: parseInt(formData.employeesCount) || 0
      };

      addCompany(newCompany);
      
      toast({
        title: "Empresa adicionada!",
        description: `${formData.companyName} foi adicionada com sucesso.`,
      });

      // Reset form
      setFormData({
        cnpj: '',
        companyName: '',
        sector: '',
        revenue: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        zipcode: '',
        businessSector: '',
        foundedDate: '',
        employeesCount: ''
      });

      setOpen(false);
      
      if (onCompanyAdded) {
        const addedCompany = { ...newCompany, id: Date.now().toString() };
        onCompanyAdded(addedCompany as Company);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a empresa.",
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
              <Label htmlFor="companyName">Nome da Empresa *</Label>
              <Input
                id="companyName"
                placeholder="Nome da empresa"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Sector */}
            <div className="space-y-2">
              <Label htmlFor="sector">Setor de Atuação *</Label>
              <Select
                value={formData.sector}
                onValueChange={(value) => handleInputChange("sector", value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Tecnologia</SelectItem>
                  <SelectItem value="agriculture">Agronegócio</SelectItem>
                  <SelectItem value="retail">Varejo</SelectItem>
                  <SelectItem value="manufacturing">Indústria</SelectItem>
                  <SelectItem value="services">Serviços</SelectItem>
                  <SelectItem value="healthcare">Saúde</SelectItem>
                  <SelectItem value="education">Educação</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Revenue */}
            <div className="space-y-2">
              <Label htmlFor="revenue">Faturamento Mensal *</Label>
              <Input
                id="revenue"
                placeholder="R$ 0,00"
                value={formData.revenue}
                onChange={(e) => handleInputChange("revenue", e.target.value)}
                required
                disabled={isSubmitting}
              />
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
              <Label htmlFor="businessSector">Ramo de Negócio</Label>
              <Input
                id="businessSector"
                placeholder="Ex: Desenvolvimento de Software"
                value={formData.businessSector}
                onChange={(e) => handleInputChange("businessSector", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Founded Date */}
            <div className="space-y-2">
              <Label htmlFor="foundedDate">Data de Fundação *</Label>
              <Input
                id="foundedDate"
                type="date"
                value={formData.foundedDate}
                onChange={(e) => handleInputChange("foundedDate", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Employees Count */}
            <div className="space-y-2">
              <Label htmlFor="employeesCount">Número de Funcionários *</Label>
              <Input
                id="employeesCount"
                type="number"
                placeholder="0"
                value={formData.employeesCount}
                onChange={(e) => handleInputChange("employeesCount", e.target.value)}
                required
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adicionando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Empresa
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
