import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/slices/cartSlice';

const C = {
  primary: '#2874f0', secondary: '#fb641b', accent: '#ff6161',
  bg: '#f1f3f6', white: '#ffffff', text: '#212121', muted: '#878787',
  border: '#e0e0e0', green: '#388e3c',
};

const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;

const STEPS = ['🛒 Cart', '📍 Address', '💳 Payment', '✅ Summary'];

export default function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);

  const { isAuthenticated } = useSelector(state => state.auth);
const token = localStorage.getItem('token');

React.useEffect(() => {
  if (!isAuthenticated && !token) {
    alert('Pehle login karo!');
    navigate('/login');
  }
}, [isAuthenticated, token, navigate]);

  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: '', phone: '', pincode: '', city: '',
    state: '', addressLine: '', type: 'Home',
  });
  const [payment, setPayment] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [errors, setErrors] = useState({});
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const discount = Math.floor(total * 0.1);
  const delivery = total > 499 ? 0 : 49;
  const finalAmount = total - discount + delivery;

  const validateAddress = () => {
    const e = {};
    if (!address.name.trim()) e.name = 'Naam required hai';
    if (!/^\d{10}$/.test(address.phone)) e.phone = 'Valid 10-digit number do';
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = 'Valid 6-digit pincode do';
    if (!address.city.trim()) e.city = 'City required hai';
    if (!address.state.trim()) e.state = 'State required hai';
    if (!address.addressLine.trim()) e.addressLine = 'Address required hai';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (payment === 'upi' && !/\S+@\S+/.test(upiId)) e.upi = 'Valid UPI ID do (e.g. name@upi)';
    if (payment === 'card') {
      if (!/^\d{16}$/.test(cardNum.replace(/\s/g, ''))) e.cardNum = 'Valid 16-digit card number do';
      if (!cardName.trim()) e.cardName = 'Card holder naam do';
      if (!/^\d{2}\/\d{2}$/.test(cardExp)) e.cardExp = 'Format: MM/YY';
      if (!/^\d{3,4}$/.test(cardCvv)) e.cardCvv = 'Valid CVV do';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Pehle login karo!');
    navigate('/login');
    return;
  }
  setPaidAmount(finalAmount);
  setOrderPlaced(true);
  dispatch(clearCart());
};

  if (orderPlaced) return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Segoe UI',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: C.white, borderRadius: 12, padding: '48px 40px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,.1)', maxWidth: 420 }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: C.green, fontSize: 24, margin: '0 0 8px' }}>Order Place Ho Gaya!</h2>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 8 }}>
          Delivery address: <strong>{address.addressLine}, {address.city}</strong>
        </p>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>
          Expected delivery: <strong style={{ color: C.text }}>3-5 Business Days</strong>
        </p>
        <div style={{ background: '#f0faf0', borderRadius: 8, padding: '12px 20px', marginBottom: 24 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.green }}>
            Total Paid: {fmt(paidAmount)}
          </p>
        </div>
        <button onClick={() => navigate('/buyer')}
          style={{ background: C.primary, color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' }}>
          🛍️ Continue Shopping
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Segoe UI',sans-serif" }}>

      {/* Header */}
      <div style={{ background: C.primary, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ color: '#fff', fontSize: 20, fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/buyer')}>
          🛍️ ShopEasy
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {STEPS.map((s, i) => (
            <React.Fragment key={i}>
              <span style={{
                fontSize: 13, fontWeight: 700, padding: '4px 10px', borderRadius: 4,
                background: i === 0 ? 'rgba(255,255,255,0.15)' : i === step ? '#fff' : 'transparent',
                color: i === step ? C.primary : i < step ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)',
              }}>{s}</span>
              {i < STEPS.length - 1 && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>›</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* LEFT */}
        <div style={{ flex: 1, minWidth: 320 }}>

          {/* STEP 1: Address */}
          {step === 1 && (
            <div style={{ background: C.white, borderRadius: 8, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,.08)' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 18, color: C.text }}>📍 Delivery Address</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Full Name *" value={address.name} error={errors.name}
                  onChange={v => setAddress({ ...address, name: v })} placeholder="Apna naam likho" />
                <Field label="Phone Number *" value={address.phone} error={errors.phone}
                  onChange={v => setAddress({ ...address, phone: v })} placeholder="10-digit number" type="tel" />
                <Field label="Pincode *" value={address.pincode} error={errors.pincode}
                  onChange={v => setAddress({ ...address, pincode: v })} placeholder="6-digit pincode" type="number" />
                <Field label="City *" value={address.city} error={errors.city}
                  onChange={v => setAddress({ ...address, city: v })} placeholder="Apna city" />
                <Field label="State *" value={address.state} error={errors.state}
                  onChange={v => setAddress({ ...address, state: v })} placeholder="Apna state" />
                <div>
                  <label style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Address Type</label>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    {['Home', 'Work', 'Other'].map(t => (
                      <button key={t} onClick={() => setAddress({ ...address, type: t })}
                        style={{ padding: '6px 16px', borderRadius: 20, border: `1px solid ${address.type === t ? C.primary : C.border}`, background: address.type === t ? '#e8f0fe' : C.white, color: address.type === t ? C.primary : C.text, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        {t === 'Home' ? '🏠' : t === 'Work' ? '🏢' : '📍'} {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16 }}>
                <label style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Full Address *</label>
                <textarea value={address.addressLine}
                  onChange={e => setAddress({ ...address, addressLine: e.target.value })}
                  placeholder="House no, Street, Locality, Landmark..."
                  rows={3}
                  style={{ width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 6, border: `1px solid ${errors.addressLine ? C.accent : C.border}`, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
                />
                {errors.addressLine && <p style={{ color: C.accent, fontSize: 12, margin: '4px 0 0' }}>{errors.addressLine}</p>}
              </div>
              <button onClick={() => { if (validateAddress()) setStep(2); }}
                style={{ marginTop: 24, background: C.secondary, color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(251,100,27,.3)' }}>
                Deliver Here → Payment Step
              </button>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <div style={{ background: C.white, borderRadius: 8, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,.08)' }}>
              <div style={{ background: '#f0f4ff', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>📍 {address.name} — {address.type}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: C.muted }}>{address.addressLine}, {address.city}, {address.state} — {address.pincode}</p>
                </div>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: `1px solid ${C.primary}`, color: C.primary, padding: '5px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>Change</button>
              </div>

              <h2 style={{ margin: '0 0 20px', fontSize: 18, color: C.text }}>💳 Payment Method</h2>

              {[
                { id: 'upi', label: '📱 UPI', sub: 'Google Pay, PhonePe, Paytm' },
                { id: 'card', label: '💳 Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                { id: 'cod', label: '💵 Cash on Delivery', sub: 'Pay when you receive' },
                { id: 'netbanking', label: '🏦 Net Banking', sub: 'All major banks supported' },
              ].map(opt => (
                <div key={opt.id} onClick={() => setPayment(opt.id)}
                  style={{ border: `1px solid ${payment === opt.id ? C.primary : C.border}`, borderRadius: 8, padding: '14px 16px', marginBottom: 12, cursor: 'pointer', background: payment === opt.id ? '#f0f4ff' : C.white }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${payment === opt.id ? C.primary : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {payment === opt.id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.primary }} />}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>{opt.label}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: C.muted }}>{opt.sub}</p>
                    </div>
                  </div>
                  {payment === 'upi' && opt.id === 'upi' && (
                    <div style={{ marginTop: 12 }} onClick={e => e.stopPropagation()}>
                      <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi" style={inputStyle(errors.upi)} />
                      {errors.upi && <p style={errStyle}>{errors.upi}</p>}
                    </div>
                  )}
                  {payment === 'card' && opt.id === 'card' && (
                    <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} onClick={e => e.stopPropagation()}>
                      <div style={{ gridColumn: '1/-1' }}>
                        <input value={cardNum} onChange={e => setCardNum(e.target.value)} placeholder="Card Number (16 digits)" style={inputStyle(errors.cardNum)} maxLength={16} />
                        {errors.cardNum && <p style={errStyle}>{errors.cardNum}</p>}
                      </div>
                      <div style={{ gridColumn: '1/-1' }}>
                        <input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="Card Holder Name" style={inputStyle(errors.cardName)} />
                        {errors.cardName && <p style={errStyle}>{errors.cardName}</p>}
                      </div>
                      <div>
                        <input value={cardExp} onChange={e => setCardExp(e.target.value)} placeholder="MM/YY" style={inputStyle(errors.cardExp)} maxLength={5} />
                        {errors.cardExp && <p style={errStyle}>{errors.cardExp}</p>}
                      </div>
                      <div>
                        <input value={cardCvv} onChange={e => setCardCvv(e.target.value)} placeholder="CVV" style={inputStyle(errors.cardCvv)} maxLength={4} type="password" />
                        {errors.cardCvv && <p style={errStyle}>{errors.cardCvv}</p>}
                      </div>
                    </div>
                  )}
                  {payment === 'netbanking' && opt.id === 'netbanking' && (
                    <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }} onClick={e => e.stopPropagation()}>
                      {['SBI', 'HDFC', 'ICICI', 'Axis', 'PNB'].map(b => (
                        <span key={b} style={{ padding: '5px 14px', border: `1px solid ${C.border}`, borderRadius: 20, fontSize: 12, cursor: 'pointer', background: C.white }}>{b}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button onClick={() => { if (validatePayment()) setStep(3); }}
                style={{ marginTop: 8, background: C.secondary, color: '#fff', border: 'none', padding: '13px 32px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', boxShadow: '0 4px 12px rgba(251,100,27,.3)' }}>
                Review Order →
              </button>
            </div>
          )}

          {/* STEP 3: Summary */}
          {step === 3 && (
            <div style={{ background: C.white, borderRadius: 8, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,.08)' }}>
              <h2 style={{ margin: '0 0 20px', fontSize: 18, color: C.text }}>✅ Order Review</h2>

              <SummaryBlock title="📍 Delivery Address" onEdit={() => setStep(1)}>
                <p style={{ margin: 0, fontWeight: 700 }}>{address.name} · {address.phone}</p>
                <p style={{ margin: '4px 0 0', color: C.muted, fontSize: 13 }}>{address.addressLine}, {address.city}, {address.state} — {address.pincode}</p>
              </SummaryBlock>

              <SummaryBlock title="💳 Payment Method" onEdit={() => setStep(2)}>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  {payment === 'upi' ? `📱 UPI — ${upiId}`
                    : payment === 'card' ? `💳 Card ending in ${cardNum.slice(-4)}`
                    : payment === 'cod' ? '💵 Cash on Delivery'
                    : '🏦 Net Banking'}
                </p>
              </SummaryBlock>

              <div style={{ marginBottom: 20 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: C.muted, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 1 }}>🛒 Order Items</p>
                {items.map(item => (
                  <div key={item.id || item._id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
                    <div style={{ width: 60, height: 60, borderRadius: 6, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <span style={{ fontSize: 28 }}>🛍️</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{item.name}</p>
                      <p style={{ margin: '2px 0 0', color: C.muted, fontSize: 12 }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{fmt(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <button onClick={handlePlaceOrder}
                style={{ background: C.secondary, color: '#fff', border: 'none', padding: '14px 32px', borderRadius: 6, fontSize: 16, fontWeight: 800, cursor: 'pointer', width: '100%', boxShadow: '0 4px 16px rgba(251,100,27,.35)' }}>
                🚀 Place Order — {fmt(finalAmount)}
              </button>
              <p style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginTop: 10 }}>🔒 Safe and Secure Payment</p>
            </div>
          )}
        </div>

        {/* RIGHT — Price Summary */}
        <div style={{ width: 300, flexShrink: 0 }}>
          <div style={{ background: C.white, borderRadius: 8, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,.08)', border: `1px solid ${C.border}`, position: 'sticky', top: 80 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, color: C.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Price Details</h3>
            <div style={{ borderBottom: `1px dashed ${C.border}`, paddingBottom: 14, marginBottom: 14 }}>
              <Row label={`Price (${totalItems} items)`} value={fmt(total)} />
              <Row label="Discount (10%)" value={`-${fmt(discount)}`} green />
              <Row label="Delivery Charges" value={delivery === 0 ? 'FREE' : fmt(delivery)} green={delivery === 0} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 800 }}>Total Amount</span>
              <span style={{ fontSize: 18, fontWeight: 800 }}>{fmt(finalAmount)}</span>
            </div>
            <p style={{ color: C.green, fontWeight: 700, fontSize: 13, textAlign: 'center', margin: 0 }}>
              🎉 Aap {fmt(discount)} bachayenge!
            </p>
          </div>
          <div style={{ background: C.white, borderRadius: 8, padding: 16, marginTop: 12, boxShadow: '0 1px 4px rgba(0,0,0,.07)' }}>
            <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 10px', color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Your Items</p>
            {items.map(item => (
              <div key={item.id || item._id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: C.text, flex: 1, marginRight: 8 }}>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>{fmt(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, error, type = 'text' }) {
  return (
    <div>
      <label style={{ fontSize: 13, color: '#878787', fontWeight: 600 }}>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ display: 'block', width: '100%', marginTop: 6, padding: '10px 12px', borderRadius: 6, border: `1px solid ${error ? '#ff6161' : '#e0e0e0'}`, fontSize: 14, boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
      />
      {error && <p style={{ color: '#ff6161', fontSize: 12, margin: '4px 0 0' }}>{error}</p>}
    </div>
  );
}

function SummaryBlock({ title, onEdit, children }) {
  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '14px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ margin: '0 0 6px', fontSize: 13, fontWeight: 700, color: '#878787', textTransform: 'uppercase', letterSpacing: 1 }}>{title}</p>
        {children}
      </div>
      <button onClick={onEdit} style={{ background: 'none', border: '1px solid #2874f0', color: '#2874f0', padding: '5px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>Edit</button>
    </div>
  );
}

function Row({ label, value, green }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
      <span style={{ fontSize: 14, color: '#212121' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: green ? '#388e3c' : '#212121' }}>{value}</span>
    </div>
  );
}

const inputStyle = (err) => ({
  display: 'block', width: '100%', padding: '10px 12px', borderRadius: 6,
  border: `1px solid ${err ? '#ff6161' : '#e0e0e0'}`, fontSize: 14,
  boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
});

const errStyle = { color: '#ff6161', fontSize: 12, margin: '4px 0 0' };
