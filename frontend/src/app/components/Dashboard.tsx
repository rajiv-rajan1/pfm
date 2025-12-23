import { useState } from 'react';
import {
  TrendingUp,
  Wallet,
  PiggyBank,
  CreditCard,
  BarChart3,
  Calendar,
  Activity,
  Award,
} from 'lucide-react';
import { KPICard } from './KPICard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { SpendingHeatmap } from './SpendingHeatmap';
import { FinancialHealthScore } from './FinancialHealthScore';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  calculateFinancialSummary,
  mockMonthlyPL,
  mockNetWorthHistory,
  mockExpenseCategories,
  mockIncomeCategories,
  mockTransactions,
  mockQuarterlyPL,
} from '../data/mockData';
import { cn } from './ui/utils';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

export function Dashboard() {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | 'all'>('6m');
  const financialSummary = calculateFinancialSummary();

  const getFilteredMonthlyData = () => {
    const ranges = { '3m': 3, '6m': 6, '1y': 12, 'all': mockMonthlyPL.length };
    return mockMonthlyPL.slice(-ranges[timeRange]);
  };

  const getFilteredNetWorthData = () => {
    const ranges = { '3m': 3, '6m': 6, '1y': 12, 'all': mockNetWorthHistory.length };
    return mockNetWorthHistory.slice(-ranges[timeRange]);
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      {/* KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Net Worth"
          value={financialSummary.netWorth}
          change={financialSummary.netWorthChange}
          trend={financialSummary.netWorthChange > 0 ? 'up' : 'down'}
          icon={<Wallet className="w-4 h-4" />}
          subtitle="vs last month"
        />
        <KPICard
          title="Total Assets"
          value={financialSummary.totalAssets}
          icon={<PiggyBank className="w-4 h-4" />}
          subtitle="across all accounts"
        />
        <KPICard
          title="Monthly P&L"
          value={financialSummary.monthlyPL}
          change={financialSummary.monthlyPLChange}
          trend={financialSummary.monthlyPLChange > 0 ? 'up' : 'down'}
          icon={<TrendingUp className="w-4 h-4" />}
          subtitle="December 2024"
        />
        <KPICard
          title="Savings Rate"
          value={`${financialSummary.savingsRate.toFixed(0)}%`}
          icon={<BarChart3 className="w-4 h-4" />}
          subtitle={`₹${(financialSummary.monthlyIncome - financialSummary.monthlyExpenses).toLocaleString('en-IN')}/month`}
          formatValue={false}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard
          title="Monthly Income"
          value={financialSummary.monthlyIncome}
          icon={<TrendingUp className="w-4 h-4" />}
          trend="up"
        />
        <KPICard
          title="Monthly Expenses"
          value={financialSummary.monthlyExpenses}
          icon={<CreditCard className="w-4 h-4" />}
        />
        <KPICard
          title="Total Liabilities"
          value={financialSummary.totalLiabilities}
          icon={<CreditCard className="w-4 h-4" />}
          subtitle="loans & credit"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Net Worth Trend */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Net Worth Trend</CardTitle>
              <div className="flex gap-1">
                {(['3m', '6m', '1y', 'all'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={timeRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeRange(range)}
                    className="h-8"
                  >
                    {range.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={getFilteredNetWorthData()}>
                <defs>
                  <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Net Worth']}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#netWorthGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Income vs Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={getFilteredMonthlyData()}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={formatCurrency} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="income" fill="#10b981" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockExpenseCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category.split(' ')[0]} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {mockExpenseCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {mockExpenseCategories.slice(0, 6).map((cat, idx) => (
                <div key={cat.category} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                  <span className="truncate">{cat.category}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Income Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockIncomeCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" tickFormatter={formatCurrency} />
                <YAxis dataKey="category" type="category" className="text-xs" width={100} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="amount" fill="#3b82f6">
                  {mockIncomeCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* P&L Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly P&L Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getFilteredMonthlyData()}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={formatCurrency} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
              <Line type="monotone" dataKey="netProfit" stroke="#3b82f6" strokeWidth={3} name="Net Profit" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTransactions.slice(0, 8).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                    )}
                  >
                    {transaction.type === 'income' ? (
                      <TrendingUp className={cn('w-5 h-5 text-green-600')} />
                    ) : (
                      <CreditCard className={cn('w-5 h-5 text-red-600')} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{transaction.category}</span>
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                      {transaction.recurring && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Recurring
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={cn(
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {transaction.type === 'income' ? '+' : ''}
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spending Heatmap */}
      <SpendingHeatmap />

      {/* Financial Health Score */}
      <FinancialHealthScore />
    </div>
  );
}