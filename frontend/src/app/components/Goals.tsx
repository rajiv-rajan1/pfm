import { Target, TrendingUp, Calendar, Plus, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockGoals, type Goal } from '../data/mockData';
import { cn } from './ui/utils';

export function Goals() {
  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const getGoalProgress = (goal: Goal) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const getMonthsToGoal = (goal: Goal) => {
    const deadline = new Date(goal.deadline);
    const now = new Date();
    const months = Math.round((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months;
  };

  const getProjectedCompletion = (goal: Goal) => {
    if (!goal.monthlyContribution) return null;
    const remaining = goal.targetAmount - goal.currentAmount;
    const months = Math.ceil(remaining / goal.monthlyContribution);
    return months;
  };

  const getCategoryColor = (category: Goal['category']) => {
    const colors = {
      emergency: 'bg-red-100 text-red-700',
      retirement: 'bg-purple-100 text-purple-700',
      purchase: 'bg-blue-100 text-blue-700',
      investment: 'bg-green-100 text-green-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[category];
  };

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'emergency':
        return '🚨';
      case 'retirement':
        return '🏖️';
      case 'purchase':
        return '🚗';
      case 'investment':
        return '📈';
      default:
        return '🎯';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl tracking-tight">Financial Goals</h2>
          <p className="text-muted-foreground">
            Track your progress towards your financial milestones
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add New Goal
        </Button>
      </div>

      {/* Goals Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{mockGoals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {formatCurrency(mockGoals.reduce((sum, g) => sum + g.targetAmount, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Saved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">
              {formatCurrency(mockGoals.reduce((sum, g) => sum + g.currentAmount, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              {(
                mockGoals.reduce((sum, g) => sum + getGoalProgress(g), 0) / mockGoals.length
              ).toFixed(0)}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Individual Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockGoals.map((goal) => {
          const progress = getGoalProgress(goal);
          const monthsRemaining = getMonthsToGoal(goal);
          const projectedMonths = getProjectedCompletion(goal);
          const isOnTrack = projectedMonths ? projectedMonths <= monthsRemaining : false;

          return (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{getCategoryIcon(goal.category)}</div>
                    <div>
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <Badge variant="outline" className={cn('mt-1', getCategoryColor(goal.category))}>
                        {goal.category}
                      </Badge>
                    </div>
                  </div>
                  {progress >= 100 && (
                    <Trophy className="w-6 h-6 text-yellow-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current</p>
                    <p className="font-medium">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Target</p>
                    <p className="font-medium">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Monthly Contribution</p>
                    <p className="font-medium">
                      {goal.monthlyContribution
                        ? formatCurrency(goal.monthlyContribution)
                        : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                    <p className="font-medium">
                      {new Date(goal.deadline).toLocaleDateString('en-IN', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{monthsRemaining} months remaining</span>
                    </div>
                    {projectedMonths && (
                      <div
                        className={cn(
                          'flex items-center gap-1 font-medium',
                          isOnTrack ? 'text-green-600' : 'text-orange-600'
                        )}
                      >
                        <TrendingUp className="w-4 h-4" />
                        <span>
                          {isOnTrack ? 'On track' : `${projectedMonths - monthsRemaining} months behind`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {projectedMonths && !isOnTrack && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-xs text-orange-800">
                      <strong>Suggestion:</strong> Increase monthly contribution to{' '}
                      {formatCurrency(
                        Math.ceil(
                          (goal.targetAmount - goal.currentAmount) / monthsRemaining
                        )
                      )}{' '}
                      to meet your deadline
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gamification Section */}
      <Card>
        <CardHeader>
          <CardTitle>Your Financial Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                🏆
              </div>
              <div>
                <p className="font-medium">Consistent Saver</p>
                <p className="text-sm text-muted-foreground">
                  6 months streak of meeting savings goals
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl">
                💎
              </div>
              <div>
                <p className="font-medium">Investment Pro</p>
                <p className="text-sm text-muted-foreground">
                  Portfolio returns above 12% annually
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                🎯
              </div>
              <div>
                <p className="font-medium">Goal Crusher</p>
                <p className="text-sm text-muted-foreground">
                  On track to complete all goals
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What-if Projection */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium mb-2">📊 3-Year Projection</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Based on your current savings rate and investment returns:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Projected Net Worth</p>
                  <p className="text-xl font-medium text-blue-700">₹1.25Cr</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Savings</p>
                  <p className="text-xl font-medium text-blue-700">₹32L</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Investment Growth</p>
                  <p className="text-xl font-medium text-blue-700">₹18L</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              * Projection assumes 48% savings rate, 12% investment returns, and 8% income growth
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
