'use client';

import { useState } from 'react';
import RoleGate from '@/components/auth/RoleGate';
import { ROLES } from '@/lib/roles';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import CustomerList from '@/components/customers/CustomerList';

export default function CustomersPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <RoleGate allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.LOAN_OFFICER]}>
      <div className="flex h-screen">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopBar onMenuClick={() => setMobileOpen(true)} />
          <Breadcrumb />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Customer Directory</h1>
              <p className="text-muted-foreground">Browse and manage customer records.</p>
            </div>
            <CustomerList />
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
