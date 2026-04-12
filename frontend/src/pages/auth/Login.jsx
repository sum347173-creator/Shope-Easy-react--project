import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../../redux/slices/authSlice';
import api from '../../services/api';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      dispatch(loginSuccess(res.data));
      const role = res.data.role;
      if (role === 'ADMIN') navigate('/admin');
      else if (role === 'VENDOR') navigate('/vendor');
      else navigate('/buyer');
    } catch (err) {
      setError('Invalid email or password!');
    }
  };

  return (
    <div style={S.container}>
      <div style={S.card}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>🛍️</span>
          <h2 style={S.title}>ShopEasy</h2>
          <p style={S.subtitle}>Apne account mein login karo</p>
        </div>

        {error && <p style={S.error}>{error}</p>}

        {!showEmailForm ? (
          /* Step 1 — Login options */
          <div>
            {/* Google Button */}
            <button style={S.googleBtn} onClick={() => alert('Google login coming soon!')}>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                style={{ width: 20, height: 20, marginRight: 10 }}
              />
              Login with Google
            </button>

            {/* Divider */}
            <div style={S.divider}>
              <hr style={S.hr} />
              <span style={S.orText}>ya</span>
              <hr style={S.hr} />
            </div>

            {/* Email Button */}
            <button style={S.emailBtn} onClick={() => setShowEmailForm(true)}>
              ✉️ &nbsp; Login with Email
            </button>

            <p style={S.link}>
              Account nahi hai? <Link to="/register" style={S.linkA}>Register karo</Link>
            </p>
          </div>
        ) : (
          /* Step 2 — Email form */
          <div>
            <button style={S.backBtn} onClick={() => { setShowEmailForm(false); setError(''); }}>
              ← Wapas jao
            </button>

            <form onSubmit={handleLogin}>
              <input
                style={S.input}
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                style={S.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button style={S.submitBtn} type="submit">
                🔐 Login Karo
              </button>
            </form>

            <p style={S.link}>
              Account nahi hai? <Link to="/register" style={S.linkA}>Register karo</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', minHeight: '100vh',
    backgroundColor: '#f0f2f5', fontFamily: "'Segoe UI', sans-serif",
  },
  card: {
    background: 'white', padding: '2rem',
    borderRadius: 16, width: 360,
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center', margin: '4px 0 0',
    color: '#2874f0', fontSize: 22, fontWeight: 800,
  },
  subtitle: {
    textAlign: 'center', color: '#888',
    fontSize: 13, marginBottom: 24,
  },
  googleBtn: {
    width: '100%', padding: '11px 0',
    background: '#fff', border: '1.5px solid #ddd',
    borderRadius: 8, fontSize: 15, fontWeight: 600,
    cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, color: '#333',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  divider: {
    display: 'flex', alignItems: 'center', marginBottom: 16,
  },
  hr: { flex: 1, border: 'none', borderTop: '1px solid #eee' },
  orText: { margin: '0 10px', color: '#aaa', fontSize: 13 },
  emailBtn: {
    width: '100%', padding: '11px 0',
    background: '#2874f0', color: '#fff',
    border: 'none', borderRadius: 8,
    fontSize: 15, fontWeight: 600, cursor: 'pointer',
    marginBottom: 20,
  },
  backBtn: {
    background: 'none', border: 'none',
    color: '#2874f0', fontSize: 14,
    cursor: 'pointer', marginBottom: 16,
    padding: 0, fontWeight: 600,
  },
  input: {
    width: '100%', padding: '11px 12px',
    marginBottom: 14, borderRadius: 8,
    border: '1.5px solid #ddd', fontSize: 14,
    boxSizing: 'border-box', outline: 'none',
  },
  submitBtn: {
    width: '100%', padding: '11px 0',
    background: '#2874f0', color: '#fff',
    border: 'none', borderRadius: 8,
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    marginBottom: 16,
  },
  error: { color: 'red', textAlign: 'center', fontSize: 13, marginBottom: 10 },
  link: { textAlign: 'center', fontSize: 13, color: '#666', marginTop: 8 },
  linkA: { color: '#2874f0', fontWeight: 600, textDecoration: 'none' },
};