import { NextResponse } from 'next/server';
import { getHaberler } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get('limit') ?? 20);
  const kategori = url.searchParams.get('kategori') ?? undefined;
  const oneCikan = url.searchParams.get('one_cikan') === 'true';

  try {
    const data = await getHaberler({
      limit: Math.min(Math.max(limit, 1), 100),
      kategori: kategori as never,
      oneCikan,
    });
    return NextResponse.json({ success: true, data, meta: { count: data.length } });
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: (err as Error).message },
      { status: 500 },
    );
  }
}
