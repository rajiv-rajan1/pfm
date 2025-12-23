/**
 * Enhanced AI Parser for Financial Data
 * Supports flexible sub-item detection (Gold, Jewelry, FDs, etc.)
 */

export interface ParsedFinancialData {
  category: 'income' | 'expenses' | 'assets' | 'liabilities';
  categoryId: string;
  subItems: Array<{
    name: string;
    amount: number;
    type?: string;
    frequency?: 'monthly' | 'yearly' | 'one-time';
  }>;
}

// Asset type keywords mapping
const ASSET_KEYWORDS = {
  // Precious metals
  gold: { category: 'precious', name: 'Gold', type: 'Precious Metal' },
  jewelry: { category: 'precious', name: 'Jewelry', type: 'Precious Metal' },
  jewellery: { category: 'precious', name: 'Jewelry', type: 'Precious Metal' },
  silver: { category: 'precious', name: 'Silver', type: 'Precious Metal' },
  platinum: { category: 'precious', name: 'Platinum', type: 'Precious Metal' },
  
  // Investments
  'mutual fund': { category: 'investments', name: 'Mutual Fund', type: 'Investment' },
  'mutual funds': { category: 'investments', name: 'Mutual Funds', type: 'Investment' },
  sip: { category: 'investments', name: 'SIP', type: 'Investment' },
  stocks: { category: 'investments', name: 'Stocks', type: 'Investment' },
  shares: { category: 'investments', name: 'Shares', type: 'Investment' },
  bonds: { category: 'investments', name: 'Bonds', type: 'Investment' },
  'fixed deposit': { category: 'investments', name: 'Fixed Deposit', type: 'Investment' },
  fd: { category: 'investments', name: 'Fixed Deposit', type: 'Investment' },
  ppf: { category: 'investments', name: 'PPF', type: 'Investment' },
  'recurring deposit': { category: 'investments', name: 'Recurring Deposit', type: 'Investment' },
  rd: { category: 'investments', name: 'Recurring Deposit', type: 'Investment' },
  
  // Cash & Savings
  savings: { category: 'cash', name: 'Savings Account', type: 'Bank Account' },
  'savings account': { category: 'cash', name: 'Savings Account', type: 'Bank Account' },
  'bank account': { category: 'cash', name: 'Bank Account', type: 'Bank Account' },
  cash: { category: 'cash', name: 'Cash', type: 'Liquid Asset' },
  
  // Property
  property: { category: 'property', name: 'Property', type: 'Real Estate' },
  'real estate': { category: 'property', name: 'Real Estate', type: 'Real Estate' },
  house: { category: 'property', name: 'House', type: 'Real Estate' },
  flat: { category: 'property', name: 'Flat', type: 'Real Estate' },
  apartment: { category: 'property', name: 'Apartment', type: 'Real Estate' },
  land: { category: 'property', name: 'Land', type: 'Real Estate' },
  
  // Vehicles
  car: { category: 'vehicles', name: 'Car', type: 'Vehicle' },
  bike: { category: 'vehicles', name: 'Bike', type: 'Vehicle' },
  motorcycle: { category: 'vehicles', name: 'Motorcycle', type: 'Vehicle' },
  vehicle: { category: 'vehicles', name: 'Vehicle', type: 'Vehicle' },
};

// Income keywords
const INCOME_KEYWORDS = {
  salary: { category: 'salary', name: 'Salary', type: 'Employment Income' },
  wages: { category: 'salary', name: 'Wages', type: 'Employment Income' },
  freelance: { category: 'business', name: 'Freelance', type: 'Self-Employment' },
  business: { category: 'business', name: 'Business Income', type: 'Self-Employment' },
  rental: { category: 'rental', name: 'Rental Income', type: 'Passive Income' },
  'rent income': { category: 'rental', name: 'Rental Income', type: 'Passive Income' },
  dividend: { category: 'investments', name: 'Dividend', type: 'Investment Income' },
  interest: { category: 'investments', name: 'Interest', type: 'Investment Income' },
};

// Expense keywords
const EXPENSE_KEYWORDS = {
  rent: { category: 'housing', name: 'Rent', type: 'Housing' },
  emi: { category: 'housing', name: 'EMI', type: 'Loan Payment' },
  utilities: { category: 'utilities', name: 'Utilities', type: 'Bills' },
  electricity: { category: 'utilities', name: 'Electricity', type: 'Bills' },
  water: { category: 'utilities', name: 'Water', type: 'Bills' },
  internet: { category: 'utilities', name: 'Internet', type: 'Bills' },
  groceries: { category: 'food', name: 'Groceries', type: 'Food' },
  food: { category: 'food', name: 'Food', type: 'Food' },
  transport: { category: 'transport', name: 'Transportation', type: 'Travel' },
  fuel: { category: 'transport', name: 'Fuel', type: 'Travel' },
  petrol: { category: 'transport', name: 'Petrol', type: 'Travel' },
};

/**
 * Extract numbers from text with Indian format support
 */
export function extractNumber(text: string): number | null {
  const lowerText = text.toLowerCase();
  
  // Crore: 1.5Cr, 2 Crore, etc.
  const crMatch = lowerText.match(/(\d+\.?\d*)\s*(?:cr|crore)/i);
  if (crMatch) return parseFloat(crMatch[1]) * 10000000;
  
  // Lakh: 5L, 10 Lakh, etc.
  const lMatch = lowerText.match(/(\d+\.?\d*)\s*(?:l|lakh|lac)/i);
  if (lMatch) return parseFloat(lMatch[1]) * 100000;
  
  // Thousand: 80k, 50 Thousand, etc.
  const kMatch = lowerText.match(/(\d+\.?\d*)\s*(?:k|thousand)/i);
  if (kMatch) return parseFloat(kMatch[1]) * 1000;
  
  // Standard numbers: 80000, 80,000, etc.
  const numMatch = lowerText.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/);
  if (numMatch) return parseFloat(numMatch[1].replace(/,/g, ''));
  
  return null;
}

/**
 * Parse user input for assets with sub-item support
 * Example: "I have 5 lakhs in gold and 2 lakhs in jewelry"
 */
export function parseAssetInput(text: string): ParsedFinancialData[] {
  const lowerText = text.toLowerCase();
  const results: ParsedFinancialData[] = [];
  
  // Split by "and" to find multiple items
  const segments = lowerText.split(/\s+and\s+/);
  
  for (const segment of segments) {
    // Look for asset keywords
    for (const [keyword, mapping] of Object.entries(ASSET_KEYWORDS)) {
      if (segment.includes(keyword)) {
        const amount = extractNumber(segment);
        if (amount) {
          // Find or create category result
          let categoryResult = results.find(
            r => r.category === 'assets' && r.categoryId === mapping.category
          );
          
          if (!categoryResult) {
            categoryResult = {
              category: 'assets',
              categoryId: mapping.category,
              subItems: [],
            };
            results.push(categoryResult);
          }
          
          categoryResult.subItems.push({
            name: mapping.name,
            amount,
            type: mapping.type,
            frequency: 'one-time',
          });
        }
      }
    }
  }
  
  return results;
}

/**
 * Parse user input for income
 */
export function parseIncomeInput(text: string): ParsedFinancialData[] {
  const lowerText = text.toLowerCase();
  const results: ParsedFinancialData[] = [];
  
  for (const [keyword, mapping] of Object.entries(INCOME_KEYWORDS)) {
    if (lowerText.includes(keyword)) {
      const amount = extractNumber(text);
      if (amount) {
        let categoryResult = results.find(
          r => r.category === 'income' && r.categoryId === mapping.category
        );
        
        if (!categoryResult) {
          categoryResult = {
            category: 'income',
            categoryId: mapping.category,
            subItems: [],
          };
          results.push(categoryResult);
        }
        
        categoryResult.subItems.push({
          name: mapping.name,
          amount,
          type: mapping.type,
          frequency: 'monthly',
        });
      }
    }
  }
  
  return results;
}

/**
 * Parse user input for expenses
 */
export function parseExpenseInput(text: string): ParsedFinancialData[] {
  const lowerText = text.toLowerCase();
  const results: ParsedFinancialData[] = [];
  
  const segments = lowerText.split(/\s+and\s+/);
  
  for (const segment of segments) {
    for (const [keyword, mapping] of Object.entries(EXPENSE_KEYWORDS)) {
      if (segment.includes(keyword)) {
        const amount = extractNumber(segment);
        if (amount) {
          let categoryResult = results.find(
            r => r.category === 'expenses' && r.categoryId === mapping.category
          );
          
          if (!categoryResult) {
            categoryResult = {
              category: 'expenses',
              categoryId: mapping.category,
              subItems: [],
            };
            results.push(categoryResult);
          }
          
          categoryResult.subItems.push({
            name: mapping.name,
            amount,
            type: mapping.type,
            frequency: 'monthly',
          });
        }
      }
    }
  }
  
  return results;
}

/**
 * Main parser function - detects category and routes to appropriate parser
 */
export function parseFinancialInput(text: string): ParsedFinancialData[] {
  const lowerText = text.toLowerCase();
  
  // Detect category based on context
  const hasAssetKeywords = Object.keys(ASSET_KEYWORDS).some(k => lowerText.includes(k));
  const hasIncomeKeywords = Object.keys(INCOME_KEYWORDS).some(k => lowerText.includes(k));
  const hasExpenseKeywords = Object.keys(EXPENSE_KEYWORDS).some(k => lowerText.includes(k));
  
  const results: ParsedFinancialData[] = [];
  
  if (hasAssetKeywords) {
    results.push(...parseAssetInput(text));
  }
  
  if (hasIncomeKeywords) {
    results.push(...parseIncomeInput(text));
  }
  
  if (hasExpenseKeywords) {
    results.push(...parseExpenseInput(text));
  }
  
  return results;
}

/**
 * Generate confirmation message for parsed data
 */
export function generateConfirmationMessage(parsed: ParsedFinancialData[]): string {
  if (parsed.length === 0) {
    return "I couldn't quite understand that. Could you rephrase it?";
  }
  
  let message = "";
  
  for (const data of parsed) {
    for (const item of data.subItems) {
      message += `✅ Got it! ${item.name}: ₹${item.amount.toLocaleString('en-IN')}`;
      if (item.type) {
        message += ` (${item.type})`;
      }
      message += "\n";
    }
  }
  
  return message;
}
