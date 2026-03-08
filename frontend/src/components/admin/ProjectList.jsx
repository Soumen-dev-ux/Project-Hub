import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectList({ projects, onEdit, onDelete }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <AnimatePresence>
        {projects.map((project, i) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              borderRadius: 14,
              background: 'rgba(10,15,30,0.7)',
              border: '1px solid rgba(0,245,255,0.1)',
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 16,
              backdropFilter: 'blur(16px)',
              transition: 'border-color 0.2s',
            }}
            whileHover={{ borderColor: 'rgba(0,245,255,0.3)' }}
          >
            {/* Image thumbnail */}
            <div style={{
              width: 56, height: 56, borderRadius: 10, overflow: 'hidden',
              flexShrink: 0, border: '1px solid rgba(0,245,255,0.1)',
              background: 'rgba(10,15,30,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {project.image ? (
                <img src={project.image} alt={project.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <span style={{ fontSize: '1.5rem' }}>🏙️</span>
              )}
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="font-orbitron" style={{
                fontSize: '0.9rem', fontWeight: 600, color: '#00f5ff',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {project.title}
              </div>
              <div style={{
                fontSize: '0.75rem', color: 'rgba(226,232,240,0.45)',
                marginTop: 3, fontFamily: 'JetBrains Mono',
              }}>
                ({project.position?.x}, {project.position?.y}, {project.position?.z})
              </div>
              <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {project.techStack?.slice(0, 4).map((t) => (
                  <span key={t} style={{
                    padding: '1px 7px', borderRadius: 999,
                    fontSize: '0.62rem', fontWeight: 600,
                    background: 'rgba(0,245,255,0.07)',
                    border: '1px solid rgba(0,245,255,0.2)',
                    color: 'rgba(0,245,255,0.6)',
                    fontFamily: 'JetBrains Mono',
                  }}>
                    {t}
                  </span>
                ))}
                {project.techStack?.length > 4 && (
                  <span style={{ fontSize: '0.62rem', color: 'rgba(226,232,240,0.3)', padding: '1px 4px' }}>
                    +{project.techStack.length - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onEdit(project)}
                style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid rgba(0,245,255,0.35)',
                  color: '#00f5ff', cursor: 'pointer',
                  fontSize: '0.78rem', fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, background: 'rgba(255,0,85,0.2)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (window.confirm(`Delete "${project.title}"?`)) onDelete(project._id);
                }}
                style={{
                  padding: '7px 14px', borderRadius: 8,
                  background: 'transparent',
                  border: '1px solid rgba(255,0,85,0.35)',
                  color: '#ff4444', cursor: 'pointer',
                  fontSize: '0.78rem', fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {projects.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '48px 0',
          color: 'rgba(226,232,240,0.25)',
          fontFamily: 'JetBrains Mono', fontSize: '0.85rem',
        }}>
          No projects yet. Add your first one!
        </div>
      )}
    </div>
  );
}

export function ProjectListSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{
          height: 90, borderRadius: 14,
          background: 'rgba(10,15,30,0.5)',
          border: '1px solid rgba(0,245,255,0.05)',
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
        }} />
      ))}
    </div>
  );
}
