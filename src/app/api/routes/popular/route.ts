import { NextResponse } from 'next/server';
import { POPULAR_ROUTES } from '@/services/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: POPULAR_ROUTES,
  });
}
