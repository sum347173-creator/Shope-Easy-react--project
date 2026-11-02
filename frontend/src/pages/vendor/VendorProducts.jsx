import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function VendorProducts() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [showDel, setShowDel] = useState(false)
  const [editId, setEditId] = useState(null)
  const [delId, setDelId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    stock: '', category: '', imageUrl: ''
  })

  const cats = ['All', 'Mobiles', 'Laptops', 'Electronics', 'Headphones', 'Fashion']

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.get('/products/vendor')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter(p => {
    const matchTab = tab === 'All' || p.category === tab
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const stockBadge = (qty) => {
    if (qty === 0) return { label: 'Out of Stock', bg: '#fee2e2', color: '#991b1b' }
    if (qty <= 5) return { label: 'Low Stock', bg: '#fef3c7', color: '#92400e' }
    return { label: 'In Stock', bg: '#dcfce7', color: '#166534' }
  }

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 5).length,
    low: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    out: products.filter(p => p.stock === 0).length,
  }

  const openAdd = () => {
    setEditId(null)
    setForm({ name: '', description: '', price: '', stock: '', category: '', imageUrl: '' })
    setShowForm(true)
  }

  const openEdit = (p) => {
    setEditId(p.id)
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      category: p.category || '',
      imageUrl: p.imageUrl || ''
    })
    setShowForm(true)
  }

  const openDel = (id) => { setDelId(id); setShowDel(true) }

  const saveProduct = async () => {
    if (!form.name || !form.price || !form.stock) return alert('Naam, price aur stock required hai!')
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      }
      if (editId) {
        await api.put(`/products/${editId}`, payload)
      } else {
        await api.post('/products', payload)
      }
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      alert('Error saving product!')
    }
  }

  const confirmDel = async () => {
    try {
      await api.delete(`/products/${delId}`)
      setShowDel(false)
      fetchProducts()
    } catch (err) {
      alert('Error deleting product!')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <div style={{ background: '#1a56db', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span onClick={() => navigate(-1)} style={{ cursor: 'pointer', color: 'white', fontSize: 20 }}>←</span>
        <span style={{ fontSize: 22 }}>🏪</span>
        <div>
          <div style={{ color: 'white', fontSize: 18, fontWeight: 600 }}>Product Management</div>
          <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>ShopEasy Vendor Portal</div>
        </div>
        <span style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 11, padding: '2px 10px', borderRadius: 20 }}>{stats.total} products</span>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, padding: '16px 24px', background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        {[['Total', stats.total, '#1a56db'], ['In Stock', stats.inStock, '#16a34a'], ['Low Stock', stats.low, '#d97706'], ['Out of Stock', stats.out, '#dc2626']].map(([label, val, color]) => (
          <div key={label} style={{ background: '#f9fafb', borderRadius: 10, padding: '12px 14px' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, padding: '12px 24px', background: 'white', borderBottom: '1px solid #e5e7eb', flexWrap: 'wrap', alignItems: 'center' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Product search karo..."
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }} />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setTab(c)}
              style={{ padding: '6px 14px', borderRadius: 20, fontSize: 12, border: '1px solid #e5e7eb', cursor: 'pointer', background: tab === c ? '#1a56db' : 'white', color: tab === c ? 'white' : '#374151', fontWeight: tab === c ? 600 : 400 }}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={openAdd}
          style={{ padding: '8px 18px', background: '#1a56db', color: 'white', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Product Add Karo
        </button>
      </div>

      {/* Products List */}
      <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading && <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Loading... ⏳</div>}
        {!loading && filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Koi product nahi mila 😕</div>}
        {filtered.map(p => {
          const st = stockBadge(p.stock)
          return (
            <div key={p.id} style={{ background: 'white', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, border: '1px solid #e5e7eb' }}>
              <div style={{ width: 52, height: 52, borderRadius: 10, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#6b7280', flexShrink: 0, overflow: 'hidden' }}>
                {p.imageUrl
                  ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10 }} />
                  : '📦'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{p.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{p.category} • Stock: {p.stock} units</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#111827', minWidth: 90, textAlign: 'right' }}>
                ₹{Number(p.price).toLocaleString('en-IN')}
              </div>
              <span style={{ background: st.bg, color: st.color, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, minWidth: 80, textAlign: 'center' }}>{st.label}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(p)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: 'white', fontSize: 12, cursor: 'pointer' }}>✏️ Edit</button>
                <button onClick={() => openDel(p.id)} style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid #fecaca', background: 'white', color: '#dc2626', fontSize: 12, cursor: 'pointer' }}>🗑️ Delete</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 440, maxWidth: '92vw' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{editId ? '✏️ Product Edit Karo' : '➕ Naya Product Add Karo'}</h2>
            {[
              ['name', 'Product Naam', 'text', 'e.g. iPhone 15 Pro'],
              ['description', 'Description', 'text', 'Product details...'],
              ['imageUrl', 'Image URL', 'text', 'https://...'],
              ['price', 'Price (₹)', 'number', 'e.g. 134900'],
              ['stock', 'Stock', 'number', 'e.g. 25'],
            ].map(([key, label, type, ph]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}>
                {['Mobiles', 'Laptops', 'Electronics', 'Headphones', 'Fashion', 'Accessories'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
              <button onClick={() => setShowForm(false)} style={{ padding: '8px 18px', border: '1px solid #e5e7eb', borderRadius: 8, background: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveProduct} style={{ padding: '8px 18px', background: '#1a56db', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                {editId ? 'Update Karo' : 'Save Karo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, width: 360, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Delete Karo?</h2>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
              <strong>{products.find(p => p.id === delId)?.name}</strong> permanently delete ho jayega
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button onClick={() => setShowDel(false)} style={{ padding: '8px 18px', border: '1px solid #e5e7eb', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button onClick={confirmDel} style={{ padding: '8px 18px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Haan, Delete Karo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}