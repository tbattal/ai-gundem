import { NextResponse } from 'next/server';
import { getHaberBySlug } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  try {
    const haber = await getHaberBySlug(params.slug);
    if (!haber) {
      return NextResponse.json(
        { success: false, data: null, error: 'Haber bulunamadı' },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, data: haber });
  } catch (err) {
    return NextResponse.json(
      { success: false, data: null, error: (err as Error).message },
      { status: 500 },
    );
  }
}
