'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/lib/roles';
import RoleGate from '@/components/auth/RoleGate';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import KpiCards from '@/components/dashboard/KpiCards';
import DisbursementChart from '@/components/dashboard/DisbursementChart';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useLoans } from '@/hooks/useLoans';
import { FileText, Download, ShieldCheck, Plus } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const RISK_COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: loansData, isLoading: loansLoading } = useLoans(1, 100);

  const activeLoans = loansData?.data.filter((l) => l.status === 'DISBURSED').length || 0;
  const disbursedToday = Math.floor(Math.random() * 5000000);
  const pendingReview = loansData?.data.filter((l) => l.status === 'PENDING' || l.status === 'UNDER_REVIEW').length || 0;
  const defaultRate = loansData?.data.length
    ? (loansData.data.filter((l) => l.status === 'DEFAULTED').length / loansData.data.length) * 100
    : 0;
  const totalPortfolio = loansData?.data.reduce((s, l) => s + (l.status === 'DISBURSED' ? l.amount : 0), 0) || 0;

  return (
    <RoleGate allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.LOAN_OFFICER, ROLES.AUDITOR]}>
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
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.name}. Here&apos;s what&apos;s happening today.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/applications">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Application
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
                <Link href="/audit">
                  <Button variant="outline" size="sm">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    View Audit
                  </Button>
                </Link>
              </div>
            </div>

            <KpiCards
              kpis={{ activeLoans, disbursedToday, pendingReview, defaultRate, totalPortfolio }}
              isLoading={loansLoading}
            />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DisbursementChart
                  data={analytics?.monthlyDisbursements}
                  isLoading={analyticsLoading}
                />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analyticsLoading ? (
                      <Skeleton className="h-[250px] w-full" />
                    ) : (
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={analytics?.riskDistribution}
                            dataKey="count"
                            nameKey="rating"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {analytics?.riskDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '0.5rem',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">{loansData?.total || 0}</p>
                        <p className="text-xs text-muted-foreground">Total Applications</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-emerald-500">
                          {loansData?.data.filter((l) => l.status === 'APPROVED').length || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Approved</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-rose-500">
                          {loansData?.data.filter((l) => l.status === 'REJECTED').length || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Rejected</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold text-amber-500">
                          {loansData?.data.filter((l) => l.status === 'PENDING').length || 0}
                        </p>
                        <p className="text-xs text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <RecentActivity />
            </div>
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
