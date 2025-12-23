import { useState } from 'react';
import { CreditCard, Smartphone, Building2, Wallet, Check, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Badge } from './ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { usePayment } from '../services/PaymentService';
import { PaymentService } from '../services/PaymentService';

interface PaymentProps {
  userId: string;
  onPaymentSuccess: () => void;
  onSkipForNow?: () => void;
}

type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export function Payment({ userId, onPaymentSuccess, onSkipForNow }: PaymentProps) {
  const { processPayment, isProcessing, error, minimumPayment } = usePayment(userId);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [amount, setAmount] = useState(minimumPayment);
  const [upiId, setUpiId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = async () => {
    try {
      await processPayment(amount, selectedMethod);
      setShowSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const tokens = PaymentService.calculateTokens(amount);
  const estimatedInteractions = Math.floor(tokens / 100);

  const paymentMethods = [
    {
      id: 'upi' as PaymentMethod,
      label: 'UPI',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm',
      popular: true,
    },
    {
      id: 'card' as PaymentMethod,
      label: 'Card',
      icon: CreditCard,
      description: 'Credit or Debit Card',
      popular: false,
    },
    {
      id: 'netbanking' as PaymentMethod,
      label: 'Net Banking',
      icon: Building2,
      description: 'All major banks',
      popular: false,
    },
    {
      id: 'wallet' as PaymentMethod,
      label: 'Wallet',
      icon: Wallet,
      description: 'Paytm, Freecharge, etc.',
      popular: false,
    },
  ];

  const predefinedAmounts = [99, 299, 499, 999];

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-background to-green-50 dark:from-gray-900 dark:via-background dark:to-gray-900 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Payment Successful!</h2>
              <p className="text-muted-foreground mt-2">
                Your account has been activated with {tokens.toLocaleString()} tokens
              </p>
            </div>
            <div className="animate-pulse text-sm text-muted-foreground">
              Redirecting to setup...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900 p-4">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="outline" className="mb-2">
            <Sparkles className="w-3 h-3 mr-1" />
            Unlock AI-Powered Finance
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">
            Activate Your Account
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Make a one-time minimum payment to enable AI features and start managing your finances like a pro
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Benefits */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">What You Get</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium">AI Assistant</h4>
                  <p className="text-sm text-muted-foreground">
                    Voice & chat-based financial guidance
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium">Smart Automation</h4>
                  <p className="text-sm text-muted-foreground">
                    Auto-categorize expenses and income
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium">Secure Storage</h4>
                  <p className="text-sm text-muted-foreground">
                    Encrypted data and privacy protection
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    ₹{amount} = {tokens.toLocaleString()} tokens
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    ~{estimatedInteractions} AI interactions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Payment Form */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Choose Payment Method</CardTitle>
              <CardDescription>
                Secure payment powered by industry-standard encryption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Methods */}
              <RadioGroup value={selectedMethod} onValueChange={(value) => setSelectedMethod(value as PaymentMethod)}>
                <div className="grid grid-cols-2 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <div key={method.id} className="relative">
                        <RadioGroupItem
                          value={method.id}
                          id={method.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={method.id}
                          className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-background p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50 dark:peer-data-[state=checked]:bg-blue-950 cursor-pointer"
                        >
                          <Icon className="w-6 h-6 mb-2" />
                          <div className="text-center">
                            <div className="font-medium flex items-center gap-1">
                              {method.label}
                              {method.popular && (
                                <Badge variant="secondary" className="text-xs">Popular</Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {method.description}
                            </div>
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>

              {/* Amount Selection */}
              <div className="space-y-3">
                <Label>Select Amount</Label>
                <div className="grid grid-cols-4 gap-2">
                  {predefinedAmounts.map((amt) => (
                    <Button
                      key={amt}
                      variant={amount === amt ? "default" : "outline"}
                      onClick={() => setAmount(amt)}
                      className={amount === amt ? "bg-gradient-to-r from-blue-600 to-purple-600" : ""}
                    >
                      ₹{amt}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="custom-amount" className="whitespace-nowrap">Custom:</Label>
                  <Input
                    id="custom-amount"
                    type="number"
                    min={minimumPayment}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1"
                  />
                </div>
                {amount < minimumPayment && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Minimum payment is ₹{minimumPayment}
                  </p>
                )}
              </div>

              {/* UPI ID Input (conditional) */}
              {selectedMethod === 'upi' && (
                <div className="space-y-2">
                  <Label htmlFor="upi-id">UPI ID (Optional)</Label>
                  <Input
                    id="upi-id"
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can also scan QR code in the next step
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || amount < minimumPayment}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay ₹{amount}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {onSkipForNow && (
                  <Button
                    variant="ghost"
                    onClick={onSkipForNow}
                    className="w-full"
                    disabled={isProcessing}
                  >
                    Skip for now (Limited features)
                  </Button>
                )}
              </div>

              {/* Security Notice */}
              <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Payments are processed securely. Your card details are encrypted and never stored on our servers.
                  This is a demo - no real charges will be made.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Info */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">₹{minimumPayment}</p>
                <p className="text-sm text-muted-foreground">Minimum to start</p>
              </div>
              <div>
                <p className="text-2xl font-bold">1000</p>
                <p className="text-sm text-muted-foreground">Tokens per ₹1</p>
              </div>
              <div>
                <p className="text-2xl font-bold">~100</p>
                <p className="text-sm text-muted-foreground">Tokens per AI query</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
