import { NextRequest, NextResponse } from 'next/server';
import { MOCK_AUDIT_ENTRIES } from '@/lib/mockData';
import { sleep } from '@/lib/utils';

export async function GET(request: NextRequest) {
  await sleep(200 + Math.random() * 600);
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '50', 10);
  const actor = searchParams.get('actor') || '';
  const action = searchParams.get('action') || '';
  const fromDate = searchParams.get('fromDate') || '';
  const toDate = searchParams.get('toDate') || '';

  let data = [...MOCK_AUDIT_ENTRIES];

  if (actor) {
    data = data.filter((e) => e.actor === actor);
  }
  if (action) {
    data = data.filter((e) => e.action === action);
  }
  if (fromDate) {
    const from = new Date(fromDate);
    data = data.filter((e) => new Date(e.timestamp) >= from);
  }
  if (toDate) {
    const to = new Date(toDate);
    to.setHours(23, 59, 59, 999);
    data = data.filter((e) => new Date(e.timestamp) <= to);
  }

  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const paginated = data.slice(start, start + pageSize);

  return NextResponse.json({
    data: paginated,
    total,
    page,
    pageSize,
    totalPages,
  });
}
