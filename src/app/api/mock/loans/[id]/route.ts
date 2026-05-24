import { NextResponse } from 'next/server';
import { MOCK_LOANS } from '@/lib/mockData';
import { sleep } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await sleep(200 + Math.random() * 600);
  const { id } = await params;
  const loan = MOCK_LOANS.find((l) => l.id === id);
  if (!loan) {
    return NextResponse.json({ error: 'Loan not found' }, { status: 404 });
  }
  return NextResponse.json(loan);
}
