import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import './globals.css';

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? 'AIGündem';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Yapay zekanın gündemi, her gün`,
    template: `%s | ${siteName}`,
  },
  description: "Türkiye'nin yapay zeka haber merkezi. LLM'ler, araçlar, araştırma, robotik, etik ve politika — her gün güncellenen, kaynak gösterilen haberler.",
  openGraph: {
    type: 'website',
    siteName,
    locale: 'tr_TR',
  },
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/rss.xml' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-paper text-ink min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
