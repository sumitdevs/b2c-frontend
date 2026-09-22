import { NextResponse } from 'next/server';
import { CITIES } from '@/services/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: CITIES,
  });
}
