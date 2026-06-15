import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'AIGündem <onboarding@resend.dev>';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

let resendClient: Resend | null = null;
function getClient(): Resend | null {
  if (!apiKey) return null;
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

export function resendHazirMi(): boolean {
  return Boolean(apiKey);
}

interface MailSonuc {
  gonderildi: boolean;
  hata?: string;
  fallbackLog?: string;
}

/**
 * Çift onay maili: kullanıcıya onay linki içeren e-posta gönderir.
 * RESEND_API_KEY tanımlı değilse graceful degrade eder:
 * - Link konsola yazılır
 * - Dönüşte gonderildi:false, fallbackLog ile bildirilir
 * Bu sayede dev/test ortamında mail göndermeden akış test edilebilir.
 */
export async function bultenOnayMailiGonder(
  email: string,
  isim: string | null,
  token: string,
): Promise<MailSonuc> {
  const onayLink = `${siteUrl}/bulten/onayla?token=${encodeURIComponent(token)}`;

  const konu = 'AIGündem bülteni — onayını bekliyoruz';
  const selamlama = isim ? `Merhaba ${isim},` : 'Merhaba,';

  const text = `${selamlama}

AIGündem bültenine abone olmak istedin. İsteğini onaylamak için aşağıdaki bağlantıya tıkla:

${onayLink}

Bu bağlantı 7 gün geçerlidir. Eğer abone olmak istemediysen bu maili silebilirsin — hesabın açılmaz.

— AIGündem
aigundem.com`;

  const html = `<!doctype html>
<html lang="tr">
  <body style="margin:0;padding:0;background:#f6f3ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#131313;">
    <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
      <div style="border-bottom:1px solid #e0dccf;padding-bottom:16px;margin-bottom:24px;">
        <span style="font-family:'Times New Roman',Georgia,serif;font-style:italic;font-size:22px;">AIGündem</span>
        <span style="display:block;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#8a8579;margin-top:4px;">Yapay zekanın gündemi · Her gün</span>
      </div>

      <p style="font-size:15px;line-height:1.6;margin:0 0 16px;">${selamlama}</p>
      <p style="font-size:15px;line-height:1.6;margin:0 0 24px;">
        AIGündem bültenine abone olmak istedin. İsteğini onaylamak için aşağıdaki butona tıkla.
      </p>

      <p style="margin:0 0 24px;">
        <a href="${onayLink}" style="display:inline-block;background:#131313;color:#f6f3ec;text-decoration:none;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;padding:14px 22px;border-radius:2px;font-family:Menlo,Consolas,monospace;">
          Aboneliği Onayla →
        </a>
      </p>

      <p style="font-size:13px;line-height:1.6;color:#555048;margin:0 0 8px;">
        Buton çalışmıyorsa bu bağlantıyı tarayıcına yapıştır:
      </p>
      <p style="font-size:12px;line-height:1.5;word-break:break-all;background:#efebe1;padding:10px 12px;border-radius:2px;margin:0 0 24px;">
        <a href="${onayLink}" style="color:#218c00;">${onayLink}</a>
      </p>

      <hr style="border:none;border-top:1px solid #e0dccf;margin:24px 0;" />

      <p style="font-size:11px;line-height:1.6;color:#8a8579;margin:0;">
        Bu bağlantı 7 gün geçerlidir. Abone olmak istemediysen bu maili silebilirsin — hesabın açılmaz.
      </p>
      <p style="font-size:11px;line-height:1.6;color:#8a8579;margin:8px 0 0;">
        © ${new Date().getFullYear()} AIGündem · <a href="${siteUrl}" style="color:#218c00;">aigundem.com</a>
      </p>
    </div>
  </body>
</html>`;

  const client = getClient();
  if (!client) {
    const fallbackLog = `[bulten] RESEND_API_KEY tanımsız — onay linki konsola yazıldı: ${onayLink}`;
    console.log(fallbackLog);
    return { gonderildi: false, fallbackLog };
  }

  try {
    const { error } = await client.emails.send({
      from: fromEmail,
      to: email,
      subject: konu,
      html,
      text,
    });
    if (error) {
      console.error('[bulten] resend hata', error);
      return { gonderildi: false, hata: error.message };
    }
    return { gonderildi: true };
  } catch (err: unknown) {
    const mesaj = err instanceof Error ? err.message : 'Bilinmeyen hata';
    console.error('[bulten] resend exception', err);
    return { gonderildi: false, hata: mesaj };
  }
}
