import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TrialService, UserState, TrialStatus, AIQuota } from '../services/TrialService';
import { useAuth } from '../services/AuthService';

interface TrialContextType {
    userState: UserState;
    useAITokens: (tokens: number) => { success: boolean; quota: AIQuota };
    activateAccount: () => void;
    purchaseAICredits: (tokens: number) => void;
    shouldShowRetentionReminder: boolean;
    shouldShowUrgentWarning: boolean;
    retentionMessage: string;
    aiQuotaMessage: string;
    refreshState: () => void;
}

const TrialContext = createContext<TrialContextType | undefined>(undefined);

export function TrialProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const userId = user?.id || '';

    const [userState, setUserState] = useState<UserState>(() =>
        TrialService.getUserState(userId)
    );

    // Refresh state when user changes
    useEffect(() => {
        if (userId) {
            setUserState(TrialService.getUserState(userId));
        }
    }, [userId]);

    const refreshState = () => {
        setUserState(TrialService.getUserState(userId));
    };

    const useAITokens = (tokens: number) => {
        const result = TrialService.useAITokens(userId, tokens);
        refreshState();
        return result;
    };

    const activateAccount = () => {
        TrialService.activateAccount(userId);
        refreshState();
    };

    const purchaseAICredits = (tokens: number) => {
        TrialService.purchaseAICredits(userId, tokens);
        refreshState();
    };

    const value = {
        userState,
        useAITokens,
        activateAccount,
        purchaseAICredits,
        shouldShowRetentionReminder: TrialService.shouldShowRetentionReminder(userId),
        shouldShowUrgentWarning: TrialService.shouldShowUrgentRetentionWarning(userId),
        retentionMessage: TrialService.getRetentionMessage(userId),
        aiQuotaMessage: TrialService.getAIQuotaMessage(userState.aiQuota),
        refreshState
    };

    return (
        <TrialContext.Provider value={value}>
            {children}
        </TrialContext.Provider>
    );
}

export function useTrialContext() {
    const context = useContext(TrialContext);
    if (context === undefined) {
        throw new Error('useTrialContext must be used within a TrialProvider');
    }
    return context;
}
