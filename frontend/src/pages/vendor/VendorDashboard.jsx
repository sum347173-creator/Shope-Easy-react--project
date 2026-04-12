import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import api from '../../services/api';

export default function VendorDashboard() {
  const { name } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    stock: '', category: '', imageUrl: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products/vendor');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      });
      setMessage('Product added successfully!');
      setForm({ name: '', description: '', price: '',
                 stock: '', category: '', imageUrl: '' });
      fetchProducts();
    } catch (err) {
      setMessage('Error adding product!');
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>🏪 Vendor Dashboard — {name}</h2>
              <button style={styles.productsBtn} onClick={() => navigate('/vendor/products')}>
          🛍️ Product Management
        </button>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.card}>
        <h3>Add New Product</h3>
        {message && <p style={styles.message}>{message}</p>}
        <form onSubmit={handleAddProduct}>
          {['name','description','category','imageUrl'].map((field) => (
            <input key={field} style={styles.input}
              type="text" name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]} onChange={handleChange} required={field !== 'imageUrl'}
            />
          ))}
          <input style={styles.input} type="number"
            name="price" placeholder="Price"
            value={form.price} onChange={handleChange} required />
          <input style={styles.input} type="number"
            name="stock" placeholder="Stock"
            value={form.stock} onChange={handleChange} required />
          <button style={styles.button} type="submit">Add Product</button>
        </form>
      </div>

      <div style={styles.card}>
        <h3>My Products ({products.length})</h3>
        {products.length === 0 ? (
          <p>No products yet!</p>
        ) : (
          products.map((p) => (
            <div key={p.id} style={styles.productCard}>
              <div>
                <strong>{p.name}</strong> — ₹{p.price}
                <p style={{margin:'4px 0', color:'#666'}}>{p.category} | Stock: {p.stock}</p>
              </div>
              <button style={styles.deleteBtn}
                onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '2rem' },
  header: { display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '2rem' },
  card: { background: 'white', padding: '1.5rem',
          borderRadius: '10px', marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '10px', marginBottom: '1rem',
           borderRadius: '6px', border: '1px solid #ddd',
           fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '10px',
            backgroundColor: '#4f46e5', color: 'white',
            border: 'none', borderRadius: '6px',
            fontSize: '16px', cursor: 'pointer' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#ef4444',
               color: 'white', border: 'none',
               borderRadius: '6px', cursor: 'pointer' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#ef4444',
               color: 'white', border: 'none',
               borderRadius: '6px', cursor: 'pointer' },
  productCard: { display: 'flex', justifyContent: 'space-between',
                 alignItems: 'center', padding: '1rem',
                 border: '1px solid #eee', borderRadius: '8px',
                 marginBottom: '0.5rem' },
  message: { color: 'green', marginBottom: '1rem' },

  productsBtn: { padding: '8px 16px', backgroundColor: '#1a56db',
                 color: 'white', border: 'none',
                 borderRadius: '6px', cursor: 'pointer' },
};