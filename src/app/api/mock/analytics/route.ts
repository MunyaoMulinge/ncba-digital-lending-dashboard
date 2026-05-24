import { NextRequest, NextResponse } from 'next/server';
import {
  MOCK_LOANS,
  MOCK_MONTHLY_DISBURSEMENTS,
  MOCK_RISK_DISTRIBUTION,
} from '@/lib/mockData';
import { sleep } from '@/lib/utils';

export async function GET(request: NextRequest) {
  await sleep(300 + Math.random() * 500);
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '365', 10);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recentLoans = MOCK_LOANS.filter((l) => new Date(l.submittedAt) >= cutoff);

  const disbursementTrends = MOCK_MONTHLY_DISBURSEMENTS.map((m) => ({
    month: m.month,
    disbursed: m.amount,
    defaulted: Math.floor(m.amount * (0.02 + Math.random() * 0.06)),
  }));

  const purposeMap = new Map<string, { amount: number; count: number }>();
  for (const loan of recentLoans) {
    const existing = purposeMap.get(loan.purpose) || { amount: 0, count: 0 };
    existing.amount += loan.amount;
    existing.count += 1;
    purposeMap.set(loan.purpose, existing);
  }
  const purposeBreakdown = Array.from(purposeMap.entries())
    .map(([purpose, { amount, count }]) => ({ purpose, amount, count }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const creditScoreTrend = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const monthLabel = d.toLocaleDateString('en-KE', { month: 'short', year: 'numeric' });
    return { month: monthLabel, average: Math.floor(550 + Math.random() * 150) };
  });

  return NextResponse.json({
    monthlyDisbursements: MOCK_MONTHLY_DISBURSEMENTS,
    riskDistribution: MOCK_RISK_DISTRIBUTION,
    disbursementTrends,
    purposeBreakdown,
    creditScoreTrend,
  });
}
