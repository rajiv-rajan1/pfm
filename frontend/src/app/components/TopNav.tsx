import { TrendingUp, Home as HomeIcon, LayoutDashboard, CreditCard, User, LogIn, LogOut as LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';

interface TopNavProps {
  showDemo?: boolean;
  showDashboard?: boolean;
  showPlans?: boolean;
  showProfile?: boolean;
  onHomeClick?: () => void;
  onDashboardClick?: () => void;
  onDemoClick?: () => void;
  onPlansClick?: () => void;
  onProfileClick?: () => void;
  currentPage?: 'home' | 'dashboard' | 'plans' | 'profile' | 'other';
}

export function TopNav({
  showDemo = false,
  showDashboard = false,
  showPlans = true,
  showProfile = false,
  onHomeClick,
  onDashboardClick,
  onDemoClick,
  onPlansClick,
  onProfileClick,
  currentPage = 'other',
}: TopNavProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onHomeClick}>
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
        <nav className="hidden md:flex items-center gap-2">
          {onHomeClick && (
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={onHomeClick}
              className="gap-2"
            >
              <HomeIcon className="w-4 h-4" />
              Home
            </Button>
          )}

          {showDemo && onDemoClick && (
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={onDemoClick}
              className="gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Demo
            </Button>
          )}

          {showDashboard && onDashboardClick && (
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={onDashboardClick}
              className="gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          )}

          {showPlans && onPlansClick && (
            <Button
              variant={currentPage === 'plans' ? 'default' : 'ghost'}
              onClick={onPlansClick}
              className="gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Plans
            </Button>
          )}

          {/* Profile in center nav if requested via props */}
          {showProfile && onProfileClick && (
            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              onClick={onProfileClick}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!user ? (
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Login
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
              <LogOutIcon />
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="container mx-auto px-4 py-2 flex gap-1 overflow-x-auto">
          {onHomeClick && (
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={onHomeClick}
              size="sm"
              className="gap-2 flex-shrink-0"
            >
              <HomeIcon className="w-4 h-4" />
              Home
            </Button>
          )}

          {showDemo && onDemoClick && (
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={onDemoClick}
              size="sm"
              className="gap-2 flex-shrink-0"
            >
              <LayoutDashboard className="w-4 h-4" />
              Demo
            </Button>
          )}

          {showDashboard && onDashboardClick && (
            <Button
              variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
              onClick={onDashboardClick}
              size="sm"
              className="gap-2 flex-shrink-0"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Button>
          )}

          {showPlans && onPlansClick && (
            <Button
              variant={currentPage === 'plans' ? 'default' : 'ghost'}
              onClick={onPlansClick}
              size="sm"
              className="gap-2 flex-shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              Plans
            </Button>
          )}

          {showProfile && onProfileClick && (
            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              onClick={onProfileClick}
              size="sm"
              className="gap-2 flex-shrink-0"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
