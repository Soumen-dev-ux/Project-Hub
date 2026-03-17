import React from 'react';
// eslint-disable-next-line
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'fixed', inset: 0,
        background: '#030712',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 9999,
        gap: '1.5rem',
      }}
    >
      {/* Spinning neon ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 64, height: 64,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#00f5ff',
          borderRightColor: '#9000ff',
          boxShadow: '0 0 20px rgba(0, 245, 255, 0.4)',
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="font-orbitron glow-text-cyan"
        style={{ fontSize: '0.9rem', letterSpacing: '0.2em', color: '#00f5ff' }}
      >
        LOADING CITY...
      </motion.div>
    </motion.div>
  );
}
