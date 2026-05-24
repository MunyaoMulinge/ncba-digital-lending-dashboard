'use client';

import { useState } from 'react';
import RoleGate from '@/components/auth/RoleGate';
import { ROLES } from '@/lib/roles';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { useAudit } from '@/hooks/useAudit';
import AuditTimeline from '@/components/audit/AuditTimeline';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Download } from 'lucide-react';

const AUDIT_ACTIONS = [
  'APPLICATION_CREATED',
  'STATUS_CHANGED',
  'AMOUNT_MODIFIED',
  'REVIEWED',
  'DISBURSED',
  'REJECTED',
  'CUSTOMER_UPDATED',
];

const ACTORS = ['Admin User', 'Manager One', 'Manager Two', 'Officer One', 'Officer Two', 'Officer Three', 'Auditor One', 'Auditor Two'];

export default function AuditPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [actor, setActor] = useState('');
  const [action, setAction] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAudit(page, 50, { actor, action, fromDate, toDate });

  const handleExport = () => {
    if (!data?.data) return;
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Target', 'Details', 'IP'];
    const rows = data.data.map((e) => [
      e.timestamp,
      e.actor,
      e.actorRole,
      e.action,
      `${e.targetType}:${e.targetId}`,
      e.details,
      e.ipAddress,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Audit log exported');
  };

  return (
    <RoleGate allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.AUDITOR]}>
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
                <h1 className="text-2xl font-bold tracking-tight">Audit Trail</h1>
                <p className="text-muted-foreground">Compliance and activity monitoring.</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export Audit Log
              </Button>
            </div>

            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Select value={actor} onValueChange={(v) => { setActor(v || ''); setPage(1); }}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Actor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Actors</SelectItem>
                  {ACTORS.map((a) => (
                    <SelectItem key={a} value={a}>{a}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={action} onValueChange={(v) => { setAction(v || ''); setPage(1); }}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Actions</SelectItem>
                  {AUDIT_ACTIONS.map((a) => (
                    <SelectItem key={a} value={a}>{a.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="date"
                className="h-9 w-full md:w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1); }}
                placeholder="From"
              />
              <input
                type="date"
                className="h-9 w-full md:w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1); }}
                placeholder="To"
              />
            </div>

            <AuditTimeline entries={data?.data} isLoading={isLoading} />

            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Page {page} of {data.totalPages}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))} disabled={page >= data.totalPages}>
                    Next
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
