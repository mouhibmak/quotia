import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import Link from 'next/link';

export const metadata = {
  metadataBase: new URL('https://quotia-mouhib2.vercel.app'),
  title: 'Free Invoice Generator — No Sign-Up | Quotia',
  description:
    'Create a professional invoice in seconds. Free forever, no account, no watermark. Your data stays in your browser. Download a clean PDF.',
  openGraph: {
    title: 'Free Invoice Generator — No Sign-Up | Quotia',
    description:
      'Create a professional invoice in seconds. Free forever, no account, no watermark. Your data stays in your browser. Download a clean PDF.',
    url: 'https://quotia-mouhib2.vercel.app',
    siteName: 'Quotia',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar no-print">
          <Link href="/" className="logo">Quotia<span>.</span></Link>
          <nav>
            <Link href="/">Invoice</Link>
            <Link href="/quote">Quote</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="footer no-print">
          <p>
            Quotia — free invoice &amp; quote generator. No account, no watermark, no sign-up.
            Your data never leaves your browser. <Link href="/pricing">Pricing</Link>
          </p>
          <p>Quotia creates document templates. It is not legal, tax, or accounting advice — check your local invoicing rules.</p>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
