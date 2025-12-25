import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from './services/AuthService';
import { MockDataService } from './services/MockDataService';
import { TrialProvider, useTrialContext } from './context/TrialContext';

// Layouts
import { AppLayout } from './components/AppLayout';
import { LegalLayout } from './components/LegalLayout';

// Components
import { Welcome } from './components/Welcome';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { Reports } from './components/Reports';
import { Goals } from './components/Goals';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { ManualEntry } from './components/ManualEntry';
import { OnboardingAIFirst } from './components/OnboardingAIFirst';
import { Activation } from './components/Activation';
import { VoiceAIAssistant } from './components/VoiceAIAssistant';
import { RetentionBanner, MockDataBanner } from './components/RetentionBanner';
import { Button } from './components/ui/button';
import { Sparkles } from 'lucide-react';
import { cn } from './components/ui/utils';

// Pages
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const GlobalFloatingUI = () => {
  const { user } = useAuth();
  const {
    userState,
    useAITokens,
    shouldShowRetentionReminder,
    shouldShowUrgentWarning,
    activateAccount
  } = useTrialContext();

  const navigate = useNavigate();
  const [aiOpen, setAiOpen] = React.useState(false);
  const [aiMinimized, setAiMinimized] = React.useState(false);
  const [isUsingMockData, setIsUsingMockData] = React.useState(true);

  const location = useLocation();
  const isPublicRoute = ['/login', '/terms', '/privacy', '/about', '/'].includes(location.pathname);

  // Sync mock data state
  useEffect(() => {
    if (user) {
      setIsUsingMockData(MockDataService.isUsingMockData(user.id));
    }
  }, [user, location.pathname]);

  const handleUpdateData = () => {
    setAiOpen(true);
    setAiMinimized(false);
  };

  if (!user || isPublicRoute) return null;

  return (
    <>
      {/* Floating AI Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        {!aiOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setAiOpen(true);
              setAiMinimized(false);
            }}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all"
          >
            <Sparkles className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </Button>
        )}
      </div>

      {/* AI Assistant Panel */}
      {aiOpen && (
        <div
          className={cn(
            'fixed z-40 transition-all',
            aiMinimized
              ? 'bottom-6 right-24'
              : 'bottom-0 right-0 md:bottom-24 md:right-6 w-full md:w-[400px] h-[600px] md:rounded-lg shadow-2xl'
          )}
        >
          <VoiceAIAssistant
            isOpen={aiOpen}
            onClose={() => setAiOpen(false)}
            onMinimize={() => setAiMinimized(!aiMinimized)}
            isMinimized={aiMinimized}
            className="h-full"
            onTokenUsage={(tokens) => useAITokens(tokens).success}
            onSwitchToManual={() => {
              setAiOpen(false);
              navigate("/manual-entry");
            }}
          />
        </div>
      )}

      {/* Retention Banner */}
      {shouldShowRetentionReminder && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
          <RetentionBanner
            daysRemaining={userState.trialStatus.daysRemaining}
            isUrgent={shouldShowUrgentWarning}
            onActivate={activateAccount}
          />
        </div>
      )}

      {/* Mock Data Banner */}
      {isUsingMockData && (
        <div className="fixed top-20 left-0 right-0 z-40 p-4 pointer-events-none">
          <div className="pointer-events-auto">
            <MockDataBanner onUpdateData={handleUpdateData} />
          </div>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <TrialProvider>
          <AppRoutes />
          <GlobalFloatingUI />
        </TrialProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

const AppRoutes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/welcome" element={<AppLayout />}>
        <Route index element={<Welcome
          onGetStarted={() => navigate('/login')}
        />} />
      </Route>

      {/* Auth & Legal Routes - Wrapped in LegalLayout for focus */}
      <Route element={<LegalLayout />}>
        <Route path="/login" element={
          user ? <Navigate to="/" replace /> :
            <Login
              onLoginSuccess={() => navigate('/')}
            />
        } />
        <Route path="/about" element={<About onJoinMovement={() => navigate(user ? '/' : '/login')} />} />
        <Route path="/terms" element={<Terms onBack={() => navigate(-1)} />} />
        <Route path="/privacy" element={<Privacy onBack={() => navigate(-1)} />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/activation" element={<ProtectedRoute><Activation
          onClose={() => navigate('/dashboard')}
          onHomeClick={() => navigate('/')}
          onDashboardClick={() => navigate('/dashboard')}
          onActivateSuccess={() => navigate('/')}
          userId={user?.id || ''}
          daysRemaining={0}
          aiQuotaRemaining={0}
        /></ProtectedRoute>} />

        {/* Special Flows */}
        <Route path="/onboarding" element={<ProtectedRoute><OnboardingAIFirst onComplete={() => navigate('/')} onBackToWelcome={() => navigate('/welcome')} /></ProtectedRoute>} />
        <Route path="/manual-entry" element={<ProtectedRoute><ManualEntry onComplete={() => navigate('/dashboard')} onBack={() => navigate(-1)} /></ProtectedRoute>} />
        <Route path="/" element={<HomeWrapper />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Wrapper to handle Home logic (AI vs Dashboard)
const HomeWrapper = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Welcome onGetStarted={() => navigate('/login')} />;

  return <HomeActionWrapper />;
}

const HomeActionWrapper = () => {
  const { userState, useAITokens } = useTrialContext();
  const navigate = useNavigate();

  return (
    <Home
      onManualEntry={() => navigate('/manual-entry')}
      onDashboardClick={() => navigate('/dashboard')}
      onTokenUsage={(tokens) => useAITokens(tokens).success}
      aiQuotaRemaining={userState.aiQuota.quotaRemaining}
      hasUnlimitedAI={userState.aiQuota.hasUnlimitedAccess}
    />
  );
}