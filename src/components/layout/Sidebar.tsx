'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ROLES, Role, ROLE_PERMISSIONS, PERMISSIONS } from '@/lib/roles';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Landmark,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  permission: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: <LayoutDashboard className="h-5 w-5" />, permission: PERMISSIONS.VIEW_DASHBOARD },
  { label: 'Applications', href: '/applications', icon: <FileText className="h-5 w-5" />, permission: PERMISSIONS.VIEW_APPLICATIONS },
  { label: 'Customers', href: '/customers', icon: <Users className="h-5 w-5" />, permission: PERMISSIONS.VIEW_CUSTOMERS },
  { label: 'Analytics', href: '/analytics', icon: <BarChart3 className="h-5 w-5" />, permission: PERMISSIONS.VIEW_ANALYTICS },
  { label: 'Audit', href: '/audit', icon: <ShieldCheck className="h-5 w-5" />, permission: PERMISSIONS.VIEW_AUDIT },
  { label: 'Admin', href: '/admin', icon: <Settings className="h-5 w-5" />, permission: PERMISSIONS.VIEW_ADMIN },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const userPermissions = user ? ROLE_PERMISSIONS[user.role as Role] || [] : [];

  const visibleNav = NAV_ITEMS.filter((item) => userPermissions.includes(item.permission));

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-2 overflow-hidden">
          <Landmark className="h-6 w-6 text-primary shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="text-lg font-bold whitespace-nowrap overflow-hidden"
              >
                NCBA Digital
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={onToggle}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {visibleNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {item.icon}
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {user?.name?.charAt(0) || '?'}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-medium truncate">{user?.name || 'Guest'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.role || ''}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: mobileOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 z-50 h-full w-64 bg-background border-r border-border md:hidden"
      >
        {sidebarContent}
      </motion.aside>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 256 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden md:flex h-screen sticky top-0 flex-col bg-background border-r border-border shrink-0"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
