import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { ThemeProvider } from '../providers/ThemeProvider';
import { ThemeToggle } from './ThemeToggle';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { Footer } from './Footer';

// Simplified layout for Terms, Privacy, About
export const LegalLayout = () => {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-background flex flex-col">
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/80">
                    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to App
                        </Link>

                        <div className="flex items-center gap-2">
                            <ThemeToggle />
                        </div>
                    </div>
                </header>

                <main className="flex-grow">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </ThemeProvider>
    );
};
