import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from Coingecko' }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ usd: data.ethereum.usd });
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
