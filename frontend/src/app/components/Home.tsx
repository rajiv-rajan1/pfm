import { useState } from 'react';
import { Sparkles, FileEdit, TrendingUp, Mic, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { VoiceAIAssistant } from './VoiceAIAssistant';
import { cn } from './ui/utils';

interface HomeProps {
  onManualEntry: () => void;
  onDashboardClick?: () => void;
  onTokenUsage: (tokens: number) => boolean;
  aiQuotaRemaining: number;
  hasUnlimitedAI: boolean;
}

export function Home({ onManualEntry, onDashboardClick, onTokenUsage, aiQuotaRemaining, hasUnlimitedAI }: HomeProps) {
  const [aiMode, setAiMode] = useState<'voice' | 'text' | null>(null);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-gray-900 dark:via-background dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 mb-4">
              <TrendingUp className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                2t1
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Manage your personal finances like a CFO. Choose how you want to get started.
            </p>
          </div>

          {/* Mode Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Mode */}
            <Card className="border-2 border-blue-200 dark:border-blue-900 hover:border-blue-400 dark:hover:border-blue-700 transition-all cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <CardTitle>AI Assistant</CardTitle>
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">Recommended</Badge>
                </div>
                <CardDescription>
                  Talk or type naturally. Your AI assistant will set up everything for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Mic className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Voice-first conversational setup</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Natural language data entry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <span>Smart insights and recommendations</span>
                  </li>
                </ul>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setAiMode('voice')}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Mic className="w-4 h-4 mr-2" />
                    Voice Mode
                  </Button>
                  <Button
                    onClick={() => setAiMode('text')}
                    variant="outline"
                    className="flex-1"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Text Mode
                  </Button>
                </div>

                {!hasUnlimitedAI && (
                  <p className="text-xs text-center text-muted-foreground">
                    {Math.floor(aiQuotaRemaining / 100)} interactions remaining today
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Manual Mode */}
            <Card className="border-2 border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-all cursor-pointer group">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center mb-3">
                  <FileEdit className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Manual Entry</CardTitle>
                <CardDescription>
                  Prefer forms and direct input? Enter your data manually with full control.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <FileEdit className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>Traditional form-based input</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileEdit className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>Detailed category management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileEdit className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>Full customization and control</span>
                  </li>
                </ul>

                <div className="flex gap-2">
                  <Button
                    onClick={onManualEntry}
                    variant="outline"
                    className="flex-1 group-hover:bg-gray-100 dark:group-hover:bg-gray-800"
                  >
                    Start Manual Entry
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  {onDashboardClick && (
                    <Button
                      onClick={onDashboardClick}
                      variant="outline"
                      className="flex-1 group-hover:bg-gray-100 dark:group-hover:bg-gray-800"
                    >
                      Go to Dashboard
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Preview */}
          <div className="text-center pt-8">
            <p className="text-sm text-muted-foreground">
              Both modes give you full access to:
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                Dashboard
              </Badge>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                Reports
              </Badge>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                Goals
              </Badge>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="w-3 h-3" />
                Analytics
              </Badge>
            </div>
          </div>
        </div>

        {/* AI Assistant Modal/Popup */}
        {aiMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl h-[600px] bg-background rounded-lg shadow-2xl relative">
              <VoiceAIAssistant
                isOpen={true}
                onClose={() => setAiMode(null)}
                onMinimize={() => setAiMode(null)}
                isMinimized={false}
                className="h-full rounded-lg"
                onTokenUsage={onTokenUsage}
                onSwitchToManual={onManualEntry}
                defaultMode={aiMode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
