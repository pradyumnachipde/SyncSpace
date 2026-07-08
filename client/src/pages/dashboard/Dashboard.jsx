import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiFolder,
  FiCheckSquare,
  FiCheckCircle,
  FiPlus,
  FiUserPlus,
  FiActivity,
  FiClock,
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useTeams from '../../hooks/useTeams';
import useProjects from '../../hooks/useProjects';
import taskService from '../../services/taskService';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import CreateTeamModal from '../../components/team/CreateTeamModal';
import CreateProjectModal from '../../components/project/CreateProjectModal';

const timeAgo = (date) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { teams, loading: teamsLoading, refetch: refetchTeams } = useTeams();
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjects();

  const [allTasks, setAllTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  useEffect(() => {
    const loadAllTasks = async () => {
      if (projectsLoading) return;

      if (projects.length === 0) {
        setAllTasks([]);
        setTasksLoading(false);
        return;
      }

      try {
        setTasksLoading(true);
        const results = await Promise.all(
          projects.map((project) =>
            taskService.getTasks(project._id).then((tasks) =>
              tasks.map((task) => ({ ...task, projectName: project.name }))
            )
          )
        );
        setAllTasks(results.flat());
      } finally {
        setTasksLoading(false);
      }
    };

    loadAllTasks();
  }, [projects, projectsLoading]);

  const stats = useMemo(() => {
    const completed = allTasks.filter((task) => task.status === 'Done').length;
    return {
      teams: teams.length,
      projects: projects.length,
      tasks: allTasks.length,
      completed,
    };
  }, [teams, projects, allTasks]);

  const recentActivity = useMemo(() => {
    return [...allTasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [allTasks]);

  const loading = teamsLoading || projectsLoading || tasksLoading;

  return (
    <div>
      <div className="page-header">
        <h2>Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
        <p className="text-muted">Here's what's happening across your teams today.</p>
      </div>

      {loading ? (
        <div className="page-loader">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="card-grid" style={{ marginBottom: 'var(--space-6)' }}>
            <div className="stat-card">
              <span className="stat-card__icon stat-card__icon--primary">
                <FiUsers />
              </span>
              <div>
                <p className="stat-card__value">{stats.teams}</p>
                <p className="stat-card__label">Total teams</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-card__icon stat-card__icon--accent">
                <FiFolder />
              </span>
              <div>
                <p className="stat-card__value">{stats.projects}</p>
                <p className="stat-card__label">Total projects</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-card__icon stat-card__icon--muted">
                <FiCheckSquare />
              </span>
              <div>
                <p className="stat-card__value">{stats.tasks}</p>
                <p className="stat-card__label">Total tasks</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-card__icon stat-card__icon--success">
                <FiCheckCircle />
              </span>
              <div>
                <p className="stat-card__value">{stats.completed}</p>
                <p className="stat-card__label">Completed tasks</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-5)' }}>
            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Quick actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Button variant="secondary" icon={<FiPlus />} onClick={() => setCreateTeamOpen(true)}>
                  Create a new team
                </Button>
                <Button variant="secondary" icon={<FiFolder />} onClick={() => setCreateProjectOpen(true)}>
                  Create a new project
                </Button>
                <Button variant="secondary" icon={<FiUserPlus />} onClick={() => navigate('/teams')}>
                  Join a team with an invite code
                </Button>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Recent activity</h3>
              {recentActivity.length === 0 ? (
                <EmptyState
                  icon={<FiActivity />}
                  title="No activity yet"
                  text="Create a task to see it show up here."
                />
              ) : (
                <div className="activity-list">
                  {recentActivity.map((task) => (
                    <div className="activity-item" key={task._id}>
                      <span className="activity-item__icon">
                        <FiCheckSquare size={14} />
                      </span>
                      <div>
                        <p className="activity-item__text">
                          <strong>{task.title}</strong> was added to {task.projectName}
                        </p>
                        <p className="activity-item__time">
                          <FiClock size={11} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                          {timeAgo(task.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <CreateTeamModal
        isOpen={createTeamOpen}
        onClose={() => setCreateTeamOpen(false)}
        onCreated={() => refetchTeams()}
      />
      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onCreated={() => refetchProjects()}
        teams={teams}
      />
    </div>
  );
};

export default Dashboard;
