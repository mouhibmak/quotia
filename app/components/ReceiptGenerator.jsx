// Receipt generator — same engine pattern as DocGenerator (client-side,
// localStorage, print-to-PDF), but receipt fields: receipt number, date,
// received-from, amount, payment method. No sign-up, no watermark, data
// stays in the browser.

'use client';

import { useEffect, useMemo, useState } from 'react';

const CURRENCIES = [
  { code: 'USD', label: 'USD — US Dollar ($)' },
  { code: 'EUR', label: 'EUR — Euro (€)' },
  { code: 'GBP', label: 'GBP — British Pound (£)' },
  { code: 'TND', label: 'TND — Tunisian Dinar (DT)' },
  { code: 'CAD', label: 'CAD — Canadian Dollar ($)' },
  { code: 'AUD', label: 'AUD — Australian Dollar ($)' },
  { code: 'CHF', label: 'CHF — Swiss Franc' },
  { code: 'INR', label: 'INR — Indian Rupee (₹)' },
  { code: 'AED', label: 'AED — UAE Dirham' },
  { code: 'JPY', label: 'JPY — Japanese Yen (¥)' },
];

const PAYMENT_METHODS = ['Cash', 'Bank transfer', 'Card', 'PayPal', 'Other'];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    businessName: '',
    businessEmail: '',
    businessAddress: '',
    logo: '',
    receivedFrom: '',
    receiptNumber: 'RCT-001',
    date: todayISO(),
    currency: 'USD',
    amount: 500,
    paymentMethod: 'Bank transfer',
    notes: 'Thank you for your payment.',
    template: 'classic',
  };
}

export default function ReceiptGenerator() {
  const storageKey = 'quotia-receipt-v1';
  const [state, setState] = useState(() => defaultState());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setState({ ...defaultState(), ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {}
  }, [state, loaded, storageKey]);

  const set = (patch) => setState((s) => ({ ...s, ...patch }));

  const fmt = useMemo(
    () => (n) => {
      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: state.currency,
        }).format(n);
      } catch {
        return `${state.currency} ${Number(n).toFixed(2)}`;
      }
    },
    [state.currency]
  );

  const onLogo = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => set({ logo: String(reader.result) });
    reader.readAsDataURL(f);
  };

  const clearAll = () => {
    if (window.confirm('Clear everything and start blank?')) {
      const blank = defaultState();
      blank.receivedFrom = '';
      blank.notes = '';
      blank.amount = 0;
      set(blank);
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
  };

  return (
    <div className="generator">
      <div className="no-print">
        <div className="panel">
          <h2>Your details</h2>
          <label>Business name<input value={state.businessName} onChange={(e) => set({ businessName: e.target.value })} placeholder="Your business or your name" /></label>
          <label>Business email<input value={state.businessEmail} onChange={(e) => set({ businessEmail: e.target.value })} placeholder="you@example.com" /></label>
          <label>Business address<textarea value={state.businessAddress} onChange={(e) => set({ businessAddress: e.target.value })} placeholder="Street, city, country" rows={2} /></label>
          <label>Logo (optional)
            <input type="file" accept="image/*" onChange={onLogo} />
          </label>
          {state.logo ? (
            <button className="btn ghost" type="button" onClick={() => set({ logo: '' })}>Remove logo</button>
          ) : null}
        </div>

        <div className="panel">
          <h2>Receipt details</h2>
          <label>Received from<input value={state.receivedFrom} onChange={(e) => set({ receivedFrom: e.target.value })} placeholder="Name of the person who paid" /></label>
          <div className="row">
            <label>Receipt number<input value={state.receiptNumber} onChange={(e) => set({ receiptNumber: e.target.value })} /></label>
            <label>Date<input type="date" value={state.date} onChange={(e) => set({ date: e.target.value })} /></label>
          </div>
          <div className="row">
            <label>Amount<input type="number" min="0" step="any" value={state.amount} onChange={(e) => set({ amount: e.target.value })} /></label>
            <label>Currency
              <select value={state.currency} onChange={(e) => set({ currency: e.target.value })}>
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </label>
          </div>
          <p className="hint">Currency changes the symbol and formatting only — it does not convert amounts.</p>
          <label>Payment method
            <select value={state.paymentMethod} onChange={(e) => set({ paymentMethod: e.target.value })}>
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>
          <label>Template
            <select value={state.template || 'classic'} onChange={(e) => set({ template: e.target.value })}>
              <option value="classic">Classic — navy header, bold totals</option>
              <option value="freelancer">Freelancer — clean teal accent</option>
              <option value="minimal">Minimal — light, monochrome, thin lines</option>
              <option value="bold">Bold — dark header, high-contrast totals</option>
              <option value="elegant">Elegant — serif, warm, understated</option>
            </select>
          </label>
          <p className="hint">The template changes the look of the preview and the PDF only — the numbers stay the same.</p>
        </div>

        <div className="panel">
          <h2>Notes &amp; download</h2>
          <label>Notes<textarea value={state.notes} onChange={(e) => set({ notes: e.target.value })} rows={3} placeholder="Thank you note, what the payment was for" /></label>
          <div className="actions">
            <button className="btn primary" type="button" onClick={() => window.print()}>
              Download PDF / Print
            </button>
            <button className="btn ghost" type="button" onClick={clearAll}>Clear all</button>
          </div>
          <p className="hint">PDF: in the print dialog, choose “Save as PDF”. Everything you typed stays in your browser — nothing is uploaded or stored on a server.</p>
        </div>
      </div>

      {/* Printable preview */}
      <div className="preview-wrap">
        <div className={`preview template-${state.template || 'classic'}`} id="print-area">
          <div className="doc-head">
            <div>
              {state.logo ? <img src={state.logo} alt="Business logo" className="doc-logo" /> : null}
              <div className="doc-biz">{state.businessName || 'Your Business'}</div>
              <div className="doc-meta">{state.businessEmail}</div>
              <div className="doc-meta">{state.businessAddress}</div>
            </div>
            <div className="doc-title">
              <div className="doc-type">RECEIPT</div>
              <div className="doc-num">#{state.receiptNumber}</div>
            </div>
          </div>

          <div className="doc-cols">
            <div>
              <div className="doc-label">Received from</div>
              <div className="doc-client">{state.receivedFrom || 'Name of payer'}</div>
            </div>
            <div className="doc-dates">
              <div><span>Date:</span> {state.date}</div>
            </div>
          </div>

          <div className="doc-section">
            <div className="doc-label">Amount received</div>
            <div className="receipt-amount">{fmt(Number(state.amount) || 0)}</div>
            <div className="receipt-rows">
              <div><span>Payment method</span><span>{state.paymentMethod}</span></div>
              <div><span>Receipt number</span><span>#{state.receiptNumber}</span></div>
              <div><span>Date</span><span>{state.date}</span></div>
            </div>
          </div>

          {state.notes ? (
            <div className="doc-section"><div className="doc-label">Notes</div><p>{state.notes}</p></div>
          ) : null}
          <div className="doc-foot">Created with Quotia — free invoice, quote &amp; receipt generator</div>
        </div>
      </div>
    </div>
  );
}
