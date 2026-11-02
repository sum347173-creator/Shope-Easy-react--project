import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/slices/cartSlice";

// ── Category helpers ──────────────────────────────────────────
const ELECTRONICS_CATS = ["mobile", "laptop", "headphone", "electronics", "camera", "tablet"];
const CLOTHING_CATS    = ["men fashion", "women fashion", "saree", "lehenga", "fashion", "clothing", "shirt", "jeans"];
const isElectronics = (cat = "") => ELECTRONICS_CATS.some(c => cat.toLowerCase().includes(c));
const isClothing    = (cat = "") => CLOTHING_CATS.some(c => cat.toLowerCase().includes(c));

// ── Specs by category ─────────────────────────────────────────
const getSpecs = (product) => {
  const cat = (product.category || "").toLowerCase();
  if (cat.includes("mobile")) return [
    { icon: "📱", label: "Display",   value: "6.7\" FHD+ AMOLED, 120Hz" },
    { icon: "⚡", label: "Processor", value: "Octa-core 3.2GHz" },
    { icon: "🧠", label: "RAM",       value: "8 GB" },
    { icon: "💾", label: "Storage",   value: "128 GB Internal" },
    { icon: "📷", label: "Camera",    value: "50MP + 12MP + 10MP" },
    { icon: "🔋", label: "Battery",   value: "5000 mAh, 65W Fast Charge" },
    { icon: "📶", label: "Network",   value: "5G, Wi-Fi 6, Bluetooth 5.3" },
    { icon: "🖥️", label: "OS",        value: "Android 14" },
  ];
  if (cat.includes("laptop")) return [
    { icon: "💻", label: "Display",   value: "15.6\" FHD IPS, 144Hz" },
    { icon: "⚡", label: "Processor", value: "Intel Core i7 13th Gen" },
    { icon: "🧠", label: "RAM",       value: "16 GB DDR5" },
    { icon: "💾", label: "Storage",   value: "512 GB NVMe SSD" },
    { icon: "🎮", label: "Graphics",  value: "NVIDIA RTX 4060 6GB" },
    { icon: "🔋", label: "Battery",   value: "72 Wh, 130W Adapter" },
    { icon: "🖥️", label: "OS",        value: "Windows 11 Home" },
    { icon: "⚖️", label: "Weight",    value: "1.8 kg" },
  ];
  if (cat.includes("headphone")) return [
    { icon: "🎵", label: "Type",         value: "Over-Ear Wireless" },
    { icon: "📶", label: "Connectivity", value: "Bluetooth 5.2, 3.5mm Jack" },
    { icon: "🔋", label: "Battery",      value: "30 hrs playback, Fast Charge" },
    { icon: "🎙️", label: "Microphone",   value: "Active Noise Cancellation" },
    { icon: "🔊", label: "Driver",       value: "40mm Dynamic Driver" },
    { icon: "📻", label: "Frequency",    value: "20Hz – 20kHz" },
  ];
  return null;
};

// ── Size configs ──────────────────────────────────────────────
const CLOTHING_SIZES = [
  { label: "S",   multiplier: 1.00 },
  { label: "M",   multiplier: 1.00 },
  { label: "L",   multiplier: 1.05 },
  { label: "XL",  multiplier: 1.10 },
  { label: "XXL", multiplier: 1.15 },
];

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

// ── REVIEWS STORAGE HELPERS ───────────────────────────────────
const getReviews = (productId) => {
  try {
    const data = localStorage.getItem(`reviews_${productId}`);
    return data ? JSON.parse(data) : [];
  } catch { return []; }
};
const saveReview = (productId, review) => {
  const existing = getReviews(productId);
  const updated  = [review, ...existing];
  localStorage.setItem(`reviews_${productId}`, JSON.stringify(updated));
  return updated;
};

// ── STAR SELECTOR component ───────────────────────────────────
function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          style={{ fontSize: 32, cursor: "pointer", color: star <= (hovered || value) ? "#f5a623" : "#ddd", transition: "color .15s" }}>
          ★
        </span>
      ))}
    </div>
  );
}

// ── RATING SUMMARY BAR ────────────────────────────────────────
function RatingSummary({ reviews }) {
  const total = reviews.length;
  if (!total) return null;
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1);
  const counts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
  }));
  return (
    <div style={{ display: "flex", gap: 32, alignItems: "center", background: "#fafafa", borderRadius: 10, padding: 20, marginBottom: 24, border: "1px solid #e0e0e0", flexWrap: "wrap" }}>
      {/* Average */}
      <div style={{ textAlign: "center", minWidth: 100 }}>
        <div style={{ fontSize: 52, fontWeight: 800, color: "#212121", lineHeight: 1 }}>{avg}</div>
        <div style={{ color: "#f5a623", fontSize: 22, margin: "4px 0" }}>{"★".repeat(Math.round(avg))}{"☆".repeat(5 - Math.round(avg))}</div>
        <div style={{ color: "#878787", fontSize: 13 }}>{total} reviews</div>
      </div>
      {/* Bars */}
      <div style={{ flex: 1, minWidth: 200 }}>
        {counts.map(({ star, count }) => (
          <div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#555", width: 10 }}>{star}</span>
            <span style={{ color: "#f5a623", fontSize: 14 }}>★</span>
            <div style={{ flex: 1, background: "#e0e0e0", borderRadius: 4, height: 8, overflow: "hidden" }}>
              <div style={{ width: total ? `${(count / total) * 100}%` : "0%", background: "#f5a623", height: "100%", borderRadius: 4, transition: "width .4s" }} />
            </div>
            <span style={{ fontSize: 13, color: "#878787", width: 24 }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
const ProductDetail = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const dispatch     = useDispatch();

  const [product,      setProduct]      = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity,     setQuantity]     = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [pincode,      setPincode]      = useState("");
  const [deliveryMsg,  setDeliveryMsg]  = useState("");
  const [addedMsg,     setAddedMsg]     = useState(false);

  // ── Review states ─────────────────────────────────────────
  const [reviews,       setReviews]      = useState([]);
  const [showForm,      setShowForm]     = useState(false);
  const [reviewRating,  setReviewRating] = useState(0);
  const [reviewName,    setReviewName]   = useState("");
  const [reviewComment, setReviewComment]= useState("");
  const [reviewTitle,   setReviewTitle]  = useState("");
  const [submitMsg,     setSubmitMsg]    = useState("");
  const [reviewError,   setReviewError]  = useState("");
  const [sortBy,        setSortBy]       = useState("newest");
  const [filterStar,    setFilterStar]   = useState(0);

  const discountRef = useRef(rand(10, 35));
  const discount    = discountRef.current;

  useEffect(() => {
    setLoading(true);
    const token   = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`http://localhost:8080/api/products/${id}`, { headers })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { setProduct(data?.id ? data : null); setLoading(false); })
      .catch(() => { setProduct(null); setLoading(false); });
  }, [id]);

  // Load reviews when product id changes
  useEffect(() => {
    if (id) setReviews(getReviews(id));
  }, [id]);

  // ── derived prices ────────────────────────────────────────
  const basePrice     = product?.price || 0;
  const sizeMulti     = CLOTHING_SIZES.find(s => s.label === selectedSize)?.multiplier || 1;
  const currentPrice  = Math.round(basePrice * sizeMulti);
  const originalPrice = Math.round(currentPrice * (100 / (100 - discount)));
  const clothing      = isClothing(product?.category);
  const electronic    = isElectronics(product?.category);
  const specs         = product ? getSpecs(product) : null;

  // ── handlers ─────────────────────────────────────────────
  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ id: product.id, name: product.name,
      price: currentPrice, imageUrl: product.imageUrl, quantity }));
    setAddedMsg(true);
    setTimeout(() => setAddedMsg(false), 2000);
  };
  const handleBuyNow = () => {
    if (!product) return;
    dispatch(addToCart({ id: product.id, name: product.name,
      price: currentPrice, imageUrl: product.imageUrl, quantity }));
    navigate("/cart");
  };
  const checkDelivery = () => {
    if (pincode.length === 6) setDeliveryMsg("✅ Delivery available! Expected: 2-5 business days");
    else setDeliveryMsg("❌ Valid 6-digit pincode daalo");
  };

  // ── Review submit ─────────────────────────────────────────
  const handleReviewSubmit = () => {
    if (!reviewRating) { setReviewError("⭐ Rating select karo"); return; }
    if (!reviewName.trim()) { setReviewError("✏️ Apna naam daalo"); return; }
    if (reviewComment.trim().length < 10) { setReviewError("💬 Thoda detailed review likho (min 10 characters)"); return; }

    setReviewError("");
    const newReview = {
      id:      Date.now(),
      name:    reviewName.trim(),
      title:   reviewTitle.trim() || "Great product!",
      comment: reviewComment.trim(),
      rating:  reviewRating,
      date:    new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      helpful: 0,
      verified: true,
    };
    const updated = saveReview(id, newReview);
    setReviews(updated);
    setReviewName(""); setReviewComment(""); setReviewRating(0); setReviewTitle("");
    setShowForm(false);
    setSubmitMsg("✅ Review submit ho gaya! Shukriya 🙏");
    setTimeout(() => setSubmitMsg(""), 4000);
  };

  // ── Sorted + filtered reviews ─────────────────────────────
  const displayReviews = [...reviews]
    .filter(r => filterStar === 0 || r.rating === filterStar)
    .sort((a, b) => {
      if (sortBy === "newest")  return b.id - a.id;
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest")  return a.rating - b.rating;
      return 0;
    });

  // ── loading / not found ───────────────────────────────────
  if (loading) return (
    <div style={S.loadingBox}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={S.spinner}/>
      <p style={{ color:"#2874f0", marginTop:12 }}>Loading product...</p>
    </div>
  );
  if (!product) return (
    <div style={S.loadingBox}>
      <p style={{ color:"red", fontSize:18 }}>❌ Product not found!</p>
    </div>
  );

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={S.logo} onClick={() => navigate("/buyer")}>🛍️ ShopEasy</div>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <button style={S.cartBtn} onClick={() => navigate("/cart")}>🛒 Cart</button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div style={S.breadcrumb}>
        <span style={S.breadLink} onClick={() => navigate("/buyer")}>Home</span>
        <span> › </span>
        <span style={S.breadLink}>{product.category || "Products"}</span>
        <span> › </span>
        <span style={{ color:"#333" }}>{product.name}</span>
      </div>

      {/* Main */}
      <div style={S.mainContainer}>
        {/* LEFT: Image */}
        <div style={S.imageSection}>
          <div style={S.mainImageBox}>
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name} style={S.mainImage}
                  onError={e => e.target.style.display="none"}/>
              : <div style={S.noImage}>🖼️<br/>No Image</div>}
            <div style={S.badge}>Best Seller</div>
          </div>
          <div style={S.actionButtons}>
            <button style={{ ...S.addToCartBtn, background: addedMsg ? "#388e3c" : "#ff9f00" }}
              onClick={handleAddToCart}>
              {addedMsg ? "✓ Added to Cart!" : "🛒 ADD TO CART"}
            </button>
            <button style={S.buyNowBtn} onClick={handleBuyNow}>⚡ BUY NOW</button>
          </div>
        </div>

        {/* RIGHT: Info */}
        <div style={S.infoSection}>
          <h1 style={S.productTitle}>{product.name}</h1>
          <div style={S.ratingRow}>
            <span style={S.ratingBadge}>⭐ 4.{rand(1,9)}</span>
            <span style={S.ratingCount}>{rand(800,5000).toLocaleString()} ratings & {reviews.length + rand(100,900)} reviews</span>
          </div>
          <div style={S.priceSection}>
            <span style={S.currentPrice}>₹{currentPrice.toLocaleString()}</span>
            <span style={S.originalPrice}>₹{originalPrice.toLocaleString()}</span>
            <span style={S.discountText}>{discount}% off</span>
          </div>
          <p style={S.freeDelivery}>+ FREE Delivery &nbsp;
            <span style={{ color:"#2874f0", fontWeight:600 }}>Inclusive of all taxes</span>
          </p>
          <div style={S.offersBox}>
            <p style={S.offersTitle}>💰 Available Offers</p>
            <p style={S.offerItem}>🏦 <b>Bank Offer</b> &nbsp;10% off on SBI Credit Cards, up to ₹1500</p>
            <p style={S.offerItem}>🏷️ <b>Special Price</b> &nbsp;Extra ₹200 off on first order</p>
            <p style={S.offerItem}>📦 <b>No Cost EMI</b> &nbsp;from ₹{Math.floor(currentPrice/6).toLocaleString()}/month</p>
          </div>
          {clothing && (
            <div style={S.sizeSection}>
              <p style={S.sizeTitle}>Select Size (changes price):</p>
              <div style={S.sizeRow}>
               
  {CLOTHING_SIZES.map(({ label }) => (
  <button key={label}
    style={{ ...S.sizeBtn, ...(selectedSize === label ? S.sizeBtnActive : {}) }}
    onClick={() => setSelectedSize(label)}>
    {label}
  </button>
))}
  </div>
{selectedSize
  ? <p style={{ color:"#388e3c", fontSize:13, fontWeight:600, marginTop:6 }}>✅ Size {selectedSize} selected — ₹{currentPrice.toLocaleString()}</p>
  : <p style={{ color:"#ff6161", fontSize:12, marginTop:6 }}>⚠️ Please select a size</p>
}
            </div>
          )}
          {electronic && specs && (
            <div style={S.specsBox}>
              <p style={S.specsTitle}>📋 Specifications</p>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={i} style={{ background: i%2===0?"#f9f9f9":"#fff" }}>
                      <td style={S.specLabel}>{spec.icon} {spec.label}</td>
                      <td style={S.specValue}>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div style={S.qtySection}>
            <p style={S.sizeTitle}>Quantity:</p>
            <div style={S.qtyRow}>
              <button style={S.qtyBtn} onClick={() => setQuantity(Math.max(1, quantity-1))}>−</button>
              <span style={S.qtyNum}>{quantity}</span>
              <button style={S.qtyBtn} onClick={() => setQuantity(quantity+1)}>+</button>
            </div>
          </div>
          <div style={S.deliveryBox}>
            <p style={S.sizeTitle}>📦 Check Delivery:</p>
            <div style={S.pincodeRow}>
              <input type="text" placeholder="Enter 6-digit pincode" maxLength={6}
                value={pincode} onChange={e => setPincode(e.target.value)}
                style={S.pincodeInput}/>
              <button style={S.checkBtn} onClick={checkDelivery}>Check</button>
            </div>
            {deliveryMsg && <p style={S.deliveryMsg}>{deliveryMsg}</p>}
          </div>
          {product.description && (
            <div style={S.descBox}>
              <p style={S.descTitle}>📋 Description</p>
              <p style={S.descText}>{product.description}</p>
            </div>
          )}
          <div style={S.highlightsBox}>
            <p style={S.descTitle}>✨ Highlights</p>
            <ul style={S.highlightsList}>
              <li>Category: {product.category || "General"}</li>
              <li>In Stock: {product.stock > 0 ? `${product.stock} units available` : "Out of Stock"}</li>
              <li>Brand: ShopEasy Original</li>
              <li>Return Policy: 7 days easy return</li>
              <li>Warranty: 1 year manufacturer warranty</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ✅ REVIEWS SECTION — FULL REAL SYSTEM
          ══════════════════════════════════════════════════════ */}
      <div style={S.reviewsSection}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
          <h2 style={S.reviewsTitle}>⭐ Ratings & Reviews ({reviews.length})</h2>
          <button onClick={() => setShowForm(f => !f)}
            style={{ background: showForm ? "#e0e0e0" : "#2874f0", color: showForm ? "#333" : "#fff",
              border:"none", padding:"10px 24px", borderRadius:6, fontWeight:700, fontSize:14, cursor:"pointer" }}>
            {showForm ? "✕ Cancel" : "✏️ Write a Review"}
          </button>
        </div>

        {/* Success message */}
        {submitMsg && (
          <div style={{ background:"#f0fdf4", border:"1px solid #86efac", borderRadius:8, padding:"12px 16px", marginBottom:16, color:"#166534", fontWeight:600 }}>
            {submitMsg}
          </div>
        )}

        {/* ── WRITE REVIEW FORM ── */}
        {showForm && (
          <div style={{ background:"#f8faff", border:"1px solid #c5d5ff", borderRadius:10, padding:24, marginBottom:24 }}>
            <h3 style={{ margin:"0 0 20px", color:"#212121", fontSize:16 }}>📝 Apna Review Likho</h3>

            {/* Star Rating */}
            <div style={{ marginBottom:16 }}>
              <label style={S.formLabel}>Rating *</label>
              <StarSelector value={reviewRating} onChange={setReviewRating} />
              {reviewRating > 0 && (
                <p style={{ margin:"6px 0 0", fontSize:13, color:"#555" }}>
                  {["", "😞 Bahut Bura", "😕 Theek Nahi", "😐 Average", "😊 Acha Tha", "🤩 Ekdum Zabardast!"][reviewRating]}
                </p>
              )}
            </div>

            {/* Name */}
            <div style={{ marginBottom:14 }}>
              <label style={S.formLabel}>Aapka Naam *</label>
              <input value={reviewName} onChange={e => setReviewName(e.target.value)}
                placeholder="Apna naam likho..."
                style={S.formInput} />
            </div>

            {/* Title */}
            <div style={{ marginBottom:14 }}>
              <label style={S.formLabel}>Review Title</label>
              <input value={reviewTitle} onChange={e => setReviewTitle(e.target.value)}
                placeholder="Jaise: 'Amazing product!' ya 'Value for money'"
                style={S.formInput} />
            </div>

            {/* Comment */}
            <div style={{ marginBottom:14 }}>
              <label style={S.formLabel}>Review *</label>
              <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)}
                placeholder="Product ke baare mein detail mein batao — quality, delivery, packaging, etc."
                rows={4}
                style={{ ...S.formInput, resize:"vertical", fontFamily:"inherit" }} />
              <p style={{ fontSize:11, color:"#878787", margin:"4px 0 0" }}>
                {reviewComment.length}/500 characters
              </p>
            </div>

            {/* Error */}
            {reviewError && (
              <p style={{ color:"#ff6161", fontSize:13, fontWeight:600, marginBottom:12 }}>{reviewError}</p>
            )}

            {/* Submit */}
            <button onClick={handleReviewSubmit}
              style={{ background:"#2874f0", color:"#fff", border:"none", padding:"12px 32px",
                borderRadius:6, fontWeight:700, fontSize:15, cursor:"pointer" }}>
              🚀 Submit Review
            </button>
          </div>
        )}

        {/* ── RATING SUMMARY ── */}
        {reviews.length > 0 && <RatingSummary reviews={reviews} />}

        {/* ── SORT + FILTER ── */}
        {reviews.length > 0 && (
          <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
            <span style={{ fontSize:13, color:"#555", fontWeight:600 }}>Filter:</span>
            {[0,5,4,3,2,1].map(star => (
              <button key={star} onClick={() => setFilterStar(star)}
                style={{ padding:"5px 14px", borderRadius:20,
                  border:`1px solid ${filterStar===star?"#2874f0":"#e0e0e0"}`,
                  background: filterStar===star?"#2874f0":"#fff",
                  color: filterStar===star?"#fff":"#555",
                  fontSize:12, fontWeight:600, cursor:"pointer" }}>
                {star === 0 ? "All" : `${star} ★`}
              </button>
            ))}
            <span style={{ marginLeft:"auto", fontSize:13, color:"#555", fontWeight:600 }}>Sort:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ padding:"6px 12px", borderRadius:6, border:"1px solid #e0e0e0", fontSize:13, cursor:"pointer", outline:"none" }}>
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        )}

        {/* ── REVIEWS LIST ── */}
        {displayReviews.length > 0 ? (
          <div style={S.reviewsGrid}>
            {displayReviews.map((review) => (
              <div key={review.id} style={S.reviewCard}>
                <div style={S.reviewHeader}>
                  <div style={{ ...S.reviewAvatar, background: `hsl(${(review.name.charCodeAt(0)*5)%360},60%,45%)` }}>
                    {review.name[0].toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <p style={S.reviewName}>{review.name}</p>
                      {review.verified && (
                        <span style={{ background:"#e8f5e9", color:"#388e3c", fontSize:10, fontWeight:700, padding:"1px 6px", borderRadius:3 }}>
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p style={S.reviewDate}>{review.date}</p>
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end" }}>
                    <span style={{ color:"#f5a623", fontSize:15 }}>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span>
                    <span style={{ fontSize:11, color:"#878787" }}>{review.rating}/5</span>
                  </div>
                </div>
                {review.title && (
                  <p style={{ fontWeight:700, fontSize:14, color:"#212121", margin:"0 0 4px" }}>{review.title}</p>
                )}
                <p style={S.reviewComment}>{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"40px 0", color:"#878787" }}>
            {filterStar > 0
              ? <p>{filterStar}★ ka koi review nahi hai abhi</p>
              : (
                <>
                  <div style={{ fontSize:48, marginBottom:12 }}>💬</div>
                  <p style={{ fontSize:16, fontWeight:600, color:"#555" }}>Koi review nahi hai abhi!</p>
                  <p style={{ fontSize:13 }}>Pehle review likhne wale bano 🙂</p>
                  <button onClick={() => setShowForm(true)}
                    style={{ marginTop:12, background:"#2874f0", color:"#fff", border:"none",
                      padding:"10px 24px", borderRadius:6, fontWeight:700, cursor:"pointer" }}>
                    ✏️ Pehla Review Likho
                  </button>
                </>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Styles ────────────────────────────────────────────────────
const S = {
  page:          { fontFamily:"'Segoe UI',sans-serif", background:"#f1f3f6", minHeight:"100vh" },
  loadingBox:    { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"100vh" },
  spinner:       { width:40, height:40, border:"4px solid #e0e0e0", borderTop:"4px solid #2874f0", borderRadius:"50%", animation:"spin 1s linear infinite" },
  header:        { background:"#2874f0", padding:"14px 24px", display:"flex", justifyContent:"space-between", alignItems:"center", position:"sticky", top:0, zIndex:100 },
  logo:          { color:"#fff", fontSize:22, fontWeight:700, cursor:"pointer" },
  cartBtn:       { background:"#fff", color:"#2874f0", border:"none", padding:"8px 20px", borderRadius:4, fontWeight:700, cursor:"pointer", fontSize:14 },
  breadcrumb:    { padding:"10px 24px", fontSize:13, color:"#878787", background:"#fff", borderBottom:"1px solid #e0e0e0" },
  breadLink:     { cursor:"pointer", color:"#2874f0" },
  mainContainer: { display:"flex", gap:24, padding:"24px", maxWidth:1200, margin:"0 auto", flexWrap:"wrap" },
  imageSection:  { flex:"0 0 380px", background:"#fff", borderRadius:8, padding:20, boxShadow:"0 2px 8px rgba(0,0,0,0.08)" },
  mainImageBox:  { position:"relative", textAlign:"center", marginBottom:20 },
  mainImage:     { width:"100%", maxHeight:380, objectFit:"contain", borderRadius:8 },
  noImage:       { height:300, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", fontSize:48, color:"#ccc", background:"#f5f5f5", borderRadius:8 },
  badge:         { position:"absolute", top:10, left:10, background:"#ff6161", color:"#fff", padding:"4px 10px", borderRadius:4, fontSize:11, fontWeight:700 },
  actionButtons: { display:"flex", gap:12 },
  addToCartBtn:  { flex:1, color:"#fff", border:"none", padding:"14px 0", borderRadius:4, fontSize:15, fontWeight:700, cursor:"pointer", transition:"background .2s" },
  buyNowBtn:     { flex:1, background:"#fb641b", color:"#fff", border:"none", padding:"14px 0", borderRadius:4, fontSize:15, fontWeight:700, cursor:"pointer" },
  infoSection:   { flex:1, minWidth:300 },
  productTitle:  { fontSize:22, fontWeight:600, color:"#212121", marginBottom:8, lineHeight:1.4 },
  ratingRow:     { display:"flex", alignItems:"center", gap:12, marginBottom:16 },
  ratingBadge:   { background:"#388e3c", color:"#fff", padding:"3px 10px", borderRadius:4, fontSize:13, fontWeight:700 },
  ratingCount:   { color:"#878787", fontSize:14 },
  priceSection:  { display:"flex", alignItems:"center", gap:12, marginBottom:4 },
  currentPrice:  { fontSize:28, fontWeight:700, color:"#212121" },
  originalPrice: { fontSize:16, color:"#878787", textDecoration:"line-through" },
  discountText:  { fontSize:16, color:"#388e3c", fontWeight:600 },
  freeDelivery:  { color:"#388e3c", fontSize:13, marginBottom:16 },
  offersBox:     { background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, padding:16, marginBottom:16 },
  offersTitle:   { fontWeight:700, fontSize:15, marginBottom:8, color:"#212121" },
  offerItem:     { fontSize:13, color:"#212121", marginBottom:6 },
  sizeSection:   { marginBottom:16 },
  sizeTitle:     { fontWeight:700, fontSize:14, marginBottom:8, color:"#212121" },
  sizeRow:       { display:"flex", gap:8, flexWrap:"wrap" },
 sizeBtn:        { padding:"8px 14px", border:"1px solid #c2c2c2", borderRadius:4, background:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, textAlign:"center", minWidth:48, color:"#212121", display:"inline-block" },
 sizeBtnActive:  { border:"2px solid #2874f0", color:"#2874f0", background:"#e8f0fe", fontWeight:700 },
  specsBox:      { background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, padding:16, marginBottom:16 },
  specsTitle:    { fontWeight:700, fontSize:15, marginBottom:12, color:"#212121" },
  specLabel:     { padding:"10px 14px", fontSize:13, color:"#878787", fontWeight:600, width:"35%", borderBottom:"1px solid #f0f0f0" },
  specValue:     { padding:"10px 14px", fontSize:13, color:"#212121", borderBottom:"1px solid #f0f0f0" },
  qtySection:    { marginBottom:16 },
  qtyRow:        { display:"flex", alignItems:"center", gap:12 },
  qtyBtn:        { width:32, height:32, border:"1px solid #c2c2c2", borderRadius:"50%", background:"#fff", fontSize:18, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" },
  qtyNum:        { fontSize:18, fontWeight:700, minWidth:30, textAlign:"center" },
  deliveryBox:   { background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, padding:16, marginBottom:16 },
  pincodeRow:    { display:"flex", gap:8, marginTop:8 },
  pincodeInput:  { flex:1, padding:"8px 12px", border:"1px solid #c2c2c2", borderRadius:4, fontSize:14 },
  checkBtn:      { background:"#2874f0", color:"#fff", border:"none", padding:"8px 16px", borderRadius:4, cursor:"pointer", fontWeight:600 },
  deliveryMsg:   { marginTop:8, fontSize:13, color:"#388e3c" },
  descBox:       { background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, padding:16, marginBottom:16 },
  descTitle:     { fontWeight:700, fontSize:15, marginBottom:8, color:"#212121" },
  descText:      { fontSize:14, color:"#555", lineHeight:1.6 },
  highlightsBox: { background:"#fff", border:"1px solid #e0e0e0", borderRadius:8, padding:16, marginBottom:16 },
  highlightsList:{ paddingLeft:20, fontSize:14, color:"#555", lineHeight:2 },
  reviewsSection:{ maxWidth:1200, margin:"0 auto 24px", padding:24, background:"#fff", borderRadius:8 },
  reviewsTitle:  { fontSize:20, fontWeight:700, margin:0, color:"#212121" },
  reviewsGrid:   { display:"flex", gap:16, flexWrap:"wrap" },
  reviewCard:    { flex:"1 1 280px", background:"#f9f9f9", borderRadius:8, padding:16, border:"1px solid #e0e0e0" },
  reviewHeader:  { display:"flex", alignItems:"center", gap:12, marginBottom:10 },
  reviewAvatar:  { width:42, height:42, borderRadius:"50%", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700, fontSize:16, flexShrink:0 },
  reviewName:    { fontWeight:700, fontSize:14, color:"#212121", margin:0 },
  reviewDate:    { fontSize:12, color:"#878787", margin:0 },
  reviewComment: { fontSize:14, color:"#555", lineHeight:1.6, margin:0 },
  formLabel:     { display:"block", fontSize:13, fontWeight:700, color:"#333", marginBottom:6 },
  formInput:     { width:"100%", padding:"10px 12px", border:"1px solid #c2c2c2", borderRadius:6, fontSize:14, boxSizing:"border-box", outline:"none", fontFamily:"inherit" },
};

export default ProductDetail;
