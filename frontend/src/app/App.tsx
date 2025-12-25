import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  Target,
  Settings as SettingsIcon,
  Bell,
  User,
  Sparkles,
  TrendingUp,
  LogOut,
  Shield,
  Clock,
  Home as HomeIcon,
  Info,
} from 'lucide-react';
import { ThemeProvider } from './providers/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';
import { Welcome } from './components/Welcome';
import { Login } from './components/Login';
import { Activation } from './components/Activation';
import { Home } from './components/Home';
import { ManualEntry } from './components/ManualEntry';
import { OnboardingAIFirst } from './components/OnboardingAIFirst';
import { Dashboard } from './components/Dashboard';
import { Reports } from './components/Reports';
import { Goals } from './components/Goals';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { VoiceAIAssistant } from './components/VoiceAIAssistant';
import { RetentionBanner, AIQuotaBanner, MockDataBanner } from './components/RetentionBanner';
import { Footer } from './components/Footer';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { Button } from './components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './components/ui/dropdown-menu';
import { Badge } from './components/ui/badge';
import { cn } from './components/ui/utils';
import { useAuth } from './services/AuthService';
import { useTrial } from './services/TrialService';
import { MockDataService } from './services/MockDataService';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

type AppState = 'welcome' | 'login' | 'home' | 'manual-entry' | 'onboarding' | 'app' | 'activation' | 'terms' | 'privacy';
type View = 'home' | 'dashboard' | 'reports' | 'goals' | 'settings' | 'about';

export default function App() {
  const { user, logout } = useAuth();
  const { userState, useAITokens, activateAccount, shouldShowRetentionReminder, shouldShowUrgentWarning, retentionMessage, aiQuotaMessage } = useTrial(user?.id || '');
  const [appState, setAppState] = useState<AppState>('welcome');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMinimized, setAiMinimized] = useState(false);
  const [isUsingMockData, setIsUsingMockData] = useState(true);

  // Debug: Check if Client ID is loaded
  useEffect(() => {
    console.log('Google Client ID Status:', GOOGLE_CLIENT_ID ? 'Loaded' : 'Missing');
    if (GOOGLE_CLIENT_ID) {
      console.log('Diagnostic: Client ID length =', GOOGLE_CLIENT_ID.length);
    }

    // Handle initial URL routing for legal pages
    const path = window.location.pathname;
    if (path === '/terms') {
      setAppState('terms');
    } else if (path === '/privacy') {
      setAppState('privacy');
    }
  }, []);

  // Check authentication on mount - NO PAYMENT BLOCKER
  useEffect(() => {
    if (user) {
      // User is logged in, go straight to onboarding or app
      const hasCompletedOnboarding = localStorage.getItem('onboarding_complete');
      if (hasCompletedOnboarding) {
        setAppState('app');
        setIsUsingMockData(MockDataService.isUsingMockData(user.id));
      } else {
        setAppState('onboarding');
      }
    }
  }, [user]);

  const handleGetStarted = () => {
    setAppState('login');
  };

  const handleLoginSuccess = () => {
    // After login, go directly to onboarding (NO PAYMENT WALL)
    setAppState('onboarding');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_complete', 'true');
    setAppState('app');
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem('onboarding_complete');
    setAppState('welcome');
    setCurrentView('dashboard');
  };

  const handleGoToDashboard = () => {
    if (user) {
      setAppState('app');
    } else {
      setAppState('login');
    }
  };

  const handleBackToWelcome = () => {
    setAppState('welcome');
  };

  const handleTokenUsage = (tokens: number) => {
    if (user?.id) {
      const result = useAITokens(tokens);
      return result.success;
    }
    return false;
  };

  const handleActivateClick = () => {
    setAppState('activation');
  };

  const handleActivationSuccess = () => {
    activateAccount();
    setAppState('app');
  };

  const handleUpdateData = () => {
    setAiOpen(true);
    setAiMinimized(false);
  };

  // Main Application
  const navItems = [
    { id: 'home' as View, label: 'Home', icon: HomeIcon },
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'reports' as View, label: 'Reports', icon: FileText },
    { id: 'goals' as View, label: 'Goals', icon: Target },
    { id: 'settings' as View, label: 'Settings', icon: SettingsIcon },
    { id: 'about' as View, label: 'About 2t1', icon: Info },
  ];

  // Determine if we should show "Demo" or "Dashboard" button
  const shouldShowDemo = appState === 'login' || appState === 'welcome' || currentView === 'home';
  const dashboardButtonLabel = shouldShowDemo ? 'Demo' : 'Dashboard';

  const handleDashboardClick = () => {
    if (shouldShowDemo) {
      // Show demo with mock data
      if (!user) {
        // Not logged in, need to login first
        setAppState('login');
      } else {
        setCurrentView('dashboard');
        setAppState('app');
      }
    } else {
      // Go to regular dashboard
      setCurrentView('dashboard');
      setAppState('app');
    }
  };

  const handleHomeClick = () => {
    if (user) {
      setCurrentView('home');
      setAppState('app');
    } else {
      setAppState('welcome');
    }
  };

  const handlePlansClick = () => {
    setAppState('activation');
  };

  // Welcome Screen
  if (appState === 'welcome') {
    return (
      <ThemeProvider>
        <Welcome
          onGetStarted={handleGetStarted}
          onGoToDashboard={user ? handleGoToDashboard : undefined}
          onNavigate={(path) => {
            window.history.pushState({}, '', path);
            if (path === '/terms') setAppState('terms');
            if (path === '/privacy') setAppState('privacy');
          }}
        />
      </ThemeProvider>
    );
  }

  // Login Screen
  if (appState === 'login') {
    return (
      <ThemeProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Login
            onLoginSuccess={handleLoginSuccess}
            onBackToWelcome={handleBackToWelcome}
            onDemoClick={handleGoToDashboard}
            onPlansClick={handlePlansClick}
          />
        </GoogleOAuthProvider>
      </ThemeProvider>
    );
  }

  // Onboarding Screen
  if (appState === 'onboarding') {
    return (
      <ThemeProvider>
        <OnboardingAIFirst
          onComplete={handleOnboardingComplete}
          onBackToWelcome={handleBackToWelcome}
        />
      </ThemeProvider>
    );
  }

  // Home/Setup Screen
  if (appState === 'home' && user) {
    return (
      <ThemeProvider>
        <Home
          onManualEntry={() => setAppState('manual-entry')}
          onTokenUsage={handleTokenUsage}
          aiQuotaRemaining={userState.aiQuota.quotaRemaining}
          hasUnlimitedAI={userState.aiQuota.hasUnlimitedAccess}
        />
      </ThemeProvider>
    );
  }

  // Manual Entry Screen
  if (appState === 'manual-entry' && user) {
    return (
      <ThemeProvider>
        <ManualEntry
          onComplete={handleOnboardingComplete}
          onBack={() => setAppState('home')}
        />
      </ThemeProvider>
    );
  }

  // Activation Screen
  if (appState === 'activation' && user) {
    return (
      <ThemeProvider>
        <Activation
          userId={user.id}
          daysRemaining={userState.trialStatus.daysRemaining}
          aiQuotaRemaining={userState.aiQuota.quotaRemaining}
          onActivateSuccess={handleActivationSuccess}
          onClose={() => setAppState('app')}
          onHomeClick={handleHomeClick}
          onDashboardClick={handleDashboardClick}
        />
      </ThemeProvider>
    );
  }

  // Legal Pages
  if (appState === 'terms') {
    return (
      <ThemeProvider>
        <Terms onBack={() => {
          if (user) setAppState('app');
          else setAppState('welcome');
          window.history.pushState({}, '', '/');
        }} />
      </ThemeProvider>
    );
  }

  if (appState === 'privacy') {
    return (
      <ThemeProvider>
        <Privacy onBack={() => {
          if (user) setAppState('app');
          else setAppState('welcome');
          window.history.pushState({}, '', '/');
        }} />
      </ThemeProvider>
    );
  }



  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/80">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  2t1
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  personal finance manager
                </p>
              </div>
            </div>

            {/* Center Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? 'default' : 'ghost'}
                    onClick={() => setCurrentView(item.id)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Trial/Activation Status */}
              {!userState.trialStatus.hasActivated && (
                <Badge
                  variant="outline"
                  className="gap-1 hidden sm:flex cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900 transition-colors"
                  onClick={handleActivateClick}
                >
                  <Clock className="w-3 h-3" />
                  {userState.trialStatus.daysRemaining}d trial
                </Badge>
              )}

              {/* AI Quota Badge */}
              {userState.aiQuota.hasUnlimitedAccess ? (
                <Badge variant="outline" className="gap-1 hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent">
                  <Sparkles className="w-3 h-3" />
                  Unlimited AI
                </Badge>
              ) : (
                <Badge variant="outline" className="gap-1 hidden sm:flex">
                  <Sparkles className="w-3 h-3" />
                  {Math.floor(userState.aiQuota.quotaRemaining / 100)}
                </Badge>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* AI Assistant Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setAiOpen(!aiOpen);
                  setAiMinimized(false);
                }}
                className={cn(
                  'relative',
                  aiOpen && 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent hover:from-blue-700 hover:to-purple-700'
                )}
              >
                <Sparkles className="w-4 h-4" />
                {aiOpen && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                )}
              </Button>

              {/* Notifications */}
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="font-medium">{user?.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground">{user?.email || 'user@example.com'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCurrentView('settings')}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t">
            <div className="container mx-auto px-4 py-2 flex gap-1 overflow-x-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? 'default' : 'ghost'}
                    onClick={() => setCurrentView(item.id)}
                    size="sm"
                    className="gap-2 flex-shrink-0"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-6 md:py-8">
          {currentView === 'home' && (
            <Home
              onManualEntry={() => setAppState('manual-entry')}
              onTokenUsage={handleTokenUsage}
              aiQuotaRemaining={userState.aiQuota.quotaRemaining}
              hasUnlimitedAI={userState.aiQuota.hasUnlimitedAccess}
            />
          )}
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'reports' && <Reports />}
          {currentView === 'goals' && <Goals />}
          {currentView === 'settings' && <Settings />}
          {currentView === 'about' && (
            <About onJoinMovement={() => {
              if (!user) setAppState('login');
              else setCurrentView('dashboard');
            }} />
          )}
        </main>

        {/* AI Assistant Panel */}
        {aiOpen && (
          <div
            className={cn(
              'fixed z-40 transition-all',
              aiMinimized
                ? 'bottom-6 right-6'
                : 'bottom-0 right-0 md:bottom-6 md:right-6 w-full md:w-[400px] h-[600px] md:rounded-lg shadow-2xl'
            )}
          >
            <VoiceAIAssistant
              isOpen={aiOpen}
              onClose={() => setAiOpen(false)}
              onMinimize={() => setAiMinimized(!aiMinimized)}
              isMinimized={aiMinimized}
              className="h-full"
              onTokenUsage={handleTokenUsage}
              onSwitchToManual={() => {
                setAiOpen(false);
                setAppState('manual-entry');
              }}
            />
          </div>
        )}

        {/* Overlay for mobile AI */}
        {aiOpen && !aiMinimized && (
          <div
            className="fixed inset-0 bg-black/20 z-30 md:hidden"
            onClick={() => setAiOpen(false)}
          />
        )}

        {/* Retention Banner */}
        {shouldShowRetentionReminder && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
            <RetentionBanner
              daysRemaining={userState.trialStatus.daysRemaining}
              isUrgent={shouldShowUrgentWarning}
              onActivate={handleActivateClick}
            />
          </div>
        )}

        {/* AI Quota Banner */}
        {userState.aiQuota.quotaRemaining < 200 && !userState.aiQuota.hasUnlimitedAccess && (
          <div className="fixed bottom-20 left-0 right-0 z-50 p-4">
            <AIQuotaBanner
              quotaRemaining={userState.aiQuota.quotaRemaining}
              quotaLimit={userState.aiQuota.dailyLimit}
              onRecharge={handleActivateClick}
              onUpgrade={handleActivateClick}
            />
          </div>
        )}

        {/* Mock Data Banner */}
        {isUsingMockData && (
          <div className="fixed top-20 left-0 right-0 z-40 p-4">
            <MockDataBanner
              onUpdateData={handleUpdateData}
            />
          </div>
        )}


        {/* Footer */}
        <Footer onNavigate={(path) => {
          window.history.pushState({}, '', path);
          if (path === '/terms') setAppState('terms');
          if (path === '/privacy') setAppState('privacy');
        }} />
      </div>
    </ThemeProvider >
  );
}