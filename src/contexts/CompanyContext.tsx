import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Company {
  id: string;
  cnpj: string;
  companyName: string;
  sector: string;
  revenue: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  zipcode: string;
  businessSector?: string;
  riskScore?: number;
  foundedDate: string;
  employeesCount: number;
}

interface CompanyContextType {
  companies: Company[];
  addCompany: (company: Omit<Company, 'id'>) => void;
  updateCompany: (id: string, company: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  getCompanyById: (id: string) => Company | undefined;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

interface CompanyProviderProps {
  children: ReactNode;
}

export function CompanyProvider({ children }: CompanyProviderProps) {
  const [companies, setCompanies] = useState<Company[]>([
    // Empresa padrão para demonstração
    {
      id: '1',
      cnpj: '12.345.678/0001-90',
      companyName: 'TechSolutions LTDA',
      sector: 'technology',
      revenue: '150000',
      address: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 99999-9999',
      zipcode: '01234-567',
      businessSector: 'Desenvolvimento de Software',
      riskScore: 85,
      foundedDate: '2020-01-15',
      employeesCount: 25
    }
  ]);

  const addCompany = (companyData: Omit<Company, 'id'>) => {
    const newCompany: Company = {
      ...companyData,
      id: Date.now().toString(), // ID simples baseado em timestamp
    };
    setCompanies(prev => [...prev, newCompany]);
  };

  const updateCompany = (id: string, companyData: Partial<Company>) => {
    setCompanies(prev => 
      prev.map(company => 
        company.id === id ? { ...company, ...companyData } : company
      )
    );
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(company => company.id !== id));
  };

  const getCompanyById = (id: string) => {
    return companies.find(company => company.id === id);
  };

  const value: CompanyContextType = {
    companies,
    addCompany,
    updateCompany,
    deleteCompany,
    getCompanyById,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (context === undefined) {
    throw new Error('useCompany deve ser usado dentro de um CompanyProvider');
  }
  return context;
}
