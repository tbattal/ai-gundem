/**
 * Veritabanı migration'ını çalıştırır.
 * Kullanım:  npm run db:migrate
 */
import { config as loadEnv } from 'dotenv';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Client } from 'pg';

loadEnv({ path: '.env.local' });
loadEnv(); // fallback to .env

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.error('❌ DATABASE_URL gerekli (.env.local)');
  console.error('   Örnek: postgresql://postgres:SIFRE@db.PROJECT_REF.supabase.co:5432/postgres');
  process.exit(1);
}

async function main() {
  const dir = join(process.cwd(), 'supabase', 'migrations');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.sql')).sort();
  if (files.length === 0) {
    console.log('ℹ️  Migration dosyası yok.');
    return;
  }

  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  console.log('✅ Veritabanına bağlanıldı.');

  try {
    for (const file of files) {
      const sql = await readFile(join(dir, file), 'utf8');
      console.log(`▶ ${file} çalıştırılıyor...`);
      try {
        await client.query(sql);
        console.log(`✅ ${file} tamam.`);
      } catch (err) {
        const msg = (err as Error).message;
        // "zaten var" hataları idempotent şekilde yutulabilir
        if (/already exists|duplicate/i.test(msg)) {
          console.log(`⏭  ${file} (nesneler zaten mevcut, atlandı).`);
        } else {
          throw err;
        }
      }
    }
  } finally {
    await client.end();
  }
  console.log("🎉 Tüm migration'lar başarıyla uygulandı.");
}

main().catch((err) => {
  console.error('❌ Migration hatası:', err.message);
  process.exit(1);
});
