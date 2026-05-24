'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatKES, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown, PiggyBank, Banknote, Clock, AlertTriangle } from 'lucide-react';

interface KpiCardsProps {
  kpis?: {
    activeLoans: number;
    disbursedToday: number;
    pendingReview: number;
    defaultRate: number;
    totalPortfolio: number;
  };
  isLoading: boolean;
}

export default function KpiCards({ kpis, isLoading }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!kpis) return null;

  const cards = [
    {
      title: 'Active Loans',
      value: kpis.activeLoans.toLocaleString(),
      trend: '+5.2%',
      trendUp: true,
      icon: <PiggyBank className="h-4 w-4 text-primary" />,
    },
    {
      title: 'Disbursed Today',
      value: formatKES(kpis.disbursedToday),
      trend: '+12.8%',
      trendUp: true,
      icon: <Banknote className="h-4 w-4 text-emerald-500" />,
    },
    {
      title: 'Pending Review',
      value: kpis.pendingReview.toLocaleString(),
      trend: '-3.1%',
      trendUp: false,
      icon: <Clock className="h-4 w-4 text-amber-500" />,
    },
    {
      title: 'Default Rate',
      value: formatPercent(kpis.defaultRate),
      trend: '-0.4%',
      trendUp: true,
      icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
            {card.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {card.trendUp ? (
                <TrendingUp className="h-3 w-3 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-rose-500" />
              )}
              <span className={card.trendUp ? 'text-emerald-500' : 'text-rose-500'}>
                {card.trend} vs last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
