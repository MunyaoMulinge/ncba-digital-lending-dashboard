'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useLoan } from '@/hooks/useLoans';
import { ROLES } from '@/lib/roles';
import { formatKES, formatPercent, formatDateShort } from '@/lib/utils';
import RoleGate from '@/components/auth/RoleGate';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import StatusBadge from '@/components/applications/StatusBadge';
import CreditScoreRing from '@/components/applications/CreditScoreRing';
import ApplicationTimeline from '@/components/applications/ApplicationTimeline';
import RiskProfile from '@/components/customers/RiskProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Banknote, MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { data: loan, isLoading } = useLoan(id);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleAction = (action: string) => {
    toast.success(`${action} action triggered (demo)`);
  };

  const riskData = loan
    ? [
        { dimension: 'Payment History', score: Math.min(100, (loan.creditScore / 850) * 100) },
        { dimension: 'Income Stability', score: Math.min(100, (loan.monthlyIncome / 200000) * 100) },
        { dimension: 'Debt Ratio', score: Math.min(100, 100 - (loan.amount / (loan.monthlyIncome * loan.termMonths)) * 100) },
        { dimension: 'Credit Mix', score: 60 + Math.random() * 30 },
        { dimension: 'Loan Purpose', score: loan.purpose === 'BUSINESS' || loan.purpose === 'AGRICULTURE' ? 80 : 65 },
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
            <Link href="/applications" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Applications
            </Link>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-1/2" />
                <div className="grid gap-6 lg:grid-cols-2">
                  <Skeleton className="h-80" />
                  <Skeleton className="h-80" />
                </div>
              </div>
            ) : loan ? (
              <>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">{loan.customerName}</h1>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-lg text-muted-foreground">{formatKES(loan.amount)}</span>
                      <StatusBadge status={loan.status} />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER) && loan.status === 'UNDER_REVIEW' && (
                      <Button size="sm" onClick={() => handleAction('Approve')}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    {(user?.role === ROLES.ADMIN || user?.role === ROLES.MANAGER) && (
                      <Button size="sm" variant="destructive" onClick={() => handleAction('Reject')}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    )}
                    {user?.role === ROLES.ADMIN && loan.status === 'APPROVED' && (
                      <Button size="sm" onClick={() => handleAction('Disburse')}>
                        <Banknote className="mr-2 h-4 w-4" />
                        Disburse
                      </Button>
                    )}
                    {user?.role === ROLES.LOAN_OFFICER && loan.status === 'PENDING' && (
                      <Button size="sm" variant="outline" onClick={() => handleAction('Request Review')}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Request Review
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Loan Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Amount</p>
                            <p className="font-medium">{formatKES(loan.amount)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Term</p>
                            <p className="font-medium">{loan.termMonths} months</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Interest Rate</p>
                            <p className="font-medium">{formatPercent(loan.interestRate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Purpose</p>
                            <p className="font-medium">{loan.purpose.replace(/_/g, ' ')}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Monthly Income</p>
                            <p className="font-medium">{formatKES(loan.monthlyIncome)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Collateral</p>
                            <p className="font-medium">
                              {loan.collateralValue ? formatKES(loan.collateralValue) : 'None'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Submitted</p>
                            <p className="font-medium">{formatDateShort(loan.submittedAt)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Reviewed By</p>
                            <p className="font-medium">{loan.reviewedBy || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Risk Rating</p>
                            <p className="font-medium">{loan.riskRating}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Application Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ApplicationTimeline loan={loan} />
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Credit Score</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        <CreditScoreRing score={loan.creditScore} />
                      </CardContent>
                    </Card>
                    <RiskProfile data={riskData} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-12">Application not found</div>
            )}
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
