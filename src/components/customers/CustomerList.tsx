'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useCustomers } from '@/hooks/useCustomers';
import { formatKES } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Users } from 'lucide-react';

export default function CustomerList() {
  const [search, setSearch] = useState('');
  const [kycFilter, setKycFilter] = useState('');
  const [employmentFilter, setEmploymentFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useCustomers(page, 100, {
    search,
    kycStatus: kycFilter,
    employmentType: employmentFilter,
  });

  const parentRef = React.useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: data?.data.length || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  const debouncedSearch = useCallback((value: string) => {
    const timeout = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, or ID..."
            className="pl-8"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        <Select value={kycFilter} onValueChange={(v) => { setKycFilter(v || ''); setPage(1); }}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="KYC Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All KYC</SelectItem>
            <SelectItem value="VERIFIED">Verified</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="FAILED">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={employmentFilter} onValueChange={(v) => { setEmploymentFilter(v || ''); setPage(1); }}>
          <SelectTrigger className="w-full md:w-44">
            <SelectValue placeholder="Employment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="SALARIED">Salaried</SelectItem>
            <SelectItem value="SELF_EMPLOYED">Self Employed</SelectItem>
            <SelectItem value="BUSINESS">Business</SelectItem>
            <SelectItem value="CASUAL">Casual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-sm text-muted-foreground">
        {data?.total ?? 0} customers found
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : data?.data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Users className="h-12 w-12 mb-4 opacity-50" />
          <p>No customers found</p>
        </div>
      ) : (
        <div ref={parentRef} className="h-[600px] overflow-auto rounded-md border">
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
            {virtualItems.map((virtualItem) => {
              const customer = data?.data[virtualItem.index];
              if (!customer) return null;
              return (
                <Link
                  key={customer.id}
                  href={`/customers/${customer.id}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <div className="flex items-center gap-4 px-4 py-3 border-b border-border hover:bg-muted/50 transition-colors">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {customer.phone} • ID: {customer.idNumber}
                      </p>
                    </div>
                    <div className="hidden md:block text-right">
                      <Badge
                        variant={customer.kycStatus === 'VERIFIED' ? 'default' : customer.kycStatus === 'PENDING' ? 'secondary' : 'destructive'}
                      >
                        {customer.kycStatus}
                      </Badge>
                    </div>
                    <div className="hidden sm:block text-right min-w-[120px]">
                      <p className="text-sm font-medium">{formatKES(customer.totalBorrowed)}</p>
                      <p className="text-xs text-muted-foreground">{customer.activeLoans} active</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
