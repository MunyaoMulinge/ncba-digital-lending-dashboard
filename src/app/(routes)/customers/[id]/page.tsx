'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useCustomer } from '@/hooks/useCustomers';
import { useLoans } from '@/hooks/useLoans';
import { ROLES } from '@/lib/roles';
import { formatKES, formatDateShort } from '@/lib/utils';
import RoleGate from '@/components/auth/RoleGate';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import RiskProfile from '@/components/customers/RiskProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { User, ArrowLeft, Calendar, Briefcase, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: customer, isLoading } = useCustomer(id);
  const { data: loansData } = useLoans(1, 100);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const customerLoans = loansData?.data.filter((l) => l.customerId === id) || [];

  const accountAge = customer
    ? Math.floor((Date.now() - new Date(customer.enrollmentDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0;

  const riskData = customer
    ? [
        { dimension: 'Payment History', score: customer.repaymentHistory },
        { dimension: 'Income Stability', score: Math.min(100, (customer.monthlyIncome / 200000) * 100) },
        { dimension: 'Debt Ratio', score: Math.min(100, 100 - (customer.totalBorrowed / (customer.monthlyIncome * 12)) * 100) },
        { dimension: 'Credit Mix', score: customer.activeLoans > 0 ? 70 + Math.random() * 20 : 50 },
        { dimension: 'Loan Purpose', score: 65 },
      ]
    : [];

  return (
    <RoleGate allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.LOAN_OFFICER]}>
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
            <Link href="/customers" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Customers
            </Link>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <div className="grid gap-6 lg:grid-cols-3">
                  <Skeleton className="h-60" />
                  <Skeleton className="h-60 lg:col-span-2" />
                </div>
              </div>
            ) : customer ? (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                        <User className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold">{customer.name}</h1>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {customer.phone}</span>
                          <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {customer.email}</span>
                          <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {customer.employmentType.replace(/_/g, ' ')}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDateShort(customer.dateOfBirth)}</span>
                        </div>
                      </div>
                      <Badge
                        variant={customer.kycStatus === 'VERIFIED' ? 'default' : customer.kycStatus === 'PENDING' ? 'secondary' : 'destructive'}
                      >
                        {customer.kycStatus}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">Total Borrowed</p>
                      <p className="text-xl font-bold">{formatKES(customer.totalBorrowed)}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">Active Loans</p>
                      <p className="text-xl font-bold">{customer.activeLoans}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">Repayment History</p>
                      <p className="text-xl font-bold">{customer.repaymentHistory}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">Account Age</p>
                      <p className="text-xl font-bold">{accountAge} months</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Loan History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {customerLoans.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">No loan history</p>
                        ) : (
                          <div className="space-y-3">
                            {customerLoans.map((loan) => (
                              <div key={loan.id} className="flex items-center justify-between p-3 rounded-md border">
                                <div>
                                  <p className="font-medium">{formatKES(loan.amount)}</p>
                                  <p className="text-xs text-muted-foreground">{loan.termMonths} months • {loan.purpose.replace(/_/g, ' ')}</p>
                                </div>
                                <Badge variant={loan.status === 'DISBURSED' ? 'default' : loan.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                                  {loan.status.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                  <RiskProfile data={riskData} />
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-12">Customer not found</div>
            )}
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
