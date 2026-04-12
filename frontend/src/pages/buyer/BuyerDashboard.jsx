// ============================================================
// FILE: src/pages/buyer/BuyerDashboard.jsx
// ✅ NO Redux needed — works with just axios + local state
// ============================================================

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { addToCart } from '../../redux/slices/cartSlice';
import { useDispatch, useSelector } from 'react-redux';

const C = {
  primary:'#2874f0', secondary:'#fb641b', accent:'#ff6161', gold:'#f5a623',
  bg:'#f1f3f6', white:'#ffffff', text:'#212121', muted:'#878787',
  border:'#e0e0e0', green:'#388e3c', lightBlue:'#e3f1ff',
};

const BANNERS = [
  { bg:'linear-gradient(135deg,#0f2027,#203a43,#2c5364)', title:'New Arrivals 2026',  sub:'Latest Mobiles & Laptops',   badge:'UP TO 40% OFF', emoji:'📱', cat:'Mobile',       btnTxt:'Shop Electronics', accent:'#2874f0' },
  { bg:'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)', title:"Women's Fashion",    sub:'Sarees • Lehengas • Tops',   badge:'MIN 50% OFF',   emoji:'👗', cat:'Women Fashion', btnTxt:'Shop Women',       accent:'#fcb045' },
  { bg:'linear-gradient(135deg,#134e5e,#71b280)',          title:"Men's Collection",   sub:'Shirts • Jeans • Shoes',     badge:'FLAT ₹500 OFF', emoji:'👔', cat:'Men Fashion',   btnTxt:'Shop Men',         accent:'#71b280' },
  { bg:'linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)', title:'Premium Audio',      sub:'Sony • Bose • AirPods',      badge:'BEST DEALS',    emoji:'🎧', cat:'Headphone',     btnTxt:'Shop Headphones',  accent:'#e94560' },
];

const CATS = [
  { label:'Mobiles',       icon:'📱', cat:'Mobile'        },
  { label:'Laptops',       icon:'💻', cat:'Laptop'        },
  { label:'Headphones',    icon:'🎧', cat:'Headphone'     },
  { label:"Men's Fashion", icon:'👔', cat:'Men Fashion'   },
  { label:"Women's",       icon:'👗', cat:'Women Fashion' },
  { label:'Sarees',        icon:'🥻', cat:'Women Fashion' },
  { label:'Lehengas',      icon:'💃', cat:'Women Fashion' },
];

const SECTIONS = [
  { title:'📱 Mobiles',              sub:'Best smartphones',          cat:'Mobile',       color:'#e3f2fd', accent:'#1565c0' },
  { title:'💻 Laptops',              sub:'Work • Game • Create',      cat:'Laptop',       color:'#f3e5f5', accent:'#6a1b9a' },
  { title:'🎧 Headphones & Earbuds', sub:'Premium audio experience',  cat:'Headphone',    color:'#e8f5e9', accent:'#1b5e20' },
  { title:"👔 Men's Fashion",         sub:'Shirts • Jeans • Shoes',   cat:'Men Fashion',  color:'#fff8e1', accent:'#e65100' },
  { title:"👗 Women's Fashion",       sub:'Sarees • Lehengas • Tops', cat:'Women Fashion',color:'#fce4ec', accent:'#880e4f' },
];

const fmt  = n => `₹${Number(n).toLocaleString('en-IN')}`;
const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
const authHdr = () => {
  const t = localStorage.getItem('token');
  return t ? { Authorization:`Bearer ${t}` } : {};
};

// ── Product Card ─────────────────────────────────────────────
function ProductCard({ product }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [hover, setHover] = useState(false);
  const disc    = useRef(rand(30,60)).current;
  const mrp     = Math.round(product.price*(100/(100-disc)));
  const stars   = useRef(rand(3,5)).current;
  const reviews = useRef(rand(120,4800)).current;

 const addCart = e => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleWL = async e => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    try {
      await axios.post(`http://localhost:8080/api/wishlist/toggle/${product.id}`,{},{ headers:authHdr() });
      setLiked(l=>!l);
    } catch { console.log('wishlist err'); }
  };

 const buyNow = e => {
    e.stopPropagation();
    if (!localStorage.getItem('token')) { navigate('/login'); return; }
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1
    }));
    navigate('/cart');
  };

  return (
    <div onClick={()=>navigate(`/product/${product.id}`)}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ background:C.white, borderRadius:10, overflow:'hidden', cursor:'pointer',
        boxShadow:hover?'0 8px 24px rgba(0,0,0,.16)':'0 1px 6px rgba(0,0,0,.1)',
        transform:hover?'translateY(-4px)':'none', transition:'all .22s',
        border:`1px solid ${C.border}`, position:'relative', flexShrink:0, width:210 }}>

      <div style={{ position:'absolute',top:8,left:8,zIndex:2,background:C.accent,
        color:'#fff',fontSize:11,fontWeight:700,padding:'3px 7px',borderRadius:3 }}>{disc}% off</div>

      <button onClick={toggleWL} style={{ position:'absolute',top:6,right:6,zIndex:2,
        background:'rgba(255,255,255,.9)',border:'none',borderRadius:'50%',
        width:32,height:32,cursor:'pointer',fontSize:16,
        display:'flex',alignItems:'center',justifyContent:'center',
        boxShadow:'0 1px 4px rgba(0,0,0,.2)' }}>{liked?'❤️':'🤍'}</button>

      <div style={{ height:180,background:'#f7f8fa',overflow:'hidden' }}>
        <img src={product.imageUrl} alt={product.name}
          style={{ width:'100%',height:'100%',objectFit:'cover',transition:'transform .3s',
            transform:hover?'scale(1.07)':'scale(1)' }}
          onError={e=>{e.target.src=`https://ui-avatars.com/api/?name=${encodeURIComponent(product.name.slice(0,12))}&size=200&background=e3f2fd&color=1565c0&bold=true`;}}/>
      </div>

      <div style={{ padding:'10px 12px 12px' }}>
        <p style={{ margin:'0 0 2px',fontSize:13,color:C.text,fontWeight:600,
          whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{product.name}</p>
        <p style={{ margin:'0 0 6px',fontSize:11,color:C.muted,
          whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{product.description}</p>

        <div style={{ display:'flex',alignItems:'center',gap:5,marginBottom:6 }}>
          <span style={{ background:C.green,color:'#fff',fontSize:11,fontWeight:700,
            padding:'2px 6px',borderRadius:3 }}>{stars}.{rand(0,9)} ★</span>
          <span style={{ fontSize:11,color:C.muted }}>({reviews.toLocaleString()})</span>
        </div>

        <div style={{ display:'flex',alignItems:'baseline',gap:6,marginBottom:10 }}>
          <span style={{ fontSize:16,fontWeight:700,color:C.text }}>{fmt(product.price)}</span>
          <span style={{ fontSize:12,color:C.muted,textDecoration:'line-through' }}>{fmt(mrp)}</span>
          <span style={{ fontSize:12,color:C.green,fontWeight:600 }}>{disc}% off</span>
        </div>

        {product.stock>0 ? (
          <div style={{ display:'flex',gap:6 }}>
            <button onClick={addCart} style={{ flex:1,padding:'8px 0',
              background:added?C.green:C.white, color:added?'#fff':C.primary,
              border:`1.5px solid ${added?C.green:C.primary}`,
              borderRadius:4,cursor:'pointer',fontSize:12,fontWeight:700,transition:'all .2s' }}>
              {added?'✓ Added!':'🛒 Cart'}
            </button>
            <button onClick={buyNow} style={{ flex:1,padding:'8px 0',background:C.secondary,
              color:'#fff',border:'none',borderRadius:4,cursor:'pointer',fontSize:12,fontWeight:700 }}>
              Buy Now
            </button>
          </div>
        ) : (
          <div style={{ textAlign:'center',color:C.accent,fontWeight:700,fontSize:13,padding:'8px 0' }}>
            Out of Stock
          </div>
        )}
      </div>
    </div>
  );
}

// ── Horizontal scroll section ─────────────────────────────────
function ProductRow({ section, products }) {
  const rowRef = useRef(null);
  const navigate = useNavigate();
  const list = products.filter(p=>p.category?.toLowerCase().includes(section.cat.toLowerCase()));
  if (!list.length) return null;
  return (
    <section style={{ marginBottom:20 }}>
      <div style={{ background:C.white,borderRadius:'10px 10px 0 0',padding:'14px 20px',
        display:'flex',justifyContent:'space-between',alignItems:'center',
        borderBottom:`3px solid ${section.accent}` }}>
        <div>
          <h2 style={{ margin:0,fontSize:20,fontWeight:800,color:C.text }}>{section.title}</h2>
          <p style={{ margin:'2px 0 0',fontSize:12,color:C.muted }}>{section.sub}</p>
        </div>
        <button onClick={()=>navigate(`/products?cat=${encodeURIComponent(section.cat)}`)} style={{
          padding:'8px 18px',background:C.primary,color:'#fff',border:'none',
          borderRadius:4,cursor:'pointer',fontSize:12,fontWeight:700 }}>View All →</button>
      </div>
      <div style={{ background:section.color,borderRadius:'0 0 10px 10px',padding:'14px 38px',position:'relative' }}>
        <button onClick={()=>rowRef.current?.scrollBy({left:-680,behavior:'smooth'})}
          style={{ position:'absolute',left:4,top:'50%',transform:'translateY(-50%)',zIndex:5,
            background:'#fff',border:`1px solid ${C.border}`,width:32,height:54,
            cursor:'pointer',fontSize:22,fontWeight:900,borderRadius:4,
            boxShadow:'0 2px 8px rgba(0,0,0,.15)',color:C.primary,lineHeight:1 }}>‹</button>
        <button onClick={()=>rowRef.current?.scrollBy({left:680,behavior:'smooth'})}
          style={{ position:'absolute',right:4,top:'50%',transform:'translateY(-50%)',zIndex:5,
            background:'#fff',border:`1px solid ${C.border}`,width:32,height:54,
            cursor:'pointer',fontSize:22,fontWeight:900,borderRadius:4,
            boxShadow:'0 2px 8px rgba(0,0,0,.15)',color:C.primary,lineHeight:1 }}>›</button>
        <div ref={rowRef} style={{ display:'flex',gap:14,overflowX:'auto',paddingBottom:4,scrollbarWidth:'none' }}>
          {list.map(p=><ProductCard key={p.id} product={p}/>)}
        </div>
      </div>
    </section>
  );
}

// ── Hero Banner ───────────────────────────────────────────────
function HeroBanner({ onFilter }) {
  const [idx,setIdx]=useState(0);
  useEffect(()=>{ const t=setInterval(()=>setIdx(i=>(i+1)%BANNERS.length),4000); return()=>clearInterval(t); },[]);
  const b=BANNERS[idx];
  return (
    <div style={{ borderRadius:10,overflow:'hidden',marginBottom:16,position:'relative' }}>
      <div style={{ background:b.bg,minHeight:256,display:'flex',alignItems:'center',
        justifyContent:'space-between',padding:'28px 52px',position:'relative' }}>
        <div style={{ position:'absolute',right:52,fontSize:120,opacity:.2,pointerEvents:'none' }}>{b.emoji}</div>
        <div style={{ position:'relative',zIndex:2 }}>
          <span style={{ background:b.accent,color:'#fff',fontWeight:800,fontSize:11,
            padding:'4px 14px',borderRadius:20,letterSpacing:1,display:'inline-block',marginBottom:12 }}>{b.badge}</span>
          <h1 style={{ margin:'0 0 8px',fontSize:36,fontWeight:900,color:'#fff',lineHeight:1.1 }}>{b.title}</h1>
          <p style={{ margin:'0 0 20px',fontSize:15,color:'rgba(255,255,255,.8)' }}>{b.sub}</p>
          <button onClick={()=>onFilter(b.cat)} style={{ padding:'11px 28px',background:'#fff',
            color:b.accent||C.primary,fontWeight:800,fontSize:13,border:'none',borderRadius:6,
            cursor:'pointer',boxShadow:'0 4px 14px rgba(0,0,0,.2)' }}>{b.btnTxt}</button>
        </div>
        <div style={{ fontSize:86,position:'relative',zIndex:2 }}>{b.emoji}</div>
      </div>
      <div style={{ display:'flex',justifyContent:'center',gap:6,
        position:'absolute',bottom:10,width:'100%' }}>
        {BANNERS.map((_,i)=>(
          <button key={i} onClick={()=>setIdx(i)} style={{ width:i===idx?22:7,height:7,
            borderRadius:4,background:i===idx?'#fff':'rgba(255,255,255,.45)',
            border:'none',cursor:'pointer',transition:'all .3s',padding:0 }}/>
        ))}
      </div>
    </div>
  );
}

// ── Category pills ────────────────────────────────────────────
function CategoryBar({ active, onChange }) {
  const p=on=>({ padding:'7px 16px',borderRadius:20,cursor:'pointer',fontWeight:600,fontSize:12,
    border:on?`2px solid ${C.primary}`:`1px solid ${C.border}`,
    background:on?C.lightBlue:C.white,color:on?C.primary:C.text,
    transition:'all .18s',whiteSpace:'nowrap',flexShrink:0 });
  return (
    <div style={{ background:C.white,borderRadius:10,padding:'12px 16px',marginBottom:16,
      display:'flex',gap:8,overflowX:'auto',scrollbarWidth:'none',
      boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}>
      <button onClick={()=>onChange('')} style={p(!active)}>🏠 All</button>
      {CATS.map(c=><button key={c.label} onClick={()=>onChange(c.cat)} style={p(active===c.cat)}>{c.icon} {c.label}</button>)}
    </div>
  );
}

// ── Deal of the Day ───────────────────────────────────────────
function DealStrip({ products }) {
  const navigate=useNavigate();
  const [sec,setSec]=useState(rand(3600,7200));
  useEffect(()=>{ const t=setInterval(()=>setSec(s=>s>0?s-1:0),1000); return()=>clearInterval(t); },[]);
  const pad=n=>String(n).padStart(2,'0');
  const h=pad(Math.floor(sec/3600)), m=pad(Math.floor((sec%3600)/60)), s=pad(sec%60);
  const deals=products.slice(0,6);
  if(!deals.length) return null;
  const box=v=><span style={{ background:'#fff',color:C.text,fontWeight:800,padding:'2px 7px',borderRadius:4,fontSize:14,fontFamily:'monospace' }}>{v}</span>;
  return (
    <div style={{ background:C.white,borderRadius:10,marginBottom:16,
      boxShadow:'0 1px 4px rgba(0,0,0,.08)',overflow:'hidden' }}>
      <div style={{ background:'linear-gradient(90deg,#ff6161,#fb641b)',padding:'10px 18px',
        display:'flex',alignItems:'center',gap:10,flexWrap:'wrap' }}>
        <span style={{ fontSize:15,fontWeight:900,color:'#fff' }}>⚡ Deal of the Day</span>
        <span style={{ color:'#fff',fontSize:12 }}>Ends in:</span>
        {box(h)}<span style={{ color:'#fff',fontWeight:700 }}>:</span>
        {box(m)}<span style={{ color:'#fff',fontWeight:700 }}>:</span>{box(s)}
      </div>
      <div style={{ display:'flex',overflowX:'auto',scrollbarWidth:'none' }}>
        {deals.map((p,i)=>{
          const d=rand(35,65); const mrp=Math.round(p.price*(100/(100-d)));
          return (
            <div key={p.id} onClick={()=>navigate(`/product/${p.id}`)}
              style={{ flex:'0 0 178px',padding:'14px 10px',textAlign:'center',cursor:'pointer',
                borderRight:i<deals.length-1?`1px solid ${C.border}`:'none',transition:'background .18s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
              onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
              <div style={{ height:95,display:'flex',alignItems:'center',justifyContent:'center',marginBottom:5 }}>
                <img src={p.imageUrl} alt={p.name} style={{ maxHeight:90,maxWidth:150,objectFit:'contain' }}
                  onError={e=>{e.target.style.display='none';}}/>
              </div>
              <p style={{ margin:'0 0 2px',fontSize:11,fontWeight:600,color:C.text,
                whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{p.name}</p>
              <p style={{ margin:0,fontSize:11,color:C.accent,fontWeight:700 }}>{d}% off</p>
              <p style={{ margin:'2px 0 0',fontSize:13,fontWeight:700 }}>{fmt(p.price)}</p>
              <p style={{ margin:0,fontSize:10,color:C.muted,textDecoration:'line-through' }}>{fmt(mrp)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Info Bar ──────────────────────────────────────────────────
function InfoBar() {
  const items=[
    {icon:'🚚',label:'Free Delivery',sub:'On orders above ₹499'},
    {icon:'↩️',label:'Easy Returns', sub:'10-day return policy'},
    {icon:'🔒',label:'Secure Pay',   sub:'100% safe checkout'  },
    {icon:'⭐',label:'2Cr+ Reviews', sub:'Trusted by millions' },
  ];
  return (
    <div style={{ background:C.white,borderRadius:10,marginBottom:16,
      display:'grid',gridTemplateColumns:'repeat(4,1fr)',
      boxShadow:'0 1px 4px rgba(0,0,0,.08)' }}>
      {items.map((it,i)=>(
        <div key={i} style={{ padding:'12px 0',textAlign:'center',
          borderRight:i<items.length-1?`1px solid ${C.border}`:'none' }}>
          <div style={{ fontSize:20 }}>{it.icon}</div>
          <div style={{ fontSize:12,fontWeight:700,color:C.text,marginTop:3 }}>{it.label}</div>
          <div style={{ fontSize:10,color:C.muted }}>{it.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────
export default function BuyerDashboard() {
  const navigate=useNavigate();
  const [products,setProducts]=useState([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');
  const [catFilter,setCatFilter]=useState('');

  const cartItems = useSelector(state => state.cart.items);
  const cartCount = cartItems.reduce((t, i) => t + (i.quantity || 1), 0);


  useEffect(()=>{
    const t=localStorage.getItem('token');
    axios.get('http://localhost:8080/api/products',{ headers:t?{Authorization:`Bearer ${t}`}:{} })
      .then(r=>{ setProducts(Array.isArray(r.data)?r.data:(r.data?.content||[])); })
      .catch(e=>console.error(e))
      .finally(()=>setLoading(false));
  },[]);

  const filtered=products.filter(p=>{
    const q=search.toLowerCase();
    const mQ=!q||[p.name,p.description,p.category].some(v=>v?.toLowerCase().includes(q));
    const mC=!catFilter||p.category?.toLowerCase().includes(catFilter.toLowerCase());
    return mQ&&mC;
  });

  const sections=catFilter?SECTIONS.filter(s=>s.cat.toLowerCase()===catFilter.toLowerCase()):SECTIONS;

  if(loading) return (
    <div style={{ display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'70vh',gap:16 }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width:44,height:44,border:`4px solid ${C.border}`,borderTopColor:C.primary,
        borderRadius:'50%',animation:'spin .8s linear infinite' }}/>
      <p style={{ color:C.muted,fontSize:16 }}>Products load ho rahe hain...</p>
    </div>
  );

 return (
  <div style={{ background:C.bg, minHeight:'100vh', fontFamily:"'Segoe UI',Roboto,sans-serif", width:'100vw', overflowX:'hidden' }}>
    
    {/* ── TOP ANNOUNCEMENT BAR ── */}
    <div style={{ background:C.primary,color:'#fff',textAlign:'center',
      padding:'7px 0',fontSize:12,fontWeight:500,letterSpacing:.4, width:'100%' }}>
      🎉 Free Delivery on orders above ₹499 &nbsp;|&nbsp; 🔥 New arrivals every week!
    </div>

    {/* ── NAVBAR ── */}
    <div style={{ background:C.primary, padding:'10px 20px', display:'flex',
      alignItems:'center', justifyContent:'space-between', gap:12,
      position:'sticky', top:0, zIndex:100,
      boxShadow:'0 2px 8px rgba(0,0,0,0.2)' }}>
      
      {/* Logo */}
      <div onClick={()=>navigate('/buyer')} style={{ color:'#fff', fontSize:20,
        fontWeight:900, cursor:'pointer', whiteSpace:'nowrap', letterSpacing:'-0.5px' }}>
        🛍️ ShopEasy
      </div>

      {/* Search bar */}
      <div style={{ position:'relative', flex:1, maxWidth:600 }}>
        <input type="text" value={search}
          onChange={e=>{ setSearch(e.target.value); setCatFilter(''); }}
          placeholder="Search for mobiles, laptops, fashion & more..."
          style={{ width:'100%', padding:'10px 42px 10px 16px', border:'none',
            borderRadius:6, fontSize:14, outline:'none', boxSizing:'border-box' }}/>
        <span style={{ position:'absolute', right:12, top:'50%',
          transform:'translateY(-50%)', fontSize:18, color:C.primary,
          pointerEvents:'none' }}>🔍</span>
      </div>

     <div style={{ display:'flex', alignItems:'center', gap:20 }}>
        {/* My Orders */}
        <div onClick={()=>navigate('/orders')} style={{ cursor:'pointer',
          display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
          <span style={{ fontSize:22 }}>📦</span>
          <span style={{ color:'#fff', fontSize:11, fontWeight:600 }}>Orders</span>
        </div>

        {/* Cart Icon */}
        <div onClick={()=>navigate('/cart')} style={{ position:'relative',
          cursor:'pointer', display:'flex', flexDirection:'column',
          alignItems:'center', gap:2 }}>
          <div style={{ position:'relative' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{ position:'absolute', top:'-8px', right:'-8px',
                background:'#ff6161', color:'#fff', borderRadius:'50%',
                width:18, height:18, fontSize:11, fontWeight:700,
                display:'flex', alignItems:'center', justifyContent:'center' }}>
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span style={{ color:'#fff', fontSize:11, fontWeight:600 }}>Cart</span>
        </div>

        {/* Login/Logout */}
        {localStorage.getItem('token') ? (
          <div onClick={()=>{ localStorage.removeItem('token'); navigate('/login'); }}
            style={{ cursor:'pointer', display:'flex', flexDirection:'column',
              alignItems:'center', gap:2 }}>
            <span style={{ fontSize:22 }}>👤</span>
            <span style={{ color:'#fff', fontSize:11, fontWeight:600 }}>Logout</span>
          </div>
        ) : (
          <div onClick={()=>navigate('/login')}
            style={{ cursor:'pointer', display:'flex', flexDirection:'column',
              alignItems:'center', gap:2 }}>
            <span style={{ fontSize:22 }}>👤</span>
            <span style={{ color:'#fff', fontSize:11, fontWeight:600 }}>Login</span>
          </div>
        )}
      </div>
    </div>

    {/* ── PAGE CONTENT ── */}
    <div style={{ maxWidth:1280, margin:'0 auto', padding:'14px 14px 40px' }}>

      {/* Category filter tag */}
      {catFilter && (
        <div style={{ marginBottom:12, display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ background:C.lightBlue, color:C.primary, fontWeight:700,
            padding:'5px 14px', borderRadius:20, fontSize:13 }}>Category: {catFilter}</span>
          <button onClick={()=>setCatFilter('')} style={{ background:'none', border:'none',
            color:C.accent, cursor:'pointer', fontWeight:700, fontSize:14 }}>✕ Clear</button>
        </div>
      )}

      {search ? (
        <>
          <h3 style={{ margin:'0 0 14px', color:C.text }}>🔍 "{search}" — {filtered.length} products</h3>
          {filtered.length === 0
            ? <div style={{ textAlign:'center', padding:'60px 0', color:C.muted, fontSize:18 }}>Koi product nahi mila 😔</div>
            : <div style={{ display:'flex', flexWrap:'wrap', gap:16 }}>{filtered.map(p=><ProductCard key={p.id} product={p}/>)}</div>
          }
        </>
      ) : (
        <>
          <HeroBanner onFilter={cat=>{ setCatFilter(cat); setSearch(''); }}/>
          <InfoBar/>
          <CategoryBar active={catFilter} onChange={cat=>{ setCatFilter(cat); setSearch(''); }}/>
          {!catFilter && <DealStrip products={products}/>}
          {sections.map(sec=><ProductRow key={sec.cat} section={sec} products={catFilter ? filtered : products}/>)}
          {!products.length && (
            <div style={{ textAlign:'center', padding:'80px 0' }}>
              <div style={{ fontSize:60 }}>🛍️</div>
              <h3 style={{ color:C.muted }}>Koi product nahi!</h3>
              <p style={{ color:C.muted }}>Backend restart karo — DataSeeder products add kar dega</p>
            </div>
          )}
        </>
      )}
    </div>
  </div>
);
}