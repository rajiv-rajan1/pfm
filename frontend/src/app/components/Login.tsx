import { useState } from 'react';
import { TrendingUp, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAuth, AuthService } from '../services/AuthService';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [oauthError, setOauthError] = useState<string | null>(null);
  const { loginWithGoogle, loginWithDemo, isLoading, error } = useAuth();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setOauthError('No credential received from Google');
      return;
    }

    try {
      await loginWithGoogle(credentialResponse.credential);
      onLoginSuccess();
    } catch (error) {
      console.error('Google login failed:', error);
      setOauthError(error instanceof Error ? error.message : 'Google login failed');
    }
  };

  const handleDemoLogin = () => {
    try {
      loginWithDemo();
      onLoginSuccess();
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo, just use demo login
    handleDemoLogin();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Login Content */}
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900 p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Logo and Title */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                2t1
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                personal finance manager
              </p>
            </div>
            <p className="text-muted-foreground">
              Welcome back! Please login to your account
            </p>
          </div>

          {/* Login Card */}
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Choose your preferred login method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Sign In */}
              <div className="w-full">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => setOauthError('Google login failed')}
                  useOneTap
                  theme="outline"
                  size="large"
                  text="continue_with"
                />
              </div>

              {oauthError && (
                <div className="text-sm text-red-600 dark:text-red-400">
                  {oauthError}
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email/Password Form */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="text-center space-y-2">
                <button className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                  Forgot password?
                </button>
                <div className="text-xs text-muted-foreground">
                  Don't have an account?{' '}
                  <button className="text-blue-600 hover:underline dark:text-blue-400">
                    Sign up
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Notice */}
          <Card className="bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
            <CardContent className="pt-6">
              <div className="flex gap-3 items-start">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                    Demo Mode Available
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    You can sign in with Google or use the demo mode. Email/password login will use demo credentials.
                  </p>

                  {/* Mock Login for Dev/Testing */}
                  <div className="mt-4 pt-4 border-t border-yellow-200 dark:border-yellow-800">
                    <p className="text-xs font-semibold uppercase text-yellow-800/60 dark:text-yellow-200/60 mb-2">
                      Developer Tools
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-black/40 border-yellow-200/50 dark:border-yellow-800/50"
                      onClick={() => {
                        const mockUser = { id: "mock_user_1", name: "Test Explorer", email: "explorer@2t1.ai", provider: "mock" };
                        // @ts-ignore
                        AuthService.saveUser(mockUser);
                        window.location.href = "/";
                      }}
                    >
                      Mock Login (Test Explorer)
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}