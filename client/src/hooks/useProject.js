import { useState, useEffect, useCallback } from 'react';
import projectService from '../services/projectService';

// Fetches a single project's details
const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const data = await projectService.getProjectById(projectId);
      setProject(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, loading, error, refetch: fetchProject };
};

export default useProject;
