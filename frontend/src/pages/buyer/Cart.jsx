import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, clearCart, updateQuantity } from '../../redux/slices/cartSlice';
import { useNavigate } from 'react-router-dom';

const C = {
  primary: '#2874f0', secondary: '#fb641b', accent: '#ff6161',
  bg: '#f1f3f6', white: '#ffffff', text: '#212121', muted: '#878787',
  border: '#e0e0e0', green: '#388e3c',
};

const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(state => state.cart.items);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const discount = Math.floor(total * 0.1);
  const delivery = total > 499 ? 0 : 49;
  const finalAmount = total - discount + delivery;

  if (items.length === 0) return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Segoe UI',sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.primary, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={() => navigate('/buyer')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>←</button>
        <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>🛒 My Cart</span>
      </div>
      {/* Empty State */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', gap: 16 }}>
        <div style={{ fontSize: 80 }}>🛒</div>
        <h2 style={{ color: C.text, margin: 0 }}>Cart Khali Hai!</h2>
        <p style={{ color: C.muted, fontSize: 15 }}>Koi product add nahi kiya abhi tak</p>
        <button onClick={() => navigate('/buyer')} style={{ background: C.primary, color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
          🛍️ Shopping Shuru Karo
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: "'Segoe UI',sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.primary, padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16, position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => navigate('/buyer')} style={{ background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }}>←</button>
        <span style={{ color: '#fff', fontSize: 20, fontWeight: 700 }}>🛒 My Cart ({totalItems} items)</span>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

        {/* LEFT — Cart Items */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {/* Delivery Info */}
          <div style={{ background: C.white, borderRadius: 8, padding: '12px 16px', marginBottom: 12, borderLeft: `4px solid ${C.green}`, boxShadow: '0 1px 4px rgba(0,0,0,.07)' }}>
            <span style={{ color: C.green, fontWeight: 700, fontSize: 14 }}>
              {total > 499 ? '🎉 Free Delivery Eligible!' : `₹${499 - total} aur add karo — FREE delivery milegi!`}
            </span>
          </div>

          {/* Items List */}
          {items.map(item => {
            const itemId = item.id || item._id;
            const disc = 10;
            const mrp = Math.round(item.price * (100 / (100 - disc)));
            return (
              <div key={itemId} style={{ background: C.white, borderRadius: 8, padding: 16, marginBottom: 12, boxShadow: '0 1px 6px rgba(0,0,0,.08)', border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  {/* Image */}
                  <div style={{ width: 100, height: 100, flexShrink: 0, background: '#f5f5f5', borderRadius: 6, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: 36 }}>🛍️</span>}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 15, color: C.text }}>{item.name}</p>
                    <p style={{ margin: '0 0 8px', fontSize: 12, color: C.muted }}>Seller: ShopEasy Store</p>

                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{fmt(item.price)}</span>
                      <span style={{ fontSize: 13, color: C.muted, textDecoration: 'line-through' }}>{fmt(mrp)}</span>
                      <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>{disc}% off</span>
                    </div>

                    {/* ✅ Quantity Controls with +/- buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Qty:</span>
                      <button
                        onClick={() => item.quantity > 1 && dispatch(updateQuantity({ id: itemId, quantity: item.quantity - 1 }))}
                        style={{ width: 28, height: 28, border: '1px solid #c2c2c2', borderRadius: '50%', background: C.white, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: item.quantity <= 1 ? C.muted : C.text }}>
                        −
                      </button>
                      <span style={{ fontSize: 16, fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ id: itemId, quantity: item.quantity + 1 }))}
                        style={{ width: 28, height: 28, border: '1px solid #c2c2c2', borderRadius: '50%', background: C.white, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: C.text }}>
                        +
                      </button>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 16 }}>
                      <button
                        onClick={() => dispatch(removeFromCart(itemId))}
                        style={{ background: 'none', border: 'none', color: C.accent, cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: 0 }}>
                        🗑️ Remove
                      </button>
                      <button
                        onClick={() => navigate(`/product/${itemId}`)}
                        style={{ background: 'none', border: 'none', color: C.primary, cursor: 'pointer', fontSize: 13, fontWeight: 700, padding: 0 }}>
                        👁️ View Product
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Clear Cart */}
          <button onClick={() => dispatch(clearCart())}
            style={{ background: 'none', border: `1px solid ${C.accent}`, color: C.accent, padding: '8px 20px', borderRadius: 4, cursor: 'pointer', fontWeight: 700, fontSize: 13 }}>
            🗑️ Clear Cart
          </button>
        </div>

        {/* RIGHT — Price Summary */}
        <div style={{ width: 320, flexShrink: 0 }}>
          <div style={{ background: C.white, borderRadius: 8, padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,.08)', border: `1px solid ${C.border}` }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 14, color: C.muted, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>
              Price Details
            </h3>

            <div style={{ borderBottom: `1px dashed ${C.border}`, paddingBottom: 14, marginBottom: 14 }}>
              <Row label={`Price (${totalItems} items)`} value={fmt(total)} />
              <Row label="Discount (10%)" value={`-${fmt(discount)}`} green />
              <Row label="Delivery Charges" value={delivery === 0 ? 'FREE' : fmt(delivery)} green={delivery === 0} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: C.text }}>Total Amount</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{fmt(finalAmount)}</span>
            </div>

            <p style={{ color: C.green, fontWeight: 700, fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
              🎉 Aap {fmt(discount)} bachayenge is order par!
            </p>

            <button
            onClick={() => navigate('/checkout')}
            style={{ width: '100%', padding: '14px 0', background: C.secondary, color: '#fff', border: 'none', borderRadius: 6, fontSize: 16, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(251,100,27,.3)' }}>
            🚀 Place Order
            </button>

            {/* Safe Payment */}
            <div style={{ textAlign: 'center', marginTop: 14 }}>
              <span style={{ fontSize: 12, color: C.muted }}>🔒 Safe and Secure Payments</span>
            </div>
          </div>

          {/* Offers Card */}
          <div style={{ background: C.white, borderRadius: 8, padding: 16, marginTop: 12, boxShadow: '0 1px 4px rgba(0,0,0,.07)' }}>
            <p style={{ fontWeight: 700, fontSize: 14, margin: '0 0 10px', color: C.text }}>💳 Available Offers</p>
            <p style={{ fontSize: 12, color: C.text, margin: '0 0 6px' }}>✅ 10% off on SBI Credit Card</p>
            <p style={{ fontSize: 12, color: C.text, margin: '0 0 6px' }}>✅ Extra ₹200 off on first order</p>
            <p style={{ fontSize: 12, color: C.text, margin: 0 }}>✅ Free EMI available</p>
          </div>
        </div>
      </div>
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
