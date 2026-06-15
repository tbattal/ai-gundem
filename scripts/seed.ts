/**
 * Seed verisini veritabanına yükler (idempotent: slug çakışırsa atlar).
 * Kullanım:  npm run db:seed
 */
import { config as loadEnv } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

loadEnv({ path: '.env.local' });
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!url || !serviceKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

interface SeedRow {
  slug: string;
  baslik: string;
  ozet: string;
  icerik: string | null;
  gorsel: string;
  kaynak_ad: string;
  kaynak_url: string;
  kaynak_logo: string | null;
  yazar: string | null;
  kategori: string;
  etiketler: string[];
  yayin_tarihi: string;
  okuma_suresi: number;
  orijinal_url: string;
  one_cikan: boolean;
}

const HOUR = 60 * 60 * 1000;
const now = Date.now();
const saatOnce = (h: number) => new Date(now - h * HOUR).toISOString();

const seedData: SeedRow[] = [
  {
    slug: 'openai-gpt-5-duyuruldu',
    baslik: "OpenAI, GPT-5'i Duyurdu: \"Muhtemelen Son Dokunuş\"",
    ozet: "OpenAI, çoklu-modal yetenekleri ve 1M token bağlam penceresiyle GPT-5'i tanıttı. CEO Sam Altman, modelin \"yapay genel zekanın son dokunuşu olabileceğini\" söyledi.",
    icerik: "OpenAI, bugün yaptığı basın toplantısında GPT-5 modelini resmen duyurdu. Yeni model, 1 milyon token bağlam penceresi, geliştirilmiş çoklu-modal yetenekler (metin, görsel, ses, video) ve önemli ölçüde azaltılmış halüsinasyon oranı ile geliyor.\n\nŞirket, GPT-5'in özellikle kodlama, matematik ve bilimsel akıl yürütme alanlarında seleflerine göre ciddi sıçrama yaptığını belirtti. Benchmark sonuçlarına göre model, SWE-bench Verified testlerinde %78, AIME 2024'te %94 başarı elde etti.\n\nCEO Sam Altman etkinlikte yaptığı konuşmada, \"Bu, yapay genel zekaya giden yolda muhtemelen son dokunuş olabilir\" dedi. Model, ChatGPT Pro ve API üzerinden önümüzdeki hafta kullanıma açılacak.",
    gorsel: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600',
    kaynak_ad: 'TechCrunch',
    kaynak_url: 'https://techcrunch.com',
    kaynak_logo: null,
    yazar: 'Maxwell Zeff',
    kategori: 'buyuk-dil-modelleri',
    etiketler: ['openai', 'gpt-5', 'llm', 'duyuru'],
    yayin_tarihi: saatOnce(2),
    okuma_suresi: 5,
    orijinal_url: 'https://techcrunch.com/2026/06/14/openai-gpt-5-announcement',
    one_cikan: true,
  },
  {
    slug: 'anthropic-claude-4-7-uretken-yazma',
    baslik: 'Anthropic, Claude 4.7\'yi "Yazma Dostu" Olarak Konumlandırıyor',
    ozet: 'Yeni Claude 4.7, editoryal ton, makale yapısı ve kaynakça yönetiminde ciddi iyileştirmeler içeriyor. Yayıncılar için özel bir playbook yayımlandı.',
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1611937663129-bf3abf0d7b5d?w=1600',
    kaynak_ad: 'The Verge',
    kaynak_url: 'https://www.theverge.com',
    kaynak_logo: null,
    yazar: 'Nilay Patel',
    kategori: 'buyuk-dil-modelleri',
    etiketler: ['anthropic', 'claude', 'yayincilik'],
    yayin_tarihi: saatOnce(5),
    okuma_suresi: 4,
    orijinal_url: 'https://www.theverge.com/2026/06/14/anthropic-claude-4-7',
    one_cikan: true,
  },
  {
    slug: 'google-gemini-robotik-ortakligi',
    baslik: 'Google DeepMind, Boston Dynamics ile Ortaklık Kurdu',
    ozet: "Gemini 3 Flash, Atlas insansı robotlarının \"anlık muhakeme\" modülü olarak kullanılacak. Ortaklık 3 yıllık bir Ar-Ge programını kapsıyor.",
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600',
    kaynak_ad: 'MIT Technology Review',
    kaynak_url: 'https://www.technologyreview.com',
    kaynak_logo: null,
    yazar: 'James Temple',
    kategori: 'robotik',
    etiketler: ['google', 'deepmind', 'boston-dynamics', 'insansi-robot'],
    yayin_tarihi: saatOnce(8),
    okuma_suresi: 6,
    orijinal_url: 'https://www.technologyreview.com/2026/06/14/google-deepmind-boston-dynamics',
    one_cikan: false,
  },
  {
    slug: 'avrupa-birligi-ai-act-ikinci-dalga',
    baslik: "AB Yapay Zeka Yasası'nın İkinci Dalgası Yürürlüğe Girdi",
    ozet: 'Genel amaçlı modeller için yeni şeffaflık kuralları, eğitim verisi özetleri ve hesap verebilirlik raporlaması bugün itibarıyla zorunlu oldu.',
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1600',
    kaynak_ad: 'Reuters',
    kaynak_url: 'https://www.reuters.com',
    kaynak_logo: null,
    yazar: 'Foo Yun Chee',
    kategori: 'politika-etik',
    etiketler: ['avrupa-birligi', 'duzenleme', 'ai-act'],
    yayin_tarihi: saatOnce(12),
    okuma_suresi: 7,
    orijinal_url: 'https://www.reuters.com/technology/eu-ai-act-second-wave',
    one_cikan: false,
  },
  {
    slug: 'mistral-8x22b-acik-kaynak',
    baslik: 'Mistral, 8x22B Açık Kaynak Modelini Yayımladı',
    ozet: "Fransız yapay zeka şirketi, Apache 2.0 lisansıyla 176B parametreli MoE modelini kamuya açtı. Tek GPU'da inference mümkün.",
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600',
    kaynak_ad: 'VentureBeat',
    kaynak_url: 'https://venturebeat.com',
    kaynak_logo: null,
    yazar: 'Carl Franzen',
    kategori: 'acik-kaynak',
    etiketler: ['mistral', 'acik-kaynak', 'moe', 'llm'],
    yayin_tarihi: saatOnce(24),
    okuma_suresi: 4,
    orijinal_url: 'https://venturebeat.com/ai/mistral-8x22b',
    one_cikan: false,
  },
  {
    slug: 'sora-2-video-uretimi',
    baslik: 'OpenAI, Sora 2 ile 60 Saniyelik Tutarlı Video Üretiyor',
    ozet: 'Yeni Sora 2, karakter tutarlılığı, kamera kontrolü ve fizik simülasyonunda önemli gelişmeler sunuyor. Sinema endüstrisi endişeli.',
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1600',
    kaynak_ad: 'Wired',
    kaynak_url: 'https://www.wired.com',
    kaynak_logo: null,
    yazar: 'Will Knight',
    kategori: 'araclar',
    etiketler: ['openai', 'sora', 'video', 'uretici'],
    yayin_tarihi: saatOnce(28),
    okuma_suresi: 5,
    orijinal_url: 'https://www.wired.com/story/sora-2-openai',
    one_cikan: false,
  },
  {
    slug: 'nvidia-yeni-gpu-yatirim',
    baslik: 'NVIDIA, Yeni Blackwell Ultra GPU\'ları Duyurdu',
    ozet: "B200 Ultra, eğitim maliyetlerini %40 azaltıyor ve 208B parametreli modellerin tek bir node'da eğitilmesini sağlıyor.",
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1600',
    kaynak_ad: 'Reuters',
    kaynak_url: 'https://www.reuters.com',
    kaynak_logo: null,
    yazar: 'Max A. Cherney',
    kategori: 'is-dunyasi',
    etiketler: ['nvidia', 'gpu', 'donanim', 'yatirim'],
    yayin_tarihi: saatOnce(32),
    okuma_suresi: 4,
    orijinal_url: 'https://www.reuters.com/technology/nvidia-blackwell-ultra',
    one_cikan: false,
  },
  {
    slug: 'ai-arac-cagirimi-perplexity-vs-google',
    baslik: "Perplexity, Google'a Meydan Okuyor: \"Bilginin Geleceği\"",
    ozet: 'Perplexity, yeni "Comet" tarayıcısıyla arama deneyimini sıfırdan tasarlıyor. Google hisseleri son 3 günde %6 değer kaybetti.',
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1600',
    kaynak_ad: 'TechCrunch',
    kaynak_url: 'https://techcrunch.com',
    kaynak_logo: null,
    yazar: 'Sarah Perez',
    kategori: 'is-dunyasi',
    etiketler: ['perplexity', 'google', 'arama'],
    yayin_tarihi: saatOnce(36),
    okuma_suresi: 5,
    orijinal_url: 'https://techcrunch.com/2026/06/13/perplexity-comet-browser',
    one_cikan: false,
  },
  {
    slug: 'meta-llama-4-acik-kaynak',
    baslik: 'Meta, Llama 4\'ü Açık Kaynak Yaptı: 400B Parametre',
    ozet: 'Llama 4, multimodalite, 10M token bağlam ve 400B parametre ile geliyor. Lisans tartışmaları sürüyor — "70B üstü için izin gerekli" maddesi kaldırıldı.',
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=1600',
    kaynak_ad: 'The Verge',
    kaynak_url: 'https://www.theverge.com',
    kaynak_logo: null,
    yazar: 'Alex Heath',
    kategori: 'acik-kaynak',
    etiketler: ['meta', 'llama', 'acik-kaynak'],
    yayin_tarihi: saatOnce(48),
    okuma_suresi: 5,
    orijinal_url: 'https://www.theverge.com/2026/06/12/meta-llama-4',
    one_cikan: false,
  },
  {
    slug: 'github-copilot-ekip-lisanslari',
    baslik: 'GitHub, Kurumsal Copilot Lisanslarını Yeniden Yapılandırdı',
    ozet: 'Yeni "Copilot Teams" paketi, küçük ekipler için uygun fiyatlı, "Copilot Enterprise" ise özel model fine-tuning dahil.',
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1600',
    kaynak_ad: 'TechCrunch',
    kaynak_url: 'https://techcrunch.com',
    kaynak_logo: null,
    yazar: 'Frederic Lardinois',
    kategori: 'araclar',
    etiketler: ['github', 'copilot', 'devops', 'kurumsal'],
    yayin_tarihi: saatOnce(52),
    okuma_suresi: 4,
    orijinal_url: 'https://techcrunch.com/2026/06/12/github-copilot-teams',
    one_cikan: false,
  },
  {
    slug: 'ai-bilinc-tartismasi-yukseliyor',
    baslik: 'AI Bilinci Tartışması: 100 Araştırmacı Açık Mektup Yayımladı',
    ozet: 'Yapay zekâda bilinç ihtimali üzerine imzalanan mektup, 100+ nörobilimci ve AI araştırmacısını bir araya getirdi. Anthropic ve DeepMind çalışanları da imzacılar arasında.',
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1600',
    kaynak_ad: 'MIT Technology Review',
    kaynak_url: 'https://www.technologyreview.com',
    kaynak_logo: null,
    yazar: 'Karen Hao',
    kategori: 'politika-etik',
    etiketler: ['bilinc', 'etik', 'arastirma', 'mektup'],
    yayin_tarihi: saatOnce(56),
    okuma_suresi: 8,
    orijinal_url: 'https://www.technologyreview.com/2026/06/12/ai-consciousness-letter',
    one_cikan: false,
  },
  {
    slug: 'deepmind-protein-tasarimi',
    baslik: 'DeepMind, Protein Tasarımında Yeni Bir Çağ Açıyor',
    ozet: 'AlphaFold 4, sadece var olan proteinleri tahmin etmekle kalmıyor, istenen özelliklere sahip yeni proteinleri sıfırdan tasarlayabiliyor.',
    icerik: null,
    gorsel: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600',
    kaynak_ad: 'Nature',
    kaynak_url: 'https://www.nature.com',
    kaynak_logo: null,
    yazar: 'Ewen Callaway',
    kategori: 'arastirma',
    etiketler: ['deepmind', 'alphafold', 'biyoloji', 'arastirma'],
    yayin_tarihi: saatOnce(72),
    okuma_suresi: 6,
    orijinal_url: 'https://www.nature.com/articles/deepmind-alphafold-4',
    one_cikan: false,
  },
];

async function main() {
  console.log(`▶ ${seedData.length} satır seed verisi yüklenecek...`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of seedData) {
    const { data: existing } = await supabase
      .from('haberler').select('id').eq('slug', row.slug).maybeSingle();
    if (existing) { skipped++; continue; }

    const { error } = await supabase.from('haberler').insert(row);
    if (error) {
      console.error(`  ❌ ${row.slug}: ${error.message}`);
      failed++;
    } else {
      inserted++;
      console.log(`  ✓ ${row.slug}`);
    }
  }

  console.log(`\n📊 Sonuç: ${inserted} eklendi, ${skipped} atlandı, ${failed} hata.`);
}

main().catch((err) => { console.error('❌ Seed hatası:', err); process.exit(1); });
