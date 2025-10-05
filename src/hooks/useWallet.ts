import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';
import type { WalletData, TransactionData } from '@/services/api';

// Define interfaces locally
interface Transacao {
  id: string;
  data: string;
  tipo: 'deposito' | 'saque' | 'lucro' | 'investimento';
  valor: number;
  status: 'concluido' | 'pendente' | 'falhou';
  descricao: string;
}

interface Carteira {
  saldoDisponivel: number;
  patrimonioInvestido: number;
  lucroHistorico: number;
  extrato: Transacao[];
  graficoPatrimonio: Array<{ mes: string; valor: number }>;
}

// Transform API data to match your frontend interface
const transformWalletData = (walletData: WalletData, transactions: TransactionData[]): Carteira => {
  const extrato: Transacao[] = transactions.map(transaction => ({
    id: transaction.transaction_id,
    data: transaction.created_at,
    tipo: transaction.type === 'credit' ? 'deposito' : 'saque',
    valor: transaction.type === 'credit' ? transaction.amount : -transaction.amount,
    status: transaction.status === 'completed' ? 'concluido' : 'pendente',
    descricao: `${transaction.type === 'credit' ? 'Depósito' : 'Saque'} - ${transaction.amount / 100} ${walletData.currency}`
  }));

  // Calculate patrimonio and lucro from transactions
  const totalDeposits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalWithdrawals = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  // Generate real portfolio chart data based on transaction history
  const generatePortfolioChart = (): Array<{ mes: string; valor: number }> => {
    if (transactions.length === 0) {
      return [{ mes: "Atual", valor: walletData.balance / 100 }];
    }

    // Group transactions by month
    const monthlyData = new Map<string, number>();
    const currentBalance = walletData.balance / 100;
    
    // Sort transactions by date (oldest first)
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    let runningBalance = 0;
    
    sortedTransactions.forEach(transaction => {
      const date = new Date(transaction.created_at);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const amount = transaction.type === 'credit' ? transaction.amount : -transaction.amount;
      runningBalance += amount;
      
      monthlyData.set(monthKey, runningBalance / 100);
    });

    // Ensure we have at least 3 months of data for the chart
    const chartData = Array.from(monthlyData.entries()).map(([mes, valor]) => ({ mes, valor }));
    
    // If we have less than 3 months, fill with current balance
    if (chartData.length === 0) {
      return [
        { mes: "Atual", valor: currentBalance }
      ];
    } else if (chartData.length === 1) {
      return [
        chartData[0],
        { mes: "Atual", valor: currentBalance }
      ];
    } else if (chartData.length === 2) {
      return [
        chartData[0],
        chartData[1],
        { mes: "Atual", valor: currentBalance }
      ];
    }
    
    // Return last 6 months for better visualization
    return chartData.slice(-6);
  };

  return {
    saldoDisponivel: walletData.balance / 100, // Convert from cents
    patrimonioInvestido: totalDeposits / 100, // Convert from cents
    lucroHistorico: (totalDeposits - totalWithdrawals - walletData.balance) / 100,
    extrato,
    graficoPatrimonio: generatePortfolioChart()
  };
};

export const useWallet = () => {
  const [carteira, setCarteira] = useState<Carteira | null>(null);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [rawWalletData, transactions] = await Promise.all([
        apiService.fetchWallet(),
        apiService.fetchTransactions()
      ]);

      const transformedData = transformWalletData(rawWalletData, transactions);
      setCarteira(transformedData);
      setWalletData(rawWalletData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet data');
      console.error('Error fetching wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const refreshWallet = () => {
    fetchWalletData();
  };

  return {
    carteira,
    walletData,
    loading,
    error,
    refreshWallet
  };
};