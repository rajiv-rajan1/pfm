import { useState, useRef, useEffect } from 'react';
import { Sparkles, Mic, Send, FileText, CheckCircle2, XCircle, Loader2, User, Bot, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { cn } from './ui/utils';
import { ManualSetupForm } from './ManualSetupForm';
import { TopNav } from './TopNav';

interface OnboardingAIFirstProps {
  onComplete: () => void;
  onBackToWelcome?: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface CapturedData {
  income?: {
    salary?: number;
    freelance?: number;
    rental?: number;
    other?: number;
  };
  expenses?: {
    rent?: number;
    utilities?: number;
    groceries?: number;
    transport?: number;
    other?: number;
  };
  assets?: {
    savings?: number;
    investments?: number;
    property?: number;
  };
  liabilities?: {
    homeLoan?: number;
    carLoan?: number;
    creditCard?: number;
  };
}

export function OnboardingAIFirst({ onComplete, onBackToWelcome }: OnboardingAIFirstProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI finance assistant. 👋\n\nI'll help you set up your financial profile in just a few minutes. You can simply tell me about your income, expenses, savings, and loans in your own words.\n\nFor example, you could say:\n• 'I earn ₹80,000 per month as salary'\n• 'My rent is ₹20,000 and groceries are ₹15,000'\n• 'I have a home loan with ₹45,000 monthly EMI'\n\nLet's start! What would you like to tell me about your finances?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [capturedData, setCapturedData] = useState<CapturedData>({});
  const [currentStage, setCurrentStage] = useState<'income' | 'expenses' | 'assets' | 'liabilities' | 'complete'>('income');
  const [showManualSetup, setShowManualSetup] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestedPrompts = {
    income: [
      "I earn ₹80,000 per month as salary",
      "I have freelance income of ₹25,000",
      "I receive ₹7,000 rental income",
    ],
    expenses: [
      "My rent is ₹20,000 per month",
      "I spend ₹15,000 on groceries",
      "My utilities cost ₹8,000",
    ],
    assets: [
      "I have ₹5 lakhs in savings",
      "My mutual funds are worth ₹12 lakhs",
      "I own property worth ₹85 lakhs",
    ],
    liabilities: [
      "I have a home loan of ₹45 lakhs",
      "My car loan EMI is ₹12,000",
      "No loans or debts",
    ],
  };

  // Parse user input and extract financial data
  const parseUserInput = (text: string): Partial<CapturedData> => {
    const lowerText = text.toLowerCase();
    const parsed: Partial<CapturedData> = {};

    // Extract numbers (supports formats like: 80000, 80,000, 80k, 5L, 1.5Cr)
    const extractNumber = (str: string): number | null => {
      // Match patterns like 80k, 5L, 1.5Cr, 80000, 80,000
      const crMatch = str.match(/(\d+\.?\d*)\s*cr/i);
      if (crMatch) return parseFloat(crMatch[1]) * 10000000;
      
      const lMatch = str.match(/(\d+\.?\d*)\s*l(?:akh)?/i);
      if (lMatch) return parseFloat(lMatch[1]) * 100000;
      
      const kMatch = str.match(/(\d+\.?\d*)\s*k/i);
      if (kMatch) return parseFloat(kMatch[1]) * 1000;
      
      const numMatch = str.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/);
      if (numMatch) return parseFloat(numMatch[1].replace(/,/g, ''));
      
      return null;
    };

    const amount = extractNumber(lowerText);

    // Income patterns
    if (lowerText.includes('salary') || lowerText.includes('earn')) {
      parsed.income = { ...capturedData.income, salary: amount || undefined };
    }
    if (lowerText.includes('freelance') || lowerText.includes('business')) {
      parsed.income = { ...capturedData.income, freelance: amount || undefined };
    }
    if (lowerText.includes('rental') || lowerText.includes('rent income')) {
      parsed.income = { ...capturedData.income, rental: amount || undefined };
    }

    // Expense patterns
    if ((lowerText.includes('rent') || lowerText.includes('emi')) && !lowerText.includes('rental income')) {
      parsed.expenses = { ...capturedData.expenses, rent: amount || undefined };
    }
    if (lowerText.includes('utilities') || lowerText.includes('bills')) {
      parsed.expenses = { ...capturedData.expenses, utilities: amount || undefined };
    }
    if (lowerText.includes('groceries') || lowerText.includes('food')) {
      parsed.expenses = { ...capturedData.expenses, groceries: amount || undefined };
    }
    if (lowerText.includes('transport') || lowerText.includes('travel')) {
      parsed.expenses = { ...capturedData.expenses, transport: amount || undefined };
    }

    // Asset patterns
    if (lowerText.includes('savings') || lowerText.includes('bank')) {
      parsed.assets = { ...capturedData.assets, savings: amount || undefined };
    }
    if (lowerText.includes('mutual fund') || lowerText.includes('sip') || lowerText.includes('investment')) {
      parsed.assets = { ...capturedData.assets, investments: amount || undefined };
    }
    if (lowerText.includes('property') || lowerText.includes('real estate')) {
      parsed.assets = { ...capturedData.assets, property: amount || undefined };
    }

    // Liability patterns
    if (lowerText.includes('home loan') || lowerText.includes('housing loan')) {
      parsed.liabilities = { ...capturedData.liabilities, homeLoan: amount || undefined };
    }
    if (lowerText.includes('car loan') || lowerText.includes('vehicle loan')) {
      parsed.liabilities = { ...capturedData.liabilities, carLoan: amount || undefined };
    }
    if (lowerText.includes('credit card')) {
      parsed.liabilities = { ...capturedData.liabilities, creditCard: amount || undefined };
    }

    return parsed;
  };

  // Generate AI response based on user input and current stage
  const generateAIResponse = (userMessage: string, parsedData: Partial<CapturedData>): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Check if user wants to skip or is done
    if (lowerMessage.includes('no') || lowerMessage.includes('skip') || lowerMessage.includes('done')) {
      // Move to next stage
      if (currentStage === 'income') {
        setCurrentStage('expenses');
        return "Great! Now let's talk about your expenses.\n\nWhat are your regular monthly expenses? You can tell me about rent, utilities, groceries, or any recurring costs.";
      } else if (currentStage === 'expenses') {
        setCurrentStage('assets');
        return "Perfect! Now, let's capture your assets.\n\nDo you have any savings, investments, mutual funds, or property? Tell me what you own.";
      } else if (currentStage === 'assets') {
        setCurrentStage('liabilities');
        return "Excellent! Finally, let's discuss any loans or debts.\n\nDo you have any home loans, car loans, credit card debt, or personal loans?";
      } else if (currentStage === 'liabilities') {
        setCurrentStage('complete');
        return "Perfect! I've captured all your financial information. 🎉\n\nYou're all set! Your financial dashboard is ready. Click 'Complete Setup' to view your personalized P&L and insights.";
      }
    }

    // Acknowledge what was captured
    let response = '';
    
    if (parsedData.income) {
      if (parsedData.income.salary) {
        response += `✅ Got it! Monthly salary: ₹${parsedData.income.salary.toLocaleString('en-IN')}\n\n`;
      }
      if (parsedData.income.freelance) {
        response += `✅ Noted! Freelance income: ₹${parsedData.income.freelance.toLocaleString('en-IN')}\n\n`;
      }
      if (parsedData.income.rental) {
        response += `✅ Added! Rental income: ₹${parsedData.income.rental.toLocaleString('en-IN')}\n\n`;
      }
    }

    if (parsedData.expenses) {
      if (parsedData.expenses.rent) {
        response += `✅ Captured! Monthly rent/EMI: ₹${parsedData.expenses.rent.toLocaleString('en-IN')}\n\n`;
      }
      if (parsedData.expenses.utilities) {
        response += `✅ Noted! Utilities: ₹${parsedData.expenses.utilities.toLocaleString('en-IN')}\n\n`;
      }
      if (parsedData.expenses.groceries) {
        response += `✅ Got it! Groceries: ₹${parsedData.expenses.groceries.toLocaleString('en-IN')}\n\n`;
      }
    }

    if (parsedData.assets) {
      if (parsedData.assets.savings) {
        response += `✅ Excellent! Savings: ₹${parsedData.assets.savings.toLocaleString('en-IN')}\n\n`;
      }
      if (parsedData.assets.investments) {
        response += `✅ Great! Investments: ₹${parsedData.assets.investments.toLocaleString('en-IN')}\n\n`;
      }
    }

    if (parsedData.liabilities) {
      if (parsedData.liabilities.homeLoan) {
        response += `✅ Understood! Home loan: ₹${parsedData.liabilities.homeLoan.toLocaleString('en-IN')}\n\n`;
      }
      if (parsedData.liabilities.carLoan) {
        response += `✅ Added! Car loan: ₹${parsedData.liabilities.carLoan.toLocaleString('en-IN')}\n\n`;
      }
    }

    // Ask follow-up questions
    if (currentStage === 'income') {
      response += "Do you have any other sources of income? (freelance, rental, investments)\n\nOr say 'next' to move on to expenses.";
    } else if (currentStage === 'expenses') {
      response += "Any other regular expenses you'd like to add?\n\nSay 'next' when you're ready to talk about your assets.";
    } else if (currentStage === 'assets') {
      response += "Do you have any other assets or investments?\n\nSay 'next' to move on to liabilities.";
    } else if (currentStage === 'liabilities') {
      response += "Any other loans or debts?\n\nSay 'done' to complete your setup!";
    }

    return response || "I understood that. What else would you like to tell me?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Parse the input
    const parsedData = parseUserInput(inputValue);
    
    // Update captured data
    setCapturedData((prev) => ({
      income: { ...prev.income, ...parsedData.income },
      expenses: { ...prev.expenses, ...parsedData.expenses },
      assets: { ...prev.assets, ...parsedData.assets },
      liabilities: { ...prev.liabilities, ...parsedData.liabilities },
    }));

    // Generate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue, parsedData),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 800);
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCompletionProgress = () => {
    let completed = 0;
    let total = 4;

    if (capturedData.income && Object.keys(capturedData.income).length > 0) completed++;
    if (capturedData.expenses && Object.keys(capturedData.expenses).length > 0) completed++;
    if (capturedData.assets && Object.keys(capturedData.assets).length > 0) completed++;
    if (capturedData.liabilities && Object.keys(capturedData.liabilities).length > 0) completed++;

    return (completed / total) * 100;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNav 
        onHomeClick={onBackToWelcome}
        currentPage="other"
      />
      
      <div className="min-h-[calc(100vh-10rem)] bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl tracking-tight">Set Up Your Finances</h2>
                <p className="text-muted-foreground mt-1">
                  Talk to our AI assistant to get started quickly
                </p>
              </div>
              {/* Manual Setup Button - Improved spacing */}
              <Sheet open={showManualSetup} onOpenChange={setShowManualSetup}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 mr-2">
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Manual Setup</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Manual Setup</SheetTitle>
                  </SheetHeader>
                  <ManualSetupForm onComplete={onComplete} />
                </SheetContent>
              </Sheet>
            </div>
            <Progress value={getCompletionProgress()} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round(getCompletionProgress())}% complete
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main AI Chat - Takes center stage */}
            <div className="lg:col-span-2 order-1">
              <Card className="h-[calc(100vh-220px)] flex flex-col">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white dark:from-blue-700 dark:to-purple-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-white">AI Finance Assistant</CardTitle>
                      <p className="text-xs text-white/80">
                        Speak naturally - I'll understand
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 p-0 flex flex-col min-h-0">
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn(
                            'flex gap-3',
                            message.sender === 'user' && 'flex-row-reverse'
                          )}
                        >
                          <div
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                              message.sender === 'ai'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                : 'bg-muted'
                            )}
                          >
                            {message.sender === 'ai' ? (
                              <Bot className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                          </div>
                          <div
                            className={cn(
                              'rounded-lg px-4 py-3 max-w-[85%]',
                              message.sender === 'ai'
                                ? 'bg-muted'
                                : 'bg-blue-600 text-white dark:bg-blue-700'
                            )}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-line">
                              {message.text}
                            </p>
                            <p
                              className={cn(
                                'text-xs mt-2',
                                message.sender === 'ai'
                                  ? 'text-muted-foreground'
                                  : 'text-blue-100'
                              )}
                            >
                              {message.timestamp.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="rounded-lg px-4 py-3 bg-muted">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Suggested Prompts */}
                  {!isTyping && messages.length > 1 && (
                    <div className="px-4 pb-2">
                      <p className="text-xs text-muted-foreground mb-2">Suggested:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedPrompts[currentStage]?.map((prompt, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePromptClick(prompt)}
                            className="text-xs h-auto py-1.5"
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Area */}
                  <div className="p-4 border-t bg-background dark:bg-card">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        title="Voice input (coming soon)"
                      >
                        <Mic className="w-4 h-4" />
                      </Button>
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message or use voice..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        size="icon"
                        disabled={!inputValue.trim()}
                        className="shrink-0"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Press Enter to send • Shift+Enter for new line
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Captured Data Summary - Right side */}
            <div className="lg:col-span-1 order-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Captured Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Income */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Income</h4>
                      {capturedData.income && Object.keys(capturedData.income).length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    {capturedData.income && Object.entries(capturedData.income).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex justify-between text-sm py-1">
                          <span className="text-muted-foreground capitalize">{key}:</span>
                          <span>₹{value.toLocaleString('en-IN')}</span>
                        </div>
                      )
                    ))}
                    {(!capturedData.income || Object.keys(capturedData.income).length === 0) && (
                      <p className="text-xs text-muted-foreground">Not yet captured</p>
                    )}
                  </div>

                  {/* Expenses */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Expenses</h4>
                      {capturedData.expenses && Object.keys(capturedData.expenses).length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    {capturedData.expenses && Object.entries(capturedData.expenses).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex justify-between text-sm py-1">
                          <span className="text-muted-foreground capitalize">{key}:</span>
                          <span>₹{value.toLocaleString('en-IN')}</span>
                        </div>
                      )
                    ))}
                    {(!capturedData.expenses || Object.keys(capturedData.expenses).length === 0) && (
                      <p className="text-xs text-muted-foreground">Not yet captured</p>
                    )}
                  </div>

                  {/* Assets */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Assets</h4>
                      {capturedData.assets && Object.keys(capturedData.assets).length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    {capturedData.assets && Object.entries(capturedData.assets).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex justify-between text-sm py-1">
                          <span className="text-muted-foreground capitalize">{key}:</span>
                          <span>₹{value.toLocaleString('en-IN')}</span>
                        </div>
                      )
                    ))}
                    {(!capturedData.assets || Object.keys(capturedData.assets).length === 0) && (
                      <p className="text-xs text-muted-foreground">Not yet captured</p>
                    )}
                  </div>

                  {/* Liabilities */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">Liabilities</h4>
                      {capturedData.liabilities && Object.keys(capturedData.liabilities).length > 0 ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Badge variant="outline" className="text-xs">None</Badge>
                      )}
                    </div>
                    {capturedData.liabilities && Object.entries(capturedData.liabilities).map(([key, value]) => (
                      value && (
                        <div key={key} className="flex justify-between text-sm py-1">
                          <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                          <span>₹{value.toLocaleString('en-IN')}</span>
                        </div>
                      )
                    ))}
                  </div>

                  {currentStage === 'complete' && (
                    <Button onClick={onComplete} className="w-full gap-2" size="lg">
                      <CheckCircle2 className="w-5 h-5" />
                      Complete Setup
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Tips Card */}
              <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Tips for Better Results
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Be specific with amounts</li>
                        <li>• Mention frequency (monthly/yearly)</li>
                        <li>• You can edit everything later</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}