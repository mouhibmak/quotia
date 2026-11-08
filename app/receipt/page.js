import ReceiptGenerator from '../components/ReceiptGenerator';

export const metadata = {
  title: 'Free Receipt Generator — No Sign-Up | Quotia',
  description:
    'Create a professional payment receipt in seconds. Free forever, no account, no watermark. Your data stays in your browser. Download a clean PDF.',
};

const FAQ = [
  {
    q: 'Is the receipt generator free?',
    a: 'Yes, free forever, with no account and no watermark — same as the invoice and quote generators.',
  },
  {
    q: 'What is the difference between a receipt and an invoice?',
    a: 'An invoice asks for payment; a receipt confirms payment was received. Use this page after a client pays, to give them written proof of the amount, date and payment method.',
  },
  {
    q: 'Where does my data go?',
    a: 'Nowhere. Everything you type is processed in your browser and saved only in your own browser. Nothing is uploaded to a server.',
  },
  {
    q: 'How do I download the receipt as a PDF?',
    a: 'Click “Download PDF / Print”. In the print dialog, choose “Save as PDF” as the destination. The form is hidden and only the clean receipt is printed.',
  },
];

export default function ReceiptPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="hero no-print">
        <h1>Free receipt generator — no sign-up, no watermark</h1>
        <p className="lede">
          Confirm a payment in under a minute. Who paid, how much, how, and when —
          then download a clean PDF receipt. Free forever, no account.
        </p>
        <div className="badge-row">
          <span className="badge">Free forever</span>
          <span className="badge">No account</span>
          <span className="badge">No watermark</span>
          <span className="badge">Data stays in your browser</span>
        </div>
      </section>

      <ReceiptGenerator />

      <section className="faq no-print">
        <h2>Frequently asked questions</h2>
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
        <p>
          Need to ask for payment first? Use the{' '}
          <a href="/">free invoice generator</a> — or send a{' '}
          <a href="/quote">free quote</a> before the work starts.
        </p>
      </section>
    </>
  );
}
