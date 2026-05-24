'use client';

import { useQuery } from '@tanstack/react-query';
import { Customer, PaginatedResponse } from '@/types';
import { sleep } from '@/lib/utils';

interface CustomersFilter {
  search?: string;
  kycStatus?: string;
  employmentType?: string;
}

export function useCustomers(
  page = 1,
  pageSize = 50,
  filters: CustomersFilter = {}
) {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: ['customers', page, pageSize, filters],
    queryFn: async () => {
      await sleep(200 + Math.random() * 600);
      const res = await fetch(
        `/api/mock/customers?page=${page}&pageSize=${pageSize}&search=${filters.search || ''}&kycStatus=${filters.kycStatus || ''}&employmentType=${filters.employmentType || ''}`
      );
      if (!res.ok) throw new Error('Failed to fetch customers');
      return res.json();
    },
  });
}

export function useCustomer(id: string) {
  return useQuery<Customer>({
    queryKey: ['customer', id],
    queryFn: async () => {
      await sleep(200 + Math.random() * 600);
      const res = await fetch(`/api/mock/customers/${id}`);
      if (!res.ok) throw new Error('Failed to fetch customer');
      return res.json();
    },
    enabled: !!id,
  });
}
