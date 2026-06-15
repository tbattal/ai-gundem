-- ============================================================
-- AIGündem — başlangıç şeması
-- ============================================================

-- Kategoriler: enum yerine check constraint ile esnek tutuldu
-- (yeni kategori eklemek kolay olsun)

create table if not exists haberler (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  baslik        text not null,
  ozet          text not null,
  icerik        text,
  gorsel        text not null,
  kaynak_ad     text not null,
  kaynak_url    text not null,
  kaynak_logo   text,
  yazar         text,
  kategori      text not null check (kategori in (
    'buyuk-dil-modelleri','arastirma','araclar','robotik',
    'politika-etik','is-dunyasi','acik-kaynak'
  )),
  etiketler     text[] not null default '{}',
  yayin_tarihi  timestamptz not null,
  okuma_suresi  int  not null default 3 check (okuma_suresi > 0),
  orijinal_url  text not null,
  one_cikan     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Arama ve listeleme için index'ler
create index if not exists idx_haberler_yayin_tarihi
  on haberler (yayin_tarihi desc);

create index if not exists idx_haberler_kategori
  on haberler (kategori, yayin_tarihi desc);

create index if not exists idx_haberler_one_cikan
  on haberler (one_cikan, yayin_tarihi desc) where one_cikan = true;

-- Türkçe arama için basit trigram index (pg_trgm uzantısı varsa)
create extension if not exists pg_trgm;
create index if not exists idx_haberler_baslik_trgm
  on haberler using gin (baslik gin_trgm_ops);
create index if not exists idx_haberler_ozet_trgm
  on haberler using gin (ozet gin_trgm_ops);

-- updated_at otomatik güncellensin
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_haberler_updated_at on haberler;
create trigger trg_haberler_updated_at
  before update on haberler
  for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table haberler enable row level security;

-- Herkes okuyabilsin
drop policy if exists "haberler_select_all" on haberler;
create policy "haberler_select_all"
  on haberler for select
  to anon, authenticated
  using (true);

-- Yazma sadece service_role ile (anon/authenticated bloklu)
-- (RLS aktifken service_role politikadan etkilenmez)
