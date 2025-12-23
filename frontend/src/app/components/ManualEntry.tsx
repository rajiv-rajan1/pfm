import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface ManualEntryProps {
  onComplete: () => void;
  onBack: () => void;
}

interface IncomeSource {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
}

interface Expense {
  id: string;
  category: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
}

interface Asset {
  id: string;
  name: string;
  value: number;
  type: string;
}

interface Liability {
  id: string;
  name: string;
  amount: number;
  type: string;
}

export function ManualEntry({ onComplete, onBack }: ManualEntryProps) {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([
    { id: '1', name: '', amount: 0, frequency: 'monthly' },
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', category: '', amount: 0, frequency: 'monthly' },
  ]);
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: '', value: 0, type: 'savings' },
  ]);
  const [liabilities, setLiabilities] = useState<Liability[]>([
    { id: '1', name: '', amount: 0, type: 'loan' },
  ]);
  const [currentTab, setCurrentTab] = useState('income');

  const addIncomeSource = () => {
    setIncomeSources([
      ...incomeSources,
      { id: Date.now().toString(), name: '', amount: 0, frequency: 'monthly' },
    ]);
  };

  const removeIncomeSource = (id: string) => {
    setIncomeSources(incomeSources.filter((source) => source.id !== id));
  };

  const updateIncomeSource = (id: string, field: keyof IncomeSource, value: any) => {
    setIncomeSources(
      incomeSources.map((source) =>
        source.id === id ? { ...source, [field]: value } : source
      )
    );
  };

  const addExpense = () => {
    setExpenses([
      ...expenses,
      { id: Date.now().toString(), category: '', amount: 0, frequency: 'monthly' },
    ]);
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const updateExpense = (id: string, field: keyof Expense, value: any) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    );
  };

  const addAsset = () => {
    setAssets([
      ...assets,
      { id: Date.now().toString(), name: '', value: 0, type: 'savings' },
    ]);
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter((asset) => asset.id !== id));
  };

  const updateAsset = (id: string, field: keyof Asset, value: any) => {
    setAssets(
      assets.map((asset) =>
        asset.id === id ? { ...asset, [field]: value } : asset
      )
    );
  };

  const addLiability = () => {
    setLiabilities([
      ...liabilities,
      { id: Date.now().toString(), name: '', amount: 0, type: 'loan' },
    ]);
  };

  const removeLiability = (id: string) => {
    setLiabilities(liabilities.filter((liability) => liability.id !== id));
  };

  const updateLiability = (id: string, field: keyof Liability, value: any) => {
    setLiabilities(
      liabilities.map((liability) =>
        liability.id === id ? { ...liability, [field]: value } : liability
      )
    );
  };

  const handleSave = () => {
    // Save all data to localStorage or backend
    const financialData = {
      income: incomeSources.filter((s) => s.name && s.amount > 0),
      expenses: expenses.filter((e) => e.category && e.amount > 0),
      assets: assets.filter((a) => a.name && a.value > 0),
      liabilities: liabilities.filter((l) => l.name && l.amount > 0),
    };
    
    localStorage.setItem('manual_financial_data', JSON.stringify(financialData));
    onComplete();
  };

  const expenseCategories = [
    'Rent', 'Food & Dining', 'Transportation', 'Utilities', 
    'Entertainment', 'Shopping', 'Healthcare', 'Education', 'Others'
  ];

  const assetTypes = ['Savings', 'Investment', 'Property', 'Vehicle', 'Other'];
  const liabilityTypes = ['Loan', 'Credit Card', 'Mortgage', 'Other'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Manual Data Entry</h1>
                <p className="text-sm text-muted-foreground">
                  Fill in your financial information step by step
                </p>
              </div>
            </div>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save & Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="income">
                Income
                <Badge variant="secondary" className="ml-2">
                  {incomeSources.filter((s) => s.name && s.amount > 0).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="expenses">
                Expenses
                <Badge variant="secondary" className="ml-2">
                  {expenses.filter((e) => e.category && e.amount > 0).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="assets">
                Assets
                <Badge variant="secondary" className="ml-2">
                  {assets.filter((a) => a.name && a.value > 0).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="liabilities">
                Liabilities
                <Badge variant="secondary" className="ml-2">
                  {liabilities.filter((l) => l.name && l.amount > 0).length}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {/* Income Tab */}
            <TabsContent value="income" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income Sources</CardTitle>
                  <CardDescription>
                    Add all your income sources including salary, freelance, investments, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {incomeSources.map((source, index) => (
                    <div key={source.id} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Source Name</Label>
                        <Input
                          placeholder="e.g., Salary, Freelance"
                          value={source.name}
                          onChange={(e) =>
                            updateIncomeSource(source.id, 'name', e.target.value)
                          }
                        />
                      </div>
                      <div className="w-40 space-y-2">
                        <Label>Amount (₹)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={source.amount || ''}
                          onChange={(e) =>
                            updateIncomeSource(source.id, 'amount', parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label>Frequency</Label>
                        <Select
                          value={source.frequency}
                          onValueChange={(value) =>
                            updateIncomeSource(source.id, 'frequency', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {incomeSources.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIncomeSource(source.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addIncomeSource} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Income Source
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Expenses Tab */}
            <TabsContent value="expenses" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Expenses</CardTitle>
                  <CardDescription>
                    Track your regular expenses by category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expenses.map((expense) => (
                    <div key={expense.id} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={expense.category}
                          onValueChange={(value) =>
                            updateExpense(expense.id, 'category', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseCategories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-40 space-y-2">
                        <Label>Amount (₹)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={expense.amount || ''}
                          onChange={(e) =>
                            updateExpense(expense.id, 'amount', parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label>Frequency</Label>
                        <Select
                          value={expense.frequency}
                          onValueChange={(value) =>
                            updateExpense(expense.id, 'frequency', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {expenses.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExpense(expense.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addExpense} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assets Tab */}
            <TabsContent value="assets" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assets</CardTitle>
                  <CardDescription>
                    List your assets including savings, investments, property, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assets.map((asset) => (
                    <div key={asset.id} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Asset Name</Label>
                        <Input
                          placeholder="e.g., Bank Savings, Mutual Funds"
                          value={asset.name}
                          onChange={(e) =>
                            updateAsset(asset.id, 'name', e.target.value)
                          }
                        />
                      </div>
                      <div className="w-40 space-y-2">
                        <Label>Value (₹)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={asset.value || ''}
                          onChange={(e) =>
                            updateAsset(asset.id, 'value', parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={asset.type}
                          onValueChange={(value) =>
                            updateAsset(asset.id, 'type', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {assetTypes.map((type) => (
                              <SelectItem key={type} value={type.toLowerCase()}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {assets.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAsset(asset.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addAsset} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Liabilities Tab */}
            <TabsContent value="liabilities" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Liabilities</CardTitle>
                  <CardDescription>
                    Track your debts including loans, credit cards, mortgages, etc.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {liabilities.map((liability) => (
                    <div key={liability.id} className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label>Liability Name</Label>
                        <Input
                          placeholder="e.g., Personal Loan, Credit Card"
                          value={liability.name}
                          onChange={(e) =>
                            updateLiability(liability.id, 'name', e.target.value)
                          }
                        />
                      </div>
                      <div className="w-40 space-y-2">
                        <Label>Amount (₹)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={liability.amount || ''}
                          onChange={(e) =>
                            updateLiability(liability.id, 'amount', parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="w-32 space-y-2">
                        <Label>Type</Label>
                        <Select
                          value={liability.type}
                          onValueChange={(value) =>
                            updateLiability(liability.id, 'type', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {liabilityTypes.map((type) => (
                              <SelectItem key={type} value={type.toLowerCase()}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {liabilities.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLiability(liability.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" onClick={addLiability} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Liability
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Bottom Action */}
          <div className="mt-8 flex justify-between items-center p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Ready to see your dashboard?</p>
              <p className="text-sm text-muted-foreground">
                Click "Save & Continue" to view your financial overview
              </p>
            </div>
            <Button
              onClick={handleSave}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save & Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
