-- ============================================================
-- AIGündem — iletişim formu tablosu
-- ============================================================
-- /iletisim formundan gelen mesajları saklar.
-- RLS açık, policy YOK → anon/authenticated erişemez,
-- yalnızca service_role (sunucu tarafı admin) insert/select yapabilir.

create table if not exists iletisim (
  id          uuid primary key default gen_random_uuid(),
  ad          text not null,
  email       text not null,
  konu        text not null check (konu in (
              'genel','basin','ipucu','isbirligi','hata')),
  mesaj       text not null,
  ip_adresi   inet,
  user_agent  text,
  okundu      boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Yeni mesajlar üstte olacak şekilde sıralama için
create index if not exists idx_iletisim_created_at
  on iletisim (created_at desc);

-- Okunmamış mesajlar için kısmi index (sık sorgulanan)
create index if not exists idx_iletisim_okundu
  on iletisim (created_at desc) where okundu = false;

-- Konuya göre filtreleme
create index if not exists idx_iletisim_konu
  on iletisim (konu, created_at desc);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table iletisim enable row level security;

-- Policy YOK: anon/authenticated için select/insert/update/delete kapalı.
-- service_role RLS'i bypass eder, doğrudan erişir.
