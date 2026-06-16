import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
loadEnv();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const targets = [
  ['openai-gpt-5-modelini-resmen-tanitti-doktora-seviyesinde-uzman-i-ddias', 'gpt5.jpg'],
  ['anthropic-claude-4-opus-yayinda-7-saat-kesintisiz-kodlama-yapabiliyor', 'claude.jpg'],
  ['ab-ai-act-yururluge-girdi-dunyanin-en-kapsamli-yapay-zek-yasasi', 'eu.jpg'],
  ['tesla-optimus-gen-2-hareket-kabiliyeti-i-kiye-katlandi', 'optimus.jpg'],
  ['boston-dynamics-yeni-elektrikli-atlas-i-tanitti-hidrolik-cag-kapaniyor', 'boston.jpg'],
  ['figure-02-bmw-fabrikasinda-i-lk-kez-calismaya-basladi', 'figure.jpg'],
  ['1x-technologies-ev-tipi-robotu-neo-yu-duyurdu-i-nsanlarla-birlikte-yas', 'neo.jpg'],
  ['cinli-unitree-h1-90-bin-dolarlik-fiyatiyla-i-nsansi-robot-demokrasi-mi', 'unitree.jpg'],
  ['yapay-zek-30-yildir-bulunamayan-yeni-antibiyotigi-kesfetti', 'antibiyotik.jpg'],
  ['yapay-zek-27-yilda-kesfedilenden-fazla-galaksi-tespit-etti', 'galaksi.jpg'],
  ['deepmind-in-alphafold-3-u-tum-yasamin-molekuler-yapisini-cozuyor', 'alphafold.jpg'],
  ['apple-wwdc-2024-te-apple-intelligence-cagini-baslatti', 'apple.jpg'],
  ['cursor-ai-yazilim-gelistiricilerin-yeni-gozdesi-200-milyon-dolar-deger', 'cursor.jpg'],
  ['adobe-firefly-3-ticari-kullanima-hazir-gorsel-uretimde-yeni-standart', 'firefly.jpg'],
  ['elevenlabs-turkce-dahil-32-dilde-dogal-ses-uretimi-sunuyor', 'elevenlabs.jpg'],
] as const;

async function main() {
  const { data, error } = await supabase
    .from('haberler')
    .select('slug, gorsel')
    .in('slug', targets.map(([s]) => s));

  if (error) { console.error(error); return; }
  for (const [slug, filename] of targets) {
    const row = data?.find((r) => r.slug === slug);
    if (!row) { console.log(`MISSING: ${slug}`); continue; }
    console.log(`${filename}\t${row.gorsel}`);
  }
}

main();
