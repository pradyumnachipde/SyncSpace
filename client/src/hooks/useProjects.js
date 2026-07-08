import { useState, useEffect, useCallback } from 'react';
import projectService from '../services/projectService';

// Fetches all projects, optionally scoped to a single team
const useProjects = (teamId) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const data = await projectService.getProjects(teamId);
      setProjects(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
};

export default useProjects;
