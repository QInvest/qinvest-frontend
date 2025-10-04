// Mock Data para Qi Tech Platform

export interface Oportunidade {
  id: string;
  foto: string;
  nome: string;
  risco: 'baixo' | 'medio' | 'alto';
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

export interface EmpresaDetalhes extends Oportunidade {
  riscoExplicacao: string;
  redesSociais?: {
    linkedin?: string;
    instagram?: string;
  };
  valorSolicitado: number;
  valorCaptado: number;
  prazoRestante: number;
  projecaoInvestimento: {
    investindo: number;
    receberaApos12Meses: number;
    lucroLiquido: number;
  };
}

export interface Parcela {
  numero: number;
  data: string;
  valor: number;
  status: 'pago' | 'aguardando' | 'atrasado';
  dataPagamento: string | null;
}

export interface Investimento {
  id: string;
  empresaId: string;
  foto: string;
  nome: string;
  risco: 'baixo' | 'medio' | 'alto';
  numCotas: number;
  valorInvestido: number;
  valorRecebido: number;
  valorAReceber: number;
  lucroEsperado: number;
  vencimento: string;
  status: 'aberto' | 'finalizado' | 'analise';
  parcelas: Parcela[];
}

export interface Transacao {
  id: string;
  data: string;
  tipo: 'deposito' | 'saque' | 'lucro' | 'investimento';
  valor: number;
  status: 'concluido' | 'pendente' | 'falhou';
  descricao: string;
}

export interface Carteira {
  saldoDisponivel: number;
  patrimonioInvestido: number;
  lucroHistorico: number;
  extrato: Transacao[];
  graficoPatrimonio: Array<{ mes: string; valor: number }>;
}

// Mock Data
export const mockCarteira: Carteira = {
  saldoDisponivel: 25347.89,
  patrimonioInvestido: 50000.0,
  lucroHistorico: 3234.56,
  extrato: [
    {
      id: "txn-001",
      data: "2025-03-12T10:30:00Z",
      tipo: "deposito",
      valor: 1000.0,
      status: "concluido",
      descricao: "Depósito via PIX"
    },
    {
      id: "txn-002",
      data: "2025-03-10T15:45:00Z",
      tipo: "lucro",
      valor: 234.5,
      status: "concluido",
      descricao: "Lucro - TechCorp S.A."
    },
    {
      id: "txn-003",
      data: "2025-03-08T09:00:00Z",
      tipo: "investimento",
      valor: -5000.0,
      status: "concluido",
      descricao: "Investimento - TechCorp S.A."
    },
    {
      id: "txn-004",
      data: "2025-03-05T14:20:00Z",
      tipo: "deposito",
      valor: 10000.0,
      status: "concluido",
      descricao: "Depósito via TED"
    },
    {
      id: "txn-005",
      data: "2025-03-01T11:30:00Z",
      tipo: "lucro",
      valor: 187.25,
      status: "concluido",
      descricao: "Lucro - Food Express S.A."
    }
  ],
  graficoPatrimonio: [
    { mes: "Jan", valor: 45000 },
    { mes: "Fev", valor: 48000 },
    { mes: "Mar", valor: 53235 }
  ]
};

export const mockOportunidades: Oportunidade[] = [
  {
    id: "opp-001",
    foto: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    nome: "TechCorp S.A.",
    risco: "baixo",
    retornoBruto: 12.0,
    prazo: 12,
    percentualCaptacao: 65,
    valorCota: 500.0,
    cnpj: "12.345.678/0001-99",
    faturamentoAnual: 5000000.0,
    setor: "Tecnologia (CNAE 6201)",
    site: "https://techcorp.com.br",
    garantia: "Recebíveis",
    capitalSocial: 1000000.0
  },
  {
    id: "opp-002",
    foto: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    nome: "Food Express S.A.",
    risco: "medio",
    retornoBruto: 15.0,
    prazo: 24,
    percentualCaptacao: 40,
    valorCota: 1000.0,
    cnpj: "98.765.432/0001-11",
    faturamentoAnual: 12000000.0,
    setor: "Alimentação (CNAE 5611)",
    site: "https://foodexpress.com",
    garantia: "Aval dos sócios",
    capitalSocial: 500000.0
  },
  {
    id: "opp-003",
    foto: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=400&h=300&fit=crop",
    nome: "LogiX Transportes",
    risco: "baixo",
    retornoBruto: 10.0,
    prazo: 6,
    percentualCaptacao: 90,
    valorCota: 300.0,
    cnpj: "11.222.333/0001-44",
    faturamentoAnual: 8000000.0,
    setor: "Logística (CNAE 4930)",
    site: "https://logix.com",
    garantia: "Frota de veículos",
    capitalSocial: 2000000.0
  },
  {
    id: "opp-004",
    foto: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    nome: "RetailY Varejo",
    risco: "alto",
    retornoBruto: 18.0,
    prazo: 36,
    percentualCaptacao: 20,
    valorCota: 2000.0,
    cnpj: "55.666.777/0001-88",
    faturamentoAnual: 3000000.0,
    setor: "Varejo (CNAE 4711)",
    site: null,
    garantia: "Sem garantia",
    capitalSocial: 300000.0
  },
  {
    id: "opp-005",
    foto: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop",
    nome: "EcoTech Energia",
    risco: "baixo",
    retornoBruto: 11.5,
    prazo: 18,
    percentualCaptacao: 75,
    valorCota: 800.0,
    cnpj: "33.444.555/0001-22",
    faturamentoAnual: 15000000.0,
    setor: "Energia Solar (CNAE 3511)",
    site: "https://ecotech.com.br",
    garantia: "Equipamentos",
    capitalSocial: 5000000.0
  }
];

export const mockInvestimentos: Investimento[] = [
  {
    id: "inv-001",
    empresaId: "opp-001",
    foto: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    nome: "TechCorp S.A.",
    risco: "baixo",
    numCotas: 10,
    valorInvestido: 5000.0,
    valorRecebido: 2333.5,
    valorAReceber: 2666.5,
    lucroEsperado: 600.0,
    vencimento: "2025-12-15T00:00:00Z",
    status: "aberto",
    parcelas: [
      {
        numero: 1,
        data: "2025-01-15T00:00:00Z",
        valor: 466.7,
        status: "pago",
        dataPagamento: "2025-01-15T08:30:00Z"
      },
      {
        numero: 2,
        data: "2025-02-15T00:00:00Z",
        valor: 466.7,
        status: "pago",
        dataPagamento: "2025-02-15T09:15:00Z"
      },
      {
        numero: 3,
        data: "2025-03-15T00:00:00Z",
        valor: 466.7,
        status: "pago",
        dataPagamento: "2025-03-16T10:00:00Z"
      },
      {
        numero: 4,
        data: "2025-04-15T00:00:00Z",
        valor: 466.7,
        status: "aguardando",
        dataPagamento: null
      },
      {
        numero: 5,
        data: "2025-05-15T00:00:00Z",
        valor: 466.7,
        status: "aguardando",
        dataPagamento: null
      }
    ]
  },
  {
    id: "inv-002",
    empresaId: "opp-002",
    foto: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
    nome: "Food Express S.A.",
    risco: "medio",
    numCotas: 5,
    valorInvestido: 5000.0,
    valorRecebido: 5750.0,
    valorAReceber: 0,
    lucroEsperado: 750.0,
    vencimento: "2025-03-01T00:00:00Z",
    status: "finalizado",
    parcelas: [
      {
        numero: 1,
        data: "2024-03-01T00:00:00Z",
        valor: 287.5,
        status: "pago",
        dataPagamento: "2024-03-01T10:00:00Z"
      },
      {
        numero: 2,
        data: "2024-04-01T00:00:00Z",
        valor: 287.5,
        status: "pago",
        dataPagamento: "2024-04-01T10:00:00Z"
      }
    ]
  }
];

export const getEmpresaDetalhes = (id: string): EmpresaDetalhes | undefined => {
  const oportunidade = mockOportunidades.find(o => o.id === id);
  if (!oportunidade) return undefined;

  return {
    ...oportunidade,
    riscoExplicacao: oportunidade.risco === 'baixo'
      ? "Empresa com histórico sólido, garantias reais e baixa inadimplência no setor."
      : oportunidade.risco === 'medio'
      ? "Empresa em crescimento com garantias parciais. Risco moderado de inadimplência."
      : "Empresa em estágio inicial ou setor volátil. Maior potencial de retorno, mas com risco elevado.",
    redesSociais: {
      linkedin: `https://linkedin.com/company/${oportunidade.nome.toLowerCase().replace(/\s/g, '')}`,
      instagram: `@${oportunidade.nome.toLowerCase().replace(/\s/g, '')}`
    },
    valorSolicitado: oportunidade.valorCota * 200,
    valorCaptado: (oportunidade.valorCota * 200 * oportunidade.percentualCaptacao) / 100,
    prazoRestante: 15,
    projecaoInvestimento: {
      investindo: 1000.0,
      receberaApos12Meses: 1000 + (1000 * oportunidade.retornoBruto) / 100,
      lucroLiquido: (1000 * oportunidade.retornoBruto) / 100
    }
  };
};
