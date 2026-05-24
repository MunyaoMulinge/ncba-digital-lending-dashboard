'use client';

import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import RoleGate from '@/components/auth/RoleGate';
import { ROLES } from '@/lib/roles';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from 'recharts';
import { Download } from 'lucide-react';

export default function AnalyticsPage() {
  const [days, setDays] = useState(365);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useAnalytics(days);

  const handleExport = useCallback(async () => {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `analytics-dashboard-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Dashboard exported');
    } catch {
      toast.error('Failed to export dashboard');
    }
  }, []);

  return (
    <RoleGate allowedRoles={[ROLES.ADMIN, ROLES.MANAGER]}>
      <div className="flex h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar onMenuClick={() => setMobileOpen(true)} />
          <Breadcrumb />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">Portfolio performance and risk metrics.</p>
              </div>
              <div className="flex gap-2">
                <Button variant={days === 30 ? 'default' : 'outline'} size="sm" onClick={() => setDays(30)}>30 Days</Button>
                <Button variant={days === 90 ? 'default' : 'outline'} size="sm" onClick={() => setDays(90)}>90 Days</Button>
                <Button variant={days === 365 ? 'default' : 'outline'} size="sm" onClick={() => setDays(365)}>1 Year</Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>

            <div ref={chartRef} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Disbursements vs Defaults</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={data?.disbursementTrends}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                          }}
                        />
                        <Area type="monotone" dataKey="disbursed" fill="#1e3a5f" stroke="#1e3a5f" fillOpacity={0.3} />
                        <Line type="monotone" dataKey="defaulted" stroke="#ef4444" strokeWidth={2} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top 5 Loan Purposes by Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data?.purposeBreakdown}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="purpose" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            formatter={(value) => `KES ${(Number(value) / 1000000).toFixed(1)}M`}
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '0.5rem',
                            }}
                          />
                          <Bar dataKey="amount" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Credit Score Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-[300px] w-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data?.creditScoreTrend}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                          <YAxis domain={[300, 850]} tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '0.5rem',
                            }}
                          />
                          <Line type="monotone" dataKey="average" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
