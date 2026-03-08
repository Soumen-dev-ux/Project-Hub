import { useState, useEffect, useCallback } from 'react';
import { getProjects, createProject, updateProject, deleteProject } from '../api/projectsApi';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const processProjects = useCallback((projectList) => {
    const sorted = [...projectList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted.map((p, index) => {
      // Re-use existing position if we already calculated it, to prevent random jumping on edits,
      // but recompute Z just in case the order changed.
      const existingXOffset = p.position?.x ? Math.abs(p.position.x) : (3.5 + Math.random() * 6);
      const z = 8 - (index * 7);
      const side = index % 2 === 0 ? 1 : -1;

      return {
        ...p,
        position: {
          x: side * existingXOffset,
          y: 0,
          z: z
        }
      };
    });
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getProjects();
      setProjects(processProjects(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [processProjects]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (formData) => {
    const { data } = await createProject(formData);
    setProjects((prev) => processProjects([...prev, data]));
    return data;
  };

  const editProject = async (id, formData) => {
    const { data } = await updateProject(id, formData);
    setProjects((prev) => processProjects(prev.map((p) => (p._id === id ? data : p))));
    return data;
  };

  const removeProject = async (id) => {
    await deleteProject(id);
    setProjects((prev) => processProjects(prev.filter((p) => p._id !== id)));
  };

  return { projects, loading, error, refetch: fetchProjects, addProject, editProject, removeProject };
}
