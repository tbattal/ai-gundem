/**
 * Türkçe AI/tech haberleri — 50 adet, farklı kaynaklardan.
 *
 * Yaklaşım: Senkretik ama gerçekçi — gerçek 2024-2025 AI olaylarına dayalı,
 * gerçek Türkçe tech sitelerine atıf, gerçekçi başlık/özet/içerik.
 * 12 kaynak × 7 kategoriye dağıtılmış.
 *
 * Görsel: Unsplash Source API (https://source.unsplash.com/1280x720/?keyword)
 * Logo: Google Favicon API (https://www.google.com/s2/favicons?domain=...&sz=128)
 *
 * Kullanım:  npx tsx scripts/seed-tr-yapay-zeka.ts
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

// Kaynak listesi — gerçek Türkçe tech siteleri
const KAYNAKLAR = {
  webtekno: { ad: 'Webtekno', url: 'https://www.webtekno.com', domain: 'webtekno.com' },
  shiftdelete: { ad: 'ShiftDelete', url: 'https://shiftdelete.net', domain: 'shiftdelete.net' },
  donanimhaber: { ad: 'Donanım Haber', url: 'https://www.donanimhaber.com', domain: 'donanimhaber.com' },
  chip: { ad: 'Chip Online', url: 'https://www.chip.com.tr', domain: 'chip.com.tr' },
  webrazzi: { ad: 'Webrazzi', url: 'https://webrazzi.com', domain: 'webrazzi.com' },
  gelecegiyazanlar: { ad: 'Geleceği Yazanlar', url: 'https://gelecegiyazanlar.turkcell.com.tr', domain: 'gelecegiyazanlar.turkcell.com.tr' },
  bthaber: { ad: 'BThaber', url: 'https://bthaber.com', domain: 'bthaber.com' },
  technopat: { ad: 'Technopat', url: 'https://www.technopat.net', domain: 'technopat.net' },
  log: { ad: 'Log.com.tr', url: 'https://www.log.com.tr', domain: 'log.com.tr' },
  hurriyet: { ad: 'Hürriyet', url: 'https://www.hurriyet.com.tr', domain: 'hurriyet.com.tr' },
  ntv: { ad: 'NTV', url: 'https://www.ntv.com.tr', domain: 'ntv.com.tr' },
  trt: { ad: 'TRT Haber', url: 'https://www.trthaber.com', domain: 'trthaber.com' },
} as const;

const logoUrl = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
const gorselUrl = (keyword: string) => `https://source.unsplash.com/1280x720/?${encodeURIComponent(keyword)}`;

type Kaynak = keyof typeof KAYNAKLAR;
type Kategori =
  | 'buyuk-dil-modelleri' | 'arastirma' | 'araclar' | 'robotik'
  | 'politika-etik' | 'is-dunyasi' | 'acik-kaynak';

interface Haber {
  slug: string;
  baslik: string;
  ozet: string;
  icerik: string;
  gorsel: string;
  kaynak: Kaynak;
  yazar: string | null;
  kategori: Kategori;
  etiketler: string[];
  yayin_tarihi: string;
  okuma_suresi: number;
  orijinal_url: string;
  one_cikan: boolean;
}

const H = (
  kaynak: Kaynak,
  yazar: string | null,
  kategori: Kategori,
  etiketler: string[],
  tarih: string,
  manset: boolean,
  gorselKw: string,
  baslik: string,
  ozet: string,
  icerik: string,
  orijinalPath: string,
  okuma = 4,
): Haber => {
  const k = KAYNAKLAR[kaynak];
  const slug = baslik
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ü/g, 'u').replace(/ö/g, 'o')
    .replace(/ş/g, 's').replace(/ç/g, 'c').replace(/ğ/g, 'g')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
  return {
    slug,
    baslik,
    ozet,
    icerik,
    gorsel: gorselUrl(gorselKw),
    kaynak: kaynak as Kaynak,
    yazar,
    kategori,
    etiketler,
    yayin_tarihi: tarih,
    okuma_suresi: okuma,
    orijinal_url: k.url + orijinalPath,
    one_cikan: manset,
  };
};

const HABERLER: Haber[] = [
// ============================================================
// BÖLÜM 1: BÜYÜK DİL MODELLERİ (1-10)
// ============================================================
H('webtekno', 'Mert Can Aka', 'buyuk-dil-modelleri',
  ['GPT-5', 'OpenAI', 'yapay genel zeka', 'çok modlu'],
  '2025-08-08T14:00:00+03:00', true, 'artificial-intelligence,future,robot',
  'OpenAI, GPT-5 Modelini Resmen Tanıttı: "Doktora Seviyesinde Uzman" İddiası',
  'OpenAI, yeni amiral gemisi modeli GPT-5\'i duyurdu. Şirket, modelin tıp, hukuk ve mühendislik alanlarında uzman seviyesinde performans gösterdiğini açıkladı.',
  'OpenAI, 8 Ağustos 2025\'te gerçekleştirdiği canlı yayınla merakla beklenen GPT-5 modelini resmen tanıttı. Şirketin CEO\'su Sam Altman, yeni modelin "ilk kez doktora seviyesinde uzmanlık gerektiren görevlerde insan performansına yaklaştığını" söyledi. GPT-5, selefi GPT-4o\'ya kıyasla karmaşık muhakeme, matematiksel akıl yürütme ve çok modlu anlama alanlarında önemli iyileştirmeler sunuyor. Model, 400 bin token bağlam penceresiyle çalışıyor ve 50\'den fazla dilde akıcı metin üretebiliyor.\n\nBenchmark sonuçlarına göre GPT-5, GPQA (Graduate-Level Google-Proof Q&A) testinde yüzde 87, AIME 2025 matematik olimpiyatında yüzde 96, SWE-Bench kodlama değerlendirmesinde ise yüzde 75 başarı elde etti. Bu sonuçlar, modelin özellikle bilimsel araştırma ve yazılım geliştirme alanlarında çığır açıcı bir potansiyele sahip olduğunu gösteriyor. OpenAI, ayrıca yeni bir "Deep Research" modu duyurdu; bu mod, bir konuda dakikalar içinde kapsamlı araştırma raporları üretebiliyor.\n\nGPT-5, ChatGPT Plus, Pro, Team ve Enterprise kullanıcılarına kademeli olarak sunulmaya başlandı. API erişimi ise önümüzdeki hafta itibarıyla geliştiricilere açılacak. Fiyatlandırma, GPT-4o ile aynı seviyede tutuldu: giriş için milyon token başına 2.5 dolar, çıkış için 10 dolar. Altman, "Yapay genel zekâya giden yolda önemli bir adım" derken, bazı araştırmacılar bu iddiaların abartılı olduğunu ve bağımsız değerlendirmelerin şart olduğunu vurguladı.',
  '/gpt-5-tanitildi-h128450.html', 5),

H('shiftdelete', 'Cem Kıvırcık', 'buyuk-dil-modelleri',
  ['Claude 4 Opus', 'Anthropic', 'yapay zeka', 'kodlama'],
  '2025-05-22T10:30:00+03:00', false, 'technology,code,artificial',
  'Anthropic Claude 4 Opus Yayında: 7 Saat Kesintisiz Kodlama Yapabiliyor',
  'Anthropic, en güçlü modeli Claude 4 Opus\'u kullanıma sundu. Şirket, modelin 7 saat boyunca kesintisiz, hatasız kod yazabildiğini gösteren bir demo yayınladı.',
  'Anthropic, 22 Mayıs 2025\'te yeni nesil amiral gemisi modeli Claude 4 Opus\'u resmen kullanıma açtı. Şirket, duyurusunda modelin özellikle yazılım geliştirme alanında devrim niteliğinde bir sıçrama yaptığını vurguladı. Tanıtım etkinliğinde sergilenen bir demoda, Claude 4 Opus\'un 7 saat boyunca kesintisiz çalışarak 10 bin satırdan fazla kod ürettiği ve bunu yaparken tutarlı bir mimari karar silsilesi izlediği görüldü. Bu süre zarfında model hiçbir insan müdahalesi olmadan hata ayıklama, refaktör ve dokümantasyon işlemlerini tamamladı.\n\nModel, "extended thinking" adı verilen yeni bir özellikle geliyor. Bu özellik, Claude\'un bir problemi adım adım düşünmesini sağlayarak özellikle karmaşık matematik ve mühendislik problemlerinde dramatik iyileşme sağlıyor. Anthropic\'in paylaştığı SWE-Bench Verified skoruna göre Claude 4 Opus, yüzde 72.5 ile bu testte dünya lideri konumunda. Bunun yanı sıra Terminal-Bench değerlendirmesinde yüzde 65, GPQA Diamond testinde ise yüzde 83 başarı elde etti.\n\nClaude 4 Opus\'un fiyatlandırması selefine göre yüzde 30 daha düşük: giriş token başına 15 dolar, çıkış token başına 75 dolar. Şirket aynı zamanda daha ekonomik bir seçenek olan Claude 4 Sonnet\'i de duyurdu. Anthropic, güvenlik konusunda da yeni adımlar attı; modelin "constitutional AI" eğitimi sırasında 14 farklı zarar kategorisine karşı test edildiği ve "refusal training" yani tehlikeli talepleri reddetme eğitiminin sıkılaştırıldığı belirtildi.',
  '/claude-4-opus-ozellikleri-h89732.html', 5),

H('webrazzi', 'Ersin Şentürk', 'buyuk-dil-modelleri',
  ['Gemini 2.5', 'Google', 'DeepMind', 'çok modlu'],
  '2025-03-25T09:00:00+03:00', false, 'google,technology,artificial-intelligence',
  'Google, Gemini 2.5 Pro\'yu Tanıttı: "Düşünen" Model Çağı Başlıyor',
  'Google DeepMind, yeni modeli Gemini 2.5 Pro\'yu duyurdu. Model, bir problemi çözmeden önce dahili olarak "düşünme" yeteneğiyle öne çıkıyor.',
  'Google DeepMind, 25 Mart 2025\'te merakla beklenen Gemini 2.5 Pro modelini tanıttığını açıkladı. Yeni model, özellikle "chain-of-thought" (düşünce zinciri) yeteneğiyle dikkat çekiyor. Google\'ın açıklamasına göre Gemini 2.5 Pro, bir soruya cevap vermeden önce dahili olarak uzun düşünme süreçleri işletebiliyor; bu da özellikle matematik, mantık ve kodlama gibi alanlarda dramatik performans artışı sağlıyor. Model, selefi Gemini 2.0 Flash\'a göre birçok benchmark\'ta yüzde 20-30 oranında daha iyi sonuçlar elde ediyor.\n\nGemini 2.5 Pro, 1 milyon token bağlam penceresiyle (2 milyona kadar genişletilebilir) çalışıyor. Bu, modelin aynı anda yaklaşık 1500 sayfalık bir kitabı işleyebileceği anlamına geliyor. Çok modlu yetenekleri de güçlendirildi: model artık metin, görsel, ses ve video verilerini aynı anda anlayabiliyor. Google, Humanity\'s Last Exam benchmark\'ında yüzde 18.8 skor elde ettiğini, bunun da OpenAI o1 ve Claude 3.7 Sonnet\'ten daha yüksek olduğunu belirtti.\n\nYeni model öncelikle Google AI Studio ve Vertex AI üzerinden geliştiricilere sunuldu. Tüketici tarafında ise Gemini Advanced aboneleri önümüzdeki haftalarda erişebilecek. Google, modelin "agentic" yani otonom görev yürütme kapasitesini de artırdığını; artık modelin bilgisayar kullanımı, dosya yönetimi ve çok adımlı araştırma süreçlerini daha güvenilir şekilde yönetebildiğini söyledi.',
  '/gemini-25-pro-tanitildi-h64218.html', 4),

H('donanimhaber', 'Ahmet Çalık', 'buyuk-dil-modelleri',
  ['Llama 3.3', 'Meta', 'açık kaynak', 'çok dilli'],
  '2024-12-06T16:00:00+03:00', false, 'opensource,technology,code',
  'Meta, Llama 3.3 70B Modelini Açık Kaynak Olarak Yayınladı',
  'Meta, 70 milyar parametreli Llama 3.3 modelini açık kaynak lisansla yayınladı. Şirket, yeni modelin 405B versiyonuna yakın performans sunduğunu iddia ediyor.',
  'Meta, 6 Aralık 2024\'te Llama ailesinin en yeni üyesi Llama 3.3 70B\'yi duyurdu. Yeni model, "küçük ama güçlü" felsefesiyle geliştirildi: 70 milyar parametreyle, selefi Llama 3.1 405B\'nin performansına yaklaştığı iddia ediliyor. Meta, resmi blog yazısında modelin MMLU (çok görevli dil anlama) testinde yüzde 86, matematik testlerinde yüzde 95, kodlama benchmark\'larında ise yüzde 88 başarı elde ettiğini açıkladı. Bu sonuçlar, özellikle tek bir GPU ile çalıştırılabilecek bir model için son derece etkileyici.\n\nLlama 3.3 70B, Meta\'nın özelleştirilmiş "post-training" sürecinden geçirildi. Şirket, insan geri bildirimi (RLHF) ve yapay tercih optimizasyonu (DPO) yöntemlerinin birleşimini kullanarak modelin talimat takibi ve diyalog yeteneklerini geliştirdi. Yeni model, 8 dilde (İngilizce, Almanca, Fransızca, İtalyanca, Portekizce, Hintçe, İspanyolca ve Taylandca) güçlü performans sunuyor. Meta ayrıca modelin uzun bağlam desteğini 128K token\'a çıkardığını duyurdu.\n\nModel, Meta\'nın geliştirici sitesinden ve Hugging Face üzerinden indirilebilir durumda. Ticari kullanıma açık olan lisans, 700 milyondan fazla aktif kullanıcısı olan şirketler için ek kısıtlamalar getiriyor. Meta, aynı zamanda Llama 3.3 70B\'nin 8B ve 405B varyantlarının da yıl sonuna kadar yayınlanacağını söyledi. Açık kaynak AI topluluğu, modeli büyük bir memnuniyetle karşıladı; Hugging Face\'te ilk 24 saatte 50 binden fazla indirme gerçekleşti.',
  '/meta-llama-33-70b-yayinda-h234871.html', 4),

H('chip', 'Selin Kara', 'buyuk-dil-modelleri',
  ['Mistral', 'Fransa', 'avrupa yapay zekası', 'açık kaynak'],
  '2024-07-24T11:00:00+03:00', false, 'europe,technology,artificial',
  'Fransız Mistral, Large 2 Modelini Tanıttı: Avrupa\'nın GPT-4 Alternatifi',
  'Mistral AI, yeni amiral gemisi modeli Mistral Large 2\'yi duyurdu. 123 milyar parametreli model, 11 dilde güçlü performans vaat ediyor.',
  'Paris merkezli Mistral AI, 24 Temmuz 2024\'te merakla beklenen Mistral Large 2 modelini resmen tanıttı. Şirket, yeni modelini "açık kaynak felsefesinin Avrupa\'daki en güçlü temsilcisi" olarak konumlandırdı. 123 milyar parametreli model, GPT-4 ve Claude 3 Opus ile karşılaştırılabilir performans sunduğunu iddia ediyor. Mistral, özellikle matematik ve kodlama alanlarında selefine göre yüzde 30 iyileşme sağladığını açıkladı. Model, MMLU benchmark\'ında yüzde 84, HumanEval kodlama testinde ise yüzde 92 başarı elde etti.\n\nMistral Large 2\'nin en dikkat çekici özelliği çok dilliliği: model 11 dilde (İngilizce, Fransızca, Almanca, İspanyolca, İtalyanca, Portekizce, Lehçe, Felemenkçe, Rusça, Çince ve Japonca) akıcı şekilde çalışabiliyor. Şirket, Fransızca, Almanca ve İspanyolca\'da GPT-4\'ten daha iyi sonuç verdiğini iddia etti. Bu, özellikle AB kurumları ve Avrupa şirketleri için büyük önem taşıyor; zira AB AI Act ile birlikte "veri egemenliği" tartışmaları yoğunlaşmış durumda.\n\nModelin lisans yapısı tartışmalı: "Mistral Research License" altında sunulan model, ticari kullanıma açık ancak 700 milyondan fazla aktif kullanıcısı olan platformlar için ek izin gerektiriyor. Tam açık kaynak topluluğu, "source-available" lisansını tam anlamıyla açık kaynak saymadı. Yine de Mistral, Avrupa yapay zeka ekosisteminin en önemli aktörlerinden biri olmaya devam ediyor; şirketin değerlemesi son yatırım turunda 6 milyar Euro\'ya ulaştı.',
  '/mistral-large-2-tanitildi-h198432.html', 4),

H('technopat', 'Burak Yıldız', 'buyuk-dil-modelleri',
  ['DeepSeek', 'Çin yapay zekası', 'maliyet etkin', 'açık kaynak'],
  '2024-12-26T08:00:00+03:00', false, 'china,technology,data',
  'Çinli DeepSeek V3, 2 Milyon Dolar Maliyetle GPT-4o\'yu Geçti',
  'Çinli DeepSeek, V3 modelini yalnızca 2 milyon dolar eğitim maliyetiyle eğitti. Model, birçok benchmark\'ta GPT-4o ve Claude 3.5\'i geride bırakıyor.',
  'Çin merkezli yapay zeka girişimi DeepSeek, 26 Aralık 2024\'te V3 modelinin teknik detaylarını kamuoyuyla paylaştı. Açık kaynak lisansla yayınlanan 671 milyar parametreli model, sektörde büyük yankı uyandırdı çünkü yalnızca 2 milyon dolar eğitim maliyetiyle GPT-4o ve Claude 3.5 Sonnet\'ten daha iyi sonuçlar elde ettiği bildirildi. Bu rakam, OpenAI ve Anthropic gibi ABD merkezli şirketlerin yüzlerce milyon dolarlık eğitim bütçeleriyle tezat oluşturdu. DeepSeek, modeli 2048 NVIDIA H800 GPU ile iki ay gibi kısa bir sürede eğitti.\n\nDeepSeek V3, "Mixture-of-Experts" (MoE) mimarisi kullanıyor. Model, her sorgu için yalnızca 37 milyar parametre aktif hale getiriyor; bu da maliyet ve hız avantajı sağlıyor. Benchmark sonuçları etkileyici: MMLU\'da yüzde 88.5, HumanEval\'da yüzde 82.6, MATH\'da yüzde 90.2, GPQA Diamond\'da yüzde 59.1. Özellikle Çince dil performansında model, GPT-4o\'yu açık ara geride bırakıyor. Şirket, modelin eğitim verisinin yüzde 95\'inin İngilizce ve Çince olduğunu belirtti.\n\nDeepSeek\'in duyurusu küresel AI sektöründe şok etkisi yarattı. NVIDIA hisseleri tek günde yüzde 3 düşerken, ABD merkezli AI şirketlerinin değerlemesi sorgulanmaya başlandı. Bazı analistler, DeepSeek\'in başarısının "AI yarışında ABD\'nin Çin\'e karşı sahip olduğu üstünlüğün sanıldığı kadar büyük olmadığını" gösterdiğini söyledi. DeepSeek, modeli hem ticari hem de akademik kullanıma açtı; Hugging Face\'te modelin indirilme sayısı ilk haftada 1 milyonu aştı.',
  '/deepseek-v3-tanitildi-h356781.html', 5),

H('log', 'Deniz Aksoy', 'buyuk-dil-modelleri',
  ['Grok 3', 'xAI', 'Elon Musk', 'gerçek zamanlı'],
  '2025-02-17T22:00:00+03:00', false, 'musk,artificial-intelligence,futuristic',
  'Elon Musk\'ın xAI\'ı Grok 3\'ü Tanıttı: "Dünyanın En Güçlü Modeli"',
  'Elon Musk\'ın yapay zeka şirketi xAI, Grok 3 modelini duyurdu. Şirket, modeli "şimdiye kadarki en güçlü yapay zeka" olarak tanımladı.',
  'Elon Musk\'ın kurucusu olduğu xAI, 17 Şubat 2025\'te canlı yayınla Grok 3 modelini tanıttı. Musk, etkinlikte yaptığı konuşmada modelin "dünyanın en güçlü yapay zekâsı" olduğunu iddia etti. Grok 3, xAI\'ın Memphis\'teki devasa veri merkezinde 200 bin NVIDIA H100 GPU ile eğitildi. Şirket, modelin özellikle matematik, fen bilimleri ve kodlama alanlarında çığır açtığını söyledi. Benchmark sonuçlarına göre Grok 3, AIME 2024 matematik olimpiyatında yüzde 96, GPQA\'da yüzde 84, LMArena\'da ise 1400 ELO puanıyla açık ara birinci sırada yer aldı.\n\nModel, "Think" ve "DeepSearch" olmak üzere iki yeni özellikle geliyor. Think modu, modelin bir problemi adım adım düşünerek çözmesini sağlıyor; bu özellik OpenAI o1\'in chain-of-thought yaklaşımına benzer şekilde çalışıyor. DeepSearch ise gerçek zamanlı web taraması yapıyor; X (Twitter) platformundaki son paylaşımları da dahil ederek güncel bilgilerle yanıt üretebiliyor. Bu özellik, özellikle haber ve güncel olaylar konusunda modeli rakiplerinden ayırıyor.\n\nGrok 3, öncelikle X platformunun Premium+ ve SuperGrok abonelerine sunuldu. API erişimi ise birkaç hafta içinde açılacak. Musk, modelin "maksimum gerçeklik arayışı" ilkesiyle eğitildiğini, sansürsüz ve tarafsız olmaya çalıştığını vurguladı. Ancak bazı bağımsız testler, Grok 3\'ün siyasi konularda belirli bir yöne eğilim gösterdiğini ortaya koydu. Yine de model, X\'in aylık 600 milyon aktif kullanıcısı için önemli bir farklılaştırıcı olmaya aday görünüyor.',
  '/grok-3-tanitildi-h512098.html', 4),

H('hurriyet', 'Tolga Özçelik', 'buyuk-dil-modelleri',
  ['Qwen', 'Alibaba', 'Çin yapay zekası', 'açık kaynak'],
  '2025-01-28T07:00:00+03:00', false, 'asia,technology,code',
  'Alibaba\'nın Qwen 2.5-Max Modeli, Çin Yapay Zekâ Yarışında Öne Çıktı',
  'Alibaba, yeni amiral gemisi modeli Qwen 2.5-Max\'i tanıttı. Model, birçok benchmark\'ta DeepSeek V3 ve GPT-4o\'yu geride bırakıyor.',
  'Çin teknoloji devi Alibaba, 28 Ocak 2025\'te Qwen 2.5-Max modelini duyurdu. Şirket, yeni modeli "şimdiye kadar eğittiğimiz en güçlü LLM" olarak tanımladı. MoE (Mixture-of-Experts) mimarisine sahip 720 milyar parametreli model, her sorgu için 45 milyar parametre aktif hale getiriyor. Alibaba, modelin MMLU benchmark\'ında yüzde 87, HumanEval\'da yüzde 86, MATH\'da yüzde 91 başarı elde ettiğini açıkladı. Bu sonuçlar, Qwen 2.5-Max\'ı birçok benchmark\'ta GPT-4o, Claude 3.5 Sonnet ve hatta DeepSeek V3\'ün önüne geçiriyor.\n\nQwen 2.5-Max\'ın en dikkat çekici yönü çok dilliliği. Model, 29 dilde (Çince, İngilizce, Japonca, Korece, Arapça, Türkçe dahil) güçlü performans sunuyor. Alibaba, özellikle Asya dillerinde modelin rakiplerini geride bıraktığını vurguladı. Şirket ayrıca modelin 1 milyon token bağlam penceresini desteklediğini, video ve görsel anlama modüllerinin de güçlendirildiğini söyledi. Qwen 2.5-Max, "Qwen Chat" platformu üzerinden ücretsiz kullanıma sunuldu; API erişimi ise Alibaba Cloud üzerinden sağlanıyor.\n\nÇin yapay zekâ yarışı hız kazanıyor. Alibaba, Baidu, Tencent ve ByteDance\'ın yanı sıra DeepSeek, Zhipu AI ve Moonshot AI gibi yeni nesil girişimler de iddialı modeller yayınlıyor. Çin hükümeti, 2025\'i "AI yılı" ilan etti ve sektöre yüz milyarlarca yuan yatırım yaptı. ABD ise Çin\'e yönelik çip ihracat kısıtlamalarını sıkılaştırdı; bu da Çinli şirketleri daha verimli modeller geliştirmeye zorluyor. Qwen 2.5-Max, bu yarışta önemli bir kilometre taşı olarak değerlendiriliyor.',
  '/alibaba-qwen-25-max-tanitildi-h278134.html', 4),

H('ntv', 'Özge Yılmaz', 'buyuk-dil-modelleri',
  ['Phi-4', 'Microsoft', 'küçük model', 'verimli'],
  '2024-12-12T13:00:00+03:00', false, 'microsoft,technology,computer',
  'Microsoft\'tan Küçük Model Atağı: Phi-4, 14B Parametreyle Devleri Geçti',
  'Microsoft, yalnızca 14 milyar parametreye sahip Phi-4 modelini tanıttı. Küçük boyutuna rağmen model, 70B sınıfı rakiplerini geride bırakıyor.',
  'Microsoft Research, 12 Aralık 2024\'te Phi-4 modelini duyurdu. Model, 14 milyar parametreyle çalışmasına rağmen performans benchmark\'larında 70 milyar parametre sınıfındaki rakiplerini geride bırakıyor. Microsoft, "daha az veriyle, daha kaliteli sentetik eğitim verisi üretme" felsefesiyle geliştirilen modelin özellikle matematik ve kodlama alanlarında öne çıktığını söyledi. Phi-4, MATH benchmark\'ında yüzde 96.3, HumanEval\'da yüzde 91, GPQA Diamond\'da yüzde 73.5 başarı elde etti. Bu sonuçlar, modeli Llama 3.3 70B ve Qwen 2.5 70B ile aynı seviyeye, hatta bazı alanlarda daha yukarıya taşıyor.\n\nPhi-4\'ün eğitim süreci diğer büyük modellerden farklıydı. Microsoft ekibi, büyük LLM\'ler (GPT-4 ve Claude) kullanarak yüksek kaliteli sentetik veri üretti ve bu veriyle daha küçük bir modeli eğitti. "Distillation and Synthetic Data" adı verilen bu yaklaşım, modelin bilgi kapasitesini önemli ölçüde artırdı. Phi-4, 16K token bağlam penceresiyle geliyor ancak "rope scaling" tekniğiyle 64K\'ya genişletilebiliyor. Model, özellikle tek bir tüketici sınıfı GPU\'da (RTX 4090 gibi) çalıştırılabilecek kadar verimli.\n\nMicrosoft, Phi-4\'ü Azure AI Foundry platformu üzerinden geliştiricilere sundu. Model, MIT lisansıyla açık kaynak olarak da yayınlandı; bu da akademik araştırmacılar ve küçük şirketler için büyük bir fırsat. Microsoft\'un küçük modellere yatırımı, "ölçek her şey değildir" tezini destekliyor. Şirket, daha küçük ve verimli modellerin kurumsal kullanımda büyük maliyet avantajı sağladığını, ayrıca "edge AI" yani cihaz üzerinde çalışan yapay zekâ için kritik olduğunu vurguladı. Önümüzdeki dönemde Phi-5\'in de yolda olduğu söyleniyor.',
  '/microsoft-phi-4-tanitildi-h419827.html', 4),

// ============================================================
// BÖLÜM 3: ARAÇLAR (18-24)
// ============================================================
H('webrazzi', 'Murat Bilgin', 'araclar',
  ['Cursor', 'yapay zeka', 'kod editörü', 'geliştirici'],
  '2024-10-15T11:00:00+03:00', false, 'code,developer,programming',
  'Cursor AI, Yazılım Geliştiricilerin Yeni Gözdesi: 200 Milyon Dolar Değerleme',
  'Yapay zekâ destekli kod editörü Cursor, yıl içinde 200 milyon dolar değerlemeye ulaştı. Geliştiriciler, aracın üretkenliği 2-3 kat artırdığını söylüyor.',
  'Anysphere şirketinin geliştirdiği Cursor AI, Ekim 2024 itibarıyla yazılım geliştiriciler arasında en hızlı benimsenen araçlardan biri oldu. VS Code tabanlı editör, GPT-4 ve Claude 3.5 Sonnet modellerini entegre ederek geliştiricilere "yapay zekâ ile birlikte yazma" deneyimi sunuyor. Cursor\'ın en önemli özelliği "code-aware" olması: editör, kod tabanınızın tamamını anlıyor, bağlamı takip ediyor ve satır içi öneriler sunuyor. Şirket, yıl içinde ARR (yıllık tekrar eden gelir) rakamını 100 milyon dolara çıkardığını açıkladı. Andreessen Horowitz liderliğindeki son yatırım turunda değerleme 2.5 milyar dolara ulaştı.\n\nCursor\'ın başarısının arkasında pratik fayda var. Birçok geliştirici, günlük kod yazma hızının 2-3 kat arttığını, debug süresinin ise yarıya indiğini söylüyor. Araç özellikle "refactoring" yani kod yeniden yapılandırma, "boilerplate" yani tekrar eden kod yazımı ve test oluşturma gibi görevlerde parlıyor. Cursor\'ın "Composer" özelliği, kullanıcının doğal dilde verdiği talimatla birden fazla dosyada değişiklik yapabiliyor; örneğin "tüm authentication sistemini OAuth 2.0\'a geçir" gibi bir komut, editörün tüm projeyi güncellemesini sağlıyor. Bu, "AI pair programming" kavramını yeni bir seviyeye taşıdı.\n\nRekabet hızla artıyor. GitHub Copilot (Microsoft), Codeium, Tabnine, Replit Ghostwriter ve Cody (Sourcegraph) benzer özellikler sunuyor. Ancak Cursor, kullanıcı tabanı ve geliştirici topluluğu tarafından özellikle övgü alıyor. Stack Overflow\'un 2024 geliştirici anketinde Cursor, en çok kullanılan AI aracı olarak GitHub Copilot\'u geçti. Şirket, model-agnostic yaklaşımıyla (kullanıcı OpenAI, Anthropic veya kendi modellerini seçebiliyor) farklılaşıyor. Ancak bazı büyük kurumsal müşteriler, kod tabanlarının üçüncü taraf modellere gönderilmesi konusunda güvenlik endişeleri yaşıyor; bu da "on-premise" yani şirket içi çözüm taleplerini artırıyor.',
  '/cursor-ai-degerleme-h315287.html', 4),

H('shiftdelete', 'Berk Çetin', 'araclar',
  ['Perplexity', 'arama motoru', 'yapay zeka', 'Pro'],
  '2024-12-10T15:00:00+03:00', false, 'search,internet,technology',
  'Perplexity Pro 1 Yılda 10 Milyon Kullanıcıya Ulaştı: Google\'a Rakip mi?',
  'Yapay zekâ destekli arama motoru Perplexity, Pro abonelerine ek özellikler sunmaya başladı. Şirket yıllık 100 milyon dolar gelir hedefliyor.',
  'Yapay zekâ destekli arama motoru Perplexity AI, 2024 yılı içinde hızlı bir büyüme yakaladı. Şirket, Aralık 2024 itibarıyla Pro abone sayısının 10 milyonu aştığını duyurdu. Perplexity\'nin temel farkı, geleneksel arama motorlarının aksine kullanıcıya doğrudan cevap vermesi; her yanıtın altında kaynak linkleri sunması. Bu, "AI yanıtı ile kaynak güvenilirliği" arasında bir denge kurma çabası. Şirket, yıllık gelirini 100 milyon dolara çıkarmayı hedeflediğini ve yeni bir reklam modelini test ettiğini açıkladı. SoftBank, NEA ve Jeff Bezos\'un yatırımıyla değerleme 9 milyar dolara ulaştı.\n\nPerplexity Pro, Aralık 2024\'te "Pro Search" özelliğini güncelledi. Yeni özellik, karmaşık sorguları adım adım analiz edebiliyor; örneğin "2024\'te Avrupa\'da yenilenebilir enerji yatırımlarını, ülkelere göre dağılımı ve 2025 projeksiyonlarıyla birlikte raporla" gibi bir sorgu, kapsamlı bir rapor olarak yanıtlanıyor. Sistem, web\'i gerçek zamanlı tarıyor, akademik makaleleri analiz ediyor ve hatta kullanıcının yüklediği PDF\'leri de değerlendirebiliyor. Pro kullanıcılar günde 300\'den fazla "Pro Search" yapabiliyor. Ayrıca görsel arama, dosya analizi ve görsel üretimi (FLUX ve DALL-E 3 ile) özellikleri de eklendi.\n\nPerplexity, Google\'ın arama tekelini kırmaya aday gösterilen en ciddi alternatiflerden biri. Şirket, "Cevap motoru" (answer engine) kavramını öne çıkarıyor. Ancak karşılaştığı en büyük sorun, telif hakkı: birçok yayıncı (New York Times, Forbes, BBC) Perplexity\'nin içeriklerini izinsiz kullandığını iddia ederek dava açtı. Şirket, bu eleştirilere yanıt olarak "gelir paylaşım programı" başlattı: belirli yayıncılara, içeriklerinin Perplexity tarafından kullanılması karşılığında ödeme yapılıyor. New York Times davası henüz sonuçlanmamış olsa da sektör, Perplexity\'nin içerik etiği konusundaki tartışmaları yakından takip ediyor.',
  '/perplexity-pro-10-milyon-kullanici-h192348.html', 4),

H('chip', 'Onur Acar', 'araclar',
  ['Notion', 'yapay zeka', 'üretkenlik', 'workspace'],
  '2024-11-20T13:00:00+03:00', false, 'workspace,office,productivity',
  'Notion AI 2.0: Yapay Zekâ Artık Tüm Workspace\'inizi Anlıyor',
  'Notion, yapay zekâ asistanını büyük ölçüde güncelledi. Yeni sürüm, kullanıcının tüm çalışma alanını analiz edip proaktif öneriler sunabiliyor.',
  'Üretkenlik yazılımı Notion, Kasım 2024\'te yapay zekâ asistanının büyük güncellemesini duyurdu. Notion AI 2.0, kullanıcının tüm workspace\'ini (belge, veri tabanı, sayfa) gerçek zamanlı olarak analiz edebiliyor. Yeni özellik "Q&A" (Soru-Cevap) özellikle dikkat çekiyor: kullanıcı, doğal dilde bir soru soruyor ve sistem ilgili belgeleri bularak sentezlenmiş bir yanıt veriyor. Örneğin "Geçen çeyrekte hangi müşteri segmentleri en hızlı büyüdü?" sorusu, dağınık CRM verilerini analiz ederek kapsamlı bir rapor üretebiliyor. Bu, şirket içi bilgi yönetiminde devrim niteliğinde bir gelişme olarak değerlendirildi.\n\nNotion AI 2.0, sadece pasif bir asistan değil, proaktif öneriler de sunabiliyor. Sistem, yazdığınız bir belgeyi analiz ederek "ilgili sayfalar", "tamamlanmamış görevler" ve "benzer projeler" önerebiliyor. Veri tabanı entegrasyonu sayesinde yapay zekâ, tablolardaki verileri de analiz edebiliyor. Örneğin bir proje yönetimi sayfasında, geciken görevleri otomatik tespit edip kullanıcıya bildirim gönderebiliyor. Şirket, "AI Blocks" adlı yeni bir özellik de ekledi: kullanıcı, kendi AI iş akışlarını tanımlayabiliyor. Örneğin "gelen müşteri talebini oku, önceliklendir, uygun kişiye ata ve Slack\'e bildir" gibi bir akış, dakikalar içinde kurulabiliyor.\n\nNotion, AI 2.0\'ı ücretsiz kullanıcılarına kısıtlı, Pro ve Business planlarına genişletilmiş olarak sundu. Fiyatlandırma aylık 10 dolardan başlıyor. Şirket, AI özelliklerinin aktif kullanıcı tabanının yüzde 60\'ı tarafından kullanıldığını açıkladı. Bu, üretkenlik araçlarında en yüksek AI benimsenme oranlarından biri. Ancak bazı kurumsal müşteriler, hassas şirket verilerinin AI modeli eğitimi için kullanılması konusunda endişe taşıyor. Notion, bu konuda "verileriniz model eğitimi için kullanılmaz, yalnızca sizin workspace\'inizde işlenir" garantisi verdi. OpenAI ve Anthropic\'in API\'leri arka planda kullanılıyor olsa da veri saklama politikaları sıkı şekilde uygulanıyor.',
  '/notion-ai-20-guncelleme-h267193.html', 4),

H('gelecegiyazanlar', 'İrem Aslan', 'araclar',
  ['Adobe Firefly', 'görsel üretim', 'tasarım', 'ticari lisans'],
  '2024-04-23T17:00:00+03:00', false, 'design,creative,art',
  'Adobe Firefly 3: Ticari Kullanıma Hazır Görsel Üretimde Yeni Standart',
  'Adobe, üçüncü nesil Firefly modelini duyurdu. Yeni model, "ticari açıdan güvenli" eğitim verisiyle öne çıkıyor ve Photoshop/Creative Cloud\'a entegre çalışıyor.',
  'Adobe, Nisan 2024\'te üçüncü nesil yapay zekâ görsel üretim modeli Firefly 3\'ü tanıttı. Yeni model, özellikle "ticari açıdan güvenli" eğitim verisi kullanmasıyla öne çıkıyor. Adobe, modeli yalnızca lisanslı Adobe Stock görselleri, kamu malı eserler ve açık lisanslı içeriklerle eğitti. Bu, şirketlerin Firefly çıktılarını telif hakkı riski olmadan ticari projelerde kullanabilmesini sağlıyor. Diğer büyük modellerin (DALL-E, Midjourney) aksine, Firefly\'ın eğitim verisinin yasal geçmişi şeffaf şekilde belgelenmiş durumda. Bu, özellikle reklam ajansları, yayıncılar ve hukuk firmaları için kritik bir avantaj.\n\nFirefly 3, görsel kalite açısından da önemli iyileştirmeler sunuyor. Yeni model, özellikle insan yüzleri, eller ve karmaşık metin üretimi konusunda selefine göre çok daha başarılı. Model, çoklu dilde (İngilizce, Almanca, Fransızca, Japonca, Türkçe dahil 100+ dil) doğru sonuç üretebiliyor. Adobe, "Structure Reference" adlı yeni bir özellik ekledi: kullanıcı bir referans görsel yükleyebiliyor ve model, aynı yapıda ama farklı içerikte yeni görseller üretebiliyor. "Style Reference" ise belirli bir sanat stilini (örneğin "van Gogh tarzı" veya "minimalist illüstrasyon") koruyarak yeni görseller oluşturabiliyor.\n\nAdobe, Firefly 3\'ü Creative Cloud uygulamalarına (Photoshop, Illustrator, Express) entegre etti. Photoshop\'taki "Generative Fill" özelliği artık Firefly 3 ile çalışıyor; bu özellik, fotoğraflardaki istenmeyen nesneleri kaldırmak, yeni öğeler eklemek veya görseli genişletmek için kullanılabiliyor. Şirket, "Generative Credits" adıyla yeni bir kredi sistemi getirdi: aylık ücretsiz 100 kredi ile başlayan sistem, yoğun kullanımda ek kredi satın almayı gerektiriyor. Adobe\'un bu stratejisi, AI\'ın "güvenli" versiyonunu öne çıkararak kurumsal müşterilere hitap etmeyi amaçlıyor. Firefly, Adobe\'un gelir beklentilerini önemli ölçüde artırdı; 2024 mali yılında AI özelliklerine 1 milyar dolardan fazla yatırım yaptıklarını açıkladılar.',
  '/adobe-firefly-3-tanitildi-h142678.html', 4),

H('webtekno', 'Eda Demir', 'araclar',
  ['Microsoft Copilot', 'Copilot+ PC', 'Qualcomm', 'NPU'],
  '2024-05-20T22:00:00+03:00', false, 'laptop,computer,technology',
  'Microsoft, Copilot+ PC Kategorisini Başlattı: 40 TOPS NPU Zorunluluğu',
  'Microsoft, yapay zekâ destekli yeni PC kategorisi "Copilot+ PC"i duyurdu. Cihazlar, en az 40 TOPS performanslı NPU çipi içermek zorunda.',
  'Microsoft, Mayıs 2024\'teki Build geliştirici konferansında yeni bir PC kategorisi olan "Copilot+ PC"i duyurdu. Bu kategori, yapay zekâ görevlerini cihazda (buluta göndermeden) çalıştırabilecek donanıma sahip bilgisayarları kapsıyor. Microsoft, Copilot+ PC etiketinin bir koşulu olarak cihazların en az 40 TOPS (saniyede 40 trilyon işlem) performanslı bir NPU (Neural Processing Unit - sinirsel işlem birimi) çipi içermesi gerektiğini belirledi. Bu eşik, Snapdragon X Elite (Qualcomm), Core Ultra (Intel Lunar Lake) ve Ryzen AI 300 (AMD) çipleriyle karşılanıyor. Microsoft, ilk Copilot+ PC modellerinin Surface, Dell, HP, Lenovo, Asus ve Samsung tarafından üretileceğini açıkladı.\n\nCopilot+ PC\'lerin en önemli özelliği "Recall" adlı bir sistem. Bu özellik, kullanıcının ekranındaki tüm aktiviteyi (ziyaret edilen sayfalar, açılan dosyalar, yapılan konuşmalar) saniyede birkaç kez ekran görüntüsü olarak kaydediyor ve yapay zekâ ile indeksliyor. Kullanıcı, geçmişte "Salı günü gördüğüm o mavi ayakkabılı site" gibi doğal dil sorgularla bu kayıtlarda arama yapabiliyor. Microsoft, Recall\'ın tüm verilerin cihazda işlendiğini, hiçbir bulut sunucuya gönderilmediğini vurguladı. Ancak güvenlik araştırmacıları, Recall\'ın potansiyel güvenlik açıklarını hızla ortaya çıkardı: ilk sürümde veriler şifrelenmemiş şekilde saklanıyordu. Microsoft, hızla güncelleme yayınlayarak sorunu giderdi.\n\nCopilot+ PC kategorisi, yapay zekânın kişisel bilgisayarlara entegrasyonunda yeni bir dönem başlattı. Live Captions (canlı altyazı) özelliği, 40+ dilde gerçek zamanlı çeviri yapabiliyor. Cocreator (ortak yaratım) özelliği, Paint uygulamasında metin komutuyla görsel çizim yapabiliyor. Windows Studio Effects, video görüşmelerinde arka plan bulanıklaştırma, göz teması düzeltme ve otomatik çerçeveleme özelliklerini geliştirdi. Microsoft, 2025\'e kadar 50 milyon Copilot+ PC satmayı hedefliyor. Ancak pazarın bu yeni kategoriyi ne kadar benimseyeceği henüz belirsiz; özellikle geleneksel PC alıcılarının NPU performansını ne kadar önemsediği tartışma konusu.',
  '/microsoft-copilot-pc-tanitildi-h218973.html', 5),

H('log', 'Tuğçe Kaya', 'araclar',
  ['Runway', 'video üretim', 'yapay zeka', 'Gen-3 Alpha'],
  '2024-06-17T16:00:00+03:00', false, 'video,film,production',
  'Runway Gen-3 Alpha: 10 Saniyelik Gerçekçi Yapay Zekâ Videolar Artık Mümkün',
  'Runway, üçüncü nesil video üretim modeli Gen-3 Alpha\'yı duyurdu. Model, 10 saniyeye kadar gerçekçi ve tutarlı videolar üretebiliyor.',
  'Yapay zekâ video üretim şirketi Runway, Haziran 2024\'te Gen-3 Alpha modelini tanıttı. Model, metin komutlarından 10 saniyeye kadar yüksek kaliteli, gerçekçi ve tutarlı videolar üretebiliyor. Runway\'in kurucu ortaklarından Cristóbal Valenzuela, "Bu, sinema endüstrisinin demokratikleşmesi için kritik bir adım" dedi. Gen-3 Alpha, selefi Gen-2\'ye göre önemli iyileştirmeler sunuyor: insan yüzleri ve beden hareketleri çok daha tutarlı, fizik kurallarına uyum (yer çekimi, sıvı akışı) çok daha iyi, kamera hareketleri (pan, zoom, tracking shot) profesyonel kalitede. Model ayrıca "el yazısı", "duman", "ateş" gibi önceki modellerin zorlandığı detaylarda başarılı.\n\nGen-3 Alpha, "director mode" adı verilen yeni bir özellik sunuyor. Kullanıcı, kamera açısını, hareket hızını, ışıklandırmayı ve lens tipini doğrudan kontrol edebiliyor. Örneğin "geniş açılı lens, hızlı zoom-in, altın saat ışığı" gibi sinematik terimler kullanılabiliyor. Bu, yapay zekâ videoyu profesyonel bir film çekimi seviyesine taşıyor. Şirket, 50\'den fazla Hollywood yönetmeni ve prodüktörüyle pilot çalışmalar yaptığını açıkladı. Bazı film şirketleri (Lionsgate, A24), Gen-3 Alpha\'yı pre-visualization ve storyboard süreçlerinde kullanmaya başladı bile. Bu, yapım maliyetlerini önemli ölçüde düşürebilir.\n\nModel, "turbo" (hızlı) ve "standard" (kaliteli) olmak üzere iki modda çalışıyor. 10 saniyelik bir video, turbo modda 30 saniyede, standard modda 2 dakikada üretilebiliyor. Runway, modelin eğitim verilerinin tamamen lisanslı içeriklerden oluştuğunu vurgulayarak telif hakkı konusundaki endişeleri gidermeye çalıştı. Şirket, aylık abonelik modelini de güncelledi: Standard plan aylık 28 dolar, Pro plan ise 76 dolar. Runway\'in en büyük rakipleri OpenAI Sora (henüz genel kullanıma açılmadı), Pika Labs ve Stability AI Video. Sektör, video üretim modellerinin 2025\'te "AI film" projelerinin başlamasına yol açacağını öngörüyor. Ancak sinema endüstrisi sendikaları, AI\'ın senarist, yönetmen ve görsel efekt uzmanlarının işlerini tehdit edebileceği konusunda uyarıda bulunuyor.',
  '/runway-gen-3-alpha-tanitildi-h187236.html', 4),

H('hurriyet', 'Evrim Korkmaz', 'araclar',
  ['ElevenLabs', 'ses üretim', 'yapay zeka', 'çok dilli'],
  '2024-08-15T11:00:00+03:00', false, 'microphone,audio,voice',
  'ElevenLabs, Türkçe Dahil 32 Dilde Doğal Ses Üretimi Sunuyor',
  'Ses üretim platformu ElevenLabs, Türkçe dahil 32 dilde doğal ses klonlama ve üretim özelliklerini kullanıma açtı. Teknoloji, eğitim ve yayıncılık sektörlerini dönüştürebilir.',
  'Yapay zekâ ses üretim platformu ElevenLabs, Ağustos 2024\'te önemli bir genişleme duyurdu. Platform, aralarında Türkçe\'nin de bulunduğu 32 dilde yüksek kaliteli ses sentezi sunmaya başladı. ElevenLabs\'ın teknolojisi, yalnızca 1 dakikalık bir ses örneğinden "klonlama" yapabiliyor; bu da kullanıcının kendi sesini veya izin verdiği birinin sesini yapay zekâ ile üretmesini sağlıyor. Platform, özellikle doğallık ve duygu aktarımı açısından seleflerinden çok öne çıkıyor. Konuşma hızı, tonlama, duraklamalar ve duygu (mutlu, üzgün, heyecanlı, kızgın) ayarlanabiliyor. Bu, "robotic" seslerin yerini doğal insan sesine yakın çıktıların aldığı anlamına geliyor.\n\nElevenLabs\'ın yeni sürümü "Turbo v2.5" adıyla yayınlandı. Bu model, gerçek zamanlı ses üretimi yapabiliyor; yani bir kullanıcı mikrofona konuşurken, aynı anda yapay zekâ sesi başka bir dilde veya farklı bir tonda üretebiliyor. Bu, canlı çeviri, seslendirme ve erişilebilirlik (görme engelliler için) alanlarında devrim niteliğinde. Şirket, BBC, Financial Times, HarperCollins ve Storytel gibi büyük yayıncılarla ortaklık kurdu. Storytel, sesli kitap üretiminde ElevenLabs\'ı kullanmaya başladı; bu da maliyetleri yüzde 90 düşürdü. Ancak seslendirme sanatçıları, bu teknolojinin işlerini tehdit ettiğini vurgulayarak düzenleme talep ediyor.\n\nElevenLabs, "ethical use" konusunda da adımlar attı. Platform, ses klonlama için "telif hakkı sözleşmesi" zorunluluğu getirdi: kendi sesinizi klonlamak istiyorsanız kimlik doğrulama gerekiyor. Ünlü birinin sesini klonlamak için ise o kişinin (ya da mirasçılarının) yazılı izni gerekiyor. Şirket, ABD seçimleri öncesinde deepfake seslerin yayılmasını engellemek için "Election Guard" adı verilen özel bir koruma katmanı da ekledi. ElevenLabs\'ın değerlemesi 2024\'te 1.1 milyar dolara ulaştı. Şirket, ses teknolojisinin "bir sonraki büyük platform" olduğunu, tıpkı görsel üretimde Stable Diffusion ve DALL-E\'nin olduğu gibi sesin de demokratikleşeceğini söylüyor. Ancak akademik araştırmacılar, bu teknolojinin potansiyel kötüye kullanımı (deepfake, dolandırıcılık, dezenformasyon) konusunda uyarıda bulunmaya devam ediyor.',
  '/elevenlabs-32-dil-turkce-h298174.html', 4),

// ============================================================
// BÖLÜM 4: ROBOTİK (25-30)
// ============================================================
H('webtekno', 'Kerem Doğan', 'robotik',
  ['Tesla Optimus', 'Elon Musk', 'insansı robot', 'üretim'],
  '2023-12-13T08:00:00+03:00', true, 'humanoid,robot,factory',
  'Tesla Optimus Gen 2: Hareket Kabiliyeti İkiye Katlandı',
  'Tesla, insansı robotu Optimus\'un ikinci neslini tanıttı. Yeni model, yüzde 30 daha hızlı, el becerisi iki kat daha gelişmiş.',
  'Tesla, Aralık 2023\'te Optimus insansı robotunun ikinci neslini (Gen 2) tanıttı. Elon Musk, X (Twitter) üzerinden paylaştığı bir video ile yeni robotu kamuoyuna gösterdi. Video, Optimus Gen 2\'nin yumurta taşıdığı, yerden eğildiği, merdiven çıktığı ve dans ettiği görüntüleri içeriyordu. Yeni model, selefine göre yüzde 30 daha hızlı hareket ediyor, 10 kilogram hafifledi (47 kg\'a düştü) ve el becerisi iki kat arttı. Ellerdeki 11 derece serbestlik hareketi (insan eliyle aynı), robotun hassas nesneleri (yumurta, vida, küçük parçalar) tutabilmesini sağlıyor. Tesla, tüm bu gelişmelerin yalnızca 6 ay içinde gerçekleştiğini vurguladı.\n\nOptimus Gen 2\'nin teknik özellikleri dikkat çekici: tüm vücut hareket kontrolü için Tesla\'nın özel olarak geliştirdiği "aktüatörler" kullanılıyor. Bu aktüatörler, insan kaslarının yaptığı işi taklit ediyor. Robot, 2D kameralar ve derinlik sensörleriyle çevresini algılıyor; Tesla\'nın araçlarda kullandığı "Full Self-Driving" (FSD) yapay zekâ sistemi, Optimus\'a uyarlandı. Yani robot, dünyayı otomobillerin kullandığı sinir ağı ile anlıyor. Bu, yazılım geliştirme maliyetini önemli ölçüde düşürüyor. Tesla, "Tesla Bot" projesinin nihai hedefinin düşük maliyetli (20 bin doların altında), güvenli ve yetenekli bir insansı robot üretmek olduğunu söyledi.\n\nMusk, 2024\'ün sonuna kadar "sınırlı üretim" başlatacaklarını, 2025\'te ise Tesla fabrikalarında Optimus\'ları çalıştırmaya başlayacaklarını açıkladı. Şirket, Gigafactory\'lerdeki tekrarlayan görevler için (parça taşıma, montaj, kalite kontrol) robotları kullanmayı planlıyor. Bazı analistler Musk\'ın iddialarına temkinli yaklaşıyor; "Boston Dynamics\'in 30 yıllık tecrübesine karşı Tesla\'nın 2 yıllık robot deneyimi" eleştirisi yapılıyor. Ancak Tesla\'nın ölçek üretim kabiliyeti ve düşük maliyetli sensör teknolojisi avantajı, şirketi rakiplerinden ayırıyor. 2025\'te 1000, 2026\'da 10 bin, 2027\'de 100 bin adetlik üretim hedefi konuşuluyor. Uzmanlar, Optimus\'un başarısı veya başarısızlığının tüm insansı robot endüstrisinin yönünü belirleyeceğini söylüyor.',
  '/tesla-optimus-gen-2-tanitildi-h124578.html', 6),

H('donanimhaber', 'Sinan Polat', 'robotik',
  ['Boston Dynamics', 'Atlas', 'hidrolik', 'insansı robot'],
  '2024-04-09T15:00:00+03:00', false, 'robot,engineering,movement',
  'Boston Dynamics, Yeni Elektrikli Atlas\'ı Tanıttı: Hidrolik Çağ Kapanıyor',
  'Boston Dynamics, tamamen elektrikli yeni nesil Atlas insansı robotunu duyurdu. Şirket, 30 yıllık hidrolik dönemini geride bırakıyor.',
  'Boston Dynamics, Nisan 2024\'te merakla beklenen yeni nesil Atlas insansı robotunu tanıttı. Hyundai çatısı altındaki şirket, "Elektrikli Atlas"ın ticari kullanıma hazır ilk versiyonu olduğunu açıkladı. Bu, 30 yılı aşkın süredir Boston Dynamics\'in amiral gemisi olan hidrolik Atlas\'ın emekliye ayrıldığı anlamına geliyor. Yeni elektrikli Atlas, hidrolik sistemin aksine daha sessiz, daha verimli ve daha güvenli. Robot, 360 derece eklem hareketi sunan yeni bir tasarıma sahip; başını ve gövdesini insandan çok daha geniş açılarla döndürebiliyor. Bu, dar alanlarda çalışma kapasitesini artırıyor.\n\nYeni Atlas\'ın en dikkat çekici özelliği, hareket kabiliyeti. Tanıtım videosunda robot, yerden kalkma, ağır yük taşıma, engel atlama ve parke taşları üzerinde yürüme gibi görevleri kusursuz şekilde gerçekleştirdi. Özellikle "superman pozisyonu" (yüzüstü yere düşmüş halde durma ve hızla ayağa kalkma) çok etkileyici görüntüler oluşturdu. Robot, "manipulation" (nesne kullanımı) yeteneğinde de gelişmiş: çift elle hassas nesne kavrama, vida sökme, kapı açma gibi görevlerde başarılı. Boston Dynamics, Atlas\'ı ticari müşterilere 2025\'te sunmaya başlayacak. Hedef, önce Hyundai fabrikalarında pilot uygulamalar.\n\nBoston Dynamics\'in ticari stratejisi de değişti. Şirket, 2019\'da Spot\'u (robot köpek) piyasaya sürmüş ve 2023\'te Stretch (depo robotu) ile lojistik sektörüne girmişti. Atlas ise "genel amaçlı" insansı robot olarak konumlandırılıyor. Hyundai\'nin yanı sıra Google DeepMind (yazılım ortağı) ve birçok araştırma kurumuyla işbirliği yapılıyor. Ancak fiyatlandırma henüz açıklanmadı; uzmanlar 100-200 bin dolar aralığında olacağını tahmin ediyor. Boston Dynamics\'in en büyük rakipleri Figure AI, 1X Technologies, Apptronik ve Unitree. Sektör, 2025\'in "insansı robot yılı" olacağını öngörüyor. Google DeepMind\'ın robot yapay zekâsı (RT-2/RT-X) ile Boston Dynamics\'in mekanik mükemmelliğinin birleşimi, sektörde çığır açabilir.',
  '/boston-dynamics-elektrikli-atlas-tanitildi-h192837.html', 5),

H('chip', 'Selma Yıldız', 'robotik',
  ['Figure AI', 'insansı robot', 'OpenAI', 'BMW fabrikası'],
  '2024-08-06T12:00:00+03:00', false, 'factory,automation,robot-arm',
  'Figure 02, BMW Fabrikasında İlk Kez Çalışmaya Başladı',
  'Figure AI\'ın ikinci nesil insansı robotu Figure 02, BMW\'nin Spartanburg fabrikasında gerçek üretim hattında görev aldı. Bu, ticari insansı robot tarihinde bir ilk.',
  'Figure AI, Ağustos 2024\'te Figure 02 insansı robotunun BMW\'nin ABD\'deki Spartanburg fabrikasında çalışmaya başladığını duyurdu. Bu, ticari amaçlı bir insansı robotun gerçek bir otomotiv üretim hattında görev aldığı ilk örnek. Robot, gövde sac montaj hattında belirli parçaları yerleştirme, kalite kontrol ve malzeme taşıma görevlerini üstlendi. Figure AI, BMW ile ortaklığın 2025\'te daha da genişleyeceğini ve robot sayısının artacağını söyledi. Şirketin CEO\'su Brett Adcock, "Bu, insansı robotların fabrikalarda gerçek anlamda çalışmaya başladığı bir dönüm noktası" dedi.\n\nFigure 02, OpenAI ile yapılan stratejik ortaklık sayesinde güçlü bir yapay zekâ altyapısına sahip. Robot, OpenAI\'ın dil modellerini kullanarak doğal dil komutlarını anlayabiliyor ve karmaşık görevleri planlayabiliyor. Örneğin bir işçi robota "şu kutuyu al ve ikinci sıraya koy" dediğinde, robot bağlamı anlayıp eyleme geçebiliyor. Figure 02\'nin el becerisi de gelişmiş: 16 derece serbestlik hareketi sunan eller, hassas nesneleri kavrayabiliyor. Robot, vücut boyunca yerleştirilmiş 6 kamera ile çevresini 360 derece algılıyor. OpenAI\'ın sağladığı görsel dil modelleri (VLM) sayesinde robot, gördüğü nesneleri tanımlayıp anlamlandırabiliyor.\n\nFigure AI, hızlı bir büyüme yakaladı. Şirket, Mayıs 2024\'te 675 milyon dolar yatırım aldı; değerlemesi 2.6 milyar dolara ulaştı. Microsoft, OpenAI, NVIDIA ve Intel\'in de aralarında bulunduğu teknoloji devleri, Figure\'a yatırım yaptı. Şirket, 2025\'te "Figure 03" modelini tanıtmayı planlıyor. Hedef, seri üretim ve düşük maliyet. Figure\'ın en büyük rakipleri 1X Technologies (Norveç), Apptronik (Texas), Sanctuary AI (Kanada) ve Agility Robotics (Oregon). Ancak hiçbiri henüz BMW gibi büyük bir ticari müşteriyle gerçek üretim hattında çalışmaya başlamadı. Sektör gözlemcileri, Figure\'ın öncü konumunu sürdürmesi durumunda pazar payını önemli ölçüde artıracağını söylüyor. Ancak bazı işçi sendikaları, insansı robotların otomotiv sektöründe binlerce kişiyi işsiz bırakabileceği uyarısında bulunuyor.',
  '/figure-02-bmw-fabrikasinda-h246918.html', 5),

H('bthaber', 'Tolga Kaya', 'robotik',
  ['Unitree', 'H1', 'Çin robotik', 'ucuz insansı robot'],
  '2024-04-19T14:00:00+03:00', false, 'robot,china,technology',
  'Çinli Unitree H1, 90 Bin Dolarlık Fiyatıyla İnsansı Robot Demokrasi mi?',
  'Çinli Unitree Robotics, H1 insansı robotunu 90 bin dolardan satışa çıkardı. Boston Dynamics\'in 150 bin dolarlık Atlas\'ından ucuz ve bazı benchmark\'larda daha hızlı.',
  'Çin merkezli Unitree Robotics, insansı robot dünyasında önemli bir adım atarak H1 modelini ticari kullanıma açtı. Şirket, robotu 90 bin dolardan (yaklaşık 2.9 milyon TL) satışa sundu; bu, Boston Dynamics Atlas\'ın beklenen fiyatının çok altında. Unitree, H1\'i "şu an dünyanın en güçlü ticari insansı robotu" olarak tanımladı. Tanıtım videosunda robot, zıplama, takla atma, koşma, dans etme ve 1 metre yüksekliğe kadar sıçrama gibi hareketleri kusursuz şekilde gerçekleştirdi. H1, saatte 11.8 km hıza ulaşabiliyor; bu, dünyanın en hızlı ticari insansı robotu unvanını kazandırıyor. Aynı zamanda 30 kg\'a kadar yük taşıyabiliyor ve 3.6 km/s hızla koşabiliyor.\n\nH1\'in teknik özellikleri dikkat çekici. Robot, 3D LiDAR ve derinlik kameralarla donatılmış; bu sayede çevresini gerçek zamanlı olarak 3D olarak algılayabiliyor. Unitree\'nin özel olarak geliştirdiği "M107" aktüatörleri, 360 N·m tork üretiyor. Robot, açık kaynak bir SDK ile geliyor; geliştiriciler kendi uygulamalarını yazabiliyor. Şirket, H1\'in API\'sini tamamen açık kaynak olarak yayınladı. Bu, akademik araştırmacılar ve küçük girişimler için büyük bir fırsat. H1\'in modüler tasarımı sayesinde batarya, sensör ve yazılım kolayca güncellenebiliyor.\n\nUnitree\'nin düşük fiyat stratejisi, insansı robot pazarını demokratikleştirebilir. Şirket, Çin\'in düşük maliyetli üretim avantajını kullanarak rakiplerinden çok daha uygun fiyata benzer performans sunuyor. Unitree\'nin CEO\'su Wang Xingxing, "İnsansı robotlar, 2025\'te otomobil fiyatlarına yaklaşacak" dedi. Şirket, 2024 sonuna kadar 1000, 2025 sonuna kadar 10 bin adetlik üretim hedefliyor. H1\'in müşterileri arasında Çin\'deki üniversiteler, araştırma laboratuvarları ve bazı sanayi şirketleri var. Ancak uluslararası arenada Unitree\'nin karşılaştığı en büyük sorun, ABD\'nin Çin\'e yönelik teknoloji ihracat kısıtlamaları. ABD\'li araştırmacılar, Unitree robotlarına erişmekte zorlanıyor. Bu durum, "Çin robotik devrimi"nin küresel pazara nasıl yansıyacağı sorusunu gündeme getiriyor.',
  '/unitree-h1-insansi-robot-h182937.html', 4),

H('technopat', 'Levent Acar', 'robotik',
  ['Agility Robotics', 'Digit', 'lojistik', 'Amazon'],
  '2024-03-19T11:00:00+03:00', false, 'warehouse,robot,logistics',
  'Agility Robotics\'in Digit\'i Amazon Depolarında Çalışmaya Başladı',
  'Agility Robotics, insansı robotu Digit\'in Amazon depolarında test edilmeye başlandığını duyurdu. Robot, kasaları taşıma ve sıralama görevlerini üstleniyor.',
  'ABD merkezli Agility Robotics, Mart 2024\'te insansı robotu Digit\'in Amazon depolarında pilot uygulamaya alındığını açıkladı. Oregon eyaletindeki Amazon tesisinde test edilen robot, tekrarlayan lojistik görevlerinde (kasa taşıma, sıralama, yükleme) çalışıyor. Digit, "Digit v3" adı verilen yeni sürümle geliyor. Bu sürüm, iki kolu, iki bacağı ve "kuş başı" olarak adlandırılan kamera sistemiyle donatılmış. Robot, 16 kg yük taşıyabiliyor, 45\'lik açıyla eğilebiliyor ve dar alanlarda çalışabiliyor. Amazon, robotu "geleceğin iş gücünün bir parçası" olarak tanımladı; ancak insan işçilerin yerini almayacağını, onlarla birlikte çalışacağını vurguladı.\n\nDigit\'in en önemli özelliği, "human-aware" (insan farkındalığı) hareket kabiliyeti. Robot, etrafındaki insanları tespit edip yavaşlayabiliyor, durabiliyor veya yön değiştirebiliyor. Bu, insanlarla aynı ortamda güvenli çalışma için kritik. Agility, robotun yapay zekâ altyapısını Google DeepMind ile birlikte geliştirdi. DeepMind\'ın "RT-2" ve "RT-X" modelleri, Digit\'in görsel ipuçlarından yeni görevler öğrenmesini sağlıyor. Örneğin robot, hiç programlanmamış bir nesneyi (örneğin yeni bir kutu türü) daha önce benzer nesnelerden öğrendiği bilgiyle kavrayabiliyor. Bu "transfer learning" yeteneği, robotların yeni ortamlara hızla uyum sağlamasını sağlıyor.\n\nAgility Robotics, Oregon\'daki fabrikasında yılda 10 bin Digit üretme kapasitesine ulaştı. Şirket, 2024 yılında 150 milyon dolar yatırım aldı. Amazon\'un yanı sıra GXO Logistics, Manhattan Associates ve birçok perakende şirketi Digit\'i test ediyor. Ancak bazı endüstriyel kullanıcılar, maliyetin yüksekliğinden şikâyetçi: Digit\'in saatlik kullanım maliyeti (Robot-as-a-Service modeli) saatte yaklaşık 30 dolar. Bu, ABD\'deki ortalama depo işçisinin saatlik maliyetiyle (18 dolar) karşılaştırıldığında hâlâ pahalı. Ancak Agility, 2026\'ya kadar maliyetin saatte 10 doların altına ineceğini öngörüyor. Sektör, insansı robotların 2026-2027\'de lojistik sektöründe yaygınlaşacağını, 2030\'da ise perakende ve hizmet sektörlerine açılacağını tahmin ediyor.',
  '/agility-robotics-digit-amazon-h187362.html', 4),

H('ntv', 'Aslı Çetin', 'robotik',
  ['1X Technologies', 'Neo', 'Norveç', 'ev robotu'],
  '2024-05-30T10:00:00+03:00', false, 'home,domestic,robot',
  '1X Technologies, Ev Tipi Robotu Neo\'yu Duyurdu: "İnsanlarla Birlikte Yaşamak İçin"',
  'Norveç merkezli 1X Technologies, ev ortamında çalışmak üzere tasarlanan insansı robotu Neo\'yu tanıttı. Robot, OpenAI ve Tiger Global\'den 100 milyon dolar yatırım aldı.',
  'Norveç merkezli 1X Technologies (eski adı Halodi Robotics), Mayıs 2024\'te ev tipi insansı robotu Neo\'yu duyurdu. Şirketin CEO\'su Bernt Børnich, Neo\'yu "insanlarla birlikte yaşamak için tasarlanmış ilk insansı robot" olarak tanımladı. Neo, 1.65 metre boyunda, 30 kg ağırlığında ve saatte 12 km hıza ulaşabiliyor. Ancak en önemli özelliği, "yumuşak dış yüzeyi"; robot, geleneksel metalik insansı robotların aksine kumaş ve esnek polimer malzemelerle kaplı. Bu, hem estetik hem de güvenlik açısından önemli: ev ortamında robot bir çocuk veya evcil hayvanla çarpışırsa yaralanma riski azalıyor.\n\nNeo\'nun yapay zekâ altyapısı OpenAI ile birlikte geliştirildi. Robot, OpenAI\'ın dil modelleri sayesinde doğal dil komutlarını anlayabiliyor. Örneğin "salondaki kahve fincanını mutfağa götür" gibi bir komut, robotun bağlamı anlayıp eyleme geçmesini sağlıyor. Neo, OpenAI\'ın "öğrenme + takviye" yaklaşımıyla eğitildi; bu sayede yeni görevleri kullanıcıdan geri bildirim alarak öğrenebiliyor. Şirket, 2024\'te 100 milyon dolar yatırım aldı; değerleme 1 milyar dolara ulaştı. Yatırımcılar arasında OpenAI Startup Fund, Tiger Global ve Sandwater öne çıkıyor.\n\n1X Technologies, Neo\'yu 2025\'te "sınırlı sayıda" satışa çıkarmayı planlıyor. Hedef fiyat 20 bin dolar (yaklaşık 650 bin TL). Ancak Børnich, "İlk nesil zengin teknoloji meraklılarına yönelik olacak, gerçek yaygınlaşma 2027-2028\'de olacak" dedi. Şirket, kısa vadede robotu yaşlı bakımı ve engelli destek hizmetlerinde kullanmayı hedefliyor. Norveç\'te yaşlı nüfusun artması, bu tür çözümlere olan talebi artırıyor. Bazı uzmanlar, ev robotlarının "ev işçiliğini" köklü şekilde değiştirebileceğini, ancak sosyo-ekonomik etkilerinin (iş gücü kaybı, bağımlılık) dikkatle yönetilmesi gerektiğini vurguluyor.',
  '/1x-technologies-neo-ev-robotu-h234567.html', 4),

// ============================================================
// BÖLÜM 5: POLİTİKA & ETİK (31-37)
// ============================================================
H('webrazzi', 'Elif Demir', 'politika-etik',
  ['AB AI Act', 'yapay zeka yasası', 'Avrupa Birliği', 'düzenleme'],
  '2024-08-01T09:00:00+03:00', true, 'government,law,europe',
  'AB AI Act Yürürlüğe Girdi: "Dünyanın En Kapsamlı Yapay Zekâ Yasası"',
  'Avrupa Birliği\'nin AI Act yasası resmen yürürlüğe girdi. Yasa, yapay zekâ sistemlerini risk seviyesine göre sınıflandırıyor ve yüksek riskli uygulamaları sıkı şekilde düzenliyor.',
  'Avrupa Birliği\'nin yapay zekâ alanındaki en kapsamlı düzenlemesi olan "AI Act" 1 Ağustos 2024 itibarıyla resmen yürürlüğe girdi. Yasa, yapay zekâ sistemlerini dört risk kategorisinde sınıflandırıyor: kabul edilemez risk, yüksek risk, sınırlı risk ve minimal risk. Kabul edilemez risk kategorisindeki uygulamalar tamamen yasaklandı. Bu kategoride sosyal skorlama (Çin\'deki gibi), subliminal manipülasyon ve hükümetlerin kitlesel yüz tanıma sistemleri yer alıyor. Yüksek risk kategorisindeki uygulamalar (sağlık, eğitim, istihdam, adalet sistemi) için sıkı şeffaflık, veri kalitesi ve insan gözetimi kuralları getirildi. Sınırlı risk kategorisinde ise kullanıcı bilgilendirme yükümlülüğü yeterli.\n\nYasanın en tartışmalı kısmı, "genel amaçlı yapay zekâ" (GPAI) düzenlemesi. Büyük dil modelleri (GPT-4, Claude, Gemini gibi) için özel kurallar getirildi. "Sistematik risk" taşıyan modeller (yani 10^25 FLOP üzerinde eğitim verilerle eğitilmiş modeller) için ek yükümlülükler var. Bu modeller, korsanca veri kullanmadıklarını belgelemek, model kartları (model card) yayınlamak, kırmızı takım testleri (red teaming) yapmak zorunda. Ayrıca enerji tüketimi raporu sunmak da gerekiyor. Bu, çevresel sürdürülebilirlik açısından önemli bir adım. OpenAI, Google, Meta, Microsoft, Anthropic ve xAI gibi şirketler yasaya uyum için çalışmalarını hızlandırdı.\n\nYasanın küresel etkisi büyük olacak. AB, dünyanın en büyük yapay zekâ pazarı olmasa da (Çin ve ABD\'den sonra üçüncü), düzenleyici gücü nedeniyle "Brüksel Etkisi" yaratıyor. Birçok ABD ve Asya şirketi, AB pazarına ürün sunabilmek için küresel standartlarını AB kurallarına uyduruyor. Bu durum, yapay zekâ etiği konusunda küresel bir minimum standart oluşmasına yol açıyor. AB AI Act, Şubat 2025\'e kadar tam olarak uygulanabilir hale gelecek; ilk cezalar da o tarihte başlayacak. Cezalar, küresel cironun yüzde 7\'sine kadar çıkabiliyor. Bu, 35 milyar Euro gelirli bir şirket için 2.5 milyar Euro\'luk bir ceza anlamına gelebilir. Yapay zekâ etiği uzmanları, bu yasanın dünya genelinde bir "Yapay Zekâ Anayasası" örneği olacağını söylüyor.',
  '/ab-ai-act-yururluge-girdi-h215678.html', 6),

H('hurriyet', 'Murat Sevinç', 'politika-etik',
  ['California', 'SB 1047', 'yapay zeka güvenliği', 'A.B.D.'],
  '2024-09-29T16:00:00+03:00', false, 'california,law,government',
  'California, SB 1047 Yapay Zekâ Güvenlik Yasasını Onayladı: Silikon Vadisi Karışık',
  'ABD\'nin California eyaleti, büyük yapay zekâ modelleri için "güvenlik" düzenlemesi getiren SB 1047 yasasını imzaladı. Şirketlerden "öldürme teknolojisi" üretmemelerini taahhüt etmeleri isteniyor.',
  'California Valisi Gavin Newsom, 29 Eylül 2024\'te SB 1047 numaralı "Safe and Secure Innovation for Frontier Artificial Intelligence Models Act" (Sınır Yapay Zekâ Modelleri İçin Güvenli ve Emniyetli İnovasyon Yasası) yasasını onayladı. Bu, ABD\'de eyalet düzeyinde yapay zekâ güvenliği konusunda kabul edilen en kapsamlı yasa. Yasa, 100 milyon doların üzerinde eğitim maliyeti olan veya 10^26 FLOPS üzerinde işlem gücü kullanan yapay zekâ modellerini kapsıyor. Bu eşiği karşılayan modeller için geliştiricilerin "öncü güvenlik değerlendirmesi" (frontier safety evaluation) yapması, "kritik zarar" senaryolarını test etmesi ve sonuçları California Attorney General\'a raporlaması gerekiyor. "Kritik zarar" tanımı geniş: siber güvenlik saldırıları, otonom silah sistemleri, biyolojik silah üretimi veya toplu manipülasyon gibi senaryolar dahil.\n\nYasa, geliştiricilere bazı önemli yükümlülükler getiriyor. İlk olarak, "AI Kill Switch" (yapay zekâ acil durdurma) mekanizması zorunlu hale getirildi. Modeller, kritik güvenlik açıkları tespit edildiğinde hızla kapatılabilmeli. İkinci olarak, geliştiricilerin modelin "reddini" (refusal) sağlam bir şekilde uygulaması gerekiyor; yani model, tehlikeli talepleri (silah yapımı, siber saldırı) reddedebilmeli. Üçüncü olarak, "veri kümesi şeffaflığı" zorunlu: modelin eğitim verisinde hangi tür içerikler kullanıldığı belgelenmeli. Yasa ihlallerinde ceza 1 milyon dolar veya zararın 10 katı (hangisi yüksekse). Ancak yasa "açık kaynak" modelleri kapsam dışı bırakıyor; bu da Meta ve Mistral gibi şirketler için önemli bir istisna.\n\nYasa, Silikon Vadisi\'nde büyük tartışmalara yol açtı. OpenAI, Google, Meta ve Andreessen Horowitz yasaya karşı çıktı; yasanın "inovasyonu boğacağını" ve "açık kaynak ekosistemi cezalandıracağını" savundular. OpenAI, yasanın "yanlış hedefe odaklandığını" açıkladı. Öte yandan yapay zekâ güvenliği savunucuları (Anthropic, y Alignment Research Center, Future of Life Institute) yasayı destekledi. Anthropic, yasaya uyum sağlamak için şimdiden hazırlık yaptığını açıkladı. Eleştirmenler, yasanın federal düzeyde bir düzenleme olmamasının sektörde parçalanmaya yol açacağını, her eyaletin farklı kurallar koyacağını söyledi. Ancak California, ABD\'nin en büyük teknoloji merkezi olarak yasanın fiili standart haline gelmesini sağlayabilir.',
  '/california-sb-1047-yapay-zeka-guvenligi-h298173.html', 5),

H('trt', 'Ayşegül Demir', 'politika-etik',
  ['deepfake', 'yapay zeka', 'dolandırıcılık', 'düzenleme'],
  '2024-11-05T11:00:00+03:00', false, 'face,security,identity',
  'Yapay Zekâ Deepfake\'leriyle Dolandırıcılık 10 Kat Arttı',
  'Yapay zekâ destekli deepfake dolandırıcılık vakaları 2024\'te 10 kat arttı. Düzenleyiciler ve şirketler yeni önlemler alıyor.',
  'Federal Trade Commission (FTC) ve Interpol, Kasım 2024\'te yapay zekâ destekli deepfake dolandırıcılık vakalarının 2024 yılında 10 kat arttığını duyurdu. Özellikle video konferanslarda (Zoom, Teams) sahte patron veya sahte iş arkadaşı görüntüsüyle milyonlarca dolar vurgun yapan vakalar rapor edildi. Hong Kong\'da bir şirketin CFO\'su, yapay zekâ ile klonlanmış bir video konferansla 25 milyon dolar dolandırıldı. ABD\'de 65 yaş üstü bireyler deepfake dolandırıcılığının en sık hedefi oldu; kayıplar 1 milyar doları aştı. Deepfake teknolojisi o kadar gelişti ki, gerçek ve sahte arasındaki ayrımı insan gözüyle yapmak neredeyse imkânsız hale geldi.\n\nHükümetler hızla düzenleme çalışmalarına başladı. ABD\'de 18 eyalet deepfake kullanımını suç sayan yasalar çıkardı. Avrupa Birliği AI Act, deepfake içeriklerin zorunlu olarak etiketlenmesini gerektiriyor. Çin, derin sentez (deep synthesis) teknolojisi için 2023\'te yürürlüğe giren düzenlemeler getirdi. Türkiye\'de de Bilgi Teknolojileri ve İletişim Kurumu (BTK), deepfake içeriklere yönelik düzenleme çalışmalarını hızlandırdı. Şirketler de kendi önlemlerini alıyor. Microsoft, Teams\'te "watermarking" (gizli filigran) teknolojisi ekledi. Meta, Facebook ve Instagram\'da deepfake içeriklerin etiketlenmesi için bir sistem devreye aldı. Google, Gemini tabanlı bir deepfake tespit aracını açık kaynak olarak yayınladı.\n\nTeknoloji şirketleri aynı zamanda "deepfake kanıtı" (proof of personhood) sistemleri geliştiriyor. Bu sistemler, gerçek bir insanın yapay zekâ ile değil, kendi yüzüyle işlem yaptığını doğruluyor. Worldcoin\'in "Orb" cihazı ve Microsoft\'un "Entra Verified ID" sistemi buna örnek. Bazı ülkeler, seçimlerde deepfake kullanımını tamamen yasakladı. Romanya\'da 2024 cumhurbaşkanlığı seçimlerinde, TikTok\'ta yayılan deepfake içerikler seçim sonuçlarını etkilediği gerekçesiyle seçim iptal edildi. Uzmanlar, deepfake ile mücadelenin "AI yarışının en önemli cephelerinden biri" olduğunu söylüyor. 2025\'te düzenleyici kurumların ve teknoloji şirketlerinin ortak çalışmasıyla küresel standartlar oluşturulması bekleniyor.',
  '/deepfake-dolandiricilik-10-kat-artti-h182739.html', 4),

H('ntv', 'Kerim Özbek', 'politika-etik',
  ['NYT', 'OpenAI', 'telif hakkı', 'dava'],
  '2024-12-27T13:00:00+03:00', false, 'newspaper,law,court',
  'New York Times, OpenAI ve Microsoft\'a Telif Hakkı Davası Açtı',
  'The New York Times, OpenAI ve Microsoft\'a içeriklerinin izinsiz kullanıldığı gerekçesiyle milyarlarca dolarlık dava açtı. Dava, yapay zekânın geleceğini şekillendirebilir.',
  'The New York Times (NYT), 27 Aralık 2023\'te OpenAI ve Microsoft\'a federal mahkemede telif hakkı davası açtı. Dava, yapay zekâ endüstrisinin en önemli hukuki sınavlarından biri olarak görülüyor. NYT, OpenAI\'ın ChatGPT ve diğer ürünlerinin eğitimi için milyonlarca NYT makalesinin izinsiz kullanıldığını iddia etti. Davaya göre, OpenAI modelleri NYT içeriklerini neredeyse kelimesi kelimesine yeniden üretebiliyor; bu da telif hakkı ihlali anlamına geliyor. NYT, OpenAI ile lisans anlaşması yapma girişimlerinin başarısız kaldığını, bu nedenle yasal yola başvurduğunu açıkladı. Microsoft\'un da dava edilmesinin nedeni, OpenAI teknolojisini ticari ürünlerine (Bing, Copilot) entegre etmesi.\n\nDava, yargılamanın ötesinde derin soruları gündeme getiriyor. "Fair use" (adil kullanım) doktrini, ABD telif hakkı yasasının temel taşlarından biri. Eğitim amaçlı kullanım, genellikle adil kullanım sayılıyor. Ancak NYT\'nin avukatları, OpenAI\'ın salt eğitim için değil, doğrudan rakip bir ürün yaratmak için içerikleri kullandığını savunuyor. ChatGPT, kullanıcılara haber özetleri sunarak NYT\'nin okuyucu kitlesini ve reklam gelirini tehdit ediyor. Bu argüman, davanın sonucunu önemli ölçüde etkileyebilir. Davada, potansiyel tazminat miktarı milyarlarca doları bulabilir. Bazı tahminlere göre, eğer mahkeme lehine karar verirse, OpenAI\'ın tüm eğitim verilerini yeniden lisanslaması gerekecek; bu, milyarlarca dolarlık bir maliyet anlamına gelebilir.\n\nDavanın küresel yansımaları büyük olacak. ABD\'deki diğer yayıncılar (Washington Post, Wall Street Journal) ve yazarlar (Game of Thrones yazarı George R.R. Martin) benzer davalar açtı. Getty Images, Stability AI\'a karşı benzer bir dava sürdürüyor. Avrupa\'da da durum karmaşık: AB AI Act, eğitim verilerinin şeffaflığını zorunlu kılıyor ancak adil kullanım konusunda açık bir hüküm getirmiyor. OpenAI, davaya yanıt olarak "NYT ile müzakerelere açık olduğunu" ve "adil bir lisans anlaşmasına hazır olduğunu" açıkladı. Şirket, 2024 yılında birçok büyük yayıncıyla (Associated Press, Axel Springer, Financial Times) içerik lisans anlaşmaları imzaladı. Bu davanın sonucu, tüm yapay zekâ endüstrisinin iş modelini etkileyecek. Eğer yayıncılar kazanırsa, "veri lisansı" yapay zekâ eğitiminin ayrılmaz bir parçası haline gelebilir.',
  '/nyt-openai-telif-hakki-davasi-h198234.html', 5),

H('shiftdelete', 'Hakan Çelik', 'politika-etik',
  ['yapay zeka', 'seçim', 'dezenformasyon', 'deepfake'],
  '2024-10-15T15:00:00+03:00', false, 'voting,democracy,election',
  '2024 Seçimlerinde Yapay Zekâ Dezenformasyonu: 5 Milyar Kişiye Ulaşıldı',
  'Yapay zekâ destekli dezenformasyon, 2024\'te dünya genelinde 5 milyardan fazla seçmene ulaştı. ABD, AB, Hindistan ve Endonezya\'da seçimler etkilendi.',
  '2024 yılı, "süper seçim yılı" olarak anıldı: dünya genelinde 70\'den fazla ülkede seçim yapıldı. Bu seçimler, yapay zekâ dezenformasyonunun demokratik süreçlere etkisinin en yoğun görüldüğü dönem oldu. World Economic Forum ve Oxford Internet Institute\'ün raporuna göre, 2024 seçimlerinde yapay zekâ destekli deepfake, sentetik ses ve otomatik içerik üretimiyle 5 milyardan fazla kişiye dezenformasyon içerikleri ulaştı. ABD başkanlık seçiminde, iki adayın yapay zekâ ile üretilmiş sahte görüntüleri viral oldu. AB parlamento seçimlerinde, Rusya merkezli "Doppelganger" adlı propaganda ağı yapay zekâ içerikler yoğun kullandı. Hindistan\'da, sahte haber içerikleri seçim kampanyasını önemli ölçüde etkiledi.\n\nHindistan\'da Haziran 2024\'te yapılan genel seçimler, deepfake\'in siyasi iletişimde nasıl kullanıldığının çarpıcı bir örneği oldu. BJP (Hindistan Halk Partisi) ve muhalefet INDIA ittifakı, ölmüş siyasetçilerin deepfake videolarını yayınladı. Bir örnekte, 2018\'de ölen BJP lideri Muthuvel Karunanidhi\'nin yapay zekâ ile üretilmiş bir videosu, seçmenlerden oy istedi. Bu deepfake\'ler, milyonlarca kez izlendi. Uzmanlar, Hindistan seçimlerinin "AI seçim mühendisliğinin" dünya genelinde yayılmasının başlangıcı olduğunu söyledi. Endonezya\'da Şubat 2024 seçimlerinde de benzer deepfake\'ler kullanıldı. ABD\'de ise seçim öncesi dönemde New Hampshire\'da Biden\'ın sahte sesiyle seçmenleri "sandığa gitmemeye" çağıran bir robocall kaydedildi; olay federal soruşturma başlattı.\n\nHükümetler ve teknoloji şirketleri çeşitli önlemler aldı. AB AI Act, seçim dönemlerinde deepfake kullanımını yasaklıyor. ABD\'de 20 eyalette seçim dönemlerinde deepfake kullanımı suç sayılıyor. Çin, yapay zekâ üretimi içeriklerde "görünür filigran" zorunluluğu getirdi. Ancak uygulamada bu kuralların yaptırımı zor; deepfake\'ler sınır ötesi üretildiği için soruşturma ve cezalandırma karmaşık. Platformlar (Meta, YouTube, TikTok) kendi kurallarını koydu: siyasi deepfake\'lerin etiketlenmesi veya kaldırılması gerekiyor. Ancak araştırmalar, platformların bu kuralları yeterince uygulamadığını gösteriyor. Uzmanlar, 2026 ve 2028 seçimleri için daha güçlü düzenlemelerin şart olduğunu söylüyor. Yapay zekâ etiği uzmanları, "AI ve demokrasinin geleceği" tartışmalarının artık ana akım politikanın merkezine taşındığını vurguluyor.',
  '/2024-secimleri-yapay-zeka-dezenformasyon-h289176.html', 5),

H('log', 'Sevim Kara', 'politika-etik',
  ['veri gizliliği', 'GDPR', 'yapay zeka', 'veri koruma'],
  '2024-09-08T10:00:00+03:00', false, 'privacy,data,security',
  'Avrupa Veri Koruma Kurulu, Yapay Zekâ Modelleri İçin Yeni Kurallar Açıkladı',
  'Avrupa Veri Koruma Kurulu (EDPB), büyük dil modellerinin eğitim verisi kullanımı için yeni GDPR uyum kılavuzları yayınladı. Açık rıza zorunluluğu netleşti.',
  'Avrupa Veri Koruma Kurulu (EDPB), Eylül 2024\'te yapay zekâ modellerinin eğitim verisi kullanımına ilişkin yeni bir kılavuz yayınladı. Kılavuz, AB Genel Veri Koruma Tüzüğü\'nün (GDPR) yapay zekâ bağlamında nasıl uygulanacağını netleştiriyor. En önemli hüküm, "yasal dayanak" konusunda: model eğitimi için kişisel verilerin kullanılabilmesi için ya "açık rıza" ya da "meşru menfaat" gerekçesinin bulunması gerekiyor. "Meşru menfaat" argümanı, ancak çok güçlü bir kamu yararı (örneğin bilimsel araştırma) söz konusuysa kabul edilebilir. EDPB, çoğu ticari model için "açık rıza"nın zorunlu olduğunu vurguladı. Bu, OpenAI, Google, Meta ve benzeri şirketler için büyük bir darbe anlamına geliyor.\n\nKılavuz, "veri sahiplerinin hakları"nı da netleştirdi. Bireyler, yapay zekâ modellerine verilerinin işlenip işlenmediğini sorma, itiraz etme ve silme hakkına sahip. Ancak bu, modellerin "kara kutu" yapısı nedeniyle pratikte zor. EDPB, "Unlearn Machine" (makine unutturma) tekniklerinin geliştirilmesi gerektiğini söyledi; bir veri, model eğitildikten sonra "unutturulabilmeli". Bu, teknik olarak son derece zor bir problem. Bazı araştırmacılar, modelin yeniden eğitilmesi gerektiğini, bunun da milyonlarca dolarlık bir maliyet anlamına geldiğini söylüyor. Kılavuzda ayrıca "veri minimizasyonu" ilkesi vurgulandı: model eğitimi için gerekenden fazla veri toplanamaz.\n\nAvrupa\'da yaşayan bireyler, kılavuz doğrultusunda yeni haklar kazandı. Artık "No to AI Training" tarzı tarayıcı eklentileri, web sitelerine "içeriğim AI eğitimi için kullanılamaz" bildirimi gönderiyor. New York Times, Reuters ve BBC, bu tür bildirimleri yayınlayan ilk büyük yayıncılar arasında. Bazı ülkeler (İsviçre, İtalya) bu hakkı yasal olarak tanıdı. OpenAI, Mayıs 2024\'te kullanıcılara model eğitimi için veri paylaşımını kapatma seçeneği sundu. Ancak araştırmalar, kullanıcıların yüzde 90\'ının bu seçeneği kullanmadığını gösteriyor. Veri koruma uzmanları, "veri koruma artık bir lüks değil, yapay zekâ çağının temel hakkı" diyor. Önümüzdeki yıllarda, daha sıkı uygulama ve daha yüksek cezalar bekleniyor. İlk cezalar İtalya ve Hollanda\'da kesildi: OpenAI ve Clearview AI\'a sırasıyla 15 milyon Euro ve 30.5 milyon Euro ceza verildi.',
  '/avrupa-veri-koruma-yapay-zeka-kurallari-h213456.html', 4),

H('gelecegiyazanlar', 'Erdinç Şahin', 'politika-etik',
  ['AI Güvenlik Zirvesi', 'Bletchley', 'İngiltere', 'yapay zeka riski'],
  '2023-11-01T14:00:00+03:00', false, 'government,summit,international',
  'Bletchley AI Güvenlik Zirvesi: 28 Ülke Yapay Zekâ Risklerini Tartıştı',
  'İngiltere\'nin ev sahipliğinde düzenlenen AI Güvenlik Zirvesi\'ne 28 ülke katıldı. Bletchley Deklarasyonu, "yıkıcı yapay zekâ riskleri"ni resmen tanıdı.',
  'İngiltere Başbakanı Rishi Sunak\'ın ev sahipliğinde 1-2 Kasım 2023\'te Bletchley Park\'ta düzenlenen AI Güvenlik Zirvesi, yapay zekâ tarihinin en önemli diplomatik etkinliklerinden biri oldu. Zirveye ABD, Çin, AB, Hindistan, Brezilya, Rusya ve 22 diğer ülke katıldı. Bletchley Deklarasyonu adı verilen ortak bildiri, tüm ülkelerin "yıkıcı yapay zekâ riskleri"ni (catastrophic AI risks) resmen tanıdığını gösterdi. Deklarasyon, özellikle "sınır yapay zekâ" (frontier AI) modellerinin potansiyel tehlikelerine dikkat çekti. Bio-güvenlik, siber güvenlik ve otonom silah sistemleri alanlarında uluslararası işbirliği çağrısı yapıldı. Bu, yapay zekâ güvenliği konusunda küresel düzeyde kabul edilen ilk resmi belge oldu.\n\nZirvenin en dikkat çekici anı, ABD ve Çin\'in aynı masaya oturmasıydı. İki süper güç arasında teknoloji alanında artan gerilime rağmen, yapay zekâ güvenliği konusunda ortak hareket etme iradesi görüldü. ABD Ticaret Bakanı Gina Raimondo ve Çin Bilim ve Teknoloji Bakanı Wang Zhigang, ortak bir bildiriye imza attı. Bu, ABD-Çin teknoloji rekabetinde nadir görülen bir diplomatik başarı olarak değerlendirildi. Ancak somut taahhütler sınırlıydı: ülkeler sadece "en iyi uygulamaları paylaşma" ve "ortak araştırma yapma" sözü verdi. Zirvede ayrıca, "AI Safety Institute" adı verilen yeni bir uluslararası kuruluş önerildi; bu kuruluş, yapay zekâ modellerini test edip güvenlik değerlendirmesi yapacak.\n\nZirvenin pratik sonuçları arasında, OpenAI, Google DeepMind, Anthropic ve Meta\'nın modellerinin İngiliz hükümeti tarafından değerlendirilmesi kararı yer aldı. "AI Safety Institute" İngiltere merkezli olarak kuruldu ve 100 milyon pound bütçe aldı. ABD, kendi versiyonu olan "US AI Safety Institute"\'ı 2024\'te kurdu. Zirve, Haziran 2024\'te "AI Seoul Zirvesi" ile devam etti; Mayıs 2025\'te ise Fransa\'da üçüncü zirve düzenlenecek. Uzmanlar, Bletchley Zirvesi\'nin yapay zekâ yönetişiminde bir dönüm noktası olduğunu, ancak somut düzenlemeler için zamana ihtiyaç duyulduğunu söylüyor. Yapay zekâ etiği savunucuları, "Deklarasyon güzel ama uygulama eksik" eleştirisini yapıyor. Birçok gelişmekte olan ülke, zirveye davet edilmediği için sürecin meşruiyetini sorguladı. Önümüzdeki zirvelerin daha kapsayıcı ve uygulamaya yönelik olması bekleniyor.',
  '/bletchley-ai-guvenlik-zirvesi-h198237.html', 5),

// ============================================================
// BÖLÜM 2: ARAŞTIRMA (11-17)
// ============================================================
H('webtekno', 'Pınar Demir', 'arastirma',
  ['AlphaFold 3', 'DeepMind', 'biyoloji', 'protein'],
  '2024-05-08T15:00:00+03:00', false, 'biology,protein,science',
  'DeepMind\'in AlphaFold 3\'ü Tüm Yaşamın Moleküler Yapısını Çözüyor',
  'Google DeepMind, üçüncü nesil AlphaFold modelini tanıttı. Yeni sistem, proteinlerin yanı sıra DNA, RNA ve ilaç etkileşimlerini de yüksek doğrulukla tahmin edebiliyor.',
  'Google DeepMind, 8 Mayıs 2024\'te Nature dergisinde yayımladığı makaleyle AlphaFold 3\'ü kamuoyuna tanıttı. İlk nesli 2020\'de duyurulan AlphaFold, biyoloji dünyasında devrim yaratmıştı; şimdi üçüncü versiyonu çok daha geniş bir kapsam sunuyor. AlphaFold 3 yalnızca proteinlerin üç boyutlu yapısını değil, DNA, RNA, lipidler, iyonlar ve küçük moleküllerin (ilaçlar dahil) birbirleriyle etkileşimlerini de tahmin edebiliyor. Bu, ilaç keşfinden sentetik biyolojiye kadar pek çok alan için çığır açıcı bir gelişme anlamına geliyor.\n\nYeni model, "diffusion-based" yani difüzyon tabanlı bir mimari kullanıyor. Bu yaklaşım, görsel üretiminde kullanılan Stable Diffusion ve DALL-E modellerinden ilham alıyor. AlphaFold 3, bir moleküler yapıyı başlangıçta "bulanık" bir nokta kümesi olarak ele alıyor ve adım adım netleştirerek gerçek yapıya yakınsıyor. DeepMind, yeni modelin protein-ligand (ilaç molekülü) etkileşimlerinde yüzde 50, antikor-antijen bağlanma tahminlerinde ise yüzde 100 daha doğru sonuçlar verdiğini açıkladı. Bu, özellikle aşı ve kanser ilacı geliştirme süreçlerini hızlandırabilir.\n\nDeepMind, AlphaFold 3\'ü tüm dünyadaki araştırmacılara ücretsiz sunmak için "AlphaFold Server" platformunu hayata geçirdi. Ancak bu karar tartışmalara yol açtı: aynı gün DeepMind, 1000\'den fazla bilim insanının imzaladığı bir açık mektupla karşılaştı; mektupta ticari kullanım kısıtlamaları ve kodun açık kaynak olmaması eleştirildi. Alphabet CEO\'su Sundar Pichai, "AlphaFold, yapay zekanın insanlığa en somut faydasını sağladığı alan" dedi. Önümüzdeki yıllarda ilaç keşfi, hastalık tedavisi ve malzeme bilimi alanlarında AlphaFold 3\'ün etkilerinin daha net görüleceği tahmin ediliyor.',
  '/alphafold-3-tanitildi-h187654.html', 5),

H('shiftdelete', 'Ece Koç', 'arastirma',
  ['yapay zeka', 'matematik', 'Google DeepMind', 'bilim'],
  '2024-07-25T12:00:00+03:00', false, 'math,science,equation',
  'Google DeepMind, Yapay Zekâ ile Matematik Olimpiyatında Altın Madalya Kazandı',
  'Google DeepMind\'ın "AlphaProof" ve "AlphaGeometry" sistemleri, Uluslararası Matematik Olimpiyatı\'nda (IMO) gümüş madalya seviyesine ulaştı. Bu, yapay zekanın karmaşık matematiksel akıl yürütmedeki en büyük başarısı.',
  'Google DeepMind, Temmuz 2024\'te yapay zekâ tarihinde bir ilke imza atarak iki yapay zekâ sistemi AlphaProof ve AlphaGeometry\'nin Uluslararası Matematik Olimpiyatı\'nda (IMO) gümüş madalya seviyesinde performans gösterdiğini duyurdu. IMO, dünyanın en prestijli lise düzeyindeki matematik yarışması olarak kabul ediliyor ve soruları uzun, çok adımlı mantık zincirleri gerektiriyor. Bu, yapay zekânın "sayısal hesaplama"dan öte "gerçek akıl yürütme" yapabildiğinin en güçlü kanıtı olarak değerlendirildi.\n\nAlphaProof, "öğrenme + formal doğrulama" hibrit bir sistem. Sistem, Leann matematik kütüphanesini kullanarak problemleri formal bir dile çeviriyor, ardından "Gemini" dil modeliyle çözüm adımlarını arıyor ve her adımı "Lean" ile doğruluyor. AlphaGeometry ise özellikle geometri problemleri için tasarlandı; sentetik veriyle eğitilmiş ve klasik geometri kurallarını uygulayarak çözüm üretiyor. İki sistem birlikte, IMO\'nun altı sorusundan dördünü çözdü; 42 puanla gümüş madalya eşiğini (35 puan) aştı.\n\nDeepMind araştırmacısı Pushmeet Kohli, "Bu sonuç, yapay genel zekâya giden yolda kritik bir adım" dedi. Ancak bazı akademisyenler temkinli: "AlphaProof, önceki başarısız denemelerinden öğrendi, her yeni soru için saatlerce çalışması gerekiyor. İnsan öğrenciler 90 dakikada çözüyor" yorumunu yaptılar. Yine de sonuç, OpenAI\'ın o1 modelinin Eylül 2024\'teki AIME başarısıyla birlikte "yapay zekâ artık akıl yürütebiliyor" tezini güçlendirdi. DeepMind, AlphaProof\'un kaynak kodunu ilerleyen dönemde araştırmacılarla paylaşmayı planlıyor.',
  '/deepmind-imu-matematik-olimpiyati-h256134.html', 5),

H('chip', 'Ahmet Sarı', 'arastirma',
  ['yapay zeka', 'antibiyotik', 'sağlık', 'ilaç keşfi'],
  '2025-02-12T11:00:00+03:00', false, 'medical,laboratory,pharmaceutical',
  'Yapay Zekâ, 30 Yıldır Bulunamayan Yeni Antibiyotiği Keşfetti',
  'MIT ve McMaster Üniversitesi araştırmacıları, yapay zekâ kullanarak ilaca dirençli bakterilere karşı etkili yeni bir antibiyotik sınıfı keşfetti.',
  'MIT ve McMaster Üniversitesi\'nden araştırmacılar, Şubat 2025\'te Nature dergisinde çarpıcı bir çalışma yayımladı. Yapay zekâ destekli bir keşif süreci, ilaca dirençli MRSA (metisiline dirençli Staphylococcus aureus) ve karbapenem-dirençli Acinetobacter baumannii gibi "süper bakteri"lere karşı etkili yeni bir antibiyotik sınıfı keşfetti. Araştırmacılar, "Chemprop" adlı açık kaynak kimyasal yapay zekâ modelini kullanarak 39 milyondan fazla kimyasal bileşiği taradı. İlk denemelerde 4800 aday molekül belirlendi, ardından bunlar laboratuvar ortamında test edildi ve nihayetinde klinik öncesi çalışmalara uygun görülen "NG1" adlı bir molekül öne çıktı.\n\nBu keşif, antibiyotik direnci krizi açısından kritik önem taşıyor. Dünya Sağlık Örgütü, 2050 yılına kadar antibiyotik direncinin yılda 10 milyon insanın ölümüne yol açabileceği uyarısında bulunmuştu. Son 30 yılda piyasaya çıkan yeni antibiyotik sınıfı sayısı yalnızca birkaç tane; keşif süreçleri uzun, maliyetli ve başarı oranı düşük. Yapay zekâ, bu süreci dramatik şekilde hızlandırma potansiyeline sahip. MIT ekibinden James Collins, "Yapay zekâ sayesinde birkaç yıllık bir araştırmayı birkaç haftaya indirgeyebildik" dedi.\n\nNG1\'in en dikkat çekici özelliği, mevcut antibiyotiklerden tamamen farklı bir mekanizmayla çalışması. İlacın, bakterinin hücre zarındaki lipitleri hedef aldığı, bu sayede direnç geliştirmenin çok daha zor olduğu belirtildi. Klinik öncesi çalışmalarda NG1\'in farelerde enfeksiyonu başarıyla tedavi ettiği görüldü. İnsan denemelerinin 2026\'da başlaması planlanıyor. Uzmanlar, bu çalışmanın "yapay zekâ destekli ilaç keşfinin altın çağını başlattığını" söyledi. Birden fazla ilaç devi (Roche, Pfizer, Novartis) kendi AI keşif platformlarını hızlandırdıklarını açıkladı.',
  '/yapay-zeka- antibiyotik-kesfi-h198765.html', 5),

H('webrazzi', 'Zeynep Aydın', 'arastirma',
  ['malzeme bilimi', 'Google DeepMind', 'GNoME', 'süper iletken'],
  '2023-11-29T14:00:00+03:00', false, 'crystal,chemistry,lab',
  'DeepMind\'ın GNoME\'su, 2.2 Milyon Yeni Kristal Yapısı Keşfetti',
  'Google DeepMind, "Graph Networks for Materials Exploration" (GNoME) projesiyle bilinen tüm kristallerin 45 katı kadar yeni yapı keşfetti.',
  'Google DeepMind, Kasım 2023\'te Nature dergisinde yayımladığı makaleyle GNoME (Graph Networks for Materials Exploration) yapay zekâ sisteminin başarısını duyurdu. Sistem, "graph neural network" mimarisi kullanarak 2.2 milyon yeni kristal yapı keşfetti. Bu, insanlığın bugüne kadar keşfettiği tüm kristallerin (yaklaşık 48 bin) 45 katı. Keşfedilen yapıların 380 bin\'i "kararlı" yani gerçek dünyada sentezlenebilir özellikte. GNoME, malzeme bilimi alanında devrim niteliğinde bir gelişme olarak değerlendirildi çünkü yeni malzeme keşfi normalde deneme-yanılma yöntemiyle yıllar alabiliyor.\n\nGNoME\'un çalışma prensibi şöyle: Sistem, "öğrenci" ve "öğretmen" olmak üzere iki yapay zekâ modeli arasındaki iteratif bir öğrenme döngüsüyle çalışıyor. Öğretmen model, mevcut veri setlerinden öğrendiği bilgiyle aday yapılar öneriyor; öğrenci model ise bu yapıların kararlılığını tahmin ediyor. Doğru tahminler pekiştirilerek süreç tekrar ediliyor. DeepMind ekibi, bu yöntemle "stability prediction" doğruluğunu yüzde 80\'in üzerine çıkardı. Keşfedilen yapılar arasında yeni süper iletkenler, batarya malzemeleri ve güneş hücreleri için umut vaat eden bileşikler bulunuyor.\n\nAraştırma ekibi, bulguları tamamen açık kaynak olarak yayınladı. Materials Project ve diğer veri tabanlarına 380 bin kararlı yapı eklendi. Berkeley Laboratuvarı\'ndan bilim insanları, GNoME\'un önerdiği yapılardan bazılarını laboratuvarda sentezlemeyi başardı. Özellikle yeni lityum-iyon batarya katot malzemeleri ve hidrojen depolama bileşikleri dikkat çekiyor. Uzmanlar, GNoME\'un "deneysel malzeme biliminin yüzyıllarını saatlere indirgeyebileceğini" söyledi. İklim kriziyle mücadele için yeni nesil enerji depolama ve dönüşüm malzemelerine olan ihtiyaç göz önüne alındığında, bu keşifler kritik önem taşıyor.',
  '/deepmind-gnome-kristal-kesfi-h218973.html', 4),

H('donanimhaber', 'Ozan Tekin', 'arastirma',
  ['GraphCast', 'DeepMind', 'hava durumu', 'meteoroloji'],
  '2023-12-04T10:00:00+03:00', false, 'weather,storm,climate',
  'DeepMind\'ın GraphCast\'ı Hava Tahmininde Devrim Yaptı: 10 Günlük Tahmin Bir Dakikada',
  'Google DeepMind, yapay zekâ tabanlı hava durumu tahmin sistemi GraphCast\'ı tanıttı. Sistem, geleneksel yöntemlerden daha hızlı ve doğru sonuç veriyor.',
  'Google DeepMind, Aralık 2023\'te Science dergisinde yayımladığı makaleyle GraphCast hava durumu tahmin sistemini tanıttı. Yapay zekâ tabanlı sistem, geleneksel süper bilgisayar tabanlı hava tahmin yöntemlerini geride bırakarak meteoroloji alanında devrim yarattı. GraphCast, "graph neural network" mimarisi kullanarak küresel hava durumu verilerini işliyor. Sistem, 10 günlük hava tahminlerini tek bir Google Cloud TPU v4 çipinde bir dakikadan kısa sürede üretebiliyor. Bu, geleneksel yöntemlerin saatlerce süren hesaplamalarıyla kıyaslandığında inanılmaz bir hız avantajı anlamına geliyor.\n\nGraphCast\'ın doğruluk oranı da en az hızı kadar etkileyici. Sistem, Avrupa\'nın en gelişmiş hava tahmin sistemi olan ECMWF\'ın operasyonel modeline göre yüzde 90 oranında daha doğru sonuç verdi. Tropik fırtına, sıcak dalgası, soğuk hava kütlesi gibi ekstrem hava olaylarını önceden tahmin etmede özellikle başarılı. 2019\'daki çok şiddetli bir fırtınayı, geleneksel sistemden 9 saat önce tespit edebildiği bildirildi. Bu, erken uyarı sistemleri için hayati önem taşıyor. Yılda yaklaşık 500 bin kişi hava olaylarına bağlı afetlerden etkileniyor; erken uyarılar binlerce hayat kurtarabilir.\n\nDeepMind, GraphCast\'ın kodunu ve model ağırlıklarını tamamen açık kaynak olarak yayınladı. Bu, ulusal meteoroloji kurumlarının sistemi kendi altyapılarına entegre etmesine olanak tanıdı. Avrupa, ABD ve İngiltere meteoroloji kurumları pilot çalışmalar başlattı. Uzmanlar, GraphCast ve benzeri yapay zekâ modellerinin önümüzdeki 5 yıl içinde geleneksel hava tahmin yöntemlerinin yerini büyük ölçüde alacağını öngörüyor. İklim değişikliğiyle birlikte aşırı hava olaylarının arttığı bir dönemde, bu tür teknolojiler hem insan hayatını korumak hem de ekonomik kayıpları azaltmak için kritik önem taşıyor.',
  '/deepmind-graphcast-hava-tahmini-h145632.html', 4),

H('bthaber', 'Caner Şahin', 'arastirma',
  ['astronomi', 'yapay zeka', 'galaksi keşfi', 'uzay'],
  '2024-09-12T09:00:00+03:00', false, 'galaxy,space,stars',
  'Yapay Zekâ, 27 Yılda Keşfedilenden Fazla Galaksi Tespit Etti',
  'Astronomlar, yapay zekâ kullanarak 10 günde 1 milyardan fazla galaksi tespit etti. Bu, insan gözlemcilerin 27 yılda keşfettiğinden fazla.',
  'Astronomlar, Eylül 2024\'te Monthly Notices of the Royal Astronomical Society dergisinde çığır açan bir çalışma yayımladı. Yapay zekâ destekli bir analiz, Şili\'deki Cerro Tololo Amerikan Gözlemevi\'ndeki "Dark Energy Camera" (DECam) tarafından toplanan verilerde 10 gün içinde 1.27 milyar galaksi tespit etti. Bu, insan astronomlarının son 27 yılda keşfettiği galaksi sayısından fazla. Analiz, "convolutional neural network" (CNN) tabanlı bir model kullanılarak gerçekleştirildi. Model, gökyüzü fotoğraflarındaki galaksi benzeri yapıları insan gözünden çok daha hızlı ve tutarlı şekilde tespit edebiliyor.\n\nKeşif, "kozmik ağ" olarak adlandırılan evrenin büyük ölçekli yapısının anlaşılması açısından kritik önem taşıyor. Galaksiler, yerçekimi etkisiyle birbirine bağlı ipliksi yapılar oluşturuyor; bu yapıların haritalanması, karanlık madde ve karanlık enerji gibi evrenin temel bileşenlerinin anlaşılmasına yardımcı oluyor. Araştırma ekibinden David Burbidge, "Bu, kozmolojide yeni bir çağın başlangıcı" dedi. Tespit edilen galaksilerin koordinatları, parlaklıkları ve tahmini uzaklıkları kamuya açık bir veri tabanında paylaşıldı.\n\nBu başarı, devasa astronomi veri kümeleri karşısında yapay zekânın ne denli vazgeçilmez olduğunu gösterdi. Yaklaşmakta olan Vera C. Rubin Gözlemeği, 2025\'te faaliyete geçtiğinde her gece 20 terabayt veri üretecek. Bu verilerin insan astronomlar tarafından analiz edilmesi fiziksel olarak imkânsız. Yapay zekâ, evrenin sırlarını çözmek için artık temel bir araç haline geldi. Yeni çalışma, kuasar (parlak galaksi çekirdeği) sınıflandırması, süpernova keşfi ve ötegezegen tespiti gibi alanlarda da benzer yapay zekâ yaklaşımlarının uygulanabileceğini gösterdi. Önümüzdeki yıllarda, evrenin erken dönemlerine ait yapıların ve belki de bilinmeyen astronomik olayların keşfi bekleniyor.',
  '/yapay-zeka-galaksi-kesfi-h289716.html', 4),

H('technopat', 'Pınar Erdoğan', 'arastirma',
  ['parçacık fiziği', 'CERN', 'yapay zeka', 'nöral ağ'],
  '2024-03-18T13:00:00+03:00', false, 'physics,particle,atom',
  'CERN, Yapay Zekâ ile Yeni Fizik Keşfine Bir Adım Daha Yaklaştı',
  'CERN\'deki araştırmacılar, yapay zekâ kullanarak Büyük Hadron Çarpıştırıcısı\'ndaki veri analizini 10 kat hızlandırdı.',
  'Avrupa Nükleer Araştırma Merkezi (CERN), Mart 2024\'te Büyük Hadron Çarpıştırıcısı\'ndaki (LHC) veri analiz sürecinde yapay zekâ destekli yeni bir sistemi devreye aldığını duyurdu. LHC, saniyede 600 milyondan fazla çarpışma üretiyor ve her yıl yaklaşık 1 petabayt veri kaydediyor. Bu verilerin analizi, yeni parçacıkların keşfi ve Standart Model\'in ötesine geçen fizik olaylarının tespiti için kritik. Yeni sistem, "graph neural network" tabanlı derin öğrenme modelleri kullanarak veri filtreleme ve sinyal tespit süreçlerini 10 kata kadar hızlandırdı.\n\nCERN\'ün fizikçileri, 2012\'deki Higgs bozonu keşfinden bu yana yeni parçacık bulamıyor. Bu durum, "new physics" olarak adlandırılan Standart Model\'in ötesindeki fizik olaylarının tespit edilememesi anlamına geliyor. Bazı teorisyenler, yeni parçacıkların LHC\'nin tespit edebileceğinden çok daha nadir oluştuğunu öne sürüyor. Yapay zekâ, bu nadir olayların sinyalini gürültüden ayırmada kritik rol oynayabilir. Yeni sistem, "anomalous detection" adı verilen bir teknikle, modellenmemiş fizik olaylarını otomatik olarak tespit edebiliyor. Yani fizikçiler önceden ne aradıklarını tam bilmeseler bile yapay zekâ "olağandışı" sinyalleri bulabiliyor.\n\nCERN ekibi, sistemin açık kaynak kodunu GitHub üzerinden tüm dünyadaki araştırmacılarla paylaştı. Bu, küçük üniversitelerin bile LHC verilerine erişip kendi analizlerini yapabilmesi anlamına geliyor. Birçok üniversite (MIT, Stanford, CERN\'ün kendi lisansüstü programları) bu sistemi kullanmaya başladı bile. Araştırmacılar, önümüzdeki yıllarda yapay zekânın LHC\'nin en önemli keşiflerinden birine imza atabileceğini umuyor. Karanlık madde parçacıkları, süpersimetrik parçacıklar ve hatta ekstra boyutların varlığına dair kanıtlar, yapay zekâ analizleri sayesinde ortaya çıkabilir. Bu, fiziğin temel anlayışımızı köklü şekilde değiştirebilir.',
  '/cern-yapay-zeka-fizik-h187654.html', 4),

H('gelecegiyazanlar', 'Hande Yıldırım', 'buyuk-dil-modelleri',
  ['Apple Intelligence', 'Apple', 'Siri', 'kişisel yapay zeka'],
  '2024-06-11T02:00:00+03:00', false, 'apple,phone,artificial-intelligence',
  'Apple, WWDC 2024\'te "Apple Intelligence" Çağını Başlattı',
  'Apple, WWDC 2024\'te kişisel yapay zekâ stratejisini duyurdu. iPhone, iPad ve Mac\'e entegre edilen yeni özellikler OpenAI ile işbirliği içinde geliyor.',
  'Apple, 10 Haziran 2024\'te düzenlenen WWDC etkinliğinde merakla beklenen yapay zekâ stratejisini "Apple Intelligence" adıyla duyurdu. Yeni sistem, iPhone 15 Pro ve M1+ çipe sahip cihazlarda çalışacak. Apple Intelligence üç temel alana odaklanıyor: yazı asistanı, görsel oluşturma ve yenilenen Siri. Yazı asistanı, sistem genelinde tonlama, gramer ve özetleme yapabiliyor. Görsel oluşturma tarafında "Image Playground" uygulaması saniyeler içinde illüstrasyonlar üretebiliyor.\n\nSiri, doğal konuşma, ekran içeriği anlama ve uygulamalar arası otomasyon kabiliyeti kazandı. Kullanıcının kişisel bağlamını anlayarak daha kişiselleştirilmiş yanıtlar veriyor. OpenAI ile stratejik ortaklık kapsamında ChatGPT, Siri\'nin "uzman" modu olarak entegre edildi. Entegrasyon ücretsiz ve kullanıcı izniyle çalışıyor. Apple\'ın gizlilik odaklı yaklaşımı sektörden olumlu not aldı. Kişisel veriler büyük ölçüde cihazda işleniyor; karmaşık sorgular için Private Cloud Compute kullanılıyor. Bu sunucular bağımsız araştırmacılar tarafından denetlenebiliyor. Yapay zekâyı "premium" özellik olarak konumlandıran Apple, yüz milyonlarca kullanıcısıyla yapay zekâyı "mainstream" hale getirme potansiyeli taşıyor.',
  '/wwdc-2024-apple-intelligence-h89327.html', 5),

// ============================================================
// BÖLÜM 6: İŞ DÜNYASI (38-45)
// ============================================================
H('webtekno', 'Volkan Aydın', 'is-dunyasi',
  ['NVIDIA', 'GPU', 'yapay zeka çipi', 'piyasa değeri'],
  '2024-11-21T17:00:00+03:00', false, 'chip,technology,stock',
  'NVIDIA, Dünyanın En Değerli Şirketi Oldu: Yapay Zekâ Çipinde Tartışmasız Lider',
  'NVIDIA, piyasa değerini 3.6 trilyon dolara çıkararak Apple\'ı geçti. Şirket, yapay zekâ çipi pazarının yüzde 90\'ına hâkim.',
  'NVIDIA, Kasım 2024 itibarıyla piyasa değerini 3.6 trilyon dolara çıkararak dünyanın en değerli şirketi unvanını Apple\'dan devraldı. Şirketin hisseleri, 2024 yılı içinde yüzde 200 değer kazandı. Bu yükseliş, yapay zekâ çipi pazarındaki tartışmasız liderliğinden kaynaklanıyor. NVIDIA\'nın "Hopper" (H100) ve "Blackwell" (B200) GPU\'ları, dünya genelindeki veri merkezlerinin yüzde 90\'ında kullanılıyor. OpenAI, Microsoft, Google, Meta, Amazon ve Oracle gibi devler, milyarlarca dolarlık NVIDIA siparişleri verdi. Yöneticiler, 2025\'e kadar talebi karşılayamayacaklarını açıkladı; tedarik zinciri 2026\'ya kadar sıkışık kalacak.\n\nŞirketin geliri, yapay zekâ devrimiyle birlikte astronomik oranda arttı. 2024 mali yılında gelir 130 milyar dolara, kâr ise 50 milyar dolara ulaştı. Bu, geçen yıla göre yüzde 125 artış anlamına geliyor. CEO Jensen Huang, "Yapay zekâ, tüm endüstrileri dönüştürecek. Biz bu dönüşümün merkezindeyiz" dedi. NVIDIA\'nın yeni "Blackwell B200" çipi, 208 milyar transistöre sahip ve 20 petaflop yapay zekâ performansı sunuyor. Bu, önceki nesil H100\'den 4 kat daha hızlı. Çip, 25.000 dolardan başlayan fiyatlarla satılıyor. En büyük müşterileri Microsoft (OpenAI için), Meta, Google ve Tesla.\n\nAncak NVIDIA\'nın karşılaştığı riskler de artıyor. Çin\'e yönelik ABD ihracat kısıtlamaları, Çin pazarındaki gelirini yüzde 50 düşürdü. Buna yanıt olarak NVIDIA, Çin\'e özel "H20" adlı kısıtlı performanslı bir çip sürdü. Ayrıca AMD (MI300X), Intel (Gaudi 3) ve özellikle Google (TPU) gibi rakipler güçleniyor. Google\'ın TPU\'ları, kendi veri merkezlerinin yüzde 60\'ında kullanılıyor. Microsoft ve Amazon da kendi çiplerini (Maia, Trainium) geliştiriyor. Buna rağmen analistler, NVIDIA\'nın pazar liderliğini 2027\'ye kadar koruyacağını öngörüyor. Yapay zekâ pazarı 2025\'te 500 milyar dolara, 2030\'da 1.5 trilyon dolara ulaşacak. NVIDIA, "AI altyapısının Microsoft\'u" olmaya devam edecek.',
  '/nvidia-en-degerli-sirket-h321456.html', 4),

H('webrazzi', 'Kerem Karaca', 'is-dunyasi',
  ['Microsoft', 'OpenAI', 'ortaklık', 'yapay zeka yatırımı'],
  '2024-10-30T13:00:00+03:00', false, 'corporate,partnership,business',
  'Microsoft, OpenAI\'a 13 Milyar Dolar Yatırım Yaptığını Açıkladı: İlişki Yeniden Tanımlandı',
  'Microsoft, OpenAI ile ortaklık yapısını değiştirdiğini ve ek 1.5 milyar dolar yatırım yaptığını açıkladı. Şirket artık "gözlemci" statüsünde olacak.',
  'Microsoft, Ekim 2024\'te OpenAI ile ortaklık yapısında önemli değişiklikler yapıldığını duyurdu. Şirket, OpenAI\'a 2023 yılı içinde toplam 13 milyar dolar yatırım yaptığını ve 2024 yılında ek 1.5 milyar dolar daha yatırım yaptığını açıkladı. Yeni yapıda Microsoft, OpenAI\'ın yönetim kurulunda "gözlemci" (observer) statüsüyle yer alıyor; oy hakkı bulunmuyor ancak toplantılara katılım hakkı var. Bu değişiklik, özellikle OpenAI\'ın "kâr amacı gütmeyen" yapısından "kâr amacı güden" yapıya dönüşmesinden kaynaklanıyor. Microsoft, OpenAI\'ın yeni "Public Benefit Corporation" yapısına 92 milyar dolar değerlemeyle yatırım yaptı.\n\nOrtaklığın ticari boyutu da yeniden tanımlandı. Microsoft, OpenAI teknolojisini Azure bulut platformu üzerinden kendi müşterilerine sunma hakkını koruyor. Ancak OpenAI, kendi API\'sini ve ürünlerini (ChatGPT, DALL-E) doğrudan sunmaya da devam ediyor. Microsoft, OpenAI teknolojisini Office 365, Windows, Bing, GitHub ve diğer ürünlerine entegre etti. Copilot markası altında sunulan yapay zekâ asistanı, 2024\'te Microsoft\'un en hızlı büyüyen ürünü oldu. Şirket, 2025\'e kadar 50 milyon Copilot+ PC satmayı hedefliyor. Bu, Microsoft\'un yapay zekâ stratejisinin merkezi haline geldi.\n\nBu ortaklık, yapay zekâ tarihinin en büyük kurumsal yatırımı olma özelliğini taşıyor. Ancak bazı gözlemciler, ilişkinin karmaşık yapısını eleştirdi. Microsoft, OpenAI\'ın en büyük yatırımcısı ve bulut sağlayıcısı; ancak OpenAI aynı zamanda bağımsız bir şirket olarak kendi yolunu çizmeye çalışıyor. OpenAI, 2024\'te Apple ile de ortaklık kurarak (Apple Intelligence için) Microsoft\'a olan bağımlılığını azaltmaya çalıştı. Microsoft, kendi yapay zekâ araştırmalarını (Phi modelleri, MAIRA, Florence) da hızlandırdı. Şirket, yapay zekâ alanında "dengeli bir portföy" oluşturma stratejisi izliyor. Analistler, Microsoft-OpenAI ilişkisinin 2025-2026\'da daha da karmaşıklaşacağını, ancak uzun vadede her iki şirketin de büyümeye devam edeceğini söylüyor.',
  '/microsoft-openai-13-milyar-dolar-yatirim-h287193.html', 4),

H('chip', 'Pınar Erol', 'is-dunyasi',
  ['Google', 'AI gelir', 'reklam', 'arama motoru'],
  '2024-10-30T16:00:00+03:00', false, 'google,search,corporate',
  'Google\'ın Yapay Zekâ Geliri 100 Milyar Doları Aştı: Arama Pazarı Sarsılıyor',
  'Alphabet, 2024 yılında yapay zekâ ile ilişkili gelirinin 100 milyar doları aştığını açıkladı. Şirket, AI gelirini ayrı raporlamaya başladı.',
  'Alphabet, 2024 üçüncü çeyrek mali sonuçlarını açıklarken ilk kez "yapay zekâ geliri"ni ayrı bir kalem olarak raporladı. Şirket, AI\'ın doğrudan katkıda bulunduğu gelir kalemlerinin yıllık 100 milyar doları aştığını duyurdu. Bu rakam, AI\'ın Google arama, YouTube, Cloud ve reklam gelirlerine olan etkisini kapsıyor. En büyük katkı, arama sonuçlarına yerleştirilen "AI Overviews" (yapay zekâ özetleri) özelliğinden geldi. Bu özellik, kullanıcıya arama sonuçlarının üstünde doğrudan sentezlenmiş bir yanıt sunuyor. Google, ABD\'de arama sorgularının yüzde 25\'inin AI Overview içerdiğini açıkladı. Şirket, AI Overviews\'un kullanıcı memnuniyetini yüzde 18 artırdığını ve arama kullanımını yüzde 12 yükselttiğini söyledi.\n\nGoogle Cloud Platform (GCP) da yapay zekâ ile büyük bir sıçrama yaptı. Şirketin "Vertex AI" platformu, 2024\'te dünya genelinde 100 binden fazla kurumsal müşteriye ulaştı. Google\'ın özel yapay zekâ çipi "TPU v5e" ve "TPU v6 Trillium", büyük dil modeli eğitimi için optimize edildi. Anthropic, Character.AI ve diğer yapay zekâ girişimleri, modellerini Google\'ın TPU\'ları üzerinde eğitiyor. Bu, Google\'ı NVIDIA\'ya rakip olarak konumlandırdı. GCP\'nin 2024 geliri 40 milyar dolara ulaştı; bunun yüzde 30\'u yapay zekâ ile ilişkili işlemlerden geldi. YouTube da AI alanında önemli adımlar attı: "Dream Screen" özelliği, kullanıcıların metin komutlarıyla video arka planları oluşturmasını sağlıyor.\n\nAlphabet CEO\'su Sundar Pichai, "Yapay zekâ, Google\'ın tüm iş kollarını dönüştürüyor" dedi. Ancak şirket, yapay zekâ arama özelliğinin reklam gelirlerine etkisi konusunda dikkatli. Bazı analistler, AI Overviews\'un reklam tıklamalarını azaltabileceği endişesini taşıyor. Google, bu riski yönetmek için AI Overviews içinde sponsorlu içerikler için yeni formatlar geliştirdi. Şirketin yapay zekâ yatırımı 2024\'te 75 milyar dolara ulaştı; bu, büyük bölümü veri merkezi ve çip altyapısına harcandı. Alphabet\'in piyasa değeri 2 trilyon dolara yaklaştı. Wall Street analistleri, Google\'ın yapay zekâ çağında "en iyi konumlandırılmış" büyük teknoloji şirketi olduğunu söylüyor. Şirket, hem model geliştirme (Gemini), hem çip (TPU), hem bulut (Vertex AI) hem de uygulama (Search, YouTube) alanlarında güçlü bir portföye sahip.',
  '/google-yapay-zeka-geliri-100-milyar-dolar-h213847.html', 4),

H('donanimhaber', 'Ali Şahin', 'is-dunyasi',
  ['Meta', 'AI yatırımı', 'sanal gerçeklik', 'açık kaynak'],
  '2024-07-31T15:00:00+03:00', false, 'meta,facebook,technology',
  'Meta, 2024 Yapay Zekâ Yatırımını 40 Milyar Dolara Çıkardı',
  'Meta, 2024 yılı yapay zekâ yatırımını 40 milyar dolara çıkardığını açıkladı. Şirket, "açık lider" stratejisiyle Llama modelleriyle öne çıkıyor.',
  'Meta, Temmuz 2024\'teki ikinci çeyrek mali sonuçlarıyla birlikte 2024 yılı toplam yapay zekâ yatırımının 40 milyar dolara ulaşacağını açıkladı. Bu rakam, 2023\'e göre yüzde 70 artış anlamına geliyor. Yatırımın büyük bölümü GPU altyapısına (NVIDIA H100\'ler) ve veri merkezlerine gidiyor. Mark Zuckerberg, "Yapay zekâ, Meta\'nın geleceğinin merkezi" dedi. Şirketin stratejisi diğer devlerden farklı: Meta, Llama modellerini açık kaynak olarak yayınlayarak "AI demokratikleşmesi"ni savunuyor. Llama 3.1 405B, Temmuz 2024\'te dünyanın en büyük açık kaynak dil modeli olarak yayınlandı. Model, Hugging Face\'te 2 milyondan fazla kez indirildi.\n\nMeta\'nın AI stratejisinin diğer önemli ayağı, reklam ve içerik öneri sistemleri. Facebook ve Instagram\'da AI, kullanıcı etkileşimini yüzde 25 artırdı. "Reels" (kısa video) platformu, AI tabanlı öneri sistemiyle TikTok\'a karşı rekabette önemli avantaj elde etti. Şirket, "Meta AI" adlı kendi yapay zekâ asistanını WhatsApp, Instagram, Facebook ve Messenger\'a entegre etti. Aylık 500 milyon aktif kullanıcıya ulaşan Meta AI, 2024\'ün en hızlı büyüyen ürünü oldu. Zuckerberg, "AI asistanımız, 2025\'te dünyanın en çok kullanılan AI ürünü olacak" dedi. Şirket, aynı zamanda AI destekli "Ray-Ban Meta" akıllı gözlüklerini piyasaya sürdü; bu ürün büyük ilgi gördü.\n\nMeta\'nın "metaverse" stratejisi de AI ile yeniden şekilleniyor. Reality Labs (Meta\'nın AR/VR bölümü) 2024\'te 16 milyar dolar zarar açıkladı, ancak Zuckerberg bu yatırımlara devam edeceklerini söyledi. Quest 3 VR gözlüğü ve yaklaşan "Orion" AR gözlüğü, AI tabanlı avatarlar ve içerik üretimiyle desteklenecek. Meta, AI\'da "açık kaynak lider" pozisyonunu sürdürerek diğer devlerden farklılaşıyor. Şirket, yapay zekâ gelirini henüz ayrı raporlamıyor; ancak analistler Meta\'nın AI gelirinin 2025\'te 50 milyar doları aşacağını tahmin ediyor. Meta\'nın en büyük riski, AI yatırımlarının "abartılı" olabileceği ve yeterli gelir getirmeyebileceği eleştirisi. Ancak Zuckerberg, "AI\'a yatırım yapmayan şirketler 5 yıl içinde rekabet edemez" görüşünü savunuyor.',
  '/meta-2024-yapay-zeka-yatirimi-40-milyar-dolar-h298176.html', 4),

H('hurriyet', 'Hülya Demir', 'is-dunyasi',
  ['Apple', 'yapay zeka stratejisi', 'gecikme', 'rekabet'],
  '2024-08-20T12:00:00+03:00', false, 'apple,iphone,strategy',
  'Apple\'ın Yapay Zekâ Stratejisi Eleştiriliyor: "Rakiplerin 2 Yıl Gerisinde"',
  'Analistler, Apple\'ın yapay zekâ stratejisinde rakiplerinin 2 yıl gerisinde olduğunu söylüyor. Şirket, cihazda çalışan küçük modellere güveniyor.',
  'Apple, Ağustos 2024\'te yapay zekâ stratejisi konusunda artan eleştirilerle karşı karşıya. Bloomberg ve Morgan Stanley analistleri, Apple\'ın OpenAI, Google ve Microsoft\'a göre "yapay zekâ devriminde" 2 yıl geç kaldığını açıkladı. Şirket, WWDC 2024\'te duyurduğu Apple Intelligence özelliğini "temkinli" bir stratejiyle piyasaya sürüyor. Apple\'ın cihazda çalışan küçük modelleri (yaklaşık 3 milyar parametre) rakiplerinin bulut tabanlı büyük modelleriyle (yüz milyarlarca parametre) karşılaştırıldığında sınırlı kalıyor. Şirket, gizlilik avantajına güveniyor ancak bu yaklaşım, kullanıcı deneyimini sınırlıyor. iPhone 16 serisinin satışları, AI özelliklerinin beklenen ilgiyi uyandırmaması nedeniyle yavaşladı.\n\nApple\'ın yapay zekâ stratejisinin temel sorunu, model geliştirme kapasitesi. Şirket, 2023\'te Google\'ın eski yapay zekâ yöneticisi John Giannandrea\'ı transfer etti; ancak ekibi diğer devlerle karşılaştırıldığında küçük kalıyor. Apple, araştırma ekibinin "gizlilik odaklı" yaklaşımını sıkı şekilde koruyor; araştırmacılar, sonuçlarını kamuoyuyla sınırlı paylaşıyor. Bu, akademik toplulukla bağı zayıflatıyor ve en iyi yeteneklerin Apple\'ı tercih etmesini zorlaştırıyor. OpenAI ve Anthropic\'e kıyasla Apple\'ın yayınladığı araştırma makalesi sayısı çok az. Şirket, araştırmacılarına "yayın yapma yasağı" koyduğu iddia ediliyor. Ancak 2024\'te Apple, bu politikayı yumuşatarak bazı araştırmaların yayınlanmasına izin verdi.\n\nApple, sorunu çözmek için büyük yatırımlar yapıyor. Şirket, 2024\'te yapay zekâ alanında 1 milyar dolarlık satın alma gerçekleştirdi; en büyük satın alma, Kanada merkezli "DarwinAI" oldu. Şirket, ayrıca veri merkezi yatırımlarını hızlandırdı. Apple, kendi yapay zekâ çipi "M4 Ultra"yı 2025\'te piyasaya sürmeyi planlıyor. M4 Ultra, 80 TOPS NPU performansı sunarak cihazda daha büyük modellerin çalıştırılmasını sağlayacak. Ancak analistler, Apple\'ın bulut tabanlı yapay zekâda (OpenAI, Google gibi) ciddi bir varlık gösteremediğini, bu nedenle "cihaz yapay zekâsı" stratejisinin sınırlarına yaklaştığını söylüyor. Bazı yorumcular, Apple\'ın önümüzdeki 2-3 yılda "AI\'da ikinci lige" düşebileceği uyarısında bulunuyor. Apple hisseleri 2024\'te yüzde 8 değer kaybetti; bu, büyük teknoloji şirketleri arasında en kötü performans.',
  '/apple-yapay-zeka-stratejisi-elestiri-h187234.html', 4),

H('bthaber', 'Murat Ercan', 'is-dunyasi',
  ['Amazon', 'Anthropic', 'AWS', 'Trainium'],
  '2024-03-28T14:00:00+03:00', false, 'amazon,aws,cloud',
  'Amazon, Anthropic\'e 4 Milyar Dolar Yatırım Yaptı: AWS Trainium ile Çip Savaşı',
  'Amazon, Anthropic\'e toplam 4 milyar dolar yatırım yaptığını açıkladı. AWS, kendi yapay zekâ çipi Trainium\'u Anthropic\'in model eğitiminde kullanacak.',
  'Amazon, Mart 2024\'te yapay zekâ girişimi Anthropic\'e 2.75 milyar dolarlık ek yatırım yaptığını duyurdu. Eylül 2023\'teki 1.25 milyar dolarlık ilk yatırımla birlikte Amazon\'un Anthropic\'e toplam yatırımı 4 milyar dolara ulaştı. Bu, Amazon\'un tarihindeki en büyük dış yatırım. Yatırım karşılığında Amazon, Anthropic\'in ana bulut sağlayıcısı oldu; model eğitimi ve dağıtımı AWS üzerinden gerçekleştirilecek. Anthropic, AWS\'nin özel yapay zekâ çipi "Trainium 2"yi kullanarak modellerini eğitecek. Bu, NVIDIA\'ya olan bağımlılığı azaltma stratejisinin parçası. Trainium 2, H100\'den yüzde 30-40 daha ucuz ve yüzde 20 daha hızlı olduğu iddia ediliyor. Amazon, 2024\'e kadar 100 bin Trainium çipi üretmeyi hedefliyor.\n\nAnthropic, Amazon\'un desteğiyle hızlı büyümesini sürdürdü. Şirket, 2024 yılında ARR (yıllık tekrar eden gelir) rakamını 1 milyar dolara çıkardı. Claude ailesi (Claude 3, Claude 3.5 Sonnet, Claude 4 Opus) kurumsal müşteriler arasında popüler oldu. Slack, Notion, Quora, Bridgewater Associates ve Pfizer gibi büyük şirketler Claude\'u kullanıyor. Amazon, kendi ürünlerinde de Claude\'u entegre etti: Alexa yeni nesli, AWS Bedrock platformu ve Amazon Q (kurumsal AI asistanı) Claude tabanlı çalışıyor. Bu, Anthropic\'in gelirinin önemli bir bölümünü oluşturuyor. AWS Bedrock, kurumsal müşterilere Anthropic, AI21, Cohere ve Meta\'nın modellerini tek bir platformda sunuyor.\n\nAmazon\'un yapay zekâ stratejisinin iki ayağı var: Anthropic yatırımı ve kendi çip geliştirme. AWS CEO\'su Adam Selipsky, "Yapay zekâ, AWS\'nin en hızlı büyüyen iş kolu. 2024\'te milyarlarca dolarlık gelir elde ettik" dedi. Bedrock platformu, 2024\'te 10 milyar dolarlık gelir hacmine ulaştı. Ancak Amazon, Microsoft (OpenAI ile) ve Google (Gemini ile) karşısında dezavantajlı konumda. Microsoft ve Google, kendi modellerini doğrudan geliştirip sunarken, Amazon üçüncü taraf modellere (özellikle Anthropic\'e) bağımlı. Bu riski dengelemek için Amazon, "Titan" adı altında kendi temel modellerini de geliştirdi. Ancak Titan modelleri, sektörde Claude ve GPT-4 kadar tanınmıyor. Amazon\'un en büyük avantajı, AWS\'nin kurumsal müşteri tabanı ve altyapı ölçeği. Analistler, Amazon\'un yapay zekâda "kendi yolunu çizmeye" çalıştığını, ancak Microsoft ve Google\'a karşı 3-5 yıl geride olduğunu söylüyor.',
  '/amazon-anthropic-4-milyar-dolar-yatirim-h312897.html', 4),

H('ntv', 'Beste Yıldız', 'is-dunyasi',
  ['Suudi Arabistan', 'Humain', 'yapay zeka fonu', 'Büyük Ortadoğu'],
  '2024-10-15T09:00:00+03:00', false, 'middle-east,money,investment',
  'Suudi Arabistan 100 Milyar Dolarlık Yapay Zekâ Fonu Kurdu: Humain',
  'Suudi Arabistan, "Humain" adlı yapay zekâ şirketini ve 100 milyar dolarlık fonu açıkladı. Ülke, küresel AI yarışına katılmak istiyor.',
  'Suudi Arabistan, Ekim 2024\'te yapay zekâ alanındaki en büyük ulusal yatırımını duyurdu. Ülkenin Kamu Yatırım Fonu (PIF) çatısı altında kurulan "Humain" adlı yapay zekâ şirketi, 100 milyar dolarlık bir fonla desteklenecek. Humain, Arapça dil modeli geliştirme, veri merkezi altyapısı ve AI uygulamaları üzerine odaklanacak. Şirketin CEO\'su Tareq Amin, "Suudi Arabistan, yapay zekâ çağında küresel bir merkez olmayı hedefliyor" dedi. Ülke, özellikle NVIDIA, AMD ve diğer çip üreticilerinden 40 binden fazla GPU satın aldı. Riyad yakınlarında 500 megavatlık bir veri merkezi inşa ediliyor. Bu, Orta Doğu\'nun en büyük yapay zekâ altyapısı olacak.\n\nHumain\'in stratejisi üç ayağa dayanıyor. İlk ayak, "Arapça LLM" geliştirme. Şu an Arapça dil modelleri, İngilizce modellerin çok gerisinde. Humain, 2025\'e kadar Arapça\'nın tüm lehçelerini anlayan bir "büyük dil modeli" piyasaya sürmeyi hedefliyor. İkinci ayak, veri merkezi. Suudi Arabistan, ucuz enerji (petrol ve güneş) ve serin iklim avantajına sahip. Ülke, kendi topraklarında 1 gigavatlık bir AI veri merkezi ağı kurmak istiyor. Üçüncü ayak, uygulama. Humain, sağlık, eğitim, enerji ve kamu hizmetlerinde AI çözümleri sunacak. Suudi Arabistan, kronik hastalıkları tespit etmek için AI kullanacak bir ulusal sağlık projesi başlattı.\n\nBu yatırım, küresel AI yarışında yeni bir boyut açtı. Suudi Arabistan, ABD ve Çin dışında ilk kez devasa ölçekli bir AI yatırımı yapan ülke oldu. BAE de benzer adımlar attı: "G42" adlı yapay zekâ şirketi, Microsoft ile 1.5 milyar dolarlık ortaklık kurdu. Katar ise "Qatar Computing Research Institute" ile Arapça AI modelleri geliştiriyor. Ancak Suudi Arabistan\'ın en büyük sorunu, nitelikli insan kaynağı. Ülke, ABD ve Avrupa\'dan AI araştırmacılarını çekmek için yüz milyonlarca dolarlık teşvik paketleri sunuyor. Bazı üst düzey araştırmacılar (eski Google, Meta çalışanları) Suudi Arabistan\'a transfer oldu. Ancak akademik topluluk, "otoriter rejimlerde yapay zekâ araştırması" konusunda endişeler taşıyor. İnsan hakları örgütleri, Suudi yapay zekâsının "gözetim amaçlı kullanılabileceği" uyarısında bulunuyor. Yine de ülke, 2030\'a kadar küresel AI ekosisteminin önemli bir parçası olmayı hedefliyor.',
  '/suudi-arabistan-100-milyar-dolar-yapay-zeka-h213874.html', 4),

H('technopat', 'Selim Korkmaz', 'is-dunyasi',
  ['yapay zeka satın alma', 'startup', 'büyük teknoloji', 'konsolidasyon'],
  '2024-12-15T11:00:00+03:00', false, 'business,merger,corporate',
  '2024\'te Yapay Zekâ Startup Satın Almaları Rekor Kırdı: 80 Milyar Dolar',
  '2024 yılında büyük teknoloji şirketleri, yapay zekâ girişimlerine toplam 80 milyar dolarlık satın alma ve yatırım gerçekleştirdi.',
  '2024 yılı, yapay zekâ sektöründe konsolidasyonun zirve yaptığı bir yıl oldu. Crunchbase verilerine göre, büyük teknoloji şirketleri (Microsoft, Google, Amazon, Meta, Apple, NVIDIA) 2024 yılında toplam 80 milyar dolarlık yapay zekâ startup satın alımı ve yatırımı gerçekleştirdi. Bu, 2023\'e göre yüzde 60 artış anlamına geliyor. Microsoft, en büyük alıcı oldu: 2024\'te Inflection AI (700 milyon dolar) ve benzeri girişimlerle 12 milyar dolarlık işlem yaptı. Google, Character.AI\'a 2.7 milyar dolarlık yatırım yaptı (tam satın alma yerine "lisans + ekip transferi" modeli). Amazon, Anthropic\'e 4 milyar dolar yatırım yaptı. Meta, birçok küçük AI girişimini (oyun, ses, görüntü) bünyesine kattı.\n\nEn dikkat çekici satın almalardan biri, Microsoft\'un Inflection AI hamlesi oldu. Mart 2024\'te Microsoft, Inflection AI\'ın kurucularını (Mustafa Süleyman dahil) ve ekibinin büyük bölümünü transfer etti. 700 milyon dolarlık bu "lisans anlaşması", teknik olarak bir satın alma değildi ancak pratikte Inflection\'ın en değerli varlıklarını Microsoft\'a taşıdı. Bu model, düzenleyici incelemelerden (özellikle FTC ve AB) kaçınmak için kullanılıyor. Google\'ın Character.AI hamlesi benzer şekilde yapıldı: 2.7 milyar dolarlık yatırımla Character.AI\'ın kurucu ekibi Google\'a katıldı, ancak Character.AI bağımsız bir şirket olarak kaldı. Bu "reverse acqui-hire" modeli, 2024\'ün en popüler satın alma şekli oldu.\n\nYatırımların büyüklüğü, AI sektöründeki "FOMO" (kaçırma korkusu) kültürünü yansıtıyor. Büyük şirketler, AI alanındaki en iyi yetenekleri ve teknolojileri kaçırmamak için büyük meblağlar ödemeye hazır. Ancak bu durum, düzenleyicilerin de dikkatini çekiyor. ABD FTC ve Adalet Bakanlığı, AI satın almalarını yakından inceliyor. Özellikle "acqui-hire" modeli, rekabet hukuku açısından gri alan. AB Komisyonu, Microsoft-OpenAI ortaklığını ve Google-Anthropic ilişkisini resmi olarak soruşturma altına aldı. Yatırımcılar, 2025\'te daha fazla düzenleyici müdahale bekliyor. Bazı analistler, AI balonunun zirveye yaklaştığını ve 2025-2026\'da bir "düzeltme" olabileceğini söylüyor. Ancak büyük şirketler, AI yatırımlarına devam edeceklerini çünkü "AI\'da geri kalmamanın" stratejik bir zorunluluk olduğunu vurguluyor.',
  '/2024-yapay-zeka-startup-satin-alma-80-milyar-dolar-h287619.html', 5),

// ============================================================
// BÖLÜM 7: AÇIK KAYNAK (46-50)
// ============================================================
H('webrazzi', 'Selin Aydın', 'acik-kaynak',
  ['Mistral 7B', 'açık kaynak', 'Fransa', 'verimli model'],
  '2023-09-27T15:00:00+03:00', false, 'opensource,europe,code',
  'Mistral 7B: Küçük Ama Güçlü Açık Kaynak Model Sektörü Sarstı',
  'Fransız Mistral AI, 7 milyar parametreli açık kaynak dil modelini yayınladı. Llama 2 13B\'yi geride bıraktı, 4 haneli indirme sayısına ulaştı.',
  'Fransız Mistral AI, Eylül 2023\'te "Mistral 7B" modelini açık kaynak olarak yayınladı. 7 milyar parametreli model, küçük boyutuna rağmen 13 milyar parametreli Llama 2 13B ve 70 milyar parametreli Llama 2 70B modellerini birçok benchmark\'ta geride bıraktı. Model, Apache 2.0 lisansıyla yayınlandı; bu, tamamen serbest kullanım anlamına geliyor (ticari kullanım dahil). Model, araştırmacıların ve geliştiricilerin "fine-tune" edebileceği şekilde tasarlandı. Mistral, modelin eğitim detaylarını açıklamadı ancak "Grouped-Query Attention" ve "Sliding Window Attention" gibi yeni teknikler kullandığını söyledi. Model, Hugging Face\'te 1 hafta içinde 100 binden fazla kez indirildi.\n\nMistral 7B\'nin başarısı, "küçük modeller" akımını başlattı. Araştırmacılar, devasa modellerin (100B+ parametre) her zaman en iyi performansı vermediğini, iyi eğitim verisi ve mimari ile küçük modellerin de güçlü olabileceğini gösterdi. Mistral\'in açık kaynak lisansı, Meta\'nın Llama lisansından daha özgür (700 milyon kullanıcı kısıtlaması yok). Bu, birçok şirketin Mistral\'i tercih etmesine yol açtı. Mistral 7B, özellikle Avrupa\'da veri egemenliği konusunda hassas şirketler için ideal bir seçenek oldu. Alman, Fransız ve İskandinav kamu kurumları, Mistral tabanlı çözümleri benimsedi.\n\nMistral 7B, açık kaynak AI topluluğunda "stable diffusion anı" olarak değerlendirildi. Tıpkı görsel üretimde Stable Diffusion\'ın demokratikleşmeyi sağladığı gibi, Mistral 7B de dil modellerinde aynı etkiyi yarattı. Model, fine-tuning için mükemmel bir temel oluşturdu. Binlerce geliştirici, kendi "Mistral-7B-Türkçe", "Mistral-7B-Medical", "Mistral-7B-Code" gibi varyantlarını eğitti. Bu varyantlar, belirli alanlarda (tıp, hukuk, kodlama) uzmanlaşmış ve büyük modelleri geride bırakabiliyor. Mistral AI, 7B\'nin başarısından sonra büyük yatırımlar aldı; değerlemesi 6 milyar Euro\'ya ulaştı. Şirket, "Mixtral 8x7B" ve "Mistral Large" gibi daha büyük modelleri de yayınladı. Ancak Mistral 7B, açık kaynak AI\'ın en önemli kilometre taşlarından biri olmaya devam ediyor.',
  '/mistral-7b-acik-kaynak-model-h198234.html', 4),

H('shiftdelete', 'Cem Kıvırcık', 'acik-kaynak',
  ['Llama 3.1', 'Meta', '405B parametre', 'açık kaynak LLM'],
  '2024-07-23T16:00:00+03:00', false, 'opensource,meta,llama',
  'Meta, Llama 3.1 405B\'yi Açık Kaynak Olarak Yayınladı: "GPT-4 Seviyesi"',
  'Meta, 405 milyar parametreli Llama 3.1 modelini açık kaynak olarak yayınladı. Şirket, modelin GPT-4, Claude 3.5 Sonnet ve Gemini 1.5 Pro ile aynı seviyede olduğunu iddia ediyor.',
  'Meta, 23 Temmuz 2024\'te Llama 3.1 ailesini duyurdu. Ailenin en büyük üyesi olan "Llama 3.1 405B", 405 milyar parametreye sahip. Meta, modelin "GPT-4, Claude 3.5 Sonnet ve Gemini 1.5 Pro ile karşılaştırılabilir performans" sunduğunu açıkladı. Bu, açık kaynak dünyasında devasa bir kilometre taşı. 405B\'nin eğitimi 16 bin H100 GPU kullanılarak gerçekleştirildi; toplam eğitim maliyeti 100 milyon doları aştı. Model, 128K token bağlam penceresini destekliyor ve 8 dilde (İngilizce, Almanca, Fransızca, İtalyanca, Portekizce, İspanyolca, Hintçe, Taylandca) güçlü performans sunuyor. Meta, modeli "Llama 3.1 Community License" altında yayınladı; lisans, 700 milyondan fazla aktif kullanıcısı olan şirketler için ek izin gerektiriyor.\n\nLlama 3.1 405B\'nin en önemli özelliği, "üretim kalitesinde" açık kaynak model sunması. Önceki açık kaynak modeller (Llama 2, Mistral 7B) genellikle küçük veya "fine-tune tabanı" olarak tasarlanıyordu. 405B ise doğrudan üretim ortamında kullanılabilir. Meta, ayrıca "405B\'yi fine-tune etmenin zorluğu" sorununu çözmek için özel bir "supervised fine-tuning" (SFT) ve "RLHF" pipeline\'ı yayınladı. Bu, geliştiricilerin 405B\'yi kendi verileriyle özelleştirmesini kolaylaştırıyor. Meta, modeli "en iyi açık kaynak model" olarak konumlandırırken, "en iyi model" olmadığını dürüstçe kabul etti. Mark Zuckerberg, "Açık kaynak AI, kapalı modellerden daha güvenli, daha ucuz ve daha yenilikçi" dedi.\n\nMeta\'nın açık kaynak stratejisi, sektörde büyük tartışmalara yol açtı. OpenAI\'ın CTO\'su Mira Murati, "açık kaynak modellerin güvensiz olduğunu" savundu. Google DeepMind\'ın CEO\'su Demis Hassabis, "açık kaynak AI\'ın risklerinin büyük olduğunu" söyledi. Öte yandan Mistral, Hugging Face, Together AI ve birçok açık kaynak savunucusu Meta\'nın hamlesini destekledi. ABD hükümeti ve AI güvenliği kurumları, 405B\'nin güvenlik değerlendirmesini yakından inceledi. Meta, "Llama Guard" adlı güvenlik filtresini ve "Code Shield" adlı kod güvenlik aracını da yayınladı. 405B\'nin ardından, açık kaynak topluluk hızla fine-tune varyantlarını geliştirdi: Türkçe, Fransızca, Japonca, tıbbi, hukuki ve kodlama uzmanı versiyonlar çıktı. Llama 3.1 405B, açık kaynak AI\'ın "mainstream" hale gelmesinde kritik rol oynadı.',
  '/meta-llama-3-1-405b-acik-kaynak-h213874.html', 4),

H('gelecegiyazanlar', 'İrem Aslan', 'acik-kaynak',
  ['Qwen 2.5', 'Alibaba', 'açık kaynak', 'çok dilli'],
  '2024-09-19T13:00:00+03:00', false, 'opensource,asia,multilingual',
  'Alibaba, Qwen 2.5 Ailesini Açık Kaynak Olarak Yayınladı',
  'Alibaba, 0.5B\'den 72B\'ye kadar değişen boyutlarda Qwen 2.5 modellerini açık kaynak lisansla yayınladı. Modeller, 29 dilde güçlü performans sunuyor.',
  'Çin teknoloji devi Alibaba, Eylül 2024\'te Qwen 2.5 dil modeli ailesini açık kaynak olarak yayınladı. Aile, 0.5B, 1.5B, 3B, 7B, 14B, 32B ve 72B olmak üzere yedi farklı boyutta model içeriyor. Tüm modeller Apache 2.0 lisansıyla sunuldu; bu, tamamen serbest ticari kullanım anlamına geliyor. Qwen 2.5, 18 trilyon token veriyle eğitildi; bu, Llama 3.1\'in iki katı. Model, 29 dilde (Çince, İngilizce, Türkçe dahil) güçlü performans sunuyor. Alibaba, özellikle Çince, Japonca, Korece ve Arapça\'da modelin sektör lideri olduğunu iddia etti. Qwen 2.5 72B, MMLU\'da yüzde 86, HumanEval\'da yüzde 86, MATH\'da yüzde 83 başarı elde etti. Bu, 70B sınıfı açık kaynak modeller arasında en yüksek skor.\n\nQwen 2.5\'in en önemli özelliği, "çok dilli" performansı. Çoğu açık kaynak model İngilizce-merkezli; ancak Qwen, 29 dilde eşit kalitede sonuç veriyor. Özellikle Türkçe, Arapça, Vietnamca, Taylandca gibi "az kaynaklı" dillerde modelin performansı etkileyici. Alibaba, Türkçe için özel eğitim verisi hazırladığını ve Türkçe tokenizer\'ı optimize ettiğini söyledi. Bu, Türkçe AI uygulamaları geliştiren geliştiriciler için büyük bir fırsat. Qwen 2.5, Hugging Face\'te yayınlandıktan sonra ilk 24 saatte 50 binden fazla kez indirildi. Türkiye\'deki bazı AI girişimleri, Qwen tabanlı Türkçe modellerini fine-tune etmeye başladı bile.\n\nAlibaba\'nın açık kaynak stratejisi, Çin\'in AI yarışındaki pozisyonunu güçlendirdi. Çin hükümeti, açık kaynak AI\'ı ulusal strateji olarak benimsedi. Qwen 2.5\'in ardından, Tencent (Hunyuan), Baidu (ERNIE), DeepSeek (V3) ve diğer Çinli şirketler de modellerini açık kaynak olarak yayınladı. Bu, "Çin açık kaynak AI ekosistemi"nin doğmasına yol açtı. Alibaba, Qwen 2.5\'i "Qwen Chat" platformunda ücretsiz olarak sunarken, aynı zamanda API erişimini Alibaba Cloud üzerinden sağlıyor. Şirket, "açık kaynak, inovasyonun en hızlı yolu" açıklamasını yaptı. Ancak bazı analistler, Çin\'in açık kaynak AI\'ı küresel standartları belirleme aracı olarak kullandığını vurguladı. ABD ve Avrupa\'da, Qwen modellerinin yaygınlaşmasının "AI standartlarının Çin etkisi altına girmesi" riskini taşıdığı tartışılıyor.',
  '/alibaba-qwen-25-acik-kaynak-h298716.html', 4),

H('bthaber', 'Caner Şahin', 'acik-kaynak',
  ['Hugging Face', 'açık kaynak platform', 'AI topluluğu', 'transformers'],
  '2024-08-13T10:00:00+03:00', false, 'opensource,community,platform',
  'Hugging Face, 1 Milyon Model ve 5 Milyon Geliştiriciye Ulaştı',
  'Hugging Face, "AI\'ın GitHub\'ı" olma yolunda önemli bir dönüm noktasını geçti. Platform, açık kaynak AI ekosisteminin merkezi haline geldi.',
  'Hugging Face, Ağustos 2024 itibarıyla platformunda 1 milyondan fazla AI modeli ve 5 milyondan fazla geliştirici barındırdığını duyurdu. 2016\'da chatbot girişimi olarak kurulan şirket, 2020\'de "Transformers" kütüphanesini yayınlayarak açık kaynak AI devrimini başlattı. Bugün platform, dünya genelinde AI geliştiricilerinin "default" çalışma ortamı. Hugging Face, modelleri (Llama, Mistral, Qwen, Phi), veri setlerini (ImageNet, Common Crawl, Wikipedia) ve uygulamaları (Gradio, Spaces) tek bir çatı altında sunuyor. Şirket, 2024\'te 235 milyon dolar yatırım aldı; değerleme 4.5 milyar dolara ulaştı. Yatırımcılar arasında Google, Amazon, NVIDIA, IBM, Salesforce ve Intel yer alıyor.\n\nHugging Face\'in en önemli ürünü "Transformers" kütüphanesi. Bu Python kütüphanesi, GPT, BERT, T5, Stable Diffusion, Whisper gibi yüzlerce modeli tek bir API ile kullanma imkânı sunuyor. Transformers, 2024 itibarıyla GitHub\'da 130 binden fazla yıldız (star) aldı; bu, en popüler açık kaynak makine öğrenmesi kütüphanesi olduğunu gösteriyor. Kütüphane, PyTorch ve TensorFlow ile uyumlu çalışıyor. Hugging Face ayrıca "Datasets" (veri setleri), "Tokenizers" (metin ön işleme), "Diffusers" (görsel üretim), "Evaluate" (model değerlendirme) ve "PEFT" (parametre-verimli fine-tuning) gibi yan kütüphaneleri de sunuyor. Bu ekosistem, AI geliştirmeyi demokratikleştirdi: tek bir GPU\'ya sahip bir geliştirici bile en son modelleri kullanabiliyor.\n\nHugging Face\'in "Spaces" özelliği, geliştiricilerin AI uygulamalarını (Gradio veya Streamlit ile) doğrudan platformda yayınlamasına olanak tanıyor. Bu, "AI uygulamalarının app store\'u" olarak tanımlanıyor. 2024 itibarıyla 250 binden fazla Space aktif. Hugging Face, ayrıca "Open LLM Leaderboard"u işletiyor: açık kaynak modellerin performans sıralaması. Bu liste, AI topluluğunun en çok takip ettiği referanslardan biri. Şirket, "Inference API" ile modelleri doğrudan platform üzerinden çalıştırma imkânı da sunuyor. Bazı ülkeler (Almanya, Fransa, İsviçre) kamu hizmetlerinde Hugging Face\'i kullanıyor. Şirket, "AI\'ın GitHub\'ı" olma vizyonuyla büyümeye devam ediyor. 2024 sonunda 1000 çalışana ulaşan Hugging Face, kâr amacı gütmeyen bir misyonla hareket ettiğini açıkladı: "Açık ve iyi yapay zekâ, dünya için en iyisidir."',
  '/hugging-face-1-milyon-model-5-milyon-gelistirici-h213879.html', 4),

H('log', 'Tuğçe Kaya', 'acik-kaynak',
  ['PyTorch', 'Lightning', 'derin öğrenme', 'açık kaynak framework'],
  '2024-06-04T14:00:00+03:00', false, 'opensource,framework,code',
  'PyTorch Lightning 2.0: Yapay Zekâ Eğitimini Kolaylaştıran Açık Kaynak Framework',
  'PyTorch Lightning\'in 2.0 sürümü yayınlandı. Lightning, AI eğitim sürecini basitleştirerek küçük ekiplerin büyük modeller geliştirmesini sağlıyor.',
  'PyTorch Lightning\'in 2.0 sürümü Haziran 2024\'te yayınlandı. Lightning, "PyTorch\'un Keras\'ı" olarak tanımlanıyor: derin öğrenme modellerinin eğitimini standartlaştırıp basitleştiren bir açık kaynak framework. Facebook AI Research (Meta) tarafından geliştirilen PyTorch, AI araştırmacıları arasında en popüler framework. Ancak PyTorch\'un ham API\'si, büyük projelerde karmaşık kod gerektiriyor. Lightning, "boilerplate" kodu (tekrarlayan standart kodu) soyutlayarak araştırmacıların sadece "modelin özüne" odaklanmasını sağlıyor. 2.0 sürümü, "FSDP 2.0" entegrasyonu, "Mixed Precision" (FP8) desteği ve "Distributed Training" (dağıtık eğitim) optimizasyonları ile geliyor. Bu, milyarlarca parametreli modellerin eğitimini daha erişilebilir hale getiriyor.\n\nPyTorch Lightning\'in en önemli özelliği, "best practice" kodlama standartlarını otomatik uygulaması. Model eğitimi sırasında yapılması gereken "checkpoint" (ara kayıt), "early stopping" (erken durdurma), "logging" (eğitim kaydı), "gradient clipping" (gradyan kırpma) gibi teknikler, Lightning ile otomatik geliyor. Bu, araştırmacıların "engineering" ile uğraşmak yerine "science"a odaklanmasını sağlıyor. Lightning, 2024 itibarıyla GitHub\'da 27 bin yıldız aldı. NVIDIA, Meta, Google, Microsoft, Amazon ve Stability AI, kendi iç sistemlerinde Lightning\'i kullanıyor. Birçok üniversite (Stanford, MIT, ETH Zürih) derin öğrenme derslerinde Lightning\'i standart framework olarak benimsedi. Bu, AI eğitiminde yeni bir standart haline geldi.\n\nLightning\'in açık kaynak ekosistemi de hızla büyüyor. "Lightning AI" platformu, geliştiricilerin modellerini bulutta eğitme ve paylaşma imkânı sunuyor. 2024\'te 100 binden fazla geliştirici Lightning AI\'ı kullandı. Şirket, ayrıca "LitGPT", "LitDiffusion", "LitServe" gibi yan paketleri de yayınladı. "LitGPT", GPT-benzeri modellerin sıfırdan eğitimi için optimize edilmiş. "LitServe", modellerin üretim ortamında sunulması (serving) için yüksek performanslı bir server. Bu ekosistemi, küçük ekiplerin "büyük AI şirketleriyle" rekabet etmesini sağlıyor. Örneğin, 2 kişilik bir girişim, Lightning ile 70B parametreli bir modeli eğitip dağıtabiliyor. Bu, AI\'ın demokratikleşmesi açısından kritik önem taşıyor. PyTorch Lightning, "AI\'ı herkes için erişilebilir kılma" misyonuyla büyümeye devam ediyor.',
  '/pytorch-lightning-2-yapay-zeka-egitimi-h213498.html', 4),
];

// ============================================================
// INSERT — DB'ye yaz
// ============================================================

interface DbRow {
  slug: string;
  baslik: string;
  ozet: string;
  icerik: string;
  gorsel: string;
  kaynak_ad: string;
  kaynak_url: string;
  kaynak_logo: string;
  yazar: string | null;
  kategori: string;
  etiketler: string[];
  yayin_tarihi: string;
  okuma_suresi: number;
  orijinal_url: string;
  one_cikan: boolean;
}

function toRow(h: Haber): DbRow {
  const k = KAYNAKLAR[h.kaynak];
  return {
    slug: h.slug,
    baslik: h.baslik,
    ozet: h.ozet,
    icerik: h.icerik,
    gorsel: h.gorsel,
    kaynak_ad: k.ad,
    kaynak_url: k.url,
    kaynak_logo: logoUrl(k.domain),
    yazar: h.yazar,
    kategori: h.kategori,
    etiketler: h.etiketler,
    yayin_tarihi: h.yayin_tarihi,
    okuma_suresi: h.okuma_suresi,
    orijinal_url: h.orijinal_url,
    one_cikan: h.one_cikan,
  };
}

async function main() {
  console.log(`▶ Toplam haber: ${HABERLER.length}`);
  const dagilim = new Map<string, number>();
  HABERLER.forEach((h) => dagilim.set(h.kaynak, (dagilim.get(h.kaynak) || 0) + 1));
  console.log('\n📊 Kaynak dağılımı:');
  [...dagilim.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    console.log(`  ${String(v).padStart(2)}× ${KAYNAKLAR[k as Kaynak].ad}`);
  });

  const katDagilim = new Map<string, number>();
  HABERLER.forEach((h) => katDagilim.set(h.kategori, (katDagilim.get(h.kategori) || 0) + 1));
  console.log('\n📊 Kategori dağılımı:');
  [...katDagilim.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
    console.log(`  ${String(v).padStart(2)}× ${k}`);
  });

  const mansetSayi = HABERLER.filter((h) => h.one_cikan).length;
  console.log(`\n⭐ Manşet sayısı: ${mansetSayi}`);
  HABERLER.filter((h) => h.one_cikan).forEach((h) => {
    console.log(`  - ${h.baslik}`);
  });

  // Slug çakışması kontrolü
  const slugSet = new Set<string>();
  const dupes: string[] = [];
  HABERLER.forEach((h) => {
    if (slugSet.has(h.slug)) dupes.push(h.slug);
    slugSet.add(h.slug);
  });
  if (dupes.length) {
    console.error('\n❌ Slug çakışması:', dupes.join(', '));
    process.exit(1);
  }
  console.log(`\n✅ Tüm ${slugSet.size} slug benzersiz`);

  // DB'de var olan slug'ları kontrol et
  console.log('\n🔍 Mevcut haberler kontrol ediliyor...');
  const { data: existing, error: exErr } = await supabase
    .from('haberler')
    .select('slug');
  if (exErr) {
    console.error('❌ Mevcut kayıtlar alınamadı:', exErr.message);
    process.exit(1);
  }
  const existingSlugs = new Set((existing ?? []).map((r) => r.slug));
  const toInsert = HABERLER.filter((h) => !existingSlugs.has(h.slug));
  console.log(`  Mevcut: ${existingSlugs.size}, eklenecek: ${toInsert.length}, atlanacak: ${HABERLER.length - toInsert.length}`);

  if (toInsert.length === 0) {
    console.log('\n⚠️  Eklenecek yeni haber yok.');
    return;
  }

  // Batch insert (10'ar 10'ar)
  const BATCH = 10;
  let inserted = 0;
  let failed = 0;
  const failures: string[] = [];

  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH);
    const rows = batch.map(toRow);
    const { data, error } = await supabase
      .from('haberler')
      .insert(rows)
      .select('id, slug');

    if (error) {
      console.error(`\n❌ Batch ${i / BATCH + 1} hata: ${error.message}`);
      console.error(`  Kod: ${error.code}, Detay: ${error.details}`);
      // Batch hata aldıysa tek tek dene
      for (let j = 0; j < batch.length; j++) {
        const { error: singleErr } = await supabase
          .from('haberler')
          .insert([rows[j]])
          .select('id, slug')
          .single();
        if (singleErr) {
          console.error(`  ❌ ${batch[j].slug}: ${singleErr.message}`);
          failures.push(batch[j].slug);
          failed++;
        } else {
          inserted++;
        }
      }
    } else {
      inserted += data?.length ?? batch.length;
      console.log(`  ✅ Batch ${i / BATCH + 1}: ${data?.length ?? batch.length} eklendi (${inserted}/${toInsert.length})`);
    }
  }

  console.log(`\n📊 Sonuç: ${inserted} eklendi, ${failed} hata.`);
  if (failures.length) {
    console.log('  Hatalı:', failures.join(', '));
  }

  // Doğrulama
  console.log('\n🔍 Doğrulama...');
  const { count: totalCount } = await supabase
    .from('haberler')
    .select('*', { count: 'exact', head: true });
  console.log(`  Veritabanındaki toplam haber: ${totalCount}`);

  const { data: manset } = await supabase
    .from('haberler')
    .select('baslik, kategori')
    .eq('one_cikan', true)
    .order('yayin_tarihi', { ascending: false });
  console.log(`  Manşet haberler (${manset?.length ?? 0}):`);
  manset?.forEach((m) => console.log(`    - [${m.kategori}] ${m.baslik}`));

  const { data: byKategori } = await supabase
    .from('haberler')
    .select('kategori');
  if (byKategori) {
    const m = new Map<string, number>();
    byKategori.forEach((r) => m.set(r.kategori, (m.get(r.kategori) || 0) + 1));
    console.log('\n  DB kategori dağılımı:');
    [...m.entries()].sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
      console.log(`    ${String(v).padStart(2)}× ${k}`);
    });
  }
}

main().catch((err) => {
  console.error('❌ Hata:', err);
  process.exit(1);
});

