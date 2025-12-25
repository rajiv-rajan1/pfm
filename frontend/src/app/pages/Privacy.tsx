import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export const Privacy = ({ onBack }: { onBack: () => void }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Lock className="w-6 h-6 text-green-400" />
                        <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-300 hover:text-white hover:bg-slate-800">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                </div>

                <div className="p-8 prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-sm text-muted-foreground mb-6">Last Updated: December 25, 2025</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">1. Information We Collect</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                            <li><strong>Google Account Information:</strong> We use Google OAuth to authenticate you. we collect your name, email address, and profile picture.</li>
                            <li><strong>Financial Data:</strong> We store the financial records, assets, and transaction data you manually input into the App to provide your dashboard.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">2. How We Use Your Data</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                            <li>To provide and maintain the App's functionality.</li>
                            <li>To personalize your user experience.</li>
                            <li>To communicate with you regarding updates or support.</li>
                        </ul>
                    </section>

                    <section className="mb-8 p-6 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">3. Data Security</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                            <li>We use industry-standard encryption and secure Google Cloud Run environments to protect your data.</li>
                            <li>However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">4. Data Sharing</h2>
                        <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                            <li>We do not sell your personal data to third parties.</li>
                            <li>We only share information when required by law or to protect our rights.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-white">5. Data Retention & Deletion</h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            Users have the right to request the deletion of their account and all associated data at any time through the App settings.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};
