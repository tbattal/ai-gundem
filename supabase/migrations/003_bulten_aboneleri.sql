-- ============================================================
-- AIGündem — bülten abone tablosu
-- ============================================================
-- /bulten formundan gelen abone kayıtları.
-- Çift onay (double opt-in): abone → maildeki onay linki → aktif.
-- RLS açık, policy YOK → sadece service_role erişir.

create table if not exists bulten_aboneleri (
  id                  uuid primary key default gen_random_uuid(),
  email               text unique not null,
  isim                text,
  siklik              text not null default 'haftalik' check (siklik in ('haftalik','aylik')),
  onay_durumu         text not null default 'beklemede' check (onay_durumu in ('beklemede','aktif','iptal')),
  onay_token          text unique not null,
  ip_adresi           inet,
  user_agent          text,
  created_at          timestamptz not null default now(),
  onaylanma_tarihi    timestamptz
);

-- Aktif abone aramaları için kısmi index
create index if not exists idx_bulten_aktif
  on bulten_aboneleri (created_at desc) where onay_durumu = 'aktif';

-- Beklemede olan ve token ile eşleşme için
create index if not exists idx_bulten_token
  on bulten_aboneleri (onay_token) where onay_durumu = 'beklemede';

-- E-posta ile arama (yeniden abone olma, iptal akışı)
create index if not exists idx_bulten_email
  on bulten_aboneleri (email);

alter table bulten_aboneleri enable row level security;
