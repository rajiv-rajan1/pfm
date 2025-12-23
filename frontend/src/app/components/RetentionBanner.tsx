import { useState } from 'react';
import { AlertCircle, X, Shield, Sparkles, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { cn } from './ui/utils';

interface RetentionBannerProps {
  daysRemaining: number;
  isUrgent: boolean;
  onActivate: () => void;
  className?: string;
}

export function RetentionBanner({ 
  daysRemaining, 
  isUrgent, 
  onActivate,
  className 
}: RetentionBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const getMessage = () => {
    if (daysRemaining <= 3) {
      return `Your data will be deleted in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}. Activate now to keep your financial history.`;
    } else if (daysRemaining <= 7) {
      return `${daysRemaining} days left in your trial. Activate your account to retain your data beyond the trial period.`;
    } else if (daysRemaining <= 15) {
      return `Your data will be retained for ${daysRemaining} more days. Activate to keep your data permanently.`;
    } else {
      return `Your data will be retained for one month. To keep your data beyond that, please activate your account.`;
    }
  };

  const getBannerStyle = () => {
    if (isUrgent) {
      return 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950';
    } else if (daysRemaining <= 15) {
      return 'border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950';
    } else {
      return 'border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950';
    }
  };

  const getIconColor = () => {
    if (isUrgent) return 'text-red-600 dark:text-red-400';
    if (daysRemaining <= 15) return 'text-orange-600 dark:text-orange-400';
    return 'text-blue-600 dark:text-blue-400';
  };

  const getTextColor = () => {
    if (isUrgent) return 'text-red-900 dark:text-red-100';
    if (daysRemaining <= 15) return 'text-orange-900 dark:text-orange-100';
    return 'text-blue-900 dark:text-blue-100';
  };

  return (
    <Alert className={cn(getBannerStyle(), 'border-2 relative', className)}>
      <div className="flex items-start gap-3">
        {isUrgent ? (
          <AlertCircle className={cn('w-5 h-5 flex-shrink-0 mt-0.5', getIconColor())} />
        ) : (
          <Clock className={cn('w-5 h-5 flex-shrink-0 mt-0.5', getIconColor())} />
        )}
        
        <div className="flex-1">
          <AlertDescription className={cn('font-medium', getTextColor())}>
            {getMessage()}
          </AlertDescription>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              onClick={onActivate}
              size="sm"
              className={cn(
                'h-8',
                isUrgent 
                  ? 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              )}
            >
              <Shield className="w-3 h-3 mr-1.5" />
              Activate Now
            </Button>
            
            {!isUrgent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDismissed(true)}
                className={cn('h-8', getTextColor())}
              >
                Remind Me Later
              </Button>
            )}
          </div>
        </div>

        {!isUrgent && (
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-6 w-6 flex-shrink-0', getTextColor())}
            onClick={() => setIsDismissed(true)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
}

interface AIQuotaBannerProps {
  quotaRemaining: number;
  quotaLimit: number;
  onRecharge: () => void;
  onUpgrade: () => void;
  className?: string;
}

export function AIQuotaBanner({
  quotaRemaining,
  quotaLimit,
  onRecharge,
  onUpgrade,
  className,
}: AIQuotaBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const percentage = (quotaRemaining / quotaLimit) * 100;
  const interactionsRemaining = Math.floor(quotaRemaining / 100);

  // Don't show if plenty of quota remains
  if (percentage > 20 || isDismissed) return null;

  const getMessage = () => {
    if (quotaRemaining === 0) {
      return 'Daily AI quota reached. Recharge to continue or wait for tomorrow\'s reset.';
    } else if (interactionsRemaining <= 5) {
      return `Only ${interactionsRemaining} AI interaction${interactionsRemaining !== 1 ? 's' : ''} remaining today. Upgrade for unlimited access.`;
    } else {
      return `${quotaRemaining.toLocaleString()} tokens remaining today. Consider upgrading for unlimited AI access.`;
    }
  };

  return (
    <Alert className={cn(
      'border-2',
      quotaRemaining === 0
        ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950'
        : 'border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950',
      className
    )}>
      <div className="flex items-start gap-3">
        <Sparkles className={cn(
          'w-5 h-5 flex-shrink-0 mt-0.5',
          quotaRemaining === 0 
            ? 'text-red-600 dark:text-red-400' 
            : 'text-yellow-600 dark:text-yellow-400'
        )} />
        
        <div className="flex-1">
          <AlertDescription className={cn(
            'font-medium',
            quotaRemaining === 0
              ? 'text-red-900 dark:text-red-100'
              : 'text-yellow-900 dark:text-yellow-100'
          )}>
            {getMessage()}
          </AlertDescription>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {quotaRemaining === 0 ? (
              <>
                <Button
                  onClick={onRecharge}
                  size="sm"
                  className="h-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Sparkles className="w-3 h-3 mr-1.5" />
                  Recharge Now
                </Button>
                <Button
                  onClick={onUpgrade}
                  variant="outline"
                  size="sm"
                  className="h-8"
                >
                  Upgrade to Unlimited
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onUpgrade}
                  size="sm"
                  className="h-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Shield className="w-3 h-3 mr-1.5" />
                  Upgrade Now
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDismissed(true)}
                  className="h-8 text-yellow-900 dark:text-yellow-100"
                >
                  Dismiss
                </Button>
              </>
            )}
          </div>
        </div>

        {quotaRemaining > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0 text-yellow-900 dark:text-yellow-100"
            onClick={() => setIsDismissed(true)}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
}

interface MockDataBannerProps {
  onUpdateData: () => void;
  className?: string;
}

export function MockDataBanner({ onUpdateData, className }: MockDataBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <Alert className={cn(
      'border-2 border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950',
      className
    )}>
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-purple-600 dark:text-purple-400" />
        
        <div className="flex-1">
          <AlertDescription className="font-medium text-purple-900 dark:text-purple-100">
            You're viewing sample data. Start adding your real financial information to get personalized insights.
          </AlertDescription>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              onClick={onUpdateData}
              size="sm"
              className="h-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Update with My Data
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="h-8 text-purple-900 dark:text-purple-100"
            >
              I'll Do It Later
            </Button>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0 text-purple-900 dark:text-purple-100"
          onClick={() => setIsDismissed(true)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Alert>
  );
}
