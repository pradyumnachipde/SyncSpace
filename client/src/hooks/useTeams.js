import { useState, useEffect, useCallback } from 'react';
import teamService from '../services/teamService';

// Fetches every team the current user belongs to
const useTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await teamService.getTeams();
      setTeams(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  return { teams, loading, error, refetch: fetchTeams };
};

export default useTeams;
