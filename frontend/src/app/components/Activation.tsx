import { useState } from 'react';
import { Shield, Zap, Database, Check, Sparkles, Infinity, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { TopNav } from './TopNav';
import { cn } from './ui/utils';

interface ActivationProps {
  userId: string;
  daysRemaining: number;
  aiQuotaRemaining: number;
  onActivateSuccess: () => void;
  onClose?: () => void;
  onHomeClick?: () => void;
  onDashboardClick?: () => void;
}

type Plan = 'ai-mode' | 'manual-mode';

export function Activation({ 
  userId, 
  daysRemaining, 
  aiQuotaRemaining,
  onActivateSuccess,
  onClose,
  onHomeClick,
  onDashboardClick
}: ActivationProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('ai-mode');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleActivate = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowSuccess(true);
    setTimeout(() => {
      onActivateSuccess();
    }, 2000);
  };

  const plans = [
    {
      id: 'ai-mode' as Plan,
      name: 'AI Mode',
      price: 299,
      interval: 'month',
      description: '3 years data retention and 1000 AI tokens per day',
      features: [
        'Unlimited AI voice & chat assistant',
        'Natural language data entry',
        '3 years data retention',
        '1000 AI tokens per day',
        'Advanced analytics & insights',
        'Priority support',
        'Custom reports & export',
      ],
      icon: Sparkles,
      color: 'from-blue-600 to-purple-600',
      popular: true,
    },
    {
      id: 'manual-mode' as Plan,
      name: 'Manual Mode',
      price: 99,
      interval: 'month',
      description: '3 years data retention and 100 AI tokens per day',
      features: [
        '3 years data retention',
        'Manual form-based entry',
        '100 AI tokens per day (basic assistance)',
        'Full dashboard access',
        'Export capabilities',
        'Standard support',
      ],
      icon: Database,
      color: 'from-gray-600 to-gray-700',
      popular: false,
    },
  ];

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-green-50 dark:from-gray-900 dark:via-background dark:to-gray-900 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Account Activated!</h2>
              <p className="text-muted-foreground mt-2">
                You now have full access to all features
              </p>
            </div>
            <div className="animate-pulse text-sm text-muted-foreground">
              Redirecting...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav 
        showDashboard={true}
        onHomeClick={onHomeClick} 
        onDashboardClick={onDashboardClick} 
        currentPage="plans"
      />
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="outline" className="mb-2">
            <Sparkles className="w-3 h-3 mr-1" />
            Upgrade Your Account
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock unlimited data retention and AI-powered insights
          </p>
        </div>

        {/* Current Status */}
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <Card className="border-2 border-orange-200 dark:border-orange-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data Retention</p>
                  <p className="text-2xl font-bold">{daysRemaining} days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-200 dark:border-yellow-900">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">AI Tokens</p>
                  <p className="text-2xl font-bold">{aiQuotaRemaining}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plans */}
        <RadioGroup value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as Plan)}>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isSelected = selectedPlan === plan.id;

              return (
                <div key={plan.id} className="relative">
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 z-10">
                      Most Popular
                    </Badge>
                  )}
                  
                  <RadioGroupItem
                    value={plan.id}
                    id={plan.id}
                    className="peer sr-only"
                  />
                  
                  <Label
                    htmlFor={plan.id}
                    className={cn(
                      'block cursor-pointer transition-all',
                      isSelected && 'scale-[1.02]'
                    )}
                  >
                    <Card className={cn(
                      'border-2 transition-all h-full',
                      isSelected 
                        ? 'border-blue-600 dark:border-blue-500 shadow-lg' 
                        : 'border-muted hover:border-blue-300 dark:hover:border-blue-800'
                    )}>
                      <CardHeader>
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
                          'bg-gradient-to-r',
                          plan.color
                        )}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="flex items-center justify-between">
                          {plan.name}
                        </CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Price */}
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">₹{plan.price}</span>
                            <span className="text-muted-foreground">/{plan.interval}</span>
                          </div>
                        </div>

                        <Separator />

                        {/* Features */}
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {isSelected && (
                          <Badge className="w-full justify-center bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 hover:bg-blue-100 dark:hover:bg-blue-900">
                            <Check className="w-3 h-3 mr-1" />
                            Selected
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>

        {/* Action Buttons */}
        <div className="max-w-md mx-auto space-y-3">
          <Button
            onClick={handleActivate}
            disabled={isProcessing}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Activate {plans.find(p => p.id === selectedPlan)?.name}
              </>
            )}
          </Button>

          {onClose && (
            <Button
              variant="ghost"
              onClick={onClose}
              className="w-full"
              disabled={isProcessing}
            >
              I'll Decide Later
            </Button>
          )}
        </div>

        {/* FAQ / Info */}
        <Card className="max-w-2xl mx-auto bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Why Upgrade?</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <Database className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="font-medium text-foreground">Data Retention</p>
                  <p>Free trial: 30 days. Premium: Forever. Your financial history is valuable.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="font-medium text-foreground">AI Assistant</p>
                  <p>Free: 1,000 tokens/day. Premium: Unlimited. Get instant financial insights anytime.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                <div>
                  <p className="font-medium text-foreground">Privacy & Security</p>
                  <p>We don't store any personal information. All data is encrypted and linked to a unique ID.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}