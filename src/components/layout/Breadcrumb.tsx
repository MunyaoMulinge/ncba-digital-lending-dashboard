'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

const LABEL_MAP: Record<string, string> = {
  '': 'Dashboard',
  applications: 'Applications',
  customers: 'Customers',
  analytics: 'Analytics',
  audit: 'Audit',
  admin: 'Admin',
};

export default function Breadcrumb() {
  const pathname = usePathname();

  const segments = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    return parts.map((part, index) => {
      const href = '/' + parts.slice(0, index + 1).join('/');
      const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(part);
      return {
        label: isId ? 'Detail' : LABEL_MAP[part] || part.charAt(0).toUpperCase() + part.slice(1),
        href,
        isLast: index === parts.length - 1,
      };
    });
  }, [pathname]);

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground px-4 md:px-6 py-3">
      <Link href="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      {segments.map((segment) => (
        <div key={segment.href} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {segment.isLast ? (
            <span className="font-medium text-foreground">{segment.label}</span>
          ) : (
            <Link href={segment.href} className="hover:text-foreground transition-colors">
              {segment.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
