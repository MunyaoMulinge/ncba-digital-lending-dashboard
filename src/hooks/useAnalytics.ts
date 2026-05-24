'use client';

import { useQuery } from '@tanstack/react-query';
import { MonthlyDisbursement, RiskDistribution } from '@/types';
import { sleep } from '@/lib/utils';

interface AnalyticsData {
  monthlyDisbursements: MonthlyDisbursement[];
  riskDistribution: RiskDistribution[];
  disbursementTrends: { month: string; disbursed: number; defaulted: number }[];
  purposeBreakdown: { purpose: string; amount: number; count: number }[];
  creditScoreTrend: { month: string; average: number }[];
}

export function useAnalytics(days = 365) {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics', days],
    queryFn: async () => {
      await sleep(300 + Math.random() * 500);
      const res = await fetch(`/api/mock/analytics?days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    },
  });
}
