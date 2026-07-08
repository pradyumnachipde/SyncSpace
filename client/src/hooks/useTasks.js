import { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';

// Manages the full task list for a project, including optimistic status updates
const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const data = await taskService.getTasks(projectId);
      setTasks(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Updates status locally right away, then confirms with the server
  const moveTask = async (taskId, newStatus) => {
    const previousTasks = tasks;
    setTasks((current) =>
      current.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task))
    );

    try {
      await taskService.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      setTasks(previousTasks);
      throw err;
    }
  };

  const removeTask = async (taskId) => {
    const previousTasks = tasks;
    setTasks((current) => current.filter((task) => task._id !== taskId));

    try {
      await taskService.deleteTask(taskId);
    } catch (err) {
      setTasks(previousTasks);
      throw err;
    }
  };

  return { tasks, loading, error, refetch: fetchTasks, moveTask, removeTask, setTasks };
};

export default useTasks;
