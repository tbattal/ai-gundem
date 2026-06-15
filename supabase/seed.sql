-- ============================================================
-- AIGündem — örnek haber verisi
-- Bu dosya hem boş projeyi doldurmak hem de geliştirme sırasında
-- hızlıca bakmak için kullanılır.
-- ============================================================

insert into haberler (
  slug, baslik, ozet, icerik, gorsel,
  kaynak_ad, kaynak_url, kaynak_logo, yazar,
  kategori, etiketler, yayin_tarihi, okuma_suresi, orijinal_url, one_cikan
) values
(
  'openai-gpt-5-duyuruldu',
  'OpenAI, GPT-5''i Duyurdu: "Muhtemelen Son Dokunuş"',
  'OpenAI, çoklu-modal yetenekleri ve 1M token bağlam penceresiyle GPT-5''i tanıttı. CEO Sam Altman, modelin "yapay genel zekanın son dokunuşu olabileceğini" söyledi.',
  'OpenAI, bugün yaptığı basın toplantısında GPT-5 modelini resmen duyurdu. Yeni model, 1 milyon token bağlam penceresi, geliştirilmiş çoklu-modal yetenekler (metin, görsel, ses, video) ve önemli ölçüde azaltılmış halüsinasyon oranı ile geliyor.

Şirket, GPT-5''in özellikle kodlama, matematik ve bilimsel akıl yürütme alanlarında seleflerine göre ciddi sıçrama yaptığını belirtti. Benchmark sonuçlarına göre model, SWE-bench Verified testlerinde %78, AIME 2024''te %94 başarı elde etti.

CEO Sam Altman etkinlikte yaptığı konuşmada, "Bu, yapay genel zekaya giden yolda muhtemelen son dokunuş olabilir" dedi. Model, ChatGPT Pro ve API üzerinden önümüzdeki hafta kullanıma açılacak.',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1600',
  'TechCrunch', 'https://techcrunch.com', null, 'Maxwell Zeff',
  'buyuk-dil-modelleri',
  array['openai','gpt-5','llm','duyuru'],
  now() - interval '2 hours',
  5,
  'https://techcrunch.com/2026/06/14/openai-gpt-5-announcement',
  true
),
(
  'anthropic-claude-4-7-uretken-yazma',
  'Anthropic, Claude 4.7''yi "Yazma Dostu" Olarak Konumlandırıyor',
  'Yeni Claude 4.7, editoryal ton, makale yapısı ve kaynakça yönetiminde ciddi iyileştirmeler içeriyor. Yayıncılar için özel bir playbook yayımlandı.',
  null,
  'https://images.unsplash.com/photo-1611937663129-bf3abf0d7b5d?w=1600',
  'The Verge', 'https://www.theverge.com', null, 'Nilay Patel',
  'buyuk-dil-modelleri',
  array['anthropic','claude','yayincilik'],
  now() - interval '5 hours',
  4,
  'https://www.theverge.com/2026/06/14/anthropic-claude-4-7',
  true
),
(
  'google-gemini-robotik-ortakligi',
  'Google DeepMind, Boston Dynamics ile Ortaklık Kurdu',
  'Gemini 3 Flash, Atlas insansı robotlarının "anlık muhakeme" modülü olarak kullanılacak. Ortaklık 3 yıllık bir Ar-Ge programını kapsıyor.',
  null,
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1600',
  'MIT Technology Review', 'https://www.technologyreview.com', null, 'James Temple',
  'robotik',
  array['google','deepmind','boston-dynamics','insansi-robot'],
  now() - interval '8 hours',
  6,
  'https://www.technologyreview.com/2026/06/14/google-deepmind-boston-dynamics',
  false
),
(
  'avrupa-birligi-ai-act-ikinci-dalga',
  'AB Yapay Zeka Yasası''nın İkinci Dalgası Yürürlüğe Girdi',
  'Genel amaçlı modeller için yeni şeffaflık kuralları, eğitim verisi özetleri ve hesap verebilirlik raporlaması bugün itibarıyla zorunlu oldu.',
  null,
  'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1600',
  'Reuters', 'https://www.reuters.com', null, 'Foo Yun Chee',
  'politika-etik',
  array['avrupa-birligi','duzenleme','ai-act'],
  now() - interval '12 hours',
  7,
  'https://www.reuters.com/technology/eu-ai-act-second-wave',
  false
),
(
  'mistral-8x22b-acik-kaynak',
  'Mistral, 8x22B Açık Kaynak Modelini Yayımladı',
  'Fransız yapay zeka şirketi, Apache 2.0 lisansıyla 176B parametreli MoE modelini kamuya açt. Tek GPU''da inference mümkün.',
  null,
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600',
  'VentureBeat', 'https://venturebeat.com', null, 'Carl Franzen',
  'acik-kaynak',
  array['mistral','acik-kaynak','moe','llm'],
  now() - interval '1 day',
  4,
  'https://venturebeat.com/ai/mistral-8x22b',
  false
),
(
  'sora-2-video-uretimi',
  'OpenAI, Sora 2 ile 60 Saniyelik Tutarlı Video Üretiyor',
  'Yeni Sora 2, karakter tutarlılığı, kamera kontrolü ve fizik simülasyonunda önemli gelişmeler sunuyor. Sinema endüstrisi endişeli.',
  null,
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1600',
  'Wired', 'https://www.wired.com', null, 'Will Knight',
  'araclar',
  array['openai','sora','video','uretici'],
  now() - interval '1 day 4 hours',
  5,
  'https://www.wired.com/story/sora-2-openai',
  false
),
(
  'nvidia-yeni-gpu-yatirim',
  'NVIDIA, Yeni Blackwell Ultra GPU''ları Duyurdu',
  'B200 Ultra, eğitim maliyetlerini %40 azaltıyor ve 208B parametreli modellerin tek bir node''da eğitilmesini sağlıyor.',
  null,
  'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1600',
  'Reuters', 'https://www.reuters.com', null, 'Max A. Cherney',
  'is-dunyasi',
  array['nvidia','gpu','donanim','yatirim'],
  now() - interval '1 day 8 hours',
  4,
  'https://www.reuters.com/technology/nvidia-blackwell-ultra',
  false
),
(
  'ai-arac-cagirimi-perplexity-vs-google',
  'Perplexity, Google''a Meydan Okuyor: "Bilginin Geleceği"',
  'Perplexity, yeni "Comet" tarayıcısıyla arama deneyimini sıfırdan tasarlıyor. Google hisseleri son 3 günde %6 değer kaybetti.',
  null,
  'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=1600',
  'TechCrunch', 'https://techcrunch.com', null, 'Sarah Perez',
  'is-dunyasi',
  array['perplexity','google','arama'],
  now() - interval '1 day 12 hours',
  5,
  'https://techcrunch.com/2026/06/13/perplexity-comet-browser',
  false
),
(
  'meta-llama-4-acik-kaynak',
  'Meta, Llama 4''ü Açık Kaynak Yaptı: 400B Parametre',
  'Llama 4, multimodalite, 10M token bağlam ve 400B parametre ile geliyor. Lisans tartışmaları sürüyor — "70B üstü için izin gerekli" maddesi kaldırıldı.',
  null,
  'https://images.unsplash.com/photo-1633412802994-5c058f151b66?w=1600',
  'The Verge', 'https://www.theverge.com', null, 'Alex Heath',
  'acik-kaynak',
  array['meta','llama','acik-kaynak'],
  now() - interval '2 days',
  5,
  'https://www.theverge.com/2026/06/12/meta-llama-4',
  false
),
(
  'github-copilot-ekip-lisanslari',
  'GitHub, Kurumsal Copilot Lisanslarını Yeniden Yapılandırdı',
  'Yeni "Copilot Teams" paketi, küçük ekipler için uygun fiyatlı, "Copilot Enterprise" ise özel model fine-tuning dahil.',
  null,
  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1600',
  'TechCrunch', 'https://techcrunch.com', null, 'Frederic Lardinois',
  'araclar',
  array['github','copilot','devops','kurumsal'],
  now() - interval '2 days 4 hours',
  4,
  'https://techcrunch.com/2026/06/12/github-copilot-teams',
  false
),
(
  'ai-bilinc-tartismasi-yukseliyor',
  'AI Bilinci Tartışması: 100 Araştırmacı Açık Mektup Yayımladı',
  'Yapay zekâda bilinç ihtimali üzerine imzalanan mektup, 100+ nörobilimci ve AI araştırmacısını bir araya getirdi. Anthropic ve DeepMind çalışanları da imzacılar arasında.',
  null,
  'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1600',
  'MIT Technology Review', 'https://www.technologyreview.com', null, 'Karen Hao',
  'politika-etik',
  array['bilinc','etik','arastirma','mektup'],
  now() - interval '2 days 8 hours',
  8,
  'https://www.technologyreview.com/2026/06/12/ai-consciousness-letter',
  false
),
(
  'deepmind-protein-tasarimi',
  'DeepMind, Protein Tasarımında Yeni Bir Çağ Açıyor',
  'AlphaFold 4, sadece var olan proteinleri tahmin etmekle kalmıyor, istenen özelliklere sahip yeni proteinleri sıfırdan tasarlayabiliyor.',
  null,
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600',
  'Nature', 'https://www.nature.com', null, 'Ewen Callaway',
  'arastirma',
  array['deepmind','alphafold','biyoloji','arastirma'],
  now() - interval '3 days',
  6,
  'https://www.nature.com/articles/deepmind-alphafold-4',
  false
);
