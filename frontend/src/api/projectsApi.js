import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tech-city-3j3r.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getProjects = () => api.get('/projects');
export const createProject = (data, config) => api.post('/projects', data, config);
export const updateProject = (id, data, config) => api.put(`/projects/${id}`, data, config);
export const deleteProject = (id, config) => api.delete(`/projects/${id}`, config);
