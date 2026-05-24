import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CUSTOMERS } from '@/lib/mockData';
import { sleep } from '@/lib/utils';

export async function GET(request: NextRequest) {
  await sleep(200 + Math.random() * 600);
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '50', 10);
  const search = searchParams.get('search') || '';
  const kycStatus = searchParams.get('kycStatus') || '';
  const employmentType = searchParams.get('employmentType') || '';

  let data = [...MOCK_CUSTOMERS];

  if (search) {
    const q = search.toLowerCase();
    data = data.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.idNumber.includes(q)
    );
  }
  if (kycStatus) {
    data = data.filter((c) => c.kycStatus === kycStatus);
  }
  if (employmentType) {
    data = data.filter((c) => c.employmentType === employmentType);
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
