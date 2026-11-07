export const metadata = {
  title: 'Pricing — Free Invoice Generator | Quotia',
  description:
    'Quotia is free forever for the invoice and quote generator. Pro at $12/month is coming soon — not yet available, no checkout, no payment taken.',
};

export default function PricingPage() {
  return (
    <>
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
    </>
  );
}
