import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ message: 'Seed office endpoint disabled.' });
}
