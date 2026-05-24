import { NextResponse } from 'next/server';
import { MOCK_CUSTOMERS } from '@/lib/mockData';
import { sleep } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await sleep(200 + Math.random() * 600);
  const { id } = await params;
  const customer = MOCK_CUSTOMERS.find((c) => c.id === id);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }
  return NextResponse.json(customer);
}
