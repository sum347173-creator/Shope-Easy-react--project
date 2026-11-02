import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'BUYER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      setSuccess('Registration successful! Please login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Email already exists!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Register</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleRegister}>
          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <select
            style={styles.input}
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="BUYER">Buyer</option>
            <option value="VENDOR">Vendor</option>
          </select>
          <button style={styles.button} type="submit">
            Register
          </button>
        </form>
        <p style={styles.link}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center',
    alignItems: 'center', height: '100vh',
    backgroundColor: '#f0f2f5',
  },
  card: {
    background: 'white', padding: '2rem',
    borderRadius: '10px', width: '360px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: { textAlign: 'center', marginBottom: '1.5rem', color: '#333' },
  input: {
    width: '100%', padding: '10px',
    marginBottom: '1rem', borderRadius: '6px',
    border: '1px solid #ddd', fontSize: '14px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%', padding: '10px',
    backgroundColor: '#4f46e5', color: 'white',
    border: 'none', borderRadius: '6px',
    fontSize: '16px', cursor: 'pointer',
  },
  error: { color: 'red', textAlign: 'center' },
  success: { color: 'green', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '1rem' },
};