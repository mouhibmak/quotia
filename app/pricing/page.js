export const metadata = {
  title: 'Pricing — Free Invoice Generator | Quotia',
  description:
    'Quotia is free forever for the invoice and quote generator. Pro at $12/month is coming soon — not yet available, no checkout, no payment taken.',
};

export default function PricingPage() {
  const FAQ = [
    {
      q: 'Is the invoice generator really free?',
      a: 'Yes. Invoices, quotes and receipts are free forever — unlimited, no account, no watermark, no card required.',
    },
    {
      q: 'What will Pro cost when it launches?',
      a: 'Pro is planned at $12 per month. It is not available yet: there is no checkout on this site and no payment is collected.',
    },
    {
      q: 'Will the Free plan stay free when Pro launches?',
      a: 'Yes. Everything in the Free plan — unlimited documents, 10 currencies, logo upload, clean PDF — stays free.',
    },
    {
      q: 'Do I need an account to use the free tools?',
      a: 'No. There is no sign-up and no login. Your data stays in your own browser.',
    },
  ];

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
      <section className="hero">
        <h1>Pricing</h1>
        <p className="lede">
          The invoice and quote generator is free forever. A Pro plan is planned for
          later — it is not available yet, and we take no payment for it.
        </p>
      </section>

      <div className="pricing-grid">
        <div className="plan">
          <h2>Free</h2>
          <div className="price">$0 <span style={{ fontSize: '1rem', fontWeight: 400 }}>/ forever</span></div>
          <ul>
            <li>Unlimited invoices &amp; quotes</li>
            <li>Line items with automatic subtotal, discount &amp; tax</li>
            <li>10 currencies</li>
            <li>Logo upload</li>
            <li>Clean PDF via print — no watermark</li>
            <li>No account, no sign-up</li>
            <li>Your data stays in your browser</li>
          </ul>
          <p><a className="btn primary" href="/">Make a free invoice</a></p>
        </div>

        <div className="plan">
          <h2>Pro <span className="coming">Coming soon — not yet available</span></h2>
          <div className="price">$12 <span style={{ fontSize: '1rem', fontWeight: 400 }}>/ month (planned)</span></div>
          <p>
            Pro is not launched yet. There is no checkout on this site and no payment
            is collected. When it launches, it is planned to include:
          </p>
          <ul>
            <li>Saved clients — reuse client details instead of retyping</li>
            <li>Saved business profiles &amp; logo</li>
            <li>Remove the “Created with Quotia” line from documents</li>
            <li>More document styles</li>
          </ul>
          <p className="hint">Everything in the Free plan stays free when Pro launches.</p>
        </div>
      </div>

      <section className="faq">
        <h2>Frequently asked questions</h2>
        {FAQ.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
        <p>
          Ready to make one? Start with the{' '}
          <a href="/">free invoice generator</a>.
        </p>
      </section>
    </>
  );
}
