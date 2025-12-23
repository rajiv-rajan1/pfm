import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  className?: string;
}

// Mock AI responses based on keywords
const generateAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('expense') && lowerMessage.includes('trend')) {
    return "Based on your last 6 months, your expenses show a slight upward trend of about 8%. The main drivers are increased shopping (+18%) and entertainment (+12%). Consider reviewing discretionary spending to optimize your savings rate.";
  }
  
  if (lowerMessage.includes('add') && (lowerMessage.includes('fd') || lowerMessage.includes('fixed deposit'))) {
    return "I've noted your request to add a Fixed Deposit of ₹1,00,000 for 1 year. At current rates (~7%), you can expect approximately ₹7,000 in interest. Would you like me to add this to your assets and set up a maturity reminder?";
  }

  if (lowerMessage.includes('quarterly') && lowerMessage.includes('p&l')) {
    return "Your quarterly P&L shows improvement! Q4 2024 had a net profit of ₹2,97,000 (up 14% from Q3). This is primarily due to bonus income in November (+₹50,000) and controlled expenses. Your Q4 savings rate improved to 45%.";
  }

  if (lowerMessage.includes('net worth') && lowerMessage.includes('3 years')) {
    return "Based on your current savings rate of 48% and historical investment returns of ~12%, your net worth could grow from ₹74.75L to approximately ₹1.25Cr in 3 years. This assumes you maintain current SIPs and income growth of 8% annually.";
  }

  if (lowerMessage.includes('budget') || lowerMessage.includes('save')) {
    return "Your current savings rate is excellent at 48%. To optimize further, consider: 1) Reviewing entertainment expenses (up 12% recently), 2) Comparing insurance plans for better rates, 3) Increasing SIP contributions by ₹5,000/month as your income grows.";
  }

  if (lowerMessage.includes('goal') || lowerMessage.includes('emergency fund')) {
    return "Your Emergency Fund goal is 50% complete (₹3L out of ₹6L target). At your current monthly contribution of ₹25,000, you'll reach the target by October 2025. Consider redirecting your December bonus to accelerate this by 3 months!";
  }

  if (lowerMessage.includes('investment') || lowerMessage.includes('portfolio')) {
    return "Your investment portfolio is well-diversified: Mutual Funds (12.8% growth), Stocks (18.2% growth), FDs (6.5% growth), and PPF (7.1% growth). Your overall portfolio return is ~11.2%, beating inflation comfortably. Consider rebalancing if equity exceeds 65% of total investments.";
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello! I'm your AI finance assistant. I can help you analyze your spending, track your financial goals, add transactions, and provide insights on your P&L and net worth. What would you like to know?";
  }

  // Default response
  return "I understand you're asking about your finances. I can help you with expense analysis, income tracking, goal progress, investment insights, and financial projections. Could you be more specific about what you'd like to know?";
};

export function AIAssistant({ isOpen, onClose, onMinimize, isMinimized, className }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI finance assistant. I can help you understand your financial health, add transactions, analyze spending patterns, and plan for your goals. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

    // Simulate AI thinking and response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <Button
        onClick={onMinimize}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        <Sparkles className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={cn('flex flex-col shadow-xl', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <CardTitle className="text-white">AI Finance Assistant</CardTitle>
        </div>
        <div className="flex gap-1">
          {onMinimize && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col min-h-0">
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
                      : 'bg-gray-200'
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
                    'rounded-lg px-4 py-2 max-w-[80%]',
                    message.sender === 'ai'
                      ? 'bg-gray-100'
                      : 'bg-blue-600 text-white'
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={cn(
                      'text-xs mt-1',
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
                <div className="rounded-lg px-4 py-2 bg-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your finances..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Try: "Show my expense trend" or "Add a new FD"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
