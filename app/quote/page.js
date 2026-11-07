import DocGenerator from '../components/DocGenerator';

export const metadata = {
  title: 'Free Quote & Estimate Generator | Quotia',
  description:
    'Create a professional quote or estimate in seconds. Free forever, no account, no watermark. Your data stays in your browser. Download a clean PDF.',
};

const FAQ = [
  {
    q: 'What is the difference between a quote and an invoice?',
    a: 'A quote (or estimate) is a priced offer you send before the work starts. An invoice is the payment request you send after the work is done. This page makes quotes; the home page makes invoices.',
  },
  {
    q: 'Is the quote generator free?',
    a: 'Yes, free forever, with no account and no watermark — same as the invoice generator.',
  },
  {
    q: 'How long is a quote valid?',
    a: 'You set the validity date yourself. 30 days is a common default, and this generator pre-fills 30 days from today. Change it to whatever you agreed with your client.',
  },
  {
    q: 'Where does my data go?',
    a: 'Nowhere. Everything you type is processed in your browser and saved only in your own browser. Nothing is uploaded to a server.',
  },
];

export default function QuotePage() {
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
        <h1>Free quote &amp; estimate generator</h1>
        <p className="lede">
          Send a professional priced quote before the work starts. Same free engine as
          the invoice generator — fill it in, set a validity date, download a clean PDF.
          No account, no watermark.
        </p>
        <div className="badge-row">
          <span className="badge">Free forever</span>
          <span className="badge">No account</span>
          <span className="badge">No watermark</span>
          <span className="badge">Data stays in your browser</span>
        </div>
      </section>

      <DocGenerator docType="QUOTE" />

      <section className="faq no-print">
        <h2>Frequently asked questions</h2>
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
        <p>
          Once the client accepts, make the matching invoice on the{' '}
          <a href="/">free invoice generator</a>.
        </p>
      </section>
    </>
  );
}
