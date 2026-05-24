'use client';

import { Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LoanApplication } from '@/types';

interface ApplicationTimelineProps {
  loan: LoanApplication;
}

const STEPS = [
  { status: 'PENDING', label: 'Submitted', icon: Clock },
  { status: 'UNDER_REVIEW', label: 'Under Review', icon: Clock },
  { status: 'APPROVED', label: 'Approved', icon: Check },
  { status: 'DISBURSED', label: 'Disbursed', icon: Check },
] as const;

export default function ApplicationTimeline({ loan }: ApplicationTimelineProps) {
  const statusOrder = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'DISBURSED'];
  const currentIndex = statusOrder.indexOf(loan.status);
  const isRejected = loan.status === 'REJECTED';
  const isDefaulted = loan.status === 'DEFAULTED';

  return (
    <div className="space-y-0">
      {STEPS.map((step, index) => {
        const stepIndex = statusOrder.indexOf(step.status);
        const isActive = stepIndex <= currentIndex && !isRejected;
        const isCurrent = stepIndex === currentIndex && !isRejected;
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                  isActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted bg-background text-muted-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'w-0.5 flex-1 min-h-[2rem]',
                    stepIndex < currentIndex ? 'bg-primary' : 'bg-muted'
                  )}
                />
              )}
            </div>
            <div className={cn('pb-6', isCurrent && 'font-semibold')}>
              <p className="text-sm">{step.label}</p>
              {isCurrent && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {loan.status === 'PENDING' && 'Waiting for review'}
                  {loan.status === 'UNDER_REVIEW' && `Reviewed by ${loan.reviewedBy || 'N/A'}`}
                  {loan.status === 'APPROVED' && 'Ready for disbursement'}
                  {loan.status === 'DISBURSED' && `Disbursed on ${loan.disbursedAt ? new Date(loan.disbursedAt).toLocaleDateString() : 'N/A'}`}
                </p>
              )}
            </div>
          </div>
        );
      })}

      {(isRejected || isDefaulted) && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-destructive bg-destructive text-destructive-foreground">
              <span className="text-xs font-bold">!</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-destructive">
              {isRejected ? 'Rejected' : 'Defaulted'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isRejected
                ? `Application rejected on ${loan.reviewedAt ? new Date(loan.reviewedAt).toLocaleDateString() : 'N/A'}`
                : 'Loan has defaulted on repayment'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
