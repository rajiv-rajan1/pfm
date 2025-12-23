import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, X, Minimize2, Maximize2, Volume2, Keyboard, FileEdit } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { cn } from './ui/utils';
import { Card } from './ui/card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VoiceAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  className?: string;
  onTokenUsage?: (tokens: number) => boolean;
  onSwitchToManual?: () => void;
  defaultMode?: 'voice' | 'text';
}

export function VoiceAIAssistant({
  isOpen,
  onClose,
  onMinimize,
  isMinimized,
  className,
  onTokenUsage,
  onSwitchToManual,
  defaultMode = 'voice',
}: VoiceAIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Finance Assistant. You can speak to me or type your questions. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [showTyping, setShowTyping] = useState(defaultMode === 'text');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);

          // If final result, process it
          if (event.results[current].isFinal) {
            handleVoiceInput(transcriptText);
            setTranscript('');
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }

      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setShowTyping(false); // Hide typing when voice starts
      } catch (error) {
        console.error('Failed to start recognition:', error);
      }
    }
  };

  const handleVoiceInput = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Simulate AI processing (replace with actual API call)
    setTimeout(async () => {
      const response = await generateAIResponse(text);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);

      // Speak the response
      speakText(response);

      // Track token usage (mock: ~100 tokens per interaction)
      if (onTokenUsage) {
        onTokenUsage(100);
      }
    }, 1500);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleVoiceInput(inputText);
      setInputText('');
    }
  };

  const speakText = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel(); // Cancel any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Mock AI response generator (replace with actual AI API)
  const generateAIResponse = async (input: string): Promise<string> => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('income') || lowerInput.includes('salary')) {
      return "I can help you track your income. What's your monthly income source and amount?";
    } else if (lowerInput.includes('expense') || lowerInput.includes('spent')) {
      return "Let me help you log that expense. What did you spend on and how much?";
    } else if (lowerInput.includes('savings') || lowerInput.includes('save')) {
      return "Great question about savings! What's your savings goal and timeline?";
    } else if (lowerInput.includes('budget')) {
      return "I can help you create a budget. What's your monthly income and major expense categories?";
    } else {
      return "I'm here to help with your finances. You can ask me about income, expenses, savings, budgets, or financial goals.";
    }
  };

  if (isMinimized) {
    return (
      <div className={cn('', className)}>
        <Button
          onClick={onMinimize}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
        >
          <Mic className="w-6 h-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn(
      'flex flex-col overflow-hidden border-2',
      'bg-background dark:bg-card',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">AI Finance Assistant</h3>
            <p className="text-xs text-white/80">Voice & Chat Enabled</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isSpeaking && (
            <Button
              variant="ghost"
              size="icon"
              onClick={stopSpeaking}
              className="text-white hover:bg-white/20"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          )}
          {onMinimize && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMinimize}
              className="text-white hover:bg-white/20"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-2',
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-muted dark:bg-muted/50 text-foreground'
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                <Mic className="w-4 h-4 text-white" />
              </div>
              <div className="bg-muted dark:bg-muted/50 rounded-2xl px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Voice Circle - Centered when listening */}
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 dark:bg-background/90 backdrop-blur-sm z-10">
          <div className="text-center space-y-6">
            {/* Animated listening circle */}
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <div className={cn(
                "absolute w-40 h-40 rounded-full",
                "bg-gradient-to-r from-blue-500/30 to-purple-500/30",
                "animate-ping"
              )} />
              
              {/* Middle ring */}
              <div className={cn(
                "absolute w-32 h-32 rounded-full border-4",
                "border-blue-500/50 dark:border-purple-500/50",
                "animate-pulse"
              )} />
              
              {/* Inner animated circle */}
              <div className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center",
                "bg-gradient-to-r from-blue-600 to-purple-600",
                "transition-all duration-300 ease-in-out",
                isListening ? "scale-100" : "scale-90"
              )}>
                <Mic className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium">Listening...</p>
              {transcript && (
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  "{transcript}"
                </p>
              )}
              <Button
                onClick={toggleListening}
                variant="outline"
                className="mt-4"
              >
                <MicOff className="w-4 h-4 mr-2" />
                Stop Listening
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4 space-y-3 bg-background dark:bg-card">
        {/* Toggle between voice and typing */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={!showTyping ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTyping(false)}
            className={cn(!showTyping && "bg-gradient-to-r from-blue-600 to-purple-600")}
          >
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </Button>
          <Button
            variant={showTyping ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setShowTyping(true);
              if (isListening) toggleListening();
            }}
            className={cn(showTyping && "bg-gradient-to-r from-blue-600 to-purple-600")}
          >
            <Keyboard className="w-4 h-4 mr-2" />
            Type
          </Button>
          {onSwitchToManual && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSwitchToManual}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <FileEdit className="w-4 h-4 mr-2" />
              Manual
            </Button>
          )}
        </div>

        {showTyping ? (
          // Typing Input
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isProcessing}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputText.trim() || isProcessing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        ) : (
          // Voice Button
          <Button
            onClick={toggleListening}
            className={cn(
              "w-full h-14 gap-2 transition-all",
              isListening
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            )}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Tap to Speak
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}