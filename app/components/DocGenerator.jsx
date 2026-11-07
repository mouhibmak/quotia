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

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState(docType) {
  const d = new Date();
  const due = new Date(d);
  due.setDate(due.getDate() + (docType === 'QUOTE' ? 30 : 14));
  return {
    businessName: '',
    businessEmail: '',
    businessAddress: '',
    logo: '',
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    docNumber: docType === 'QUOTE' ? 'QT-001' : 'INV-001',
    issueDate: todayISO(),
    dueDate: due.toISOString().slice(0, 10),
    currency: 'USD',
    items: [
      { id: 1, desc: 'Design work', qty: 1, rate: 500 },
      { id: 2, desc: 'Revisions', qty: 2, rate: 75 },
    ],
    discountType: 'percent',
    discountValue: 0,
    taxRate: 0,
    taxLabel: 'Tax',
    notes: 'Thank you for your business.',
    payment: '',
  };
}

export default function DocGenerator({ docType }) {
  const isQuote = docType === 'QUOTE';
  const storageKey = isQuote ? 'quotia-quote-v1' : 'quotia-invoice-v1';
  const [state, setState] = useState(() => defaultState(docType));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setState({ ...defaultState(docType), ...JSON.parse(raw) });
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

  const totals = useMemo(() => {
    const subtotal = state.items.reduce(
      (sum, it) => sum + (Number(it.qty) || 0) * (Number(it.rate) || 0),
      0
    );
    const discount =
      state.discountType === 'percent'
        ? (subtotal * (Number(state.discountValue) || 0)) / 100
        : Number(state.discountValue) || 0;
    const afterDiscount = Math.max(0, subtotal - discount);
    const tax = (afterDiscount * (Number(state.taxRate) || 0)) / 100;
    return { subtotal, discount, tax, total: afterDiscount + tax };
  }, [state.items, state.discountType, state.discountValue, state.taxRate]);

  const fmt = (n) => {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: state.currency,
      }).format(n);
    } catch {
      return `${state.currency} ${Number(n).toFixed(2)}`;
    }
  };

  const updateItem = (id, patch) =>
    set({
      items: state.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    });
  const addItem = () =>
    set({
      items: [
        ...state.items,
        { id: Date.now(), desc: '', qty: 1, rate: 0 },
      ],
    });
  const removeItem = (id) =>
    set({ items: state.items.filter((it) => it.id !== id) });

  const onLogo = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => set({ logo: String(reader.result) });
    reader.readAsDataURL(f);
  };

  const clearAll = () => {
    if (window.confirm('Clear everything and start blank?')) {
      const blank = defaultState(docType);
      blank.items = [{ id: Date.now(), desc: '', qty: 1, rate: 0 }];
      blank.businessName = '';
      blank.notes = '';
      set(blank);
      try {
        localStorage.removeItem(storageKey);
      } catch {}
    }
  };

  const label = isQuote ? 'QUOTE' : 'INVOICE';
  const numberLabel = isQuote ? 'Quote number' : 'Invoice number';
  const dateLabel = isQuote ? 'Valid until' : 'Due date';

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
          <h2>Client details</h2>
          <label>Client name<input value={state.clientName} onChange={(e) => set({ clientName: e.target.value })} placeholder="Client name or company" /></label>
          <label>Client email<input value={state.clientEmail} onChange={(e) => set({ clientEmail: e.target.value })} placeholder="client@example.com" /></label>
          <label>Client address<textarea value={state.clientAddress} onChange={(e) => set({ clientAddress: e.target.value })} placeholder="Street, city, country" rows={2} /></label>
        </div>

        <div className="panel">
          <h2>Document details</h2>
          <div className="row">
            <label>{numberLabel}<input value={state.docNumber} onChange={(e) => set({ docNumber: e.target.value })} /></label>
            <label>Issue date<input type="date" value={state.issueDate} onChange={(e) => set({ issueDate: e.target.value })} /></label>
            <label>{dateLabel}<input type="date" value={state.dueDate} onChange={(e) => set({ dueDate: e.target.value })} /></label>
          </div>
          <label>Currency
            <select value={state.currency} onChange={(e) => set({ currency: e.target.value })}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </label>
          <p className="hint">Currency changes the symbol and formatting only — it does not convert amounts.</p>
        </div>

        <div className="panel">
          <h2>Line items</h2>
          {state.items.map((it) => (
            <div className="item-row" key={it.id}>
              <input className="grow" value={it.desc} onChange={(e) => updateItem(it.id, { desc: e.target.value })} placeholder="Description" aria-label="Description" />
              <input type="number" min="0" step="any" value={it.qty} onChange={(e) => updateItem(it.id, { qty: e.target.value })} aria-label="Quantity" />
              <input type="number" min="0" step="any" value={it.rate} onChange={(e) => updateItem(it.id, { rate: e.target.value })} aria-label="Unit price" />
              <span className="amount">{fmt((Number(it.qty) || 0) * (Number(it.rate) || 0))}</span>
              <button className="btn ghost small" type="button" onClick={() => removeItem(it.id)} aria-label="Remove line">×</button>
            </div>
          ))}
          <button className="btn" type="button" onClick={addItem}>+ Add line item</button>
          <div className="row">
            <label>Discount
              <span className="inline">
                <select value={state.discountType} onChange={(e) => set({ discountType: e.target.value })}>
                  <option value="percent">% percent</option>
                  <option value="fixed">fixed amount</option>
                </select>
                <input type="number" min="0" step="any" value={state.discountValue} onChange={(e) => set({ discountValue: e.target.value })} />
              </span>
            </label>
            <label>{state.taxLabel} (%)<input type="number" min="0" step="any" value={state.taxRate} onChange={(e) => set({ taxRate: e.target.value })} /></label>
            <label>Tax label<input value={state.taxLabel} onChange={(e) => set({ taxLabel: e.target.value })} placeholder="Tax / VAT / GST" /></label>
          </div>
        </div>

        <div className="panel">
          <h2>Notes &amp; payment</h2>
          <label>Notes<textarea value={state.notes} onChange={(e) => set({ notes: e.target.value })} rows={3} placeholder="Thank you note, terms, anything the client should know" /></label>
          <label>Payment details<textarea value={state.payment} onChange={(e) => set({ payment: e.target.value })} rows={2} placeholder="Bank name, IBAN, PayPal, or how you want to be paid" /></label>
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
        <div className="preview" id="print-area">
          <div className="doc-head">
            <div>
              {state.logo ? <img src={state.logo} alt="Business logo" className="doc-logo" /> : null}
              <div className="doc-biz">{state.businessName || 'Your Business'}</div>
              <div className="doc-meta">{state.businessEmail}</div>
              <div className="doc-meta">{state.businessAddress}</div>
            </div>
            <div className="doc-title">
              <div className="doc-type">{label}</div>
              <div className="doc-num">#{state.docNumber}</div>
            </div>
          </div>

          <div className="doc-cols">
            <div>
              <div className="doc-label">Billed to</div>
              <div className="doc-client">{state.clientName || 'Client name'}</div>
              <div className="doc-meta">{state.clientEmail}</div>
              <div className="doc-meta">{state.clientAddress}</div>
            </div>
            <div className="doc-dates">
              <div><span>Issue date:</span> {state.issueDate}</div>
              <div><span>{dateLabel}:</span> {state.dueDate}</div>
            </div>
          </div>

          <table className="doc-table">
            <thead>
              <tr><th>Description</th><th>Qty</th><th>Unit price</th><th>Amount</th></tr>
            </thead>
            <tbody>
              {state.items.map((it) => (
                <tr key={it.id}>
                  <td>{it.desc || '—'}</td>
                  <td>{it.qty}</td>
                  <td>{fmt(Number(it.rate) || 0)}</td>
                  <td>{fmt((Number(it.qty) || 0) * (Number(it.rate) || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="doc-totals">
            <div><span>Subtotal</span><span>{fmt(totals.subtotal)}</span></div>
            {totals.discount > 0 ? <div><span>Discount</span><span>−{fmt(totals.discount)}</span></div> : null}
            <div><span>{state.taxLabel || 'Tax'} ({Number(state.taxRate) || 0}%)</span><span>{fmt(totals.tax)}</span></div>
            <div className="grand"><span>Total due</span><span>{fmt(totals.total)}</span></div>
          </div>

          {state.notes ? (
            <div className="doc-section"><div className="doc-label">Notes</div><p>{state.notes}</p></div>
          ) : null}
          {state.payment ? (
            <div className="doc-section"><div className="doc-label">Payment details</div><p>{state.payment}</p></div>
          ) : null}
          <div className="doc-foot">Created with Quotia — free invoice &amp; quote generator</div>
        </div>
      </div>
    </div>
  );
}
