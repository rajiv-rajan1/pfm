/**
 * Authentication Service
 * Handles user authentication with Google OAuth
 * Angular-ready pattern for easy migration
 */

export interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: 'google' | 'demo';
}

export class AuthService {
  private static STORAGE_KEY = 'financeos_user';
  private static GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  /**
   * Load current user from storage
   */
  static getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
    return null;
  }

  /**
   * Save user to storage
   */
  static saveUser(user: User): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  /**
   * Remove user from storage (logout)
   */
  static logout(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Demo login (for testing without Google OAuth)
   */
  static loginWithDemo(): User {
    const demoUser: User = {
      id: 'demo_user_123',
      name: 'Demo User',
      email: 'demo@example.com',
      provider: 'demo',
    };
    this.saveUser(demoUser);
    return demoUser;
  }

  /**
   * Initialize Google Sign-In
   * This is a placeholder - actual implementation requires Google Identity Services
   */
  static async initializeGoogleAuth(): Promise<void> {
    // In production, load Google Identity Services script
    return new Promise((resolve) => {
      // Mock implementation for demo
      console.log('Google Auth initialized (mock)');
      resolve();
    });
  }

  /**
   * Sign in with Google
   * Verifies the Google credential token with backend
   */
  static async signInWithGoogle(credentialToken: string): Promise<User> {
    try {
      // Send credential to backend for verifying
      // TEMPORARY: Hardcoded URL for debugging
      const backendUrl = 'https://pfm-backend-386128391538.us-central1.run.app';

      console.log('DEBUG: Using Hardcoded Backend URL:', backendUrl);

      const apiPath = `${backendUrl}/api/auth/google`;
      console.log(`Authenticating with backend at: ${apiPath}`);

      const response = await fetch(apiPath, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialToken }),
      });

      const responseText = await response.text();
      console.log('Backend response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Google authentication failed (Status: ${response.status})`;
        if (responseText) {
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.detail || errorMessage;
          } catch (e) {
            console.error('Non-JSON error response:', responseText);
            errorMessage = `Server error: ${responseText.substring(0, 100)}`;
          }
        } else {
          errorMessage = `Server returned an empty error response (Status: ${response.status}). Is the backend running?`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error('Failed to parse server response as JSON');
      }

      const googleUser: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        picture: data.user.picture,
        provider: 'google',
      };

      this.saveUser(googleUser);
      return googleUser;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  /**
   * Sign out from Google
   */
  static async signOutFromGoogle(): Promise<void> {
    // In production, sign out from Google
    this.logout();
  }
}

/**
 * React Hook for Authentication
 * Can be replaced with Angular service + RxJS in migration
 */
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => AuthService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AuthService.initializeGoogleAuth();
  }, []);

  const loginWithGoogle = async (credentialToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await AuthService.signInWithGoogle(credentialToken);
      setUser(user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemo = () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = AuthService.loginWithDemo();
      setUser(user);
      return user;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (user?.provider === 'google') {
        await AuthService.signOutFromGoogle();
      } else {
        AuthService.logout();
      }
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    loginWithGoogle,
    loginWithDemo,
    logout,
  };
}
