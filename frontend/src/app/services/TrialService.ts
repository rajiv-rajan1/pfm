/**
 * Trial & Retention Service
 * Manages free trial, data retention, and AI quota states
 */

export interface TrialStatus {
  userId: string;
  trialStartDate: Date;
  trialEndDate: Date;
  daysRemaining: number;
  isTrialActive: boolean;
  hasActivated: boolean;
  activationDate?: Date;
}

export interface AIQuota {
  userId: string;
  dailyLimit: number;
  dailyUsed: number;
  quotaResetTime: Date;
  hasUnlimitedAccess: boolean;
  quotaRemaining: number;
}

export interface UserState {
  isLoggedIn: boolean;
  trialStatus: TrialStatus;
  aiQuota: AIQuota;
  hasRealData: boolean;
  dataRetentionEnabled: boolean;
}

export class TrialService {
  private static STORAGE_KEY_TRIAL = 'financeos_trial';
  private static STORAGE_KEY_AI_QUOTA = 'financeos_ai_quota';
  private static STORAGE_KEY_ACTIVATION = 'financeos_activation';
  
  private static TRIAL_DAYS = 30;
  private static DAILY_AI_QUOTA = 1000; // tokens per day
  private static TOKENS_PER_INTERACTION = 100;

  /**
   * Initialize trial for new user
   */
  static initializeTrial(userId: string): TrialStatus {
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + this.TRIAL_DAYS);

    const trialStatus: TrialStatus = {
      userId,
      trialStartDate: now,
      trialEndDate,
      daysRemaining: this.TRIAL_DAYS,
      isTrialActive: true,
      hasActivated: false,
    };

    this.saveTrialStatus(trialStatus);
    this.initializeAIQuota(userId);
    
    return trialStatus;
  }

  /**
   * Initialize daily AI quota
   */
  static initializeAIQuota(userId: string): AIQuota {
    const now = new Date();
    const quotaResetTime = new Date(now);
    quotaResetTime.setDate(quotaResetTime.getDate() + 1);
    quotaResetTime.setHours(0, 0, 0, 0);

    const quota: AIQuota = {
      userId,
      dailyLimit: this.DAILY_AI_QUOTA,
      dailyUsed: 0,
      quotaResetTime,
      hasUnlimitedAccess: false,
      quotaRemaining: this.DAILY_AI_QUOTA,
    };

    this.saveAIQuota(quota);
    return quota;
  }

  /**
   * Get current trial status
   */
  static getTrialStatus(userId: string): TrialStatus {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_TRIAL);
      if (stored) {
        const trials = JSON.parse(stored);
        const userTrial = trials[userId];
        
        if (userTrial) {
          const trialStatus = {
            ...userTrial,
            trialStartDate: new Date(userTrial.trialStartDate),
            trialEndDate: new Date(userTrial.trialEndDate),
            activationDate: userTrial.activationDate ? new Date(userTrial.activationDate) : undefined,
          };

          // Calculate days remaining
          const now = new Date();
          const daysRemaining = Math.ceil((trialStatus.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          trialStatus.daysRemaining = Math.max(0, daysRemaining);
          trialStatus.isTrialActive = daysRemaining > 0 && !trialStatus.hasActivated;

          return trialStatus;
        }
      }
    } catch (error) {
      console.error('Error loading trial status:', error);
    }

    // Initialize trial for new user
    return this.initializeTrial(userId);
  }

  /**
   * Get current AI quota
   */
  static getAIQuota(userId: string): AIQuota {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_AI_QUOTA);
      if (stored) {
        const quotas = JSON.parse(stored);
        const userQuota = quotas[userId];
        
        if (userQuota) {
          const quota = {
            ...userQuota,
            quotaResetTime: new Date(userQuota.quotaResetTime),
          };

          // Check if quota needs reset
          const now = new Date();
          if (now >= quota.quotaResetTime) {
            return this.resetDailyQuota(userId, quota);
          }

          quota.quotaRemaining = Math.max(0, quota.dailyLimit - quota.dailyUsed);
          return quota;
        }
      }
    } catch (error) {
      console.error('Error loading AI quota:', error);
    }

    return this.initializeAIQuota(userId);
  }

  /**
   * Reset daily quota
   */
  private static resetDailyQuota(userId: string, currentQuota: AIQuota): AIQuota {
    const now = new Date();
    const quotaResetTime = new Date(now);
    quotaResetTime.setDate(quotaResetTime.getDate() + 1);
    quotaResetTime.setHours(0, 0, 0, 0);

    const quota: AIQuota = {
      ...currentQuota,
      dailyUsed: 0,
      quotaResetTime,
      quotaRemaining: currentQuota.dailyLimit,
    };

    this.saveAIQuota(quota);
    return quota;
  }

  /**
   * Use AI tokens
   */
  static useAITokens(userId: string, tokens: number): { success: boolean; quota: AIQuota } {
    const quota = this.getAIQuota(userId);

    // If unlimited access, always succeed
    if (quota.hasUnlimitedAccess) {
      return { success: true, quota };
    }

    // Check if enough quota
    if (quota.quotaRemaining < tokens) {
      return { success: false, quota };
    }

    // Deduct tokens
    quota.dailyUsed += tokens;
    quota.quotaRemaining = Math.max(0, quota.dailyLimit - quota.dailyUsed);
    this.saveAIQuota(quota);

    return { success: true, quota };
  }

  /**
   * Activate account (enables data retention and unlimited AI)
   */
  static activateAccount(userId: string): void {
    // Update trial status
    const trialStatus = this.getTrialStatus(userId);
    trialStatus.hasActivated = true;
    trialStatus.activationDate = new Date();
    this.saveTrialStatus(trialStatus);

    // Enable unlimited AI
    const quota = this.getAIQuota(userId);
    quota.hasUnlimitedAccess = true;
    this.saveAIQuota(quota);

    // Save activation record
    const activations = JSON.parse(localStorage.getItem(this.STORAGE_KEY_ACTIVATION) || '{}');
    activations[userId] = {
      activatedAt: new Date().toISOString(),
      plan: 'premium',
    };
    localStorage.setItem(this.STORAGE_KEY_ACTIVATION, JSON.stringify(activations));
  }

  /**
   * Purchase AI credits
   */
  static purchaseAICredits(userId: string, tokens: number): void {
    const quota = this.getAIQuota(userId);
    quota.dailyLimit += tokens;
    quota.quotaRemaining += tokens;
    this.saveAIQuota(quota);
  }

  /**
   * Check if user should see retention reminder
   */
  static shouldShowRetentionReminder(userId: string): boolean {
    const trial = this.getTrialStatus(userId);
    if (trial.hasActivated) return false;
    
    return trial.daysRemaining <= 15 && trial.daysRemaining > 0;
  }

  /**
   * Check if user should see urgent retention warning
   */
  static shouldShowUrgentRetentionWarning(userId: string): boolean {
    const trial = this.getTrialStatus(userId);
    if (trial.hasActivated) return false;
    
    return trial.daysRemaining <= 5 && trial.daysRemaining > 0;
  }

  /**
   * Get retention message
   */
  static getRetentionMessage(userId: string): string {
    const trial = this.getTrialStatus(userId);
    const days = trial.daysRemaining;

    if (days <= 3) {
      return `Your data will be deleted in ${days} day${days !== 1 ? 's' : ''}. Activate now to keep your financial history.`;
    } else if (days <= 7) {
      return `${days} days left in your trial. Activate your account to retain your data beyond the trial period.`;
    } else if (days <= 15) {
      return `Your data will be retained for ${days} more days. Activate to keep your data permanently.`;
    } else {
      return `Your data will be retained for one month. To keep your data beyond that, please activate your account.`;
    }
  }

  /**
   * Get AI quota message
   */
  static getAIQuotaMessage(quota: AIQuota): string {
    if (quota.hasUnlimitedAccess) {
      return 'Unlimited AI access';
    }

    const remaining = quota.quotaRemaining;
    const interactions = Math.floor(remaining / this.TOKENS_PER_INTERACTION);

    if (remaining === 0) {
      return 'Daily AI quota reached. Recharge to continue or wait for tomorrow\'s reset.';
    } else if (interactions <= 5) {
      return `${interactions} AI interaction${interactions !== 1 ? 's' : ''} remaining today. Upgrade for unlimited access.`;
    } else {
      return `${remaining.toLocaleString()} tokens remaining today`;
    }
  }

  /**
   * Save trial status
   */
  private static saveTrialStatus(status: TrialStatus): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_TRIAL) || '{}';
      const trials = JSON.parse(stored);
      trials[status.userId] = {
        ...status,
        trialStartDate: status.trialStartDate.toISOString(),
        trialEndDate: status.trialEndDate.toISOString(),
        activationDate: status.activationDate?.toISOString(),
      };
      localStorage.setItem(this.STORAGE_KEY_TRIAL, JSON.stringify(trials));
    } catch (error) {
      console.error('Error saving trial status:', error);
    }
  }

  /**
   * Save AI quota
   */
  private static saveAIQuota(quota: AIQuota): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_AI_QUOTA) || '{}';
      const quotas = JSON.parse(stored);
      quotas[quota.userId] = {
        ...quota,
        quotaResetTime: quota.quotaResetTime.toISOString(),
      };
      localStorage.setItem(this.STORAGE_KEY_AI_QUOTA, JSON.stringify(quotas));
    } catch (error) {
      console.error('Error saving AI quota:', error);
    }
  }

  /**
   * Get user state (comprehensive)
   */
  static getUserState(userId: string): UserState {
    const trialStatus = this.getTrialStatus(userId);
    const aiQuota = this.getAIQuota(userId);
    const hasRealData = this.checkHasRealData(userId);

    return {
      isLoggedIn: true,
      trialStatus,
      aiQuota,
      hasRealData,
      dataRetentionEnabled: trialStatus.hasActivated || trialStatus.isTrialActive,
    };
  }

  /**
   * Check if user has entered real data
   */
  private static checkHasRealData(userId: string): boolean {
    // Check if user has saved any custom financial data
    const hasOnboarded = localStorage.getItem('onboarding_complete') === 'true';
    return hasOnboarded;
  }
}

/**
 * React Hook for Trial & State
 */
import { useState, useEffect } from 'react';

export function useTrial(userId: string) {
  const [userState, setUserState] = useState<UserState>(() => 
    TrialService.getUserState(userId)
  );

  useEffect(() => {
    if (userId) {
      setUserState(TrialService.getUserState(userId));
    }
  }, [userId]);

  const useAITokens = (tokens: number) => {
    const result = TrialService.useAITokens(userId, tokens);
    setUserState(TrialService.getUserState(userId));
    return result;
  };

  const activateAccount = () => {
    TrialService.activateAccount(userId);
    setUserState(TrialService.getUserState(userId));
  };

  const purchaseAICredits = (tokens: number) => {
    TrialService.purchaseAICredits(userId, tokens);
    setUserState(TrialService.getUserState(userId));
  };

  return {
    userState,
    useAITokens,
    activateAccount,
    purchaseAICredits,
    shouldShowRetentionReminder: TrialService.shouldShowRetentionReminder(userId),
    shouldShowUrgentWarning: TrialService.shouldShowUrgentRetentionWarning(userId),
    retentionMessage: TrialService.getRetentionMessage(userId),
    aiQuotaMessage: TrialService.getAIQuotaMessage(userState.aiQuota),
  };
}
