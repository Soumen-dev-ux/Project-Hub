import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProjectList, { ProjectListSkeleton } from '../components/admin/ProjectList';
import ProjectForm from '../components/admin/ProjectForm';
import { useProjects } from '../hooks/useProjects';

export default function Admin() {
  const { projects, loading, error, addProject, editProject, removeProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const flash = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSave = async (formData) => {
    if (editingProject) {
      await editProject(editingProject._id, formData);
      flash('✅ Project updated!');
    } else {
      await addProject(formData);
      flash('✅ Project added!');
    }
    setShowForm(false);
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await removeProject(id);
    flash('🗑️ Project deleted');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };

  // ─── LOGIN SCREEN ───────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="cyber-grid" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', maxWidth: 400, padding: 32, borderRadius: 24, background: 'rgba(8,12,26,0.92)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,245,255,0.2)', boxShadow: '0 0 60px rgba(0,245,255,0.1)' }}
        >
          <h2 className="font-orbitron gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: 24 }}>ADMIN ACCESS</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#00f5ff', marginBottom: 8, fontFamily: 'JetBrains Mono' }}>SYS_PASSWORD</label>
              <input
                type="password" autoFocus
                value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}
                className="input-cyber" placeholder="Enter override code..."
              />
            </div>
            {authError && <div style={{ color: '#ff00aa', fontSize: '0.8rem', fontFamily: 'JetBrains Mono' }}>⚠️ {authError}</div>}
            <button type="submit" className="btn-neon-filled" style={{ marginTop: 8 }}>AUTHENTICATE OVR_RIDE_1</button>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <Link to="/" style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.8rem', textDecoration: 'none' }}>← Return to City View</Link>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  // ─── ADMIN DASHBOARD ────────────────────────────────────────
  // Render the dashboard immediately, and show skeleton for the list while loading
  return (
    <div
      className="cyber-grid"
      style={{
        minHeight: '100vh', padding: '100px 24px 48px',
        background: '#030712',
      }}
    >
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1
                className="font-orbitron gradient-text"
                style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', fontWeight: 900 }}
              >
                ADMIN DASHBOARD
              </h1>
              <p style={{
                fontSize: '0.78rem', color: 'rgba(226,232,240,0.4)',
                fontFamily: 'JetBrains Mono', marginTop: 4,
              }}>
                {projects.length} projects in database
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/" style={{ textDecoration: 'none' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '10px 20px', borderRadius: 10,
                    background: 'transparent',
                    border: '1px solid rgba(0,245,255,0.25)',
                    color: 'rgba(0,245,255,0.6)', cursor: 'pointer',
                    fontSize: '0.8rem', fontFamily: 'Inter, sans-serif',
                  }}
                >
                  ← City View
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(0,245,255,0.35)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setEditingProject(null); setShowForm(true); }}
                style={{
                  padding: '10px 20px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #00f5ff, #9000ff)',
                  border: 'none', color: '#030712',
                  fontWeight: 700, cursor: 'pointer',
                  fontSize: '0.8rem', letterSpacing: '0.05em',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                + Add Project
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: 1, marginTop: 24,
            background: 'linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)',
          }} />
        </motion.div>

        {/* Success flash */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: '12px 20px', borderRadius: 10, marginBottom: 20,
                background: 'rgba(0,255,136,0.08)',
                border: '1px solid rgba(0,255,136,0.25)',
                color: '#00ff88', fontSize: '0.85rem',
                fontFamily: 'JetBrains Mono',
              }}
            >
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 20px', borderRadius: 10, marginBottom: 20,
            background: 'rgba(255,0,85,0.08)', border: '1px solid rgba(255,0,85,0.25)',
            color: '#ff4444', fontSize: '0.85rem', fontFamily: 'JetBrains Mono',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ display: 'flex', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}
        >
          {[
            { label: 'TOTAL PROJECTS', value: loading ? '-' : projects.length, color: '#00f5ff' },
            { label: 'TECH TAGS', value: loading ? '-' : [...new Set(projects.flatMap(p => p.techStack))].length, color: '#ff00aa' },
            { label: 'WITH LIVE DEMO', value: loading ? '-' : projects.filter(p => p.liveDemo).length, color: '#9000ff' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{
              flex: '1 1 140px',
              padding: '16px 20px', borderRadius: 12,
              background: 'rgba(10,15,30,0.7)',
              border: `1px solid ${color}22`,
              textAlign: 'center',
            }}>
              <div className="font-orbitron" style={{ fontSize: '1.6rem', fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: '0.62rem', color: 'rgba(226,232,240,0.3)', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Project List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {loading ? (
            <ProjectListSkeleton />
          ) : (
            <ProjectList projects={projects} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </motion.div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProjectForm
            existing={editingProject}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
