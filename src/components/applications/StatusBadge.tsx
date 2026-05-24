'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Status = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'DISBURSED' | 'REJECTED' | 'DEFAULTED';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const STATUS_STYLES: Record<Status, string> = {
  PENDING: 'bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300',
  UNDER_REVIEW: 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300',
  APPROVED: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300',
  DISBURSED: 'bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300',
  REJECTED: 'bg-rose-100 text-rose-800 hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300',
  DEFAULTED: 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300',
};

const STATUS_LABELS: Record<Status, string> = {
  PENDING: 'Pending',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  DISBURSED: 'Disbursed',
  REJECTED: 'Rejected',
  DEFAULTED: 'Defaulted',
};

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge className={cn(STATUS_STYLES[status], className)} variant="secondary">
      {STATUS_LABELS[status]}
    </Badge>
  );
}
