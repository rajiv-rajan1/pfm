// Mock data for the personal finance manager
export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  recurring?: boolean;
}

export interface Asset {
  id: string;
  name: string;
  type: 'bank' | 'investment' | 'real_estate' | 'crypto' | 'other';
  value: number;
  growth?: number; // percentage change
}

export interface Liability {
  id: string;
  name: string;
  type: 'loan' | 'credit_card' | 'emi' | 'other';
  amount: number;
  interestRate?: number;
  monthlyPayment?: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  netProfit: number;
  savings: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
  trend: number;
}

// Assets
export const mockAssets: Asset[] = [
  { id: '1', name: 'Savings Account', type: 'bank', value: 450000, growth: 2.5 },
  { id: '2', name: 'Mutual Funds (SIP)', type: 'investment', value: 1200000, growth: 12.8 },
  { id: '3', name: 'Fixed Deposits', type: 'investment', value: 500000, growth: 6.5 },
  { id: '4', name: 'Stocks Portfolio', type: 'investment', value: 850000, growth: 18.2 },
  { id: '5', name: 'Property (Current Value)', type: 'real_estate', value: 8500000, growth: 5.2 },
  { id: '6', name: 'Cryptocurrency', type: 'crypto', value: 150000, growth: -8.5 },
  { id: '7', name: 'PPF Account', type: 'investment', value: 380000, growth: 7.1 },
  { id: '8', name: 'Emergency Fund', type: 'bank', value: 300000, growth: 0.5 },
];

// Liabilities
export const mockLiabilities: Liability[] = [
  { id: '1', name: 'Home Loan', type: 'loan', amount: 4500000, interestRate: 8.5, monthlyPayment: 45000 },
  { id: '2', name: 'Car Loan', type: 'loan', amount: 350000, interestRate: 9.2, monthlyPayment: 12000 },
  { id: '3', name: 'Credit Card Outstanding', type: 'credit_card', amount: 85000, interestRate: 18.0 },
  { id: '4', name: 'Personal Loan', type: 'loan', amount: 150000, interestRate: 11.5, monthlyPayment: 5000 },
];

// Monthly P&L data for the last 12 months
export const mockMonthlyPL: MonthlyData[] = [
  { month: 'Jan 2024', income: 180000, expenses: 95000, netProfit: 85000, savings: 85000 },
  { month: 'Feb 2024', income: 180000, expenses: 102000, netProfit: 78000, savings: 78000 },
  { month: 'Mar 2024', income: 195000, expenses: 98000, netProfit: 97000, savings: 97000 },
  { month: 'Apr 2024', income: 180000, expenses: 110000, netProfit: 70000, savings: 70000 },
  { month: 'May 2024', income: 180000, expenses: 105000, netProfit: 75000, savings: 75000 },
  { month: 'Jun 2024', income: 205000, expenses: 115000, netProfit: 90000, savings: 90000 },
  { month: 'Jul 2024', income: 180000, expenses: 92000, netProfit: 88000, savings: 88000 },
  { month: 'Aug 2024', income: 180000, expenses: 108000, netProfit: 72000, savings: 72000 },
  { month: 'Sep 2024', income: 195000, expenses: 95000, netProfit: 100000, savings: 100000 },
  { month: 'Oct 2024', income: 180000, expenses: 118000, netProfit: 62000, savings: 62000 },
  { month: 'Nov 2024', income: 230000, expenses: 105000, netProfit: 125000, savings: 125000 },
  { month: 'Dec 2024', income: 250000, expenses: 140000, netProfit: 110000, savings: 110000 },
];

// Quarterly data
export const mockQuarterlyPL = [
  { quarter: 'Q1 2024', income: 555000, expenses: 295000, netProfit: 260000 },
  { quarter: 'Q2 2024', income: 565000, expenses: 330000, netProfit: 235000 },
  { quarter: 'Q3 2024', income: 555000, expenses: 295000, netProfit: 260000 },
  { quarter: 'Q4 2024', income: 660000, expenses: 363000, netProfit: 297000 },
];

// Annual data
export const mockAnnualPL = [
  { year: '2022', income: 1950000, expenses: 1100000, netProfit: 850000 },
  { year: '2023', income: 2150000, expenses: 1250000, netProfit: 900000 },
  { year: '2024', income: 2335000, expenses: 1283000, netProfit: 1052000 },
];

// Expense categories breakdown
export const mockExpenseCategories: CategoryBreakdown[] = [
  { category: 'Housing (Rent/EMI)', amount: 45000, percentage: 40, trend: 0 },
  { category: 'Groceries & Food', amount: 18000, percentage: 16, trend: 5 },
  { category: 'Transportation', amount: 12000, percentage: 10.5, trend: -2 },
  { category: 'Utilities & Bills', amount: 8000, percentage: 7, trend: 3 },
  { category: 'Insurance', amount: 10000, percentage: 9, trend: 0 },
  { category: 'Entertainment', amount: 7000, percentage: 6, trend: 12 },
  { category: 'Healthcare', amount: 5000, percentage: 4.5, trend: -5 },
  { category: 'Education', amount: 3000, percentage: 2.5, trend: 0 },
  { category: 'Shopping', amount: 5000, percentage: 4.5, trend: 18 },
];

// Income sources breakdown
export const mockIncomeCategories: CategoryBreakdown[] = [
  { category: 'Salary', amount: 150000, percentage: 75, trend: 0 },
  { category: 'Freelance/Business', amount: 25000, percentage: 12.5, trend: 15 },
  { category: 'Investments/Dividends', amount: 18000, percentage: 9, trend: 8 },
  { category: 'Rental Income', amount: 7000, percentage: 3.5, trend: 0 },
];

// Recent transactions
export const mockTransactions: Transaction[] = [
  { id: 't1', date: '2024-12-20', category: 'Salary', description: 'Monthly Salary', amount: 150000, type: 'income', recurring: true },
  { id: 't2', date: '2024-12-18', category: 'Shopping', description: 'Electronics Purchase', amount: -25000, type: 'expense' },
  { id: 't3', date: '2024-12-15', category: 'Investment', description: 'SIP - Mutual Fund', amount: -15000, type: 'expense', recurring: true },
  { id: 't4', date: '2024-12-10', category: 'Freelance', description: 'Project Payment', amount: 35000, type: 'income' },
  { id: 't5', date: '2024-12-05', category: 'Housing', description: 'Home Loan EMI', amount: -45000, type: 'expense', recurring: true },
  { id: 't6', date: '2024-12-05', category: 'Transportation', description: 'Car Loan EMI', amount: -12000, type: 'expense', recurring: true },
  { id: 't7', date: '2024-12-03', category: 'Utilities', description: 'Electricity Bill', amount: -3500, type: 'expense' },
  { id: 't8', date: '2024-12-01', category: 'Rental Income', description: 'Property Rent', amount: 7000, type: 'income', recurring: true },
  { id: 't9', date: '2024-11-28', category: 'Groceries', description: 'Monthly Groceries', amount: -12000, type: 'expense' },
  { id: 't10', date: '2024-11-25', category: 'Entertainment', description: 'Streaming Services', amount: -1500, type: 'expense', recurring: true },
  { id: 't11', date: '2024-11-22', category: 'Healthcare', description: 'Health Insurance Premium', amount: -5000, type: 'expense', recurring: true },
  { id: 't12', date: '2024-11-20', category: 'Salary', description: 'Monthly Salary', amount: 150000, type: 'income', recurring: true },
  { id: 't13', date: '2024-11-18', category: 'Investment', description: 'Stock Purchase', amount: -20000, type: 'expense' },
  { id: 't14', date: '2024-11-15', category: 'Investment', description: 'SIP - Mutual Fund', amount: -15000, type: 'expense', recurring: true },
  { id: 't15', date: '2024-11-10', category: 'Dividends', description: 'Dividend Income', amount: 8500, type: 'income' },
];

// Net worth over time (for trends)
export const mockNetWorthHistory = [
  { month: 'Jan 2024', netWorth: 6500000 },
  { month: 'Feb 2024', netWorth: 6580000 },
  { month: 'Mar 2024', netWorth: 6680000 },
  { month: 'Apr 2024', netWorth: 6750000 },
  { month: 'May 2024', netWorth: 6825000 },
  { month: 'Jun 2024', netWorth: 6915000 },
  { month: 'Jul 2024', netWorth: 7005000 },
  { month: 'Aug 2024', netWorth: 7075000 },
  { month: 'Sep 2024', netWorth: 7180000 },
  { month: 'Oct 2024', netWorth: 7240000 },
  { month: 'Nov 2024', netWorth: 7365000 },
  { month: 'Dec 2024', netWorth: 7475000 },
];

// Financial goals
export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'emergency' | 'retirement' | 'purchase' | 'investment' | 'other';
  monthlyContribution?: number;
}

export const mockGoals: Goal[] = [
  {
    id: 'g1',
    name: 'Emergency Fund (6 months)',
    targetAmount: 600000,
    currentAmount: 300000,
    deadline: '2025-12-31',
    category: 'emergency',
    monthlyContribution: 25000,
  },
  {
    id: 'g2',
    name: 'Retirement Corpus',
    targetAmount: 50000000,
    currentAmount: 2100000,
    deadline: '2044-12-31',
    category: 'retirement',
    monthlyContribution: 40000,
  },
  {
    id: 'g3',
    name: 'New Car Purchase',
    targetAmount: 800000,
    currentAmount: 250000,
    deadline: '2026-06-30',
    category: 'purchase',
    monthlyContribution: 30000,
  },
  {
    id: 'g4',
    name: 'Vacation Fund',
    targetAmount: 300000,
    currentAmount: 120000,
    deadline: '2025-10-31',
    category: 'other',
    monthlyContribution: 15000,
  },
];

// Calculate current financial summary
export const calculateFinancialSummary = () => {
  const totalAssets = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
  const totalLiabilities = mockLiabilities.reduce((sum, liability) => sum + liability.amount, 0);
  const netWorth = totalAssets - totalLiabilities;
  
  const lastMonth = mockMonthlyPL[mockMonthlyPL.length - 1];
  const previousMonth = mockMonthlyPL[mockMonthlyPL.length - 2];
  
  const monthlyPLChange = lastMonth ? ((lastMonth.netProfit - previousMonth.netProfit) / previousMonth.netProfit) * 100 : 0;
  const netWorthChange = mockNetWorthHistory.length >= 2 
    ? ((mockNetWorthHistory[mockNetWorthHistory.length - 1].netWorth - mockNetWorthHistory[mockNetWorthHistory.length - 2].netWorth) / mockNetWorthHistory[mockNetWorthHistory.length - 2].netWorth) * 100
    : 0;

  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    monthlyIncome: lastMonth?.income || 0,
    monthlyExpenses: lastMonth?.expenses || 0,
    monthlyPL: lastMonth?.netProfit || 0,
    monthlyPLChange,
    netWorthChange,
    savingsRate: lastMonth ? (lastMonth.savings / lastMonth.income) * 100 : 0,
  };
};
