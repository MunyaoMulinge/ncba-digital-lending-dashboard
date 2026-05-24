'use client';

import { useState } from 'react';
import RoleGate from '@/components/auth/RoleGate';
import { ROLES } from '@/lib/roles';
import Sidebar from '@/components/layout/Sidebar';
import TopBar from '@/components/layout/TopBar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { DEMO_USERS } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Settings, Edit, KeyRound } from 'lucide-react';

const ROLE_COLORS = ['#1e3a5f', '#3b82f6', '#f59e0b', '#10b981'];

export default function AdminPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [features, setFeatures] = useState({
    newApplications: true,
    autoDisburse: false,
    emailNotifications: true,
    smsAlerts: true,
  });

  const roleDistribution = [
    { name: 'ADMIN', value: DEMO_USERS.filter((u) => u.role === 'ADMIN').length },
    { name: 'MANAGER', value: DEMO_USERS.filter((u) => u.role === 'MANAGER').length },
    { name: 'LOAN_OFFICER', value: DEMO_USERS.filter((u) => u.role === 'LOAN_OFFICER').length },
    { name: 'AUDITOR', value: DEMO_USERS.filter((u) => u.role === 'AUDITOR').length },
  ];

  const handleMockAction = (action: string, userName: string) => {
    toast.success(`${action} for ${userName} (demo)`);
  };

  return (
    <RoleGate allowedRoles={[ROLES.ADMIN]}>
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
              <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
              <p className="text-muted-foreground">User management and system settings.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium">Name</th>
                            <th className="px-4 py-3 text-left font-medium">Email</th>
                            <th className="px-4 py-3 text-left font-medium">Role</th>
                            <th className="px-4 py-3 text-left font-medium">Last Active</th>
                            <th className="px-4 py-3 text-left font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {DEMO_USERS.map((user) => (
                            <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30">
                              <td className="px-4 py-3 font-medium">{user.name}</td>
                              <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                              <td className="px-4 py-3">
                                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">Just now</td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleMockAction('Edit Role', user.name)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleMockAction('Reset Password', user.name)}
                                  >
                                    <KeyRound className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Role Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={roleDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          label
                        >
                          {roleDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '0.5rem',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    <CardTitle>System Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="new-apps">New Applications</Label>
                        <p className="text-xs text-muted-foreground">Allow submission of new loan applications</p>
                      </div>
                      <Switch
                        id="new-apps"
                        checked={features.newApplications}
                        onCheckedChange={(v) => setFeatures((f) => ({ ...f, newApplications: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-disburse">Auto Disburse</Label>
                        <p className="text-xs text-muted-foreground">Automatically disburse approved loans</p>
                      </div>
                      <Switch
                        id="auto-disburse"
                        checked={features.autoDisburse}
                        onCheckedChange={(v) => setFeatures((f) => ({ ...f, autoDisburse: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notif">Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Send email alerts for status changes</p>
                      </div>
                      <Switch
                        id="email-notif"
                        checked={features.emailNotifications}
                        onCheckedChange={(v) => setFeatures((f) => ({ ...f, emailNotifications: v }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-alerts">SMS Alerts</Label>
                        <p className="text-xs text-muted-foreground">Send SMS alerts to customers</p>
                      </div>
                      <Switch
                        id="sms-alerts"
                        checked={features.smsAlerts}
                        onCheckedChange={(v) => setFeatures((f) => ({ ...f, smsAlerts: v }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleGate>
  );
}
