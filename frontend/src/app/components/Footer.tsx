import React from 'react';
import { Shield, Lock } from 'lucide-react';

export const Footer = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
    return (
        <footer className="border-t bg-background py-6 mt-12 mb-20 sm:mb-6">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-muted-foreground p-3">
                    &copy; {new Date().getFullYear()} 2t1 - Personal Finance Manager. All rights reserved.
                </div>
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => onNavigate('/terms')}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        <Shield className="w-4 h-4" />
                        Terms of Service
                    </button>
                    <button
                        onClick={() => onNavigate('/privacy')}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        <Lock className="w-4 h-4" />
                        Privacy Policy
                    </button>
                </div>
            </div>
        </footer>
    );
};
