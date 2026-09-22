import { NextRequest, NextResponse } from 'next/server';
import { BASE_BUSES, generateSeats } from '@/services/mockData';
import { Bus } from '@/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from') || 'Bangalore';
  const to = searchParams.get('to') || 'Goa';
  const date = searchParams.get('date') || '2026-09-22';

  const buses = generateBusesForRoute(from, to, date);
  return NextResponse.json({
    success: true,
    data: buses,
    query: { from, to, date },
    total: buses.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const from = body.from || 'Bangalore';
    const to = body.to || 'Goa';
    const date = body.date || '2026-09-22';

    const buses = generateBusesForRoute(from, to, date);
    return NextResponse.json({
      success: true,
      data: buses,
      query: { from, to, date },
      total: buses.length,
    });
  } catch {
    const buses = generateBusesForRoute('Bangalore', 'Goa', '2026-09-22');
    return NextResponse.json({
      success: true,
      data: buses,
      total: buses.length,
    });
  }
}

function generateBusesForRoute(from: string, to: string, _date: string): Bus[] {
  const origin = from.trim() || 'Bangalore';
  const destination = to.trim() || 'Goa';
  const originCode = origin.slice(0, 3).toLowerCase();
  const destCode = destination.slice(0, 3).toLowerCase();

  return BASE_BUSES.map((base, idx) => {
    const priceAdjustment = (idx % 3) * 40;
    return {
      ...base,
      id: base.id,
      originCity: origin,
      destinationCity: destination,
      price: base.price + priceAdjustment,
      originalPrice: base.originalPrice + priceAdjustment,
      boardingPoints: [
        {
          id: `bp-${base.id}-1`,
          time: base.departureTime,
          location: `${origin} Central Bus Terminal`,
          landmark: 'Platform 4, Main Terminal',
        },
        {
          id: `bp-${base.id}-2`,
          time: addMinutes(base.departureTime, 45),
          location: `${origin} Highway Bypass Toll`,
          landmark: 'Toll Plaza Gate 2',
        },
      ],
      droppingPoints: [
        {
          id: `dp-${base.id}-1`,
          time: base.arrivalTime,
          location: `${destination} Central Stand`,
          landmark: 'Main City Circle',
        },
        {
          id: `dp-${base.id}-2`,
          time: addMinutes(base.arrivalTime, 40),
          location: `${destination} Highway Junction`,
          landmark: 'Flyover Bay',
        },
      ],
      seats: generateSeats(),
    };
  });
}

function addMinutes(timeStr: string, minutesToAdd: number): string {
  try {
    const [h, m] = timeStr.split(':').map(Number);
    const totalMinutes = (h * 60 + m + minutesToAdd) % (24 * 60);
    const newH = Math.floor(totalMinutes / 60);
    const newM = totalMinutes % 60;
    return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
  } catch {
    return timeStr;
  }
}
