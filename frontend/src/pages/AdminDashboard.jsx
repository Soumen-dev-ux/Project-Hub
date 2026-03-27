import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../api/projectsApi';

const emptyForm = {
  title: '', description: '', techStack: '',
  githubLink: '', liveDemo: '', image: '',
};

const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(0,245,255,0.15)',
  borderRadius: 8,
  color: '#e2e8f0', fontSize: '0.82rem',
  fontFamily: 'JetBrains Mono, monospace',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle = {
  display: 'block',
  color: 'rgba(0,245,255,0.6)',
  fontSize: '0.6rem',
  letterSpacing: '0.2em',
  marginBottom: 6,
};

export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const flash = (msg, isError = false) => {
    if (isError) setError(msg); else setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      techStack: form.techStack.split(',').map(s => s.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await updateProject(editingId, payload, authHeaders);
        flash('Project updated ✓');
      } else {
        await createProject(payload, authHeaders);
        flash('Project created ✓');
      }
      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      flash(err?.response?.data?.message || 'Save failed.', true);
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title || '',
      description: project.description || '',
      techStack: (project.techStack || []).join(', '),
      githubLink: project.githubLink || '',
      liveDemo: project.liveDemo || '',
      image: project.image || '',
    });
    setEditingId(project._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteProject(id, authHeaders);
      flash('Project deleted.');
      fetchProjects();
    } catch (err) {
      flash(err?.response?.data?.message || 'Delete failed.', true);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 10%, rgba(120,0,255,0.1) 0%, transparent 50%), #030712',
      fontFamily: 'JetBrains Mono, monospace',
      color: '#e2e8f0',
    }}>
      {/* grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 }}>
          <div>
            <h1 style={{
              fontFamily: 'Orbitron, monospace', fontSize: '1.4rem', fontWeight: 900,
              background: 'linear-gradient(90deg, #00f5ff, #9000ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '0.1em', margin: 0,
            }}>ADMIN DASHBOARD</h1>
            <p style={{ color: 'rgba(226,232,240,0.35)', fontSize: '0.65rem', letterSpacing: '0.2em', marginTop: 6 }}>
              TECH CITY CONTROL PANEL
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/')}
              style={{
                padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(226,232,240,0.5)', fontSize: '0.72rem',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >← City View</motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              style={{
                padding: '10px 18px', borderRadius: 8, cursor: 'pointer',
                background: 'rgba(255,0,80,0.1)',
                border: '1px solid rgba(255,0,80,0.3)',
                color: '#ff3366', fontSize: '0.72rem',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >LOGOUT</motion.button>
          </div>
        </div>

        {/* Toast messages */}
        <AnimatePresence>
          {(success || error) && (
            <motion.div
              key="toast"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                padding: '12px 20px', borderRadius: 10, marginBottom: 24,
                background: success ? 'rgba(0,255,136,0.08)' : 'rgba(255,0,80,0.08)',
                border: `1px solid ${success ? 'rgba(0,255,136,0.3)' : 'rgba(255,0,80,0.3)'}`,
                color: success ? '#00ff88' : '#ff4477',
                fontSize: '0.78rem',
              }}
            >{success || error}</motion.div>
          )}
        </AnimatePresence>

        {/* Add / Edit Form */}
        <div style={{
          background: 'rgba(8,12,26,0.8)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,245,255,0.12)',
          borderRadius: 16, marginBottom: 32,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => { if (showForm) cancelForm(); else setShowForm(true); }}
            style={{
              width: '100%', padding: '18px 24px',
              background: 'transparent', border: 'none',
              borderBottom: showForm ? '1px solid rgba(0,245,255,0.1)' : 'none',
              color: '#00f5ff', fontFamily: 'Orbitron, monospace',
              fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em',
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10,
            }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 24, height: 24, borderRadius: 6,
              background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.3)',
              fontSize: '1rem', transition: 'transform 0.2s',
              transform: showForm ? 'rotate(45deg)' : 'none',
            }}>+</span>
            {editingId ? 'EDITING PROJECT' : 'ADD NEW PROJECT'}
          </button>

          <AnimatePresence>
            {showForm && (
              <motion.form
                key="form"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                style={{ overflow: 'hidden' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, padding: '24px' }}>
                  {[
                    { key: 'title', label: 'TITLE *', required: true, placeholder: 'My Awesome Project' },
                    { key: 'techStack', label: 'TECH STACK (comma separated)', placeholder: 'React, Node.js, MongoDB' },
                    { key: 'githubLink', label: 'GITHUB URL', placeholder: 'https://github.com/...' },
                    { key: 'liveDemo', label: 'LIVE DEMO URL', placeholder: 'https://...' },
                    { key: 'image', label: 'IMAGE URL', placeholder: 'https://...' },
                  ].map(({ key, label, required, placeholder }) => (
                    <div key={key}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        style={inputStyle}
                        type="text"
                        value={form[key]}
                        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        required={required}
                        onFocus={e => e.target.style.borderColor = 'rgba(0,245,255,0.4)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(0,245,255,0.15)'}
                      />
                    </div>
                  ))}
                  {/* Description spans full width */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>DESCRIPTION</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Describe your project..."
                      onFocus={e => e.target.style.borderColor = 'rgba(0,245,255,0.4)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(0,245,255,0.15)'}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, padding: '0 24px 24px' }}>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{
                      padding: '11px 28px', borderRadius: 8, cursor: 'pointer',
                      background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(120,0,255,0.2))',
                      border: '1px solid rgba(0,245,255,0.35)',
                      color: '#00f5ff', fontFamily: 'Orbitron, monospace',
                      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em',
                    }}
                  >
                    {editingId ? '✓ SAVE CHANGES' : '+ CREATE PROJECT'}
                  </motion.button>
                  <button
                    type="button" onClick={cancelForm}
                    style={{
                      padding: '11px 20px', borderRadius: 8, cursor: 'pointer',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(226,232,240,0.4)', fontSize: '0.72rem',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >Cancel</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Projects Table */}
        <div style={{
          background: 'rgba(8,12,26,0.8)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,245,255,0.12)', borderRadius: 16, overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(0,245,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', color: '#00f5ff', letterSpacing: '0.1em' }}>
              PROJECTS
            </span>
            <span style={{ fontSize: '0.65rem', color: 'rgba(226,232,240,0.35)' }}>
              {projects.length} TOTAL
            </span>
          </div>

          {loading ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'rgba(226,232,240,0.3)', fontSize: '0.8rem' }}>
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'rgba(226,232,240,0.3)', fontSize: '0.8rem' }}>
              No projects yet. Add your first one above!
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,245,255,0.03)' }}>
                    {['TITLE', 'TECH STACK', 'GITHUB', 'LIVE', 'ACTIONS'].map(h => (
                      <th key={h} style={{
                        padding: '12px 20px', textAlign: 'left',
                        color: 'rgba(0,245,255,0.5)', fontSize: '0.6rem',
                        fontWeight: 600, letterSpacing: '0.15em',
                        borderBottom: '1px solid rgba(0,245,255,0.06)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map((p, i) => (
                    <motion.tr
                      key={p._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <td style={{ padding: '14px 20px', color: '#e2e8f0', fontWeight: 600 }}>
                        {p.title}
                      </td>
                      <td style={{ padding: '14px 20px', color: 'rgba(226,232,240,0.5)', maxWidth: 200 }}>
                        {(p.techStack || []).join(', ') || '—'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {p.githubLink ? (
                          <a href={p.githubLink} target="_blank" rel="noreferrer"
                            style={{ color: '#9000ff', textDecoration: 'none', fontSize: '0.7rem' }}>
                            GitHub ↗
                          </a>
                        ) : <span style={{ color: 'rgba(226,232,240,0.2)' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        {p.liveDemo ? (
                          <a href={p.liveDemo} target="_blank" rel="noreferrer"
                            style={{ color: '#00f5ff', textDecoration: 'none', fontSize: '0.7rem' }}>
                            Live ↗
                          </a>
                        ) : <span style={{ color: 'rgba(226,232,240,0.2)' }}>—</span>}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => handleEdit(p)}
                            style={{
                              padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                              background: 'rgba(120,0,255,0.1)',
                              border: '1px solid rgba(120,0,255,0.3)',
                              color: '#b060ff', fontSize: '0.68rem',
                              fontFamily: 'JetBrains Mono, monospace',
                            }}
                          >Edit</button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            disabled={deletingId === p._id}
                            style={{
                              padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
                              background: 'rgba(255,0,80,0.08)',
                              border: '1px solid rgba(255,0,80,0.25)',
                              color: '#ff3366', fontSize: '0.68rem',
                              fontFamily: 'JetBrains Mono, monospace',
                              opacity: deletingId === p._id ? 0.5 : 1,
                            }}
                          >{deletingId === p._id ? '...' : 'Delete'}</button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
