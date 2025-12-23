/**
 * Mock Data Service
 * Generates realistic sample financial data for new users
 */

export interface MockFinancialData {
  income: {
    monthly: number;
    sources: Array<{ name: string; amount: number; type: string }>;
  };
  expenses: {
    monthly: number;
    categories: Array<{ name: string; amount: number; percentage: number }>;
  };
  assets: {
    total: number;
    items: Array<{ name: string; value: number; type: string }>;
  };
  liabilities: {
    total: number;
    items: Array<{ name: string; amount: number; type: string }>;
  };
  netWorth: number;
  savingsRate: number;
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }>;
}

export class MockDataService {
  private static STORAGE_KEY = 'financeos_mock_data_flag';

  /**
   * Generate realistic mock financial data
   */
  static generateMockData(): MockFinancialData {
    const monthlyIncome = 75000; // ₹75,000 monthly income
    const monthlyExpenses = 52000; // ₹52,000 monthly expenses
    const savings = monthlyIncome - monthlyExpenses;

    return {
      income: {
        monthly: monthlyIncome,
        sources: [
          { name: 'Salary', amount: 65000, type: 'primary' },
          { name: 'Freelance', amount: 8000, type: 'secondary' },
          { name: 'Investments', amount: 2000, type: 'passive' },
        ],
      },
      expenses: {
        monthly: monthlyExpenses,
        categories: [
          { name: 'Rent', amount: 18000, percentage: 35 },
          { name: 'Food & Dining', amount: 12000, percentage: 23 },
          { name: 'Transportation', amount: 5000, percentage: 10 },
          { name: 'Utilities', amount: 3500, percentage: 7 },
          { name: 'Entertainment', amount: 4000, percentage: 8 },
          { name: 'Shopping', amount: 5500, percentage: 11 },
          { name: 'Healthcare', amount: 2000, percentage: 4 },
          { name: 'Others', amount: 2000, percentage: 4 },
        ],
      },
      assets: {
        total: 485000,
        items: [
          { name: 'Bank Savings', value: 150000, type: 'liquid' },
          { name: 'Fixed Deposit', value: 200000, type: 'fixed' },
          { name: 'Mutual Funds', value: 85000, type: 'investment' },
          { name: 'Stocks', value: 50000, type: 'investment' },
        ],
      },
      liabilities: {
        total: 125000,
        items: [
          { name: 'Personal Loan', amount: 75000, type: 'loan' },
          { name: 'Credit Card', amount: 50000, type: 'credit' },
        ],
      },
      netWorth: 360000, // assets - liabilities
      savingsRate: ((savings / monthlyIncome) * 100), // ~31%
      monthlyData: this.generateMonthlyData(monthlyIncome, monthlyExpenses),
    };
  }

  /**
   * Generate 12 months of historical data
   */
  private static generateMonthlyData(baseIncome: number, baseExpenses: number) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return months.map((month, index) => {
      // Add some variation
      const variation = (Math.random() - 0.5) * 0.2; // ±10%
      const income = Math.round(baseIncome * (1 + variation));
      const expenses = Math.round(baseExpenses * (1 + variation * 0.8));
      
      return {
        month,
        income,
        expenses,
        savings: income - expenses,
      };
    });
  }

  /**
   * Generate mock transactions
   */
  static generateMockTransactions(count: number = 50) {
    const categories = [
      { name: 'Groceries', type: 'expense' },
      { name: 'Rent', type: 'expense' },
      { name: 'Salary', type: 'income' },
      { name: 'Dining', type: 'expense' },
      { name: 'Transportation', type: 'expense' },
      { name: 'Utilities', type: 'expense' },
      { name: 'Entertainment', type: 'expense' },
      { name: 'Healthcare', type: 'expense' },
      { name: 'Freelance', type: 'income' },
      { name: 'Investment Return', type: 'income' },
    ];

    const transactions = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date(now);
      date.setDate(date.getDate() - daysAgo);

      const amount = category.type === 'income'
        ? Math.floor(Math.random() * 50000) + 10000
        : Math.floor(Math.random() * 5000) + 100;

      transactions.push({
        id: `mock-txn-${i}`,
        date: date.toISOString(),
        category: category.name,
        type: category.type,
        amount,
        description: this.generateDescription(category.name),
        isMock: true,
      });
    }

    return transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  /**
   * Generate realistic descriptions
   */
  private static generateDescription(category: string): string {
    const descriptions: Record<string, string[]> = {
      'Groceries': ['Supermarket', 'Local Store', 'Big Bazaar', 'DMart'],
      'Rent': ['Monthly Rent', 'House Rent'],
      'Salary': ['Monthly Salary', 'Paycheck'],
      'Dining': ['Restaurant', 'Food Delivery', 'Cafe', 'Swiggy', 'Zomato'],
      'Transportation': ['Uber', 'Ola', 'Fuel', 'Metro', 'Auto'],
      'Utilities': ['Electricity', 'Water', 'Internet', 'Phone Bill'],
      'Entertainment': ['Movie', 'Netflix', 'Amazon Prime', 'Spotify'],
      'Healthcare': ['Pharmacy', 'Doctor', 'Medical'],
      'Freelance': ['Freelance Project', 'Consulting'],
      'Investment Return': ['Dividend', 'Interest', 'Returns'],
    };

    const options = descriptions[category] || ['Transaction'];
    return options[Math.floor(Math.random() * options.length)];
  }

  /**
   * Check if user is using mock data
   */
  static isUsingMockData(userId: string): boolean {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const flags = JSON.parse(stored);
        return flags[userId] !== false; // Default to true for new users
      }
    } catch (error) {
      console.error('Error checking mock data flag:', error);
    }
    return true; // Default to mock data
  }

  /**
   * Mark that user has entered real data
   */
  static markRealDataEntered(userId: string): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY) || '{}';
      const flags = JSON.parse(stored);
      flags[userId] = false; // Not using mock data anymore
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(flags));
    } catch (error) {
      console.error('Error saving mock data flag:', error);
    }
  }

  /**
   * Get mock data with label
   */
  static getMockDataWithLabel() {
    return {
      data: this.generateMockData(),
      isMock: true,
      label: 'Sample Data - Update with your real information',
    };
  }

  /**
   * Get sample AI prompts
   */
  static getSampleAIPrompts(): string[] {
    return [
      "What's my total spending this month?",
      "Show my savings rate",
      "Add grocery expense ₹2,500",
      "Set my monthly income to ₹80,000",
      "How much did I spend on food?",
      "Show my net worth trend",
      "Create a savings goal for ₹1,00,000",
      "What's my biggest expense category?",
    ];
  }

  /**
   * Get quick action chips for AI
   */
  static getQuickActions(): Array<{ label: string; prompt: string }> {
    return [
      { label: 'Set Income', prompt: 'I want to set my monthly income' },
      { label: 'Add Expense', prompt: 'I want to add an expense' },
      { label: 'View Trends', prompt: 'Show me my spending trends' },
      { label: 'Update Budget', prompt: 'Help me update my budget' },
      { label: 'Set Goal', prompt: 'I want to create a savings goal' },
      { label: 'Export Data', prompt: 'How do I export my financial data?' },
    ];
  }
}
