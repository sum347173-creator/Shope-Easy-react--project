import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const C = {
  primary: '#2874f0', secondary: '#fb641b', accent: '#ff6161',
  bg: '#f1f3f6', white: '#ffffff', text: '#212121', muted: '#878787',
  border: '#e0e0e0', green: '#388e3c', orange: '#f57c00',
};

const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;

// ── Dummy Orders Data ─────────────────────────────────────────
const DUMMY_ORDERS = [
  {
    id: 'ORD-2024-001',
    date: '2024-12-01',
    status: 'Delivered',
    payMethod: 'UPI',
    address: 'Sector 12, Noida, Uttar Pradesh - 201301',
    items: [
      { id: 1, name: 'Dell XPS 15', price: 154999, quantity: 1, imageUrl: '' },
      { id: 2, name: 'Wireless Mouse', price: 1299, quantity: 2, imageUrl: '' },
    ],
    total: 157597,
    discount: 15759,
    finalAmount: 141838,
  },
  {
    id: 'ORD-2024-002',
    date: '2024-12-10',
    status: 'Shipped',
    payMethod: 'Cash on Delivery',
    address: 'MG Road, Pune, Maharashtra - 411001',
    items: [
      { id: 3, name: 'Sony Headphones WH-1000XM5', price: 29990, quantity: 1, imageUrl: '' },
    ],
    total: 29990,
    discount: 2999,
    finalAmount: 26991,
  },
  {
    id: 'ORD-2024-003',
    date: '2024-12-18',
    status: 'Processing',
    payMethod: 'Credit Card',
    address: 'Koramangala, Bengaluru, Karnataka - 560034',
    items: [
      { id: 4, name: 'iPhone 15 Pro', price: 134900, quantity: 1, imageUrl: '' },
      { id: 5, name: 'Apple AirPods Pro', price: 24900, quantity: 1, imageUrl: '' },
    ],
    total: 159800,
    discount: 15980,
    finalAmount: 143820,
  },
  {
    id: 'ORD-2024-004',
    date: '2024-11-25',
    status: 'Cancelled',
    payMethod: 'Net Banking',
    address: 'Salt Lake, Kolkata, West Bengal - 700091',
    items: [
      { id: 6, name: 'Samsung 4K Smart TV 55"', price: 54990, quantity: 1, imageUrl: '' },
    ],
    total: 54990,
    discount: 5499,
    finalAmount: 49491,
  },
];

const STATUS_CONFIG = {
  Delivered:  { color: C.green,   bg: '#f0fdf4', icon: '✅', steps: 4 },
  Shipped:    { color: '#1565c0', bg: '#e3f2fd', icon: '🚚', steps: 3 },
  Processing: { color: C.orange,  bg: '#fff8e1', icon: '⏳', steps: 2 },
  Cancelled:  { color: C.accent,  bg: '#fff0f0', icon: '❌', steps: 0 },
};

const TRACK_STEPS = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

export default function MyOrders() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState('');

  const filters = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filtered = DUMMY_ORDERS.filter(o => {
    const matchFilter = filter === 'All' || o.status === filter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ background: C.primary, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => navigate('/buyer')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>←</button>
        <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>📦 My Orders</span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px' }}>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Order ID ya product naam se search karo..."
            style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 14, boxSizing: 'border-box', outline: 'none', background: C.white }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '7px 18px', borderRadius: 20, border: `1px solid ${filter === f ? C.primary : C.border}`, background: filter === f ? C.primary : C.white, color: filter === f ? '#fff' : C.text, fontWeight: filter === f ? 700 : 400, cursor: 'pointer', fontSize: 13, transition: 'all .2s' }}>
              {f} {f === 'All' ? `(${DUMMY_ORDERS.length})` : `(${DUMMY_ORDERS.filter(o => o.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div style={{ background: C.white, borderRadius: 12, padding: 60, textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,.08)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <h3 style={{ color: C.text, margin: '0 0 8px' }}>Koi Order Nahi Mila</h3>
            <p style={{ color: C.muted, margin: '0 0 24px' }}>Is filter mein koi order nahi hai</p>
            <button onClick={() => navigate('/buyer')}
              style={{ background: C.primary, color: '#fff', border: 'none', padding: '10px 28px', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              🛍️ Shopping Karo
            </button>
          </div>
        ) : (
          filtered.map(order => {
            const cfg = STATUS_CONFIG[order.status];
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} style={{ background: C.white, borderRadius: 10, marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,.08)', border: `1px solid ${C.border}`, overflow: 'hidden' }}>

                {/* Order Header */}
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase' }}>Order ID</p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text }}>{order.id}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase' }}>Date</p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: C.text }}>{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, color: C.muted, fontWeight: 600, textTransform: 'uppercase' }}>Total</p>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text }}>{fmt(order.finalAmount)}</p>
                    </div>
                  </div>
                  <span style={{ background: cfg.bg, color: cfg.color, padding: '5px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                    {cfg.icon} {order.status}
                  </span>
                </div>

                {/* Items Preview */}
                <div style={{ padding: '14px 20px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 14, marginBottom: idx < order.items.length - 1 ? 12 : 0, alignItems: 'center' }}>
                      <div style={{ width: 60, height: 60, borderRadius: 8, background: '#f5f5f5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {item.imageUrl
                          ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: 28 }}>🛍️</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 3px', fontWeight: 600, fontSize: 14, color: C.text }}>{item.name}</p>
                        <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Qty: {item.quantity} × {fmt(item.price)}</p>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{fmt(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Tracking Bar (only for non-cancelled) */}
                {order.status !== 'Cancelled' && (
                  <div style={{ padding: '12px 20px', background: '#fafafa', borderTop: `1px solid ${C.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                      {/* Progress Line */}
                      <div style={{ position: 'absolute', top: 14, left: '10%', right: '10%', height: 3, background: C.border, zIndex: 0 }} />
                      <div style={{ position: 'absolute', top: 14, left: '10%', width: `${((cfg.steps - 1) / 3) * 80}%`, height: 3, background: C.green, zIndex: 1, transition: 'width .5s' }} />

                      {TRACK_STEPS.map((step, i) => {
                        const done = i < cfg.steps;
                        const active = i === cfg.steps - 1;
                        return (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? C.green : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#fff', fontWeight: 700, border: active ? `3px solid ${C.green}` : 'none', boxSizing: 'border-box' }}>
                              {done ? '✓' : i + 1}
                            </div>
                            <p style={{ margin: '4px 0 0', fontSize: 10, color: done ? C.green : C.muted, fontWeight: done ? 700 : 400, textAlign: 'center' }}>{step}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Expand / Collapse */}
                <div style={{ borderTop: `1px solid ${C.border}` }}>
                  <button onClick={() => setExpandedId(isExpanded ? null : order.id)}
                    style={{ width: '100%', padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: C.primary, fontWeight: 700, textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{isExpanded ? 'Less Details ▲' : 'More Details ▼'}</span>
                    {order.status === 'Delivered' && <span style={{ color: C.green }}>⭐ Review Likho</span>}
                    {order.status === 'Processing' && <span style={{ color: C.accent }}>❌ Cancel Order</span>}
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div style={{ padding: '0 20px 20px', borderTop: `1px solid ${C.border}` }}>
                      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 16 }}>

                        {/* Address */}
                        <div style={{ flex: 1, minWidth: 200 }}>
                          <p style={{ margin: '0 0 6px', fontSize: 12, color: C.muted, fontWeight: 700, textTransform: 'uppercase' }}>📍 Delivery Address</p>
                          <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.6 }}>{order.address}</p>
                        </div>

                        {/* Payment */}
                        <div style={{ flex: 1, minWidth: 150 }}>
                          <p style={{ margin: '0 0 6px', fontSize: 12, color: C.muted, fontWeight: 700, textTransform: 'uppercase' }}>💳 Payment</p>
                          <p style={{ margin: 0, fontSize: 13, color: C.text }}>{order.payMethod}</p>
                        </div>

                        {/* Price Breakdown */}
                        <div style={{ flex: 1, minWidth: 180 }}>
                          <p style={{ margin: '0 0 8px', fontSize: 12, color: C.muted, fontWeight: 700, textTransform: 'uppercase' }}>💰 Price Breakdown</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, color: C.muted }}>Subtotal</span>
                            <span style={{ fontSize: 13 }}>{fmt(order.total)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, color: C.green }}>Discount</span>
                            <span style={{ fontSize: 13, color: C.green }}>-{fmt(order.discount)}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, color: C.muted }}>Delivery</span>
                            <span style={{ fontSize: 13, color: C.green }}>FREE</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 6, borderTop: `1px solid ${C.border}`, marginTop: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
                            <span style={{ fontSize: 14, fontWeight: 700 }}>{fmt(order.finalAmount)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
                        {order.status === 'Delivered' && (
                          <>
                            <button style={actionBtn(C.primary)}>🔄 Reorder</button>
                            <button style={actionBtn(C.green)}>⭐ Rate & Review</button>
                            <button style={actionBtn(C.muted)}>↩️ Return / Refund</button>
                          </>
                        )}
                        {order.status === 'Shipped' && (
                          <button style={actionBtn(C.primary)}>📍 Track Order</button>
                        )}
                        {order.status === 'Processing' && (
                          <button style={actionBtn(C.accent)}>❌ Cancel Order</button>
                        )}
                        {order.status === 'Cancelled' && (
                          <button style={actionBtn(C.primary)}>🔄 Reorder</button>
                        )}
                        <button style={actionBtn(C.muted)}>🧾 Invoice Download</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const actionBtn = (color) => ({
  padding: '8px 18px', borderRadius: 6, border: `1px solid ${color}`,
  background: 'none', color, fontSize: 13, fontWeight: 700, cursor: 'pointer',
});
