import { useState, useEffect, useRef } from 'react';
import React from 'react';
import CityScene from '../components/scene/CityScene';
import ProjectPanel from '../components/ui/ProjectPanel';
import Loader from '../components/ui/Loader';
import { useProjects } from '../hooks/useProjects';

export default function Home() {
  const { projects, loading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef(0); // raw accumulated scroll value

  // Track wheel events for camera movement — no blocking overlay needed
  useEffect(() => {
    const handleWheel = (e) => {
      scrollRef.current = Math.max(0, Math.min(1, scrollRef.current + e.deltaY * 0.0005));
      setScrollProgress(scrollRef.current);
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  // Keyboard navigation for buildings
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!projects || projects.length === 0) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSelectedProject((prev) => {
          if (!prev) return projects[0];
          const idx = projects.findIndex(p => p._id === prev._id);
          return projects[(idx + 1) % projects.length];
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSelectedProject((prev) => {
          if (!prev) return projects[projects.length - 1];
          const idx = projects.findIndex(p => p._id === prev._id);
          return projects[(idx - 1 + projects.length) % projects.length];
        });
      } else if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projects]);

  const handleBuildingClick = (project) => {
    setSelectedProject((prev) => (prev?._id === project._id ? null : project));
  };

  const handleClosePanel = () => setSelectedProject(null);

  if (loading) return <Loader />;

  if (error) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', flexDirection: 'column', gap: 16,
      background: '#030712', color: '#ff00aa',
    }}>
      <span style={{ fontSize: '2rem' }}>⚠️</span>
      <p className="font-orbitron" style={{ fontSize: '0.9rem' }}>
        Failed to connect to API: {error}
      </p>
      <p style={{ fontSize: '0.78rem', color: 'rgba(226,232,240,0.4)' }}>
        Make sure the backend is running on port 5000
      </p>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* 3D City Canvas — fills viewport, directly receives pointer events */}
      <CityScene
        projects={projects}
        onBuildingClick={handleBuildingClick}
        selectedProject={selectedProject}
        scrollProgress={scrollProgress}
      />

      {/* HUD overlay — pointer-events: none so canvas is clickable underneath */}
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Bottom left project count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            position: 'fixed', bottom: 24, left: 24,
            padding: '12px 20px', borderRadius: 12,
            background: 'rgba(8, 12, 26, 0.7)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            pointerEvents: 'none',
          }}
        >
          <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>
            PROJECTS ONLINE
          </div>
          <div className="font-orbitron" style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 700 }}>
            {projects.length.toString().padStart(2, '0')}
          </div>
        </motion.div>

        {/* Bottom right instructions */}
        {!selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="hud-instructions"
            style={{
              position: 'fixed', bottom: 24, right: 24,
              padding: '12px 16px', borderRadius: 12,
              background: 'rgba(8, 12, 26, 0.7)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              fontFamily: 'JetBrains Mono', fontSize: '0.68rem',
              color: 'rgba(226,232,240,0.4)',
              lineHeight: 1.8, pointerEvents: 'none',
            }}
          >
            <div>🖱️ <span style={{ color: '#00f5ff' }}>Hover</span> building → glow</div>
            <div>🖱️ <span style={{ color: '#ff00aa' }}>Click</span> building → details</div>
            <div>📜 <span style={{ color: '#9000ff' }}>Scroll</span> → fly through city</div>
            <div>⌨️ <span style={{ color: '#00ff88' }}>Arrows</span> → next project</div>
          </motion.div>
        )}

        {/* Top center title (if no panel) */}
        {!selectedProject && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="hud-title-container"
            style={{ pointerEvents: 'none' }}
          >
            <h1
              className="font-orbitron gradient-text"
              style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '0.1em' }}
            >
              TECH CITY
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.35)', letterSpacing: '0.2em', marginTop: 4 }}>
              CLICK A BUILDING TO EXPLORE
            </p>
          </motion.div>
        )}
      </div>

      {/* Project Panel — slides in from right, has its own pointer-events */}
      <ProjectPanel project={selectedProject} onClose={handleClosePanel} />
    </div>
  );
}
