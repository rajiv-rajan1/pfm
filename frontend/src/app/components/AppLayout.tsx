import React, { ReactNode } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '../providers/ThemeProvider';
import { Footer } from './Footer';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { TrendingUp, LayoutDashboard, FileText, Target, Settings as SettingsIcon, Info, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../services/AuthService';
import { cn } from './ui/utils';

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

export const AppLayout = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/reports', label: 'Reports', icon: FileText },
        { path: '/goals', label: 'Goals', icon: Target },
        { path: '/settings', label: 'Settings', icon: SettingsIcon },
        { path: '/about', label: 'About 2t1', icon: Info },
    ];

    return (
        <ThemeProvider>
            <ScrollToTop />
            <div className="min-h-screen bg-background flex flex-col">
                {/* Sticky Header */}
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/80">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <div className="flex items-center justify-center">
                                <TrendingUp className="w-8 h-8 text-foreground" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-foreground">
                                    <span>2</span><span className="text-red-600">t</span><span>1</span>
                                </h1>
                                <p className="text-xs text-muted-foreground hidden sm:block">
                                    personal finance manager
                                </p>
                            </div>
                        </Link>

                        {/* Center Navigation (Only visible if logged in, or handled conditionally) */}
                        {user && (
                            <nav className="hidden md:flex items-center gap-1">
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link key={item.path} to={item.path}>
                                            <Button
                                                variant={isActive ? 'default' : 'ghost'}
                                                className="gap-2"
                                            >
                                                <Icon className="w-4 h-4" />
                                                {item.label}
                                            </Button>
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}

                        {/* Right Actions */}
                        <div className="flex items-center gap-2">
                            {!user ? (
                                <Button variant="ghost" onClick={() => navigate('/login')}>
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Login
                                </Button>
                            ) : (
                                <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            )}
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-grow">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
};
