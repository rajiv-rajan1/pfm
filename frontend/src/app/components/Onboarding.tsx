import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check, Wallet, TrendingDown, PiggyBank, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AIAssistant } from './AIAssistant';
import { Progress } from './ui/progress';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [useAI, setUseAI] = useState(false);
  const totalSteps = 5;

  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl tracking-tight">Setup Your Financial Profile</h2>
            <span className="text-sm text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 && 'Basic Information'}
                  {step === 2 && 'Income Sources'}
                  {step === 3 && 'Regular Expenses'}
                  {step === 4 && 'Assets'}
                  {step === 5 && 'Liabilities'}
                </CardTitle>
                <CardDescription>
                  {step === 1 && 'Tell us a bit about yourself'}
                  {step === 2 && 'How do you earn money?'}
                  {step === 3 && 'What are your recurring expenses?'}
                  {step === 4 && 'What do you own?'}
                  {step === 5 && 'Any loans or debts?'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name (Optional)</Label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select defaultValue="india">
                          <SelectTrigger id="country">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="india">India</SelectItem>
                            <SelectItem value="usa">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="inr">
                        <SelectTrigger id="currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                          <SelectItem value="usd">US Dollar ($)</SelectItem>
                          <SelectItem value="eur">Euro (€)</SelectItem>
                          <SelectItem value="gbp">British Pound (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {/* Step 2: Income */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <TrendingDown className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-900">
                        Add all your income sources. You can always edit these later.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="salary">Monthly Salary</Label>
                          <Input id="salary" type="number" placeholder="150000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="freelance">Freelance/Business Income</Label>
                          <Input id="freelance" type="number" placeholder="25000" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rental">Rental Income</Label>
                          <Input id="rental" type="number" placeholder="7000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dividends">Investments/Dividends</Label>
                          <Input id="dividends" type="number" placeholder="18000" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="other-income">Other Income</Label>
                        <Input id="other-income" type="number" placeholder="0" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Expenses */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <Wallet className="w-5 h-5 text-orange-600" />
                      <p className="text-sm text-orange-900">
                        Focus on recurring expenses like rent, bills, and subscriptions.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="rent">Rent/Mortgage Payment</Label>
                          <Input id="rent" type="number" placeholder="45000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="utilities">Utilities & Bills</Label>
                          <Input id="utilities" type="number" placeholder="8000" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="groceries">Groceries & Food</Label>
                          <Input id="groceries" type="number" placeholder="18000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="transport">Transportation</Label>
                          <Input id="transport" type="number" placeholder="12000" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="subscriptions">Subscriptions</Label>
                          <Input id="subscriptions" type="number" placeholder="2000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insurance">Insurance Premiums</Label>
                          <Input id="insurance" type="number" placeholder="10000" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Assets */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <PiggyBank className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-green-900">
                        List your bank accounts, investments, property, and other assets.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="savings">Savings Account Balance</Label>
                          <Input id="savings" type="number" placeholder="450000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fd">Fixed Deposits</Label>
                          <Input id="fd" type="number" placeholder="500000" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="mf">Mutual Funds (SIP)</Label>
                          <Input id="mf" type="number" placeholder="1200000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="stocks">Stocks Portfolio</Label>
                          <Input id="stocks" type="number" placeholder="850000" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="property">Real Estate Value</Label>
                          <Input id="property" type="number" placeholder="8500000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="other-assets">Other Assets</Label>
                          <Input id="other-assets" type="number" placeholder="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Liabilities */}
                {step === 5 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                      <CreditCard className="w-5 h-5 text-red-600" />
                      <p className="text-sm text-red-900">
                        Add your loans, credit card debt, and other liabilities.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="home-loan">Home Loan Outstanding</Label>
                          <Input id="home-loan" type="number" placeholder="4500000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="home-emi">Monthly EMI</Label>
                          <Input id="home-emi" type="number" placeholder="45000" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="car-loan">Car Loan Outstanding</Label>
                          <Input id="car-loan" type="number" placeholder="350000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="car-emi">Monthly EMI</Label>
                          <Input id="car-emi" type="number" placeholder="12000" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cc-debt">Credit Card Outstanding</Label>
                          <Input id="cc-debt" type="number" placeholder="85000" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="personal-loan">Personal Loans</Label>
                          <Input id="personal-loan" type="number" placeholder="150000" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={step === 1}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button onClick={handleNext} className="gap-2">
                    {step === totalSteps ? (
                      <>
                        Complete Setup
                        <Check className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Next Step
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Assistant Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <CardDescription>
                  Describe your finances in natural language, and I'll help fill the form
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!useAI ? (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Skip the forms! Tell me about your finances and I'll organize everything for you.
                      </p>
                      <Button onClick={() => setUseAI(true)} className="w-full">
                        Use AI Assistant
                      </Button>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-900">
                        <strong>Example:</strong> "I earn 80k monthly from salary, spend 20k on rent,
                        have a home loan of 45L with 45k EMI, and 12L in mutual funds"
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[500px]">
                    <AIAssistant isOpen={true} className="h-full" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  );
}
