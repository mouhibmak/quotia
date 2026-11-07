import DocGenerator from './components/DocGenerator';

export const metadata = {
  title: 'Free Invoice Generator — No Sign-Up | Quotia',
  description:
    'Create a professional invoice in seconds. Free forever, no account, no watermark. Your data stays in your browser. Download a clean PDF.',
};

const FAQ = [
  {
    q: 'Is Quotia really free?',
    a: 'Yes. The invoice generator is free forever — no trial, no per-invoice fee, no card. A Pro plan with saved clients and extra branding is planned for later, but the generator itself stays free.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. There is no sign-up and no login. Open the page, fill in the form, and download your PDF.',
  },
  {
    q: 'Is there a watermark on the PDF?',
    a: 'No. The PDF you download has no watermark. The preview carries one small line at the bottom saying it was created with Quotia.',
  },
  {
    q: 'Where does my invoice data go?',
    a: 'Nowhere. Everything you type is processed in your browser and saved only in your own browser (local storage) so your next invoice is quicker. Nothing is uploaded to a server.',
  },
  {
    q: 'How do I download the invoice as a PDF?',
    a: 'Click “Download PDF / Print”. In the print dialog, choose “Save as PDF” as the destination. The form is hidden and only the clean invoice is printed.',
  },
];

export default function Home() {
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
        <h1>Free invoice generator — no sign-up, no watermark</h1>
        <p className="lede">
          Make a professional invoice in under a minute. Add your business, your client
          and your line items — totals, discount and tax calculate automatically. Download
          a clean PDF, free forever.
        </p>
        <div className="badge-row">
          <span className="badge">Free forever</span>
          <span className="badge">No account</span>
          <span className="badge">No watermark</span>
          <span className="badge">Data stays in your browser</span>
        </div>
      </section>

      <DocGenerator docType="INVOICE" />

      <section className="faq no-print">
        <h2>Frequently asked questions</h2>
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
        <p>
          Need a price estimate first? Use the{' '}
          <a href="/quote">free quote generator</a> — same tool, labelled QUOTE with a
          validity date instead of a due date.
        </p>
      </section>
    </>
  );
}
