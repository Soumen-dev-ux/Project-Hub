// eslint-disable-next-line
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show the popup quickly after the app loads
    const timer = setTimeout(() => setIsOpen(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => setIsOpen(false);

  // Stagger container for text
  const textContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02, // anime.js style fast stagger
        delayChildren: 0.1,
      }
    }
  };

  const paragraphContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.015, // slightly faster for paragraph words
        delayChildren: 0.4,
      }
    }
  };

  // Individual letter/word animation
  const textItem = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { type: 'spring', damping: 12, stiffness: 200 }
    }
  };

  const welcomeText1 = "WELCOME TO";
  const welcomeText2 = "TECH CITY";
  const bodyText = "Hey, thank you for showing your interesting in my projects. Visit tech city by scrolling. Just for note, here every buildings are my projects. This is in testing period currently, you can still visit my tech city. Sorry for the inconvenience.";

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
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              background: 'rgba(13, 18, 30, 0.95)',
              border: '1px solid rgba(0, 245, 255, 0.3)',
              borderRadius: '20px',
              padding: '2.5rem',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
              boxShadow: '0 0 50px rgba(0, 245, 255, 0.15)',
              overflow: 'hidden'
            }}
          >
            {/* Title Stagger */}
            <motion.h2
              className="font-orbitron gradient-text"
              style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 800, letterSpacing: '0.05em', lineHeight: '1.2' }}
              variants={textContainer}
              initial="hidden"
              animate="visible"
            >
              <div style={{ display: 'block' }}>
                {welcomeText1.split('').map((char, i) => (
                  <motion.span key={i} variants={textItem} style={{ display: 'inline-block' }}>
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
              <div style={{ display: 'block' }}>
                {welcomeText2.split('').map((char, i) => (
                  <motion.span key={i + 100} variants={textItem} style={{ display: 'inline-block' }}>
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </div>
            </motion.h2>

            {/* Paragraph Stagger */}
            <motion.div
              style={{ color: 'rgba(226, 232, 240, 0.85)', marginBottom: '2.5rem', lineHeight: '1.7', fontSize: '1rem' }}
              variants={paragraphContainer}
              initial="hidden"
              animate="visible"
            >
              <div>
                {bodyText.split(' ').map((word, i) => (
                  <motion.span key={i} variants={textItem} style={{ display: 'inline-block', marginRight: '0.25em' }}>
                    {word}
                  </motion.span>
                ))}
              </div>
              <br />
              <motion.div variants={textItem} style={{ marginTop: '0.5rem', fontWeight: 600, color: '#00f5ff' }}>
                ~ Soumen Pore
              </motion.div>
            </motion.div>

            {/* Button */}
            <motion.button
              onClick={handleClose}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: 'spring', damping: 20, stiffness: 200 }}
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
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
