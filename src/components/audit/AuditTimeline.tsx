'use client';

import { AuditEntry } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Clock, FileEdit, CheckCircle, XCircle, Banknote, User } from 'lucide-react';

interface AuditTimelineProps {
  entries?: AuditEntry[];
  isLoading: boolean;
}

const ACTION_ICONS: Record<AuditEntry['action'], React.ReactNode> = {
  APPLICATION_CREATED: <FileEdit className="h-4 w-4" />,
  STATUS_CHANGED: <CheckCircle className="h-4 w-4" />,
  AMOUNT_MODIFIED: <Banknote className="h-4 w-4" />,
  REVIEWED: <Shield className="h-4 w-4" />,
  DISBURSED: <Banknote className="h-4 w-4" />,
  REJECTED: <XCircle className="h-4 w-4" />,
  CUSTOMER_UPDATED: <User className="h-4 w-4" />,
};

const ACTION_COLORS: Record<AuditEntry['action'], string> = {
  APPLICATION_CREATED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  STATUS_CHANGED: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  AMOUNT_MODIFIED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  REVIEWED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  DISBURSED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  REJECTED: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  CUSTOMER_UPDATED: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  MANAGER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  LOAN_OFFICER: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  AUDITOR: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

export default function AuditTimeline({ entries, isLoading }: AuditTimelineProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Clock className="h-12 w-12 mb-4 opacity-50" />
        <p>No audit entries found</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {entries.map((entry, index) => (
        <div key={entry.id} className="flex gap-4 pb-6 relative">
          {index < entries.length - 1 && (
            <div className="absolute left-4 top-8 bottom-0 w-px bg-border" />
          )}
          <div className={`
            relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2
            ${ACTION_COLORS[entry.action]}
          `}>
            {ACTION_ICONS[entry.action]}
          </div>
          <div className="flex-1 min-w-0 rounded-lg border border-border p-4 bg-card">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={ROLE_COLORS[entry.actorRole] || 'bg-muted'}>{entry.actor}</Badge>
                <Badge variant="outline" className={ACTION_COLORS[entry.action]}>
                  {entry.action.replace(/_/g, ' ')}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{formatDate(entry.timestamp)}</span>
            </div>
            <p className="text-sm mt-2">{entry.details}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>Target: <span className="font-mono">{entry.targetType}</span></span>
              <span>ID: <span className="font-mono">{entry.targetId.slice(0, 8)}</span></span>
              <span className="font-mono">IP: {entry.ipAddress}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
