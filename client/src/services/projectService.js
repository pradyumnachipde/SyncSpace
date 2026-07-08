import api from '../api/axios';

const getProjects = async (teamId) => {
  const response = await api.get('/projects', { params: teamId ? { team: teamId } : {} });
  return response.data.data.projects;
};

const getProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data.data.project;
};

const createProject = async (payload) => {
  const response = await api.post('/projects', payload);
  return response.data.data.project;
};

export default { getProjects, getProjectById, createProject };
