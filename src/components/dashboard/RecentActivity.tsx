'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import { Activity } from 'lucide-react';
import { useAudit } from '@/hooks/useAudit';

export default function RecentActivity() {
  const { data, isLoading } = useAudit(1, 10);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  const entries = data?.data || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Activity className="h-5 w-5 text-primary" />
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No recent activity</div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.details}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.actor} • {formatDate(entry.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
