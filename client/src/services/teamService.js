import api from '../api/axios';

const getTeams = async () => {
  const response = await api.get('/teams');
  return response.data.data.teams;
};

const getTeamById = async (id) => {
  const response = await api.get(`/teams/${id}`);
  return response.data.data.team;
};

const createTeam = async (payload) => {
  const response = await api.post('/teams', payload);
  return response.data.data.team;
};

const joinTeam = async (inviteCode) => {
  const response = await api.post('/teams/join', { inviteCode });
  return response.data.data.team;
};

const leaveTeam = async (id) => {
  const response = await api.delete(`/teams/${id}/leave`);
  return response.data;
};

export default { getTeams, getTeamById, createTeam, joinTeam, leaveTeam };
