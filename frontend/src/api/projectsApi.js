import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tech-city-3j3r.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getProjects = () => api.get('/projects');
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.put(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);
