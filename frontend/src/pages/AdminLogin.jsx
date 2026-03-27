import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(password);
      navigate('/admin');
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 50%, rgba(120,0,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,245,255,0.08) 0%, transparent 60%), #030712',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'JetBrains Mono, monospace',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          width: '100%', maxWidth: 420,
          background: 'rgba(8, 12, 26, 0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0,245,255,0.2)',
          borderRadius: 20,
          padding: '48px 40px',
          boxShadow: '0 0 40px rgba(0,245,255,0.08), 0 0 80px rgba(120,0,255,0.08)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(120,0,255,0.15))',
            border: '1px solid rgba(0,245,255,0.3)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', marginBottom: 16,
          }}>⚙️</div>
          <h1 style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '1.3rem', fontWeight: 900,
            background: 'linear-gradient(90deg, #00f5ff, #9000ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            letterSpacing: '0.1em', margin: 0,
          }}>ADMIN ACCESS</h1>
          <p style={{ color: 'rgba(226,232,240,0.4)', fontSize: '0.7rem', marginTop: 8, letterSpacing: '0.15em' }}>
            TECH CITY CONTROL PANEL
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', color: 'rgba(0,245,255,0.7)', fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: 8 }}>
              SECURITY KEY
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                autoFocus
                style={{
                  width: '100%', boxSizing: 'border-box',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${error ? 'rgba(255,0,100,0.5)' : 'rgba(0,245,255,0.2)'}`,
                  borderRadius: 10,
                  color: '#e2e8f0', fontSize: '0.9rem',
                  fontFamily: 'JetBrains Mono, monospace',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,245,255,0.5)'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(255,0,100,0.5)' : 'rgba(0,245,255,0.2)'}
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#ff4477', fontSize: '0.72rem', marginTop: 8, letterSpacing: '0.05em' }}
              >
                ⚠ {error}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading || !password}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: '14px',
              background: loading || !password
                ? 'rgba(255,255,255,0.05)'
                : 'linear-gradient(135deg, rgba(0,245,255,0.2), rgba(120,0,255,0.3))',
              border: `1px solid ${loading || !password ? 'rgba(255,255,255,0.08)' : 'rgba(0,245,255,0.4)'}`,
              borderRadius: 10,
              color: loading || !password ? 'rgba(226,232,240,0.3)' : '#00f5ff',
              fontFamily: 'Orbitron, monospace',
              fontSize: '0.8rem', fontWeight: 700,
              letterSpacing: '0.15em',
              cursor: loading || !password ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'AUTHENTICATING...' : 'ACCESS GRANTED →'}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a href="/" style={{ color: 'rgba(226,232,240,0.3)', fontSize: '0.65rem', textDecoration: 'none', letterSpacing: '0.1em' }}>
            ← BACK TO CITY
          </a>
        </div>
      </motion.div>
    </div>
  );
}
