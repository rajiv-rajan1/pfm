import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { cn } from './ui/utils';

interface DayData {
  date: string;
  amount: number;
  intensity: number; // 0-4 scale
}

export function SpendingHeatmap() {
  // Generate mock data for the last 12 weeks
  const generateHeatmapData = (): DayData[] => {
    const data: DayData[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 84); // 12 weeks back

    for (let i = 0; i < 84; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Weekend and weekday spending patterns
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseAmount = isWeekend ? Math.random() * 5000 + 2000 : Math.random() * 3000 + 1000;
      
      // Some random spikes (big spending days)
      const isSpike = Math.random() > 0.9;
      const amount = isSpike ? baseAmount * 3 : baseAmount;
      
      // Intensity based on amount (0-4 scale)
      let intensity = 0;
      if (amount > 10000) intensity = 4;
      else if (amount > 7000) intensity = 3;
      else if (amount > 4000) intensity = 2;
      else if (amount > 2000) intensity = 1;
      
      data.push({
        date: date.toISOString().split('T')[0],
        amount: Math.round(amount),
        intensity,
      });
    }
    
    return data;
  };

  const heatmapData = generateHeatmapData();

  // Organize data into weeks
  const weeks: DayData[][] = [];
  for (let i = 0; i < heatmapData.length; i += 7) {
    weeks.push(heatmapData.slice(i, i + 7));
  }

  const getIntensityColor = (intensity: number) => {
    const colors = [
      'bg-gray-100 hover:bg-gray-200',
      'bg-blue-100 hover:bg-blue-200',
      'bg-blue-300 hover:bg-blue-400',
      'bg-blue-500 hover:bg-blue-600',
      'bg-blue-700 hover:bg-blue-800',
    ];
    return colors[intensity];
  };

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Heatmap</CardTitle>
        <CardDescription>Daily spending intensity over the last 12 weeks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Month labels */}
              <div className="flex mb-2 text-xs text-muted-foreground pl-6">
                {weeks.map((week, weekIdx) => {
                  const firstDay = new Date(week[0].date);
                  const showMonth = weekIdx === 0 || firstDay.getDate() <= 7;
                  return (
                    <div key={weekIdx} className="flex-shrink-0" style={{ width: '14px', marginRight: '2px' }}>
                      {showMonth && monthLabels[firstDay.getMonth()]}
                    </div>
                  );
                })}
              </div>

              {/* Day labels and calendar */}
              <div className="flex">
                {/* Day of week labels */}
                <div className="flex flex-col text-xs text-muted-foreground mr-1">
                  {dayLabels.map((day, idx) => (
                    <div key={day} className="h-[14px] mb-[2px] flex items-center justify-end pr-1">
                      {idx % 2 === 1 && day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="flex gap-[2px]">
                  {weeks.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-[2px]">
                      {week.map((day) => {
                        const date = new Date(day.date);
                        return (
                          <div
                            key={day.date}
                            className={cn(
                              'w-[14px] h-[14px] rounded-sm cursor-pointer transition-all',
                              getIntensityColor(day.intensity)
                            )}
                            title={`${date.toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                            })}: ${formatCurrency(day.amount)}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Less</span>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((intensity) => (
                  <div
                    key={intensity}
                    className={cn('w-3 h-3 rounded-sm', getIntensityColor(intensity).split(' ')[0])}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
            <div className="text-xs text-muted-foreground">
              Total:{' '}
              <span className="font-medium text-foreground">
                {formatCurrency(heatmapData.reduce((sum, day) => sum + day.amount, 0))}
              </span>
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900 mb-1">Highest Day</p>
              <p className="font-medium text-blue-700">
                {formatCurrency(Math.max(...heatmapData.map((d) => d.amount)))}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-900 mb-1">Avg Daily Spend</p>
              <p className="font-medium text-green-700">
                {formatCurrency(
                  Math.round(heatmapData.reduce((sum, day) => sum + day.amount, 0) / heatmapData.length)
                )}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="text-xs text-purple-900 mb-1">Active Days</p>
              <p className="font-medium text-purple-700">
                {heatmapData.filter((d) => d.intensity > 0).length} / {heatmapData.length}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
