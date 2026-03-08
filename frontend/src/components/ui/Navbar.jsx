import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="nav-container glass glow-cyan"
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span
          className="font-orbitron gradient-text"
          style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.1em' }}
        >
          &lt;Techie_Sou&gt;
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {[
          { label: 'City', to: '/' },
          { label: 'Admin', to: '/admin' },
        ].map(({ label, to }) => {
          const active = pathname === to;
          return (
            <Link key={to} to={to} style={{ textDecoration: 'none', position: 'relative' }}>
              <motion.span
                whileHover={{ color: '#00f5ff' }}
                style={{
                  color: active ? '#00f5ff' : 'rgba(226,232,240,0.6)',
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.875rem',
                  letterSpacing: '0.05em',
                  transition: 'color 0.2s',
                }}
              >
                {label}
              </motion.span>
              {active && (
                <motion.div
                  layoutId="nav-underline"
                  style={{
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: 'var(--neon-cyan)',
                    borderRadius: 2,
                    boxShadow: '0 0 8px var(--neon-cyan)',
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Status dot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#00ff88',
          boxShadow: '0 0 8px #00ff88',
          animation: 'pulse 2s infinite',
        }} />
        <span style={{ fontSize: '0.7rem', color: 'rgba(226,232,240,0.4)', fontFamily: 'JetBrains Mono' }}>
          LIVE
        </span>
      </div>
    </motion.nav>
  );
}
