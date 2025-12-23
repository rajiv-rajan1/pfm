// Angular-ready data models for financial entities

export interface SubItem {
  id: string;
  name: string;
  amount: number;
  type?: string;
  notes?: string;
  frequency?: 'monthly' | 'yearly' | 'one-time';
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IncomeCategory {
  id: string;
  name: string;
  totalAmount: number;
  subItems: SubItem[];
}

export interface ExpenseCategory {
  id: string;
  name: string;
  totalAmount: number;
  subItems: SubItem[];
}

export interface AssetCategory {
  id: string;
  name: string;
  totalValue: number;
  subItems: SubItem[];
}

export interface LiabilityCategory {
  id: string;
  name: string;
  totalAmount: number;
  subItems: SubItem[];
}

export interface FinancialProfile {
  userId?: string;
  income: IncomeCategory[];
  expenses: ExpenseCategory[];
  assets: AssetCategory[];
  liabilities: LiabilityCategory[];
  lastUpdated: Date;
}

export interface CategoryType {
  type: 'income' | 'expenses' | 'assets' | 'liabilities';
  label: string;
  icon: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  monthlySavings: number;
}

// Default categories with sub-items structure
export const DEFAULT_CATEGORIES = {
  income: [
    { id: 'salary', name: 'Salary & Wages', totalAmount: 0, subItems: [] },
    { id: 'business', name: 'Business Income', totalAmount: 0, subItems: [] },
    { id: 'investments', name: 'Investment Returns', totalAmount: 0, subItems: [] },
    { id: 'rental', name: 'Rental Income', totalAmount: 0, subItems: [] },
    { id: 'other', name: 'Other Income', totalAmount: 0, subItems: [] },
  ],
  expenses: [
    { id: 'housing', name: 'Housing & Rent', totalAmount: 0, subItems: [] },
    { id: 'utilities', name: 'Utilities & Bills', totalAmount: 0, subItems: [] },
    { id: 'food', name: 'Food & Groceries', totalAmount: 0, subItems: [] },
    { id: 'transport', name: 'Transportation', totalAmount: 0, subItems: [] },
    { id: 'healthcare', name: 'Healthcare', totalAmount: 0, subItems: [] },
    { id: 'entertainment', name: 'Entertainment', totalAmount: 0, subItems: [] },
    { id: 'other', name: 'Other Expenses', totalAmount: 0, subItems: [] },
  ],
  assets: [
    { id: 'cash', name: 'Cash & Savings', totalValue: 0, subItems: [] },
    { id: 'investments', name: 'Investments', totalValue: 0, subItems: [] },
    { id: 'property', name: 'Real Estate', totalValue: 0, subItems: [] },
    { id: 'vehicles', name: 'Vehicles', totalValue: 0, subItems: [] },
    { id: 'precious', name: 'Precious Metals & Jewelry', totalValue: 0, subItems: [] },
    { id: 'other', name: 'Other Assets', totalValue: 0, subItems: [] },
  ],
  liabilities: [
    { id: 'home-loan', name: 'Home Loan', totalAmount: 0, subItems: [] },
    { id: 'car-loan', name: 'Vehicle Loan', totalAmount: 0, subItems: [] },
    { id: 'personal-loan', name: 'Personal Loans', totalAmount: 0, subItems: [] },
    { id: 'credit-card', name: 'Credit Card Debt', totalAmount: 0, subItems: [] },
    { id: 'other', name: 'Other Liabilities', totalAmount: 0, subItems: [] },
  ],
};
