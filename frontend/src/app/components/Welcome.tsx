import { TrendingUp, BarChart3, Target, Sparkles, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { TopNav } from './TopNav';

interface WelcomeProps {
  onGetStarted: () => void;
  onGoToDashboard?: () => void;
}

export function Welcome({ onGetStarted, onGoToDashboard }: WelcomeProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNav
        showDemo={true}
        onDemoClick={onGoToDashboard}
        currentPage="other"
      />

      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900 p-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* Logo and Title - Updated Branding */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  2t1
                </h1>
                <p className="text-sm text-muted-foreground">
                  personal finance manager
                </p>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your personal finances like a CFO — with company-style P&L, balance sheets, and AI-powered insights
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Company-Style P&L</h3>
                <p className="text-sm text-muted-foreground">
                  Track income, expenses, and net profit like a real business with monthly, quarterly, and annual views
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">AI Finance Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Get instant insights, add transactions naturally, and receive personalized financial advice
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Smart Goal Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Set financial goals, track progress, and get projections to achieve your dreams faster
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Features List */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 dark:from-slate-900 dark:to-slate-900 dark:border-slate-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 text-center">Everything you need to master your finances</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Net Worth & Asset Tracking',
                  'Income vs Expense Analysis',
                  'Balance Sheet View',
                  'Cash Flow Statements',
                  'Investment Portfolio Monitor',
                  'Bill & EMI Reminders',
                  'Financial Health Score',
                  'What-if Projections',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-green-600 dark:text-green-400"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              onClick={onGetStarted}
              className="h-14 px-8 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
            <p className="text-xs text-muted-foreground">
              Free to use • No credit card required • Your data stays private
            </p>
          </div>

          {/* Security Notice */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="flex gap-3 items-start">
                <div className="text-2xl">🔒</div>
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">Demo Application Notice</h4>
                  <p className="text-sm text-yellow-800">
                    This is a demonstration application with mock data. Please do not enter real
                    sensitive financial information or personally identifiable information (PII).
                    All data shown is for illustrative purposes only.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}