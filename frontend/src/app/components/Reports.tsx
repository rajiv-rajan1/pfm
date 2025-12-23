import { Download, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  mockMonthlyPL,
  mockQuarterlyPL,
  mockAnnualPL,
  mockAssets,
  mockLiabilities,
  calculateFinancialSummary,
} from '../data/mockData';
import { cn } from './ui/utils';

export function Reports() {
  const financialSummary = calculateFinancialSummary();

  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const formatShortCurrency = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl tracking-tight">Financial Reports</h2>
          <p className="text-muted-foreground">
            Comprehensive view of your P&L, balance sheet, and cash flow
          </p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export Reports
        </Button>
      </div>

      <Tabs defaultValue="pl" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pl">Profit & Loss</TabsTrigger>
          <TabsTrigger value="balance">Balance Sheet</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        {/* P&L Tab */}
        <TabsContent value="pl" className="space-y-4">
          {/* P&L Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly P&L (Dec 2024)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {formatShortCurrency(mockMonthlyPL[mockMonthlyPL.length - 1].netProfit)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Net Profit</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Quarterly P&L (Q4 2024)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {formatShortCurrency(mockQuarterlyPL[mockQuarterlyPL.length - 1].netProfit)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Net Profit</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Annual P&L (2024)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">
                  {formatShortCurrency(mockAnnualPL[mockAnnualPL.length - 1].netProfit)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Net Profit</p>
              </CardContent>
            </Card>
          </div>

          {/* Monthly P&L Table */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly P&L Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Income</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Net Profit</TableHead>
                    <TableHead className="text-right">Margin %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockMonthlyPL.slice(-6).reverse().map((month) => {
                    const margin = (month.netProfit / month.income) * 100;
                    return (
                      <TableRow key={month.month}>
                        <TableCell>{month.month}</TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(month.income)}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(month.expenses)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(month.netProfit)}
                        </TableCell>
                        <TableCell className="text-right">{margin.toFixed(1)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Quarterly P&L Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Quarterly P&L Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockQuarterlyPL}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="quarter" />
                  <YAxis tickFormatter={formatShortCurrency} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  <Bar dataKey="netProfit" fill="#3b82f6" name="Net Profit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Annual P&L Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Annual P&L Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockAnnualPL}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={formatShortCurrency} />
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
        </TabsContent>

        {/* Balance Sheet Tab */}
        <TabsContent value="balance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Assets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl">{formatShortCurrency(financialSummary.totalAssets)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Liabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-red-600">
                  {formatShortCurrency(financialSummary.totalLiabilities)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Net Worth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-green-600">
                  {formatShortCurrency(financialSummary.netWorth)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Assets */}
            <Card>
              <CardHeader>
                <CardTitle>Assets Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAssets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell className="capitalize">
                          {asset.type.replace('_', ' ')}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(asset.value)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            'text-right',
                            asset.growth && asset.growth > 0
                              ? 'text-green-600'
                              : 'text-red-600'
                          )}
                        >
                          {asset.growth ? `${asset.growth > 0 ? '+' : ''}${asset.growth.toFixed(1)}%` : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2}><strong>Total Assets</strong></TableCell>
                      <TableCell className="text-right">
                        <strong>{formatCurrency(financialSummary.totalAssets)}</strong>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Liabilities */}
            <Card>
              <CardHeader>
                <CardTitle>Liabilities Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Liability</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Interest</TableHead>
                      <TableHead className="text-right">EMI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLiabilities.map((liability) => (
                      <TableRow key={liability.id}>
                        <TableCell>{liability.name}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(liability.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {liability.interestRate ? `${liability.interestRate}%` : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {liability.monthlyPayment
                            ? formatCurrency(liability.monthlyPayment)
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell><strong>Total Liabilities</strong></TableCell>
                      <TableCell className="text-right">
                        <strong>{formatCurrency(financialSummary.totalLiabilities)}</strong>
                      </TableCell>
                      <TableCell colSpan={2} />
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Operating Activities */}
                <div>
                  <h3 className="mb-3">Operating Activities</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Income from Salary & Business</TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(175000)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rental Income</TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(7000)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Operating Expenses (Rent, Utilities, etc.)</TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(75000)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Net Cash from Operating</strong></TableCell>
                        <TableCell className="text-right">
                          <strong>{formatCurrency(107000)}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Investing Activities */}
                <div>
                  <h3 className="mb-3">Investing Activities</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Dividend & Interest Income</TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(18000)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>SIP Investments</TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(15000)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Stock Purchases</TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(10000)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Net Cash from Investing</strong></TableCell>
                        <TableCell className="text-right text-red-600">
                          <strong>-{formatCurrency(7000)}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Financing Activities */}
                <div>
                  <h3 className="mb-3">Financing Activities</h3>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>Loan EMI Payments</TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(62000)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Credit Card Payments</TableCell>
                        <TableCell className="text-right text-red-600">
                          -{formatCurrency(8000)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell><strong>Net Cash from Financing</strong></TableCell>
                        <TableCell className="text-right text-red-600">
                          <strong>-{formatCurrency(70000)}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Net Change */}
                <div className="pt-4 border-t">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="text-lg"><strong>Net Change in Cash</strong></TableCell>
                        <TableCell className="text-right text-lg text-green-600">
                          <strong>{formatCurrency(30000)}</strong>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
