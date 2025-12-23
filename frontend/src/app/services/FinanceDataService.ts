// Angular-inspired service pattern for finance data management
// Uses React hooks pattern but structured for easy Angular migration

import { useState, useCallback, useEffect } from 'react';
import {
  FinancialProfile,
  IncomeCategory,
  ExpenseCategory,
  AssetCategory,
  LiabilityCategory,
  SubItem,
  FinancialSummary,
  DEFAULT_CATEGORIES,
} from '../models/finance.models';

type CategoryType = 'income' | 'expenses' | 'assets' | 'liabilities';
type Category = IncomeCategory | ExpenseCategory | AssetCategory | LiabilityCategory;

/**
 * Finance Data Service
 * Manages all financial data operations
 * Designed for easy migration to Angular service with RxJS
 */
export class FinanceDataService {
  private static STORAGE_KEY = 'financeos_profile';

  static loadProfile(): FinancialProfile {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const profile = JSON.parse(stored);
        // Convert date strings back to Date objects
        profile.lastUpdated = new Date(profile.lastUpdated);
        return profile;
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }

    return this.createEmptyProfile();
  }

  static saveProfile(profile: FinancialProfile): void {
    try {
      profile.lastUpdated = new Date();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }

  static createEmptyProfile(): FinancialProfile {
    return {
      income: [...DEFAULT_CATEGORIES.income],
      expenses: [...DEFAULT_CATEGORIES.expenses],
      assets: [...DEFAULT_CATEGORIES.assets],
      liabilities: [...DEFAULT_CATEGORIES.liabilities],
      lastUpdated: new Date(),
    };
  }

  static addSubItem(
    profile: FinancialProfile,
    categoryType: CategoryType,
    categoryId: string,
    subItem: Omit<SubItem, 'id' | 'createdAt' | 'updatedAt'>
  ): FinancialProfile {
    const newProfile = { ...profile };
    const categories = newProfile[categoryType] as Category[];
    const categoryIndex = categories.findIndex((c) => c.id === categoryId);

    if (categoryIndex === -1) return profile;

    const newSubItem: SubItem = {
      ...subItem,
      id: `${categoryId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    categories[categoryIndex] = {
      ...categories[categoryIndex],
      subItems: [...categories[categoryIndex].subItems, newSubItem],
    };

    this.recalculateCategoryTotal(categories[categoryIndex]);
    return newProfile;
  }

  static updateSubItem(
    profile: FinancialProfile,
    categoryType: CategoryType,
    categoryId: string,
    subItemId: string,
    updates: Partial<SubItem>
  ): FinancialProfile {
    const newProfile = { ...profile };
    const categories = newProfile[categoryType] as Category[];
    const categoryIndex = categories.findIndex((c) => c.id === categoryId);

    if (categoryIndex === -1) return profile;

    const subItemIndex = categories[categoryIndex].subItems.findIndex(
      (item) => item.id === subItemId
    );

    if (subItemIndex === -1) return profile;

    categories[categoryIndex].subItems[subItemIndex] = {
      ...categories[categoryIndex].subItems[subItemIndex],
      ...updates,
      updatedAt: new Date(),
    };

    this.recalculateCategoryTotal(categories[categoryIndex]);
    return newProfile;
  }

  static deleteSubItem(
    profile: FinancialProfile,
    categoryType: CategoryType,
    categoryId: string,
    subItemId: string
  ): FinancialProfile {
    const newProfile = { ...profile };
    const categories = newProfile[categoryType] as Category[];
    const categoryIndex = categories.findIndex((c) => c.id === categoryId);

    if (categoryIndex === -1) return profile;

    categories[categoryIndex].subItems = categories[categoryIndex].subItems.filter(
      (item) => item.id !== subItemId
    );

    this.recalculateCategoryTotal(categories[categoryIndex]);
    return newProfile;
  }

  private static recalculateCategoryTotal(category: Category): void {
    const total = category.subItems.reduce((sum, item) => sum + item.amount, 0);
    
    if ('totalAmount' in category) {
      category.totalAmount = total;
    } else if ('totalValue' in category) {
      (category as AssetCategory).totalValue = total;
    }
  }

  static calculateSummary(profile: FinancialProfile): FinancialSummary {
    const totalIncome = profile.income.reduce((sum, cat) => sum + cat.totalAmount, 0);
    const totalExpenses = profile.expenses.reduce((sum, cat) => sum + cat.totalAmount, 0);
    const totalAssets = profile.assets.reduce((sum, cat) => sum + cat.totalValue, 0);
    const totalLiabilities = profile.liabilities.reduce((sum, cat) => sum + cat.totalAmount, 0);

    return {
      totalIncome,
      totalExpenses,
      totalAssets,
      totalLiabilities,
      netWorth: totalAssets - totalLiabilities,
      monthlySavings: totalIncome - totalExpenses,
    };
  }

  static importFromAIData(aiData: any): FinancialProfile {
    // Convert AI-parsed data to structured profile
    const profile = this.createEmptyProfile();

    // Map AI data to categories and sub-items
    if (aiData.income) {
      Object.entries(aiData.income).forEach(([key, value]) => {
        if (typeof value === 'number' && value > 0) {
          const category = profile.income.find((c) => 
            c.id.toLowerCase().includes(key.toLowerCase()) || 
            c.name.toLowerCase().includes(key.toLowerCase())
          );
          if (category) {
            category.subItems.push({
              id: `${category.id}_${Date.now()}`,
              name: key.charAt(0).toUpperCase() + key.slice(1),
              amount: value,
              frequency: 'monthly',
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            this.recalculateCategoryTotal(category);
          }
        }
      });
    }

    // Similar mapping for expenses, assets, liabilities
    if (aiData.expenses) {
      Object.entries(aiData.expenses).forEach(([key, value]) => {
        if (typeof value === 'number' && value > 0) {
          const category = profile.expenses.find((c) => 
            c.id.toLowerCase().includes(key.toLowerCase()) || 
            c.name.toLowerCase().includes(key.toLowerCase())
          );
          if (category) {
            category.subItems.push({
              id: `${category.id}_${Date.now()}`,
              name: key.charAt(0).toUpperCase() + key.slice(1),
              amount: value,
              frequency: 'monthly',
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            this.recalculateCategoryTotal(category);
          }
        }
      });
    }

    if (aiData.assets) {
      Object.entries(aiData.assets).forEach(([key, value]) => {
        if (typeof value === 'number' && value > 0) {
          const category = profile.assets.find((c) => 
            c.id.toLowerCase().includes(key.toLowerCase()) || 
            c.name.toLowerCase().includes(key.toLowerCase())
          );
          if (category) {
            category.subItems.push({
              id: `${category.id}_${Date.now()}`,
              name: key.charAt(0).toUpperCase() + key.slice(1),
              amount: value,
              frequency: 'one-time',
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            this.recalculateCategoryTotal(category);
          }
        }
      });
    }

    if (aiData.liabilities) {
      Object.entries(aiData.liabilities).forEach(([key, value]) => {
        if (typeof value === 'number' && value > 0) {
          const category = profile.liabilities.find((c) => 
            c.id.toLowerCase().includes(key.toLowerCase()) || 
            c.name.toLowerCase().includes(key.toLowerCase())
          );
          if (category) {
            category.subItems.push({
              id: `${category.id}_${Date.now()}`,
              name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
              amount: value,
              frequency: 'monthly',
              createdAt: new Date(),
              updatedAt: new Date(),
            });
            this.recalculateCategoryTotal(category);
          }
        }
      });
    }

    return profile;
  }
}

/**
 * React Hook wrapper for FinanceDataService
 * Provides reactive state management
 * Can be replaced with Angular service + RxJS in migration
 */
export function useFinanceData() {
  const [profile, setProfile] = useState<FinancialProfile>(() => 
    FinanceDataService.loadProfile()
  );

  useEffect(() => {
    FinanceDataService.saveProfile(profile);
  }, [profile]);

  const addSubItem = useCallback(
    (categoryType: CategoryType, categoryId: string, subItem: Omit<SubItem, 'id' | 'createdAt' | 'updatedAt'>) => {
      setProfile((prev) => FinanceDataService.addSubItem(prev, categoryType, categoryId, subItem));
    },
    []
  );

  const updateSubItem = useCallback(
    (categoryType: CategoryType, categoryId: string, subItemId: string, updates: Partial<SubItem>) => {
      setProfile((prev) => FinanceDataService.updateSubItem(prev, categoryType, categoryId, subItemId, updates));
    },
    []
  );

  const deleteSubItem = useCallback(
    (categoryType: CategoryType, categoryId: string, subItemId: string) => {
      setProfile((prev) => FinanceDataService.deleteSubItem(prev, categoryType, categoryId, subItemId));
    },
    []
  );

  const importFromAI = useCallback((aiData: any) => {
    setProfile(FinanceDataService.importFromAIData(aiData));
  }, []);

  const summary = FinanceDataService.calculateSummary(profile);

  return {
    profile,
    setProfile,
    addSubItem,
    updateSubItem,
    deleteSubItem,
    importFromAI,
    summary,
  };
}
