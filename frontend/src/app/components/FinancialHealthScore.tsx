import { Activity, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Progress } from './ui/progress';
import { cn } from './ui/utils';

export function FinancialHealthScore() {
  // Calculate various financial health metrics
  const metrics = {
    savingsRate: 48, // % of income saved
    debtToIncome: 28, // % of income going to debt
    emergencyFund: 3, // months of expenses covered
    investmentDiversity: 75, // diversification score
    creditUtilization: 15, // % of available credit used
  };

  // Calculate overall health score (0-100)
  const calculateHealthScore = () => {
    let score = 0;
    
    // Savings rate (max 25 points)
    score += Math.min((metrics.savingsRate / 50) * 25, 25);
    
    // Debt to income (max 25 points, inverse)
    score += Math.max(25 - (metrics.debtToIncome / 40) * 25, 0);
    
    // Emergency fund (max 20 points)
    score += Math.min((metrics.emergencyFund / 6) * 20, 20);
    
    // Investment diversity (max 15 points)
    score += (metrics.investmentDiversity / 100) * 15;
    
    // Credit utilization (max 15 points, inverse)
    score += Math.max(15 - (metrics.creditUtilization / 100) * 15, 0);
    
    return Math.round(score);
  };

  const healthScore = calculateHealthScore();

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-600' };
    if (score >= 60) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-600' };
    if (score >= 40) return { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-600' };
    return { label: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-600' };
  };

  const scoreLevel = getScoreLevel(healthScore);

  const getMetricStatus = (metric: string, value: number) => {
    switch (metric) {
      case 'savingsRate':
        if (value >= 30) return { icon: CheckCircle, color: 'text-green-600', status: 'Excellent' };
        if (value >= 20) return { icon: TrendingUp, color: 'text-blue-600', status: 'Good' };
        return { icon: AlertCircle, color: 'text-yellow-600', status: 'Low' };
      
      case 'debtToIncome':
        if (value <= 20) return { icon: CheckCircle, color: 'text-green-600', status: 'Excellent' };
        if (value <= 35) return { icon: TrendingUp, color: 'text-blue-600', status: 'Good' };
        return { icon: AlertCircle, color: 'text-red-600', status: 'High' };
      
      case 'emergencyFund':
        if (value >= 6) return { icon: CheckCircle, color: 'text-green-600', status: 'Excellent' };
        if (value >= 3) return { icon: TrendingUp, color: 'text-blue-600', status: 'Good' };
        return { icon: AlertCircle, color: 'text-yellow-600', status: 'Low' };
      
      case 'investmentDiversity':
        if (value >= 70) return { icon: CheckCircle, color: 'text-green-600', status: 'Well Diversified' };
        if (value >= 50) return { icon: TrendingUp, color: 'text-blue-600', status: 'Moderate' };
        return { icon: AlertCircle, color: 'text-yellow-600', status: 'Concentrated' };
      
      case 'creditUtilization':
        if (value <= 30) return { icon: CheckCircle, color: 'text-green-600', status: 'Excellent' };
        if (value <= 50) return { icon: TrendingUp, color: 'text-blue-600', status: 'Good' };
        return { icon: AlertCircle, color: 'text-red-600', status: 'High' };
      
      default:
        return { icon: Activity, color: 'text-gray-600', status: 'N/A' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          <CardTitle>Financial Health Score</CardTitle>
        </div>
        <CardDescription>
          AI-powered analysis of your overall financial wellness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <svg className="w-40 h-40" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(healthScore / 100) * 440} 440`}
                transform="rotate(-90 80 80)"
                className={scoreLevel.color}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={cn('text-4xl', scoreLevel.color)}>{healthScore}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
          </div>
          <div>
            <div className={cn('font-semibold text-lg', scoreLevel.color)}>
              {scoreLevel.label}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Your financial health is {scoreLevel.label.toLowerCase()}. Keep up the great work!
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-medium">Key Metrics Breakdown</h4>
          
          {/* Savings Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getMetricStatus('savingsRate', metrics.savingsRate);
                  const Icon = status.icon;
                  return (
                    <>
                      <Icon className={cn('w-4 h-4', status.color)} />
                      <span className="text-sm">Savings Rate</span>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{metrics.savingsRate}%</span>
                <span className={cn('text-xs', getMetricStatus('savingsRate', metrics.savingsRate).color)}>
                  {getMetricStatus('savingsRate', metrics.savingsRate).status}
                </span>
              </div>
            </div>
            <Progress value={metrics.savingsRate} className="h-2" />
          </div>

          {/* Debt to Income */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getMetricStatus('debtToIncome', metrics.debtToIncome);
                  const Icon = status.icon;
                  return (
                    <>
                      <Icon className={cn('w-4 h-4', status.color)} />
                      <span className="text-sm">Debt-to-Income Ratio</span>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{metrics.debtToIncome}%</span>
                <span className={cn('text-xs', getMetricStatus('debtToIncome', metrics.debtToIncome).color)}>
                  {getMetricStatus('debtToIncome', metrics.debtToIncome).status}
                </span>
              </div>
            </div>
            <Progress value={Math.min((metrics.debtToIncome / 50) * 100, 100)} className="h-2" />
          </div>

          {/* Emergency Fund */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getMetricStatus('emergencyFund', metrics.emergencyFund);
                  const Icon = status.icon;
                  return (
                    <>
                      <Icon className={cn('w-4 h-4', status.color)} />
                      <span className="text-sm">Emergency Fund</span>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{metrics.emergencyFund} months</span>
                <span className={cn('text-xs', getMetricStatus('emergencyFund', metrics.emergencyFund).color)}>
                  {getMetricStatus('emergencyFund', metrics.emergencyFund).status}
                </span>
              </div>
            </div>
            <Progress value={(metrics.emergencyFund / 6) * 100} className="h-2" />
          </div>

          {/* Investment Diversity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getMetricStatus('investmentDiversity', metrics.investmentDiversity);
                  const Icon = status.icon;
                  return (
                    <>
                      <Icon className={cn('w-4 h-4', status.color)} />
                      <span className="text-sm">Portfolio Diversification</span>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{metrics.investmentDiversity}%</span>
                <span className={cn('text-xs', getMetricStatus('investmentDiversity', metrics.investmentDiversity).color)}>
                  {getMetricStatus('investmentDiversity', metrics.investmentDiversity).status}
                </span>
              </div>
            </div>
            <Progress value={metrics.investmentDiversity} className="h-2" />
          </div>

          {/* Credit Utilization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const status = getMetricStatus('creditUtilization', metrics.creditUtilization);
                  const Icon = status.icon;
                  return (
                    <>
                      <Icon className={cn('w-4 h-4', status.color)} />
                      <span className="text-sm">Credit Utilization</span>
                    </>
                  );
                })()}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{metrics.creditUtilization}%</span>
                <span className={cn('text-xs', getMetricStatus('creditUtilization', metrics.creditUtilization).color)}>
                  {getMetricStatus('creditUtilization', metrics.creditUtilization).status}
                </span>
              </div>
            </div>
            <Progress value={metrics.creditUtilization} className="h-2" />
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            AI Insights & Recommendations
          </h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex gap-2">
              <span>•</span>
              <span>Your savings rate of 48% is outstanding! You're saving nearly half your income.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Consider increasing your emergency fund from 3 to 6 months for better security.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Your debt-to-income ratio is healthy at 28%. Keep it below 35%.</span>
            </li>
            <li className="flex gap-2">
              <span>•</span>
              <span>Your credit utilization is excellent at 15%. Maintain below 30% for optimal credit health.</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
