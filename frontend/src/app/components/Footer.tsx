import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Info, Mail } from 'lucide-react';

export const Footer = () => {
    return (
        <footer className="border-t bg-background py-6 mt-12 mb-20 sm:mb-6">
            <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-muted-foreground p-3 flex items-center gap-1">
                    <span>&copy; {new Date().getFullYear()}</span>
                    <span className="font-bold text-foreground">
                        <span>2</span><span className="text-red-600">t</span><span>1</span>
                    </span>
                    <span>- Personal Finance Manager. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link
                        to="/about"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        <Info className="w-4 h-4" />
                        About
                    </Link>
                    <Link
                        to="/terms"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        <Shield className="w-4 h-4" />
                        Terms of Service
                    </Link>
                    <Link
                        to="/privacy"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        <Lock className="w-4 h-4" />
                        Privacy Policy
                    </Link>
                    <a
                        href="mailto:support@2t1.ai"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                    >
                        <Mail className="w-4 h-4" />
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
};
