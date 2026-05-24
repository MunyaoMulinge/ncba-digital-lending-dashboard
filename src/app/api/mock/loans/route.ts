import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LOANS } from '@/lib/mockData';
import { sleep } from '@/lib/utils';

export async function GET(request: NextRequest) {
  await sleep(200 + Math.random() * 600);
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '25', 10);
  const status = searchParams.get('status') || '';
  const riskRating = searchParams.get('riskRating') || '';
  const search = searchParams.get('search') || '';
  const sortColumn = searchParams.get('sortColumn') || 'submittedAt';
  const sortDirection = searchParams.get('sortDirection') || 'desc';

  let data = [...MOCK_LOANS];

  if (status) {
    data = data.filter((l) => l.status === status);
  }
  if (riskRating) {
    data = data.filter((l) => l.riskRating === riskRating);
  }
  if (search) {
    const q = search.toLowerCase();
    data = data.filter(
      (l) =>
        l.customerName.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
    );
  }

  data.sort((a, b) => {
    const aVal = a[sortColumn as keyof typeof a];
    const bVal = b[sortColumn as keyof typeof b];
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal ?? '');
    const bStr = String(bVal ?? '');
    return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  });

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
