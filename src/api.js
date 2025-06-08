import axios from 'axios';

// Use VITE_API_BASE in production, fallback to /api in development
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api'
});

export const getTeams      = year => API.get(`/teams?year=${year}`);
export const getTeamById   = id   => API.get(`/teams/${id}`);
export const getPlayers    = year => API.get(`/players?year=${year}`);
export const getPlayerById = id   => API.get(`/players/${id}`);
export const getLeaderboard= ()   => API.get('/leaderboard');

// For admin (later, with JWT):
export const createTeam    = (data, token) => API.post('/admin/teams', data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const createPlayer  = (data, token) => API.post('/admin/players', data, {
  headers: { Authorization: `Bearer ${token}` }
});
export const linkAccount   = (playerId, data, token) =>
  API.post(`/admin/players/${playerId}/accounts`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
export const addMatch      = (teamId, data, token) =>
  API.post(`/admin/teams/${teamId}/matches`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
