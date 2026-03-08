// eslint-disable-next-line
import { motion, AnimatePresence } from 'framer-motion';

const TECH_COLORS = {
  React: '#61dafb', 'Node.js': '#68a063', MongoDB: '#4db33d',
  'Next.js': '#ffffff', TypeScript: '#3178c6', Python: '#3572a5',
  Docker: '#2496ed', Kubernetes: '#326ce5', AWS: '#ff9900',
  GraphQL: '#e535ab', 'Vue.js': '#42b883', 'Tailwind CSS': '#38bdf8',
  'Three.js': '#049ef4', WebGL: '#990000', Redis: '#dc382d',
  PostgreSQL: '#336791', 'Socket.io': '#ffffff', 'Web3.js': '#f16822',
  Solidity: '#363636', FastAPI: '#009688', TensorFlow: '#ff6f00',
  InfluxDB: '#22adf6', MQTT: '#660066', 'Chart.js': '#ff6384',
  OpenAI: '#412991', 'React Three Fiber': '#049ef4', 'Framer Motion': '#bb4b96',
};

function TechBadge({ tech }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: '5px 12px', borderRadius: 12,
        fontSize: '0.65rem', fontWeight: 600,
        letterSpacing: '0.05em',
        fontFamily: 'Inter, sans-serif',
        background: `linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))`,
        border: `1px solid rgba(255,255,255,0.1)`,
        color: '#fff',
        boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
        margin: 4,
      }}
    >
      {tech}
    </motion.span>
  );
}

export default function ProjectPanel({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 20,
              background: 'rgba(3,7,18,0.35)',
              backdropFilter: 'blur(3px)',
            }}
          />

          {/* Details Panel (Bottom Right) */}
          <motion.div
            key="details-panel"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="project-panel-container"
            style={{
              zIndex: 30,
              borderRadius: 22,
              overflow: 'hidden',
              background: 'rgba(8, 12, 26, 0.85)',
              backdropFilter: 'blur(40px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
            }}
          >
            {/* ── Image header ─────────────────────────── */}
            <div style={{ position: 'relative', height: 180, flexShrink: 0, overflow: 'hidden', background: '#000' }}>
              {project.image ? (
                <motion.img
                  src={project.image}
                  alt={project.title}
                  initial={{ scale: 1.08 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.parentElement.style.background = 'linear-gradient(135deg, #0a1230, #1a0530)'; e.target.remove(); }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, #0a1230, #1a0530, #0a1220)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '4rem',
                }}>🏙️</div>
              )}

              {/* Bottom gradient */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
                background: 'linear-gradient(transparent, rgba(8,12,26,0.97))',
              }} />

              {/* Top gradient + close button */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 60,
                background: 'linear-gradient(rgba(8,12,26,0.4), transparent)',
                display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start',
                padding: '12px 14px',
              }}>
                <motion.button
                  whileHover={{ scale: 1.15, background: 'rgba(255,0,170,0.25)', borderColor: '#ff00aa' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff', fontSize: '1.2rem',
                    cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                  }}
                >×</motion.button>
              </div>
            </div>

            {/* ── Scrollable content/right side ─────────────────── */}
            <div className="project-panel-content">

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-inter"
                style={{
                  fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
                  fontWeight: 700, marginBottom: 8,
                  paddingTop: 4, color: '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                {project.title}
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
                style={{
                  fontSize: '0.845rem', lineHeight: 1.75,
                  color: 'rgba(226,232,240,0.65)',
                  marginBottom: 20,
                }}
              >
                {project.description}
              </motion.p>

              {/* Tech Stack */}
              {project.techStack?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  style={{ marginBottom: 20 }}
                >
                  <div style={{
                    fontSize: '0.6rem', fontWeight: 700,
                    color: 'rgba(226,232,240,0.3)', letterSpacing: '0.14em',
                    fontFamily: 'JetBrains Mono, monospace', marginBottom: 10,
                  }}>
                    ◈ TECH STACK
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {project.techStack.map((tech) => (
                      <TechBadge key={tech} tech={tech} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Position badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.72rem', color: 'rgba(226,232,240,0.7)',
                  marginBottom: 22,
                }}
              >
                <span style={{ fontSize: '0.85rem' }}>📍</span>
                <span>
                  x={project.position?.x} &nbsp; y={project.position?.y} &nbsp; z={project.position?.z}
                </span>
              </motion.div>

              {/* CTA Links */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26 }}
                style={{ display: 'flex', gap: 10 }}
              >
                {project.githubLink && (
                  <a href={project.githubLink} target="_blank" rel="noreferrer"
                    style={{ textDecoration: 'none', flex: 1 }}>
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 0 18px rgba(0,245,255,0.25)' }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: '100%', padding: '11px 16px',
                        borderRadius: 11, background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff', cursor: 'pointer',
                        fontSize: '0.8rem', fontWeight: 600,
                        letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* GitHub icon */}
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      GitHub
                    </motion.button>
                  </a>
                )}

                {project.liveDemo && (
                  <a href={project.liveDemo} target="_blank" rel="noreferrer"
                    style={{ textDecoration: 'none', flex: 1 }}>
                    <motion.button
                      whileHover={{ scale: 1.03, boxShadow: '0 0 18px rgba(144,0,255,0.3)' }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        width: '100%', padding: '11px 16px',
                        borderRadius: 11,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1))',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff', cursor: 'pointer',
                        fontSize: '0.8rem', fontWeight: 600,
                        letterSpacing: '0.04em', fontFamily: 'Inter, sans-serif',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        transition: 'all 0.2s',
                      }}
                    >
                      ↗ Live Demo
                    </motion.button>
                  </a>
                )}
              </motion.div>

            </div>
          </motion.div>

          {/* Video Pop-up (Top Left) */}
          {project.demoVideo && (
            <motion.div
              key="video-panel"
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 260, delay: 0.1 }}
              className="video-panel-container"
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 40,
                background: 'linear-gradient(rgba(8,12,26,0.8), transparent)',
                zIndex: 10, display: 'flex', alignItems: 'center', padding: '0 16px',
                pointerEvents: 'none',
              }}>
                <span style={{
                  fontFamily: 'JetBrains Mono', fontSize: '0.65rem',
                  color: '#00f5ff', letterSpacing: '0.1em', fontWeight: 600,
                  textShadow: '0 0 10px rgba(0,245,255,0.5)'
                }}>
                  ● LIVE BROADCAST
                </span>
              </div>
              <iframe
                src={project.demoVideo}
                title={`${project.title} Demo`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
