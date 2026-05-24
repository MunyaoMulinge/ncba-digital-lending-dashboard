import { NextRequest, NextResponse } from 'next/server';
import { DEMO_USERS } from '@/lib/mockData';
import { sleep } from '@/lib/utils';

const VALID_PASSWORDS: Record<string, string> = {
  'admin@ncba.demo': 'admin123',
  'manager@ncba.demo': 'manager123',
  'officer@ncba.demo': 'officer123',
  'auditor@ncba.demo': 'auditor123',
};

export async function POST(request: NextRequest) {
  await sleep(400 + Math.random() * 400);
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (VALID_PASSWORDS[normalizedEmail] !== password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = DEMO_USERS.find((u) => u.email === normalizedEmail);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const token = `mock-jwt-${Date.now()}-${Math.random().toString(36).substring(2)}`;

    return NextResponse.json({ token, user });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
