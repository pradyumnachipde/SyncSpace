import { useState, useEffect, useCallback } from 'react';
import teamService from '../services/teamService';

// Fetches a single team's details
const useTeam = (teamId) => {
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTeam = useCallback(async () => {
    if (!teamId) return;
    try {
      setLoading(true);
      const data = await teamService.getTeamById(teamId);
      setTeam(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load team');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return { team, loading, error, refetch: fetchTeam };
};

export default useTeam;
