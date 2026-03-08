import React, { useState, useEffect } from 'react';
// eslint-disable-next-line
import { motion } from 'framer-motion';
const EMPTY = {
  title: '', description: '', techStack: '',
  githubLink: '', liveDemo: '', demoVideo: '', image: '',
  position: { x: 0, y: 0, z: 0 },
};

export default function ProjectForm({ existing, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setForm({
        ...existing,
        techStack: existing.techStack?.join(', ') || '',
        position: existing.position || { x: 0, y: 0, z: 0 },
      });
    } else {
      setForm(EMPTY);
    }
  }, [existing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePositionChange = (axis, value) => {
    setForm((prev) => ({
      ...prev,
      position: { ...prev.position, [axis]: parseFloat(value) || 0 },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map((t) => t.trim()).filter(Boolean),
      };
      await onSave(payload);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    background: 'rgba(10,15,30,0.8)',
    border: '1px solid rgba(0,245,255,0.2)',
    borderRadius: 8,
    color: '#e2e8f0',
    padding: '10px 14px',
    fontSize: '0.875rem',
    outline: 'none',
    width: '100%',
    fontFamily: 'Inter, sans-serif',
    transition: 'border-color 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    color: 'rgba(0, 245, 255, 0.6)',
    fontFamily: 'JetBrains Mono, monospace',
    marginBottom: 6,
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(3,7,18,0.7)',
        backdropFilter: 'blur(8px)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          width: '100%', maxWidth: 560,
          maxHeight: '90vh', overflowY: 'auto',
          borderRadius: 20,
          background: 'rgba(10,15,30,0.95)',
          border: '1px solid rgba(0,245,255,0.2)',
          boxShadow: '0 0 60px rgba(0,245,255,0.1)',
          padding: '28px 32px',
        }}
      >
        <h3
          className="font-orbitron gradient-text"
          style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}
        >
          {existing ? '✏️ EDIT PROJECT' : '➕ NEW PROJECT'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Title */}
          <div>
            <label style={labelStyle}>PROJECT TITLE *</label>
            <input name="title" value={form.title} onChange={handleChange} required style={inputStyle} placeholder="My Awesome Project" />
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>DESCRIPTION *</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
              style={{ ...inputStyle, resize: 'vertical' }} placeholder="What does this project do?" />
          </div>

          {/* Tech Stack */}
          <div>
            <label style={labelStyle}>TECH STACK (comma separated)</label>
            <input name="techStack" value={form.techStack} onChange={handleChange}
              style={inputStyle} placeholder="React, Node.js, MongoDB, Tailwind" />
          </div>

          {/* Links */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>GITHUB LINK</label>
              <input name="githubLink" value={form.githubLink} onChange={handleChange} style={inputStyle} placeholder="https://github.com/..." />
            </div>
            <div>
              <label style={labelStyle}>LIVE DEMO</label>
              <input name="liveDemo" value={form.liveDemo} onChange={handleChange} style={inputStyle} placeholder="https://..." />
            </div>
          </div>

          {/* Media */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>IMAGE URL</label>
              <input name="image" value={form.image} onChange={handleChange} style={inputStyle} placeholder="https://images.unsplash.com/..." />
            </div>
            <div>
              <label style={labelStyle}>DEMO VIDEO URL</label>
              <input name="demoVideo" value={form.demoVideo} onChange={handleChange} style={inputStyle} placeholder="https://youtube.com/embed/..." />
            </div>
          </div>

          {/* Position */}
          <div>
            <label style={{ ...labelStyle, marginBottom: 10 }}>3D CITY POSITION</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {['x', 'y', 'z'].map((axis) => (
                <div key={axis}>
                  <label style={{ ...labelStyle, color: axis === 'x' ? '#ff6b35' : axis === 'y' ? '#00ff88' : '#4fc3f7' }}>
                    {axis.toUpperCase()} AXIS
                  </label>
                  <input
                    type="number" step="0.5"
                    value={form.position[axis]}
                    onChange={(e) => handlePositionChange(axis, e.target.value)}
                    style={{ ...inputStyle }}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(226,232,240,0.3)', marginTop: 6, fontFamily: 'JetBrains Mono' }}>
              Tip: spread buildings across x/z plane. Keep y=0 for ground level.
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="button" onClick={onCancel}
              style={{
                flex: 1, padding: '11px 0', borderRadius: 10,
                background: 'transparent',
                border: '1px solid rgba(226,232,240,0.15)',
                color: 'rgba(226,232,240,0.5)',
                cursor: 'pointer', fontSize: '0.875rem',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Cancel
            </button>
            <motion.button
              type="submit" disabled={saving}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 2, padding: '11px 0', borderRadius: 10,
                background: 'linear-gradient(135deg, #00f5ff, #9000ff)',
                border: 'none', color: '#030712',
                fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem', letterSpacing: '0.05em',
                fontFamily: 'Inter, sans-serif',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'SAVING...' : existing ? 'UPDATE PROJECT' : 'ADD PROJECT'}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
