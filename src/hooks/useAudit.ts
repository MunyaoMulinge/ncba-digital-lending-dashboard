'use client';

import { useQuery } from '@tanstack/react-query';
import { AuditEntry, PaginatedResponse } from '@/types';
import { sleep } from '@/lib/utils';

interface AuditFilter {
  actor?: string;
  action?: string;
  fromDate?: string;
  toDate?: string;
}

export function useAudit(
  page = 1,
  pageSize = 50,
  filters: AuditFilter = {}
) {
  return useQuery<PaginatedResponse<AuditEntry>>({
    queryKey: ['audit', page, pageSize, filters],
    queryFn: async () => {
      await sleep(200 + Math.random() * 600);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        actor: filters.actor || '',
        action: filters.action || '',
        fromDate: filters.fromDate || '',
        toDate: filters.toDate || '',
      });
      const res = await fetch(`/api/mock/audit?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch audit entries');
      return res.json();
    },
    refetchInterval: 15000,
  });
}
