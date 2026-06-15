import crypto from 'node:crypto';

const SECRET = process.env.CAPTCHA_SECRET;

if (!SECRET) {
  throw new Error('CAPTCHA_SECRET tanımlı değil. .env.local dosyasını kontrol et.');
}

/**
 * Tek basamaklı toplama/çıkarma sorusu üretir. Üretilen token, cevabın
 * HMAC-SHA256'sıdır; sunucu tarafında doğrulanır, tarayıcıya açık değildir.
 */
export function generateCaptcha(): { problem: string; token: string; answer: number } {
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const op: '+' | '-' = Math.random() < 0.5 ? '+' : '-';
  const answer = op === '+' ? a + b : a - b;
  const problem = `${a} ${op} ${b} = ?`;
  const token = crypto.createHmac('sha256', SECRET!).update(String(answer)).digest('hex');
  return { problem, token, answer };
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, 'hex');
  const bb = Buffer.from(b, 'hex');
  if (ab.length !== bb.length || ab.length === 0) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Kullanıcının gönderdiği cevabı, sayfada üretilen token ile doğrular.
 * Cevap -9..+18 aralığında bir tam sayı olmalı.
 */
export function verifyCaptcha(answerRaw: string, token: string): boolean {
  if (typeof token !== 'string' || !/^[0-9a-f]{64}$/.test(token)) return false;
  const trimmed = answerRaw.trim();
  if (!/^-?\d{1,2}$/.test(trimmed)) return false;
  const value = Number(trimmed);
  if (!Number.isInteger(value) || value < -9 || value > 18) return false;
  const expected = crypto.createHmac('sha256', SECRET!).update(String(value)).digest('hex');
  return safeEqual(expected, token);
}
