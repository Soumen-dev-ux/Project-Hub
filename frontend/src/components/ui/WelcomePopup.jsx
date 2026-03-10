// eslint-disable-next-line
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show the popup shortly after the app loads
    const timer = setTimeout(() => setIsOpen(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setIsOpen(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(10px)',
          pointerEvents: 'auto',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              background: 'rgba(13, 18, 30, 0.95)',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              borderRadius: '20px',
              padding: '2.5rem',
              maxWidth: '450px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 0 50px rgba(0, 245, 255, 0.15)',
            }}
          >
            <h2 className="font-orbitron gradient-text" style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              WELCOME TO<br />TECH CITY
            </h2>
            <p style={{ color: 'rgba(226, 232, 240, 0.85)', marginBottom: '2.5rem', lineHeight: '1.7', fontSize: '1rem' }}>
              Hey, thank you for showing your interesting in my projects. Visit tech city by scrolling. Just for note, here every buildings are my projects. This is in testing period currently, you can still visit my tech city. Sorry for the inconvenience. <br /><br /> ~ Soumen Pore
            </p>
            <button
              onClick={handleClose}
              style={{
                background: 'linear-gradient(90deg, #00f5ff, #0088ff)',
                color: '#fff',
                border: 'none',
                padding: '0.85rem 2.5rem',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'JetBrains Mono, monospace',
                boxShadow: '0 0 25px rgba(0, 245, 255, 0.4)',
                transition: 'all 0.3s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(0, 245, 255, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 245, 255, 0.4)';
              }}
            >
              ENTER CITY
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
