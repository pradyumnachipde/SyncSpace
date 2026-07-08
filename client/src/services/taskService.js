import api from '../api/axios';

const getTasks = async (projectId) => {
  const response = await api.get('/tasks', { params: { project: projectId } });
  return response.data.data.tasks;
};

const createTask = async (payload) => {
  const response = await api.post('/tasks', payload);
  return response.data.data.task;
};

const updateTask = async (id, payload) => {
  const response = await api.put(`/tasks/${id}`, payload);
  return response.data.data.task;
};

const updateTaskStatus = async (id, status) => {
  const response = await api.put(`/tasks/${id}/status`, { status });
  return response.data.data.task;
};

const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export default { getTasks, createTask, updateTask, updateTaskStatus, deleteTask };
