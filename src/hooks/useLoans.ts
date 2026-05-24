'use client';

import { useQuery } from '@tanstack/react-query';
import { LoanApplication, PaginatedResponse } from '@/types';
import { sleep } from '@/lib/utils';

interface LoansFilter {
  status?: string;
  riskRating?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
}

interface LoansSort {
  column: string;
  direction: 'asc' | 'desc';
}

export function useLoans(
  page = 1,
  pageSize = 25,
  filters: LoansFilter = {},
  sort?: LoansSort
) {
  return useQuery<PaginatedResponse<LoanApplication>>({
    queryKey: ['loans', page, pageSize, filters, sort],
    queryFn: async () => {
      await sleep(200 + Math.random() * 600);
      const res = await fetch(
        `/api/mock/loans?page=${page}&pageSize=${pageSize}&status=${filters.status || ''}&riskRating=${filters.riskRating || ''}&search=${filters.search || ''}&sortColumn=${sort?.column || ''}&sortDirection=${sort?.direction || ''}`
      );
      if (!res.ok) throw new Error('Failed to fetch loans');
      return res.json();
    },
  });
}

export function useLoan(id: string) {
  return useQuery<LoanApplication>({
    queryKey: ['loan', id],
    queryFn: async () => {
      await sleep(200 + Math.random() * 600);
      const res = await fetch(`/api/mock/loans/${id}`);
      if (!res.ok) throw new Error('Failed to fetch loan');
      return res.json();
    },
    enabled: !!id,
  });
}
