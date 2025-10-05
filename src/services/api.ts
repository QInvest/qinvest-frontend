const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * API Service com suporte duplo de autenticação:
 * 1. Bearer Token (localStorage) - Método principal
 * 2. Cookies (httpOnly) - Fallback automático
 *
 * Todas as requisições autenticadas tentam primeiro com Bearer token,
 * e em caso de falha, fazem fallback para cookies automaticamente.
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  type?: 'client' | 'admin';
}

export interface User {
  user_id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  type: 'client' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  kyc_verified: boolean;
  birth_date?: string;
  created_at: string;
  updated_at?: string;
}

export interface WalletData {
  wallet_id: string;
  user_id: string;
  balance: number;
  type: string;
  currency: string;
  created_at: string;
  updated_at: string | null;
}

export interface TransactionData {
  transaction_id: string;
  wallet_id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: string;
  created_at: string;
}

export interface Company {
  company_id: string;
  user_id: string;
  company_name: string;
  cnpj: string;
  cnae_primary: string;
  cnae_secondary?: string;
  annual_revenue: number;
  employees_count: number;
  founded_date: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  zipcode: string;
  status: string;
  business_sector?: string;
  risk_score?: number;
  created_at: string;
  updated_at?: string;
}

export interface CompanyCreate {
  company_name: string;
  cnpj: string;
  cnae_primary: string;
  cnae_secondary?: string;
  annual_revenue: number;
  employees_count: number;
  founded_date: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  zipcode: string;
  status: string;
  business_sector?: string;
}

// P2P Lending interfaces matching backend models
export interface Captation {
  captation_id: string;
  company_id: string;
  requested_amount: number; // in cents
  purpose: string;
  description?: string;
  duration_months: number;
  monthly_interest_rate: number; // percentage
  expected_return: number; // percentage
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at?: string;
  approved_by?: string;
  approved_at?: string;
}

export interface CaptationCreate {
  company_id: string;
  requested_amount: number; // in cents
  purpose: string;
  description?: string;
  duration_months: number;
  monthly_interest_rate: number; // percentage
  expected_return: number; // percentage
}

export interface CaptationApprovalRequest {
  captation_id: string;
  approved: boolean;
  admin_notes?: string;
  // Opportunity parameters (if approved)
  quota_price?: number; // in cents
  total_quotas?: number;
  min_investment_quotas?: number;
  max_investment_quotas?: number;
  funding_deadline?: string;
}

export interface Opportunity {
  opportunity_id: string;
  captation_id: string;
  target_amount: number; // in cents
  quota_price: number; // in cents
  total_quotas: number;
  available_quotas: number;
  min_investment_quotas: number;
  max_investment_quotas?: number;
  status: 'open' | 'funding' | 'funded' | 'active' | 'completed' | 'defaulted';
  funded_amount: number; // in cents
  investors_count: number;
  funding_deadline?: string;
  created_at: string;
  updated_at?: string;
}

export interface OpportunityWithCompany extends Opportunity {
  // Company information
  company_name: string;
  company_cnpj: string;
  company_sector?: string;
  company_annual_revenue?: number;
  // Captation information
  purpose: string;
  description?: string;
  duration_months: number;
  monthly_interest_rate: number;
  expected_return: number;
}

export interface OpportunityDetail extends Opportunity {
  captation?: Captation;
  investments?: Investment[];
  total_investors: number;
  funding_percentage: number;
}

export interface Investment {
  investment_id: string;
  opportunity_id: string;
  investor_id: string; // user_id of the investor
  quotas_purchased: number;
  investment_amount: number; // in cents
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
  confirmed_at?: string;
}

export interface InvestmentRequest {
  opportunity_id: string;
  quotas_to_purchase: number;
}

export interface InvestorPortfolio {
  total_invested: number; // in cents
  total_received: number; // in cents
  active_investments: number;
  investments: Investment[];
}

export interface CompanyDashboard {
  company_id: string;
  total_captations: number;
  approved_captations: number;
  active_opportunities: number;
  total_funded: number; // in cents
  pending_payments: number; // in cents
}

// Legacy interfaces for backward compatibility (remove these after refactoring components)
export interface OpportunityCreate {
  captation_id: string;
  target_amount: number;
  quota_price: number;
  total_quotas: number;
  min_investment_quotas: number;
  max_investment_quotas?: number;
  funding_deadline?: string;
}

export interface InvestmentCreate {
  opportunity_id: string;
  quotas_purchased: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    let headers = { ...defaultHeaders };

    // Adicionar headers de autenticação se necessário
    if (requiresAuth) {
      const authHeaders = this.getAuthHeaders();
      headers = { ...headers, ...authHeaders };
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
      credentials: 'include', // Para incluir cookies
      mode: 'cors', // Força o modo CORS
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de rede ou servidor');
    }
  }

  // Métodos de autenticação
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<User> {
    return this.request<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.requestWithFallback<User>('/api/auth/me', {
      method: 'GET',
    }, true); // Tenta Bearer primeiro, depois cookies
  }

  async logout(): Promise<void> {
    // Limpar token do localStorage (Bearer token)
    localStorage.removeItem('access_token');

    // Limpar cookies também (para suporte duplo)
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    return Promise.resolve();
  }

  // Verificar se usuário está autenticado (Bearer token ou cookies)
  async isAuthenticated(): Promise<boolean> {
    try {
      // Tentar obter dados do usuário atual (funcionará com Bearer ou cookies)
      await this.getCurrentUser();
      return true;
    } catch (error) {
      // Se falhar, usuário não está autenticado
      return false;
    }
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Tentar usar Bearer token primeiro (localStorage)
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Retorna headers com autenticação (Bearer ou cookies via credentials: 'include')
    return headers;
  }

  // Método alternativo que força tentativa apenas com cookies (sem Bearer)
  private getCookieAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      // Não inclui Authorization header, deixando para o backend usar cookies
    };
  }

  // Método que tenta primeiro Bearer token, depois cookies (ambas as opções)
  async requestWithFallback<T>(
    endpoint: string,
    options: RequestInit = {},
    requiresAuth: boolean = false
  ): Promise<T> {
    // Tentar primeiro com Bearer token
    if (requiresAuth) {
      try {
        return await this.request<T>(endpoint, options, true);
      } catch (error) {
        // Se falhar, tentar apenas com cookies
        console.log('Tentativa com Bearer token falhou, tentando com cookies...');
        return await this.requestWithCookiesOnly<T>(endpoint, options);
      }
    }

    return await this.request<T>(endpoint, options, false);
  }

  // Requisição usando apenas cookies (sem Bearer token)
  private async requestWithCookiesOnly<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Para incluir cookies
      mode: 'cors', // Força o modo CORS
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de rede ou servidor');
    }
  }

  async fetchWallet(): Promise<WalletData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wallets`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include' // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch wallet: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching wallet:', error);
      throw error;
    }
  }

  async fetchTransactions(): Promise<TransactionData[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wallets/transactions`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  async createTransaction(data: { 
    wallet_id: string; 
    amount: number; 
    type: 'credit' | 'debit'; 
    status?: string 
  }): Promise<TransactionData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wallets/transactions`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Failed to create transaction: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  // Company Methods
  async createCompany(companyData: CompanyCreate): Promise<Company> {
    return this.request<Company>('/api/auth/companies', {
      method: 'POST',
      body: JSON.stringify(companyData),
    }, true); // Requer autenticação
  }

  async getMyCompany(): Promise<Company> {
    const companies = await this.listCompanies();
    if (companies.length === 0) {
      throw new Error('No company found for user');
    }
    return companies[0]; // Return first company (users can only have one)
  }

  async updateMyCompany(companyData: Partial<CompanyCreate>): Promise<Company> {
    const company = await this.getMyCompany();
    return this.request<Company>(`/api/auth/companies/${company.company_id}`, {
      method: 'PUT',
      body: JSON.stringify(companyData),
    }, true); // Requer autenticação
  }

  async listCompanies(): Promise<Company[]> {
    return this.request<Company[]>('/api/auth/companies', {
      method: 'GET',
    }, true); // Requer autenticação
  }

  async getCompany(companyId: string): Promise<Company> {
    return this.request<Company>(`/api/auth/companies/${companyId}`, {
      method: 'GET',
    }, true); // Requer autenticação
  }

  async deleteCompany(companyId: string): Promise<{message: string}> {
    return this.request<{message: string}>(`/api/auth/companies/${companyId}`, {
      method: 'DELETE',
    }, true); // Requer autenticação
  }

  // P2P Captation Methods (Company funding requests)
  async createCaptation(captationData: CaptationCreate): Promise<Captation> {
    return this.request<Captation>('/api/p2p/captations', {
      method: 'POST',
      body: JSON.stringify(captationData),
    }, true); // Requer autenticação
  }

  async listCaptations(status?: string): Promise<Captation[]> {
    const params = status ? `?status=${status}` : '';
    return this.request<Captation[]>(`/api/p2p/captations${params}`, {
      method: 'GET',
    }, true); // Requer autenticação
  }

  async approveCaptation(approvalData: CaptationApprovalRequest): Promise<Opportunity> {
    return this.request<Opportunity>('/api/p2p/captations/approve', {
      method: 'POST',
      body: JSON.stringify(approvalData),
    }, true); // Requer autenticação
  }

  // P2P Opportunity Methods (Available investments)
  async getOpportunities(status?: string): Promise<OpportunityWithCompany[]> {
    const params = status ? `?status=${status}` : '';
    return this.request<OpportunityWithCompany[]>(`/api/p2p/opportunities${params}`, {
      method: 'GET',
    }, true); // Requer autenticação
  }

  async getMyCompanyOpportunities(): Promise<Opportunity[]> {
    return this.request<Opportunity[]>('/api/p2p/opportunities/company', {
      method: 'GET',
    }, true); // Requer autenticação
  }

  async getOpportunity(opportunityId: string): Promise<OpportunityDetail> {
    return this.request<OpportunityDetail>(`/api/p2p/opportunities/${opportunityId}`, {
      method: 'GET',
    }, true); // Requer autenticação
  }

  async getOpportunityInvestments(opportunityId: string): Promise<Investment[]> {
    return this.request<Investment[]>(`/api/p2p/opportunities/${opportunityId}/investments`, {
      method: 'GET',
    }, true); // Requer autenticação
  }

  // P2P Investment Methods
  async createInvestment(investmentData: InvestmentRequest): Promise<Investment> {
    return this.request<Investment>('/api/p2p/investments', {
      method: 'POST',
      body: JSON.stringify(investmentData),
    }, true); // Requer autenticação
  }

  async getUserPortfolio(): Promise<InvestorPortfolio> {
    return this.request<InvestorPortfolio>('/api/p2p/investments/portfolio', {
      method: 'GET',
    }, true); // Requer autenticação
  }

  async getUserInvestments(): Promise<Investment[]> {
    const portfolio = await this.getUserPortfolio();
    return portfolio.investments;
  }

  async getUserOpportunitySummary(opportunityId: string): Promise<{
    opportunity_id: string;
    user_summary: {
      total_quotas_owned: number;
      total_amount_invested: number;
      investment_count: number;
      investments: Investment[];
    };
    opportunity_limits: {
      min_investment_quotas: number;
      max_investment_quotas?: number;
      remaining_quotas_available: number;
      remaining_quotas_for_user?: number;
    };
  }> {
    return this.request(`/api/p2p/opportunities/${opportunityId}/user-summary`, {
      method: 'GET',
    }, true); // Requer autenticação
  }

  // Company Dashboard
  async getCompanyDashboard(): Promise<CompanyDashboard> {
    return this.request<CompanyDashboard>('/api/p2p/dashboard/company', {
      method: 'GET',
    }, true); // Requer autenticação
  }

  // Legacy methods for backward compatibility (to be removed after component refactoring)
  async createOpportunity(opportunityData: OpportunityCreate): Promise<Opportunity> {
    // This method is deprecated - use createCaptation instead
    console.warn('createOpportunity is deprecated. Use createCaptation instead.');
    return this.request<Opportunity>('/api/p2p/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunityData),
    }, true); // Requer autenticação
  }

  async getMyInvestments(): Promise<Investment[]> {
    // This method is deprecated - use getUserInvestments instead
    console.warn('getMyInvestments is deprecated. Use getUserInvestments instead.');
    return this.getUserInvestments();
  }

  async getInvestment(investmentId: string): Promise<Investment> {
    // This method might not exist in the backend - check if needed
    console.warn('getInvestment endpoint might not exist in backend');
    return this.request<Investment>(`/api/p2p/investments/${investmentId}`, {
      method: 'GET',
    }, true); // Requer autenticação
  }

  async listInvestmentsByOpportunity(opportunityId: string): Promise<Investment[]> {
    // Use the new method instead
    return this.getOpportunityInvestments(opportunityId);
  }
}

export const apiService = new ApiService();