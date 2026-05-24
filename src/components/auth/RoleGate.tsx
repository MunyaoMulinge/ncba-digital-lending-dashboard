'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Role, ROLES } from '@/lib/roles';
import { Lock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface RoleGateProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleGate({ allowedRoles, children, fallback }: RoleGateProps) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="space-y-4 w-64">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Lock className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">Authentication Required</h2>
        <p className="text-muted-foreground mt-2">Please log in to access this page.</p>
      </div>
    );
  }

  const hasAccess = allowedRoles.includes(user.role as Role);

  if (!hasAccess) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <Lock className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold">Access Denied</h2>
        <p className="text-muted-foreground mt-2">
          You do not have permission to view this page.
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          Contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

export { ROLES };
export type { Role };
