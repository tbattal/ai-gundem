/**
 * On-demand ISR revalidation endpoint.
 *
 * DB güncellendikten sonra (manuel script, RSS ingest, vb.) bu endpoint
 * tetiklenir; ilgili sayfaların cache'i invalidate olur, bir sonraki istek
 * fresh veriyle render edilir.
 *
 * Kimlik doğrulama: ?secret=... query param + REVALIDATE_SECRET env karşılaştırması.
 * Production'da REVALIDATE_SECRET tanımlı OLMALIDIR — aksi halde tüm istekler 503 döner.
 *
 * İstek gövdesi (JSON):
 *   {
 *     "all": true                       // tüm ana yüzeyler (anasayfa, arşiv, tüm kategori ve haber sayfaları)
 *     "paths": ["/haber/some-slug"]     // belirli yollar (path listesi)
 *     "tags":  ["haber-list"]           // Next.js cache tag (ileride kullanım için)
 *   }
 *
 * Örnekler:
 *   curl -X POST "$URL/api/revalidate?secret=$S" -H "Content-Type: application/json" -d '{"all":true}'
 *   curl -X POST "$URL/api/revalidate?secret=$S" -H "Content-Type: application/json" -d '{"paths":["/haber/slug-1","/"]}'
 *
 * Yanıt: { ok: true, revalidated: { paths, tags, all }, at: <iso-timestamp> }
 */
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

interface RevalidateBody {
  all?: boolean;
  paths?: string[];
  tags?: string[];
}

const STATIC_PATHS = ['/'] as const;
const DYNAMIC_TEMPLATES = [
  '/haber/[slug]',
  '/kategori/[kategori]',
] as const;
const TAG_HABER_LIST = 'haber-list';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = req.nextUrl.searchParams.get('secret');
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'REVALIDATE_SECRET tanımlı değil' },
      { status: 503 },
    );
  }
  if (!secret || secret !== expected) {
    return NextResponse.json(
      { ok: false, error: 'Geçersiz secret' },
      { status: 401 },
    );
  }

  let body: RevalidateBody = {};
  try {
    body = (await req.json()) as RevalidateBody;
  } catch {
    // boş body kabul edilebilir
  }

  const revalidated = { paths: [] as string[], tags: [] as string[], all: false };

  if (body.all) {
    for (const p of STATIC_PATHS) revalidatePath(p);
    for (const t of DYNAMIC_TEMPLATES) revalidatePath(t, 'page');
    revalidateTag(TAG_HABER_LIST);
    revalidated.paths = [...STATIC_PATHS, ...DYNAMIC_TEMPLATES];
    revalidated.tags = [TAG_HABER_LIST];
    revalidated.all = true;
  }

  for (const p of body.paths ?? []) revalidatePath(p);
  for (const t of body.tags ?? []) revalidateTag(t);

  if (body.paths?.length) revalidated.paths.push(...body.paths);
  if (body.tags?.length) revalidated.tags.push(...body.tags);

  return NextResponse.json({
    ok: true,
    revalidated,
    at: new Date().toISOString(),
  });
}
