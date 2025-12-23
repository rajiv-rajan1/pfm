/**
 * Payment Service
 * Handles payment processing, usage tracking, and billing
 * Angular-ready pattern for easy migration
 */

export interface PaymentDetails {
  userId: string;
  amount: number;
  currency: string;
  method: 'upi' | 'card' | 'netbanking' | 'wallet';
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  timestamp: Date;
}

export interface UsageRecord {
  userId: string;
  tokensUsed: number;
  cost: number;
  timestamp: Date;
  feature: string;
}

export interface UserBalance {
  userId: string;
  paidAmount: number;
  tokensAvailable: number;
  tokensUsed: number;
  lastUpdated: Date;
}

export class PaymentService {
  private static STORAGE_KEY_BALANCE = 'financeos_balance';
  private static STORAGE_KEY_PAYMENTS = 'financeos_payments';
  private static STORAGE_KEY_USAGE = 'financeos_usage';
  
  // Pricing configuration
  private static MINIMUM_PAYMENT = 99; // ₹99 minimum
  private static TOKENS_PER_RUPEE = 1000; // 1000 tokens per ₹1
  private static TOKENS_PER_AI_INTERACTION = 100; // Average tokens per AI interaction

  /**
   * Get user's current balance
   */
  static getUserBalance(userId: string): UserBalance {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_BALANCE);
      if (stored) {
        const balances = JSON.parse(stored);
        const userBalance = balances[userId];
        if (userBalance) {
          return {
            ...userBalance,
            lastUpdated: new Date(userBalance.lastUpdated),
          };
        }
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    }

    // Return default balance
    return {
      userId,
      paidAmount: 0,
      tokensAvailable: 0,
      tokensUsed: 0,
      lastUpdated: new Date(),
    };
  }

  /**
   * Save user balance
   */
  static saveUserBalance(balance: UserBalance): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_BALANCE) || '{}';
      const balances = JSON.parse(stored);
      balances[balance.userId] = {
        ...balance,
        lastUpdated: balance.lastUpdated.toISOString(),
      };
      localStorage.setItem(this.STORAGE_KEY_BALANCE, JSON.stringify(balances));
    } catch (error) {
      console.error('Error saving balance:', error);
    }
  }

  /**
   * Check if user has paid minimum amount
   */
  static hasMinimumPayment(userId: string): boolean {
    const balance = this.getUserBalance(userId);
    return balance.paidAmount >= this.MINIMUM_PAYMENT;
  }

  /**
   * Check if user has sufficient tokens
   */
  static hasSufficientTokens(userId: string, requiredTokens: number = this.TOKENS_PER_AI_INTERACTION): boolean {
    const balance = this.getUserBalance(userId);
    return balance.tokensAvailable >= requiredTokens;
  }

  /**
   * Process payment (mock implementation)
   */
  static async processPayment(
    userId: string,
    amount: number,
    method: PaymentDetails['method']
  ): Promise<PaymentDetails> {
    return new Promise((resolve, reject) => {
      // Simulate payment processing
      setTimeout(() => {
        // Mock successful payment
        const payment: PaymentDetails = {
          userId,
          amount,
          currency: 'INR',
          method,
          status: 'completed',
          transactionId: 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
        };

        // Update user balance
        const balance = this.getUserBalance(userId);
        balance.paidAmount += amount;
        balance.tokensAvailable += amount * this.TOKENS_PER_RUPEE;
        balance.lastUpdated = new Date();
        this.saveUserBalance(balance);

        // Save payment record
        this.savePaymentRecord(payment);

        resolve(payment);
      }, 2000);
    });
  }

  /**
   * Save payment record
   */
  private static savePaymentRecord(payment: PaymentDetails): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_PAYMENTS) || '[]';
      const payments = JSON.parse(stored);
      payments.push({
        ...payment,
        timestamp: payment.timestamp.toISOString(),
      });
      localStorage.setItem(this.STORAGE_KEY_PAYMENTS, JSON.stringify(payments));
    } catch (error) {
      console.error('Error saving payment:', error);
    }
  }

  /**
   * Track token usage
   */
  static trackUsage(userId: string, tokensUsed: number, feature: string = 'ai_assistant'): void {
    try {
      // Update balance
      const balance = this.getUserBalance(userId);
      balance.tokensUsed += tokensUsed;
      balance.tokensAvailable = Math.max(0, balance.tokensAvailable - tokensUsed);
      balance.lastUpdated = new Date();
      this.saveUserBalance(balance);

      // Record usage
      const usage: UsageRecord = {
        userId,
        tokensUsed,
        cost: tokensUsed / this.TOKENS_PER_RUPEE,
        timestamp: new Date(),
        feature,
      };

      const stored = localStorage.getItem(this.STORAGE_KEY_USAGE) || '[]';
      const usageRecords = JSON.parse(stored);
      usageRecords.push({
        ...usage,
        timestamp: usage.timestamp.toISOString(),
      });
      localStorage.setItem(this.STORAGE_KEY_USAGE, JSON.stringify(usageRecords));
    } catch (error) {
      console.error('Error tracking usage:', error);
    }
  }

  /**
   * Get payment history
   */
  static getPaymentHistory(userId: string): PaymentDetails[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_PAYMENTS);
      if (stored) {
        const payments = JSON.parse(stored);
        return payments
          .filter((p: any) => p.userId === userId)
          .map((p: any) => ({
            ...p,
            timestamp: new Date(p.timestamp),
          }));
      }
    } catch (error) {
      console.error('Error loading payment history:', error);
    }
    return [];
  }

  /**
   * Get usage history
   */
  static getUsageHistory(userId: string): UsageRecord[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_USAGE);
      if (stored) {
        const usage = JSON.parse(stored);
        return usage
          .filter((u: any) => u.userId === userId)
          .map((u: any) => ({
            ...u,
            timestamp: new Date(u.timestamp),
          }));
      }
    } catch (error) {
      console.error('Error loading usage history:', error);
    }
    return [];
  }

  /**
   * Get minimum payment amount
   */
  static getMinimumPayment(): number {
    return this.MINIMUM_PAYMENT;
  }

  /**
   * Calculate tokens for amount
   */
  static calculateTokens(amount: number): number {
    return amount * this.TOKENS_PER_RUPEE;
  }

  /**
   * Calculate cost for tokens
   */
  static calculateCost(tokens: number): number {
    return tokens / this.TOKENS_PER_RUPEE;
  }

  /**
   * Initiate Razorpay payment (placeholder)
   */
  static async initiateRazorpayPayment(
    userId: string,
    amount: number,
    onSuccess: (payment: PaymentDetails) => void,
    onFailure: (error: Error) => void
  ): Promise<void> {
    // In production, integrate with Razorpay SDK
    // For now, use mock payment
    try {
      const payment = await this.processPayment(userId, amount, 'upi');
      onSuccess(payment);
    } catch (error) {
      onFailure(error as Error);
    }
  }
}

/**
 * React Hook for Payment
 */
import { useState, useEffect } from 'react';

export function usePayment(userId: string) {
  const [balance, setBalance] = useState<UserBalance>(() => PaymentService.getUserBalance(userId));
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setBalance(PaymentService.getUserBalance(userId));
    }
  }, [userId]);

  const processPayment = async (amount: number, method: PaymentDetails['method']) => {
    setIsProcessing(true);
    setError(null);
    try {
      const payment = await PaymentService.processPayment(userId, amount, method);
      setBalance(PaymentService.getUserBalance(userId));
      return payment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const trackUsage = (tokens: number, feature?: string) => {
    PaymentService.trackUsage(userId, tokens, feature);
    setBalance(PaymentService.getUserBalance(userId));
  };

  const hasMinimumPayment = PaymentService.hasMinimumPayment(userId);
  const hasSufficientTokens = (tokens: number = 100) => 
    PaymentService.hasSufficientTokens(userId, tokens);

  return {
    balance,
    hasMinimumPayment,
    hasSufficientTokens,
    isProcessing,
    error,
    processPayment,
    trackUsage,
    minimumPayment: PaymentService.getMinimumPayment(),
  };
}
