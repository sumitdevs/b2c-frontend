import { NextResponse } from 'next/server';
import { MOCK_OFFERS } from '@/services/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: MOCK_OFFERS,
    total: MOCK_OFFERS.length,
  });
}
