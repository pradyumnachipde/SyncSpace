import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiUser, FiUsers, FiTrello } from 'react-icons/fi';
import useProject from '../../hooks/useProject';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

const formatDate = (date) => {
  if (!date) return 'Not set';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, loading } = useProject(projectId);

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return <EmptyState title="Project not found" text="This project doesn't exist or you don't have access to it." />;
  }

  return (
    <div>
      <Link
        to="/projects"
        className="text-muted"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: 'var(--space-4)' }}
      >
        <FiArrowLeft size={14} /> Back to projects
      </Link>

      <div className="section-header">
        <div className="section-header__text">
          <h2>{project.name}</h2>
          <p>{project.description || 'No description provided'}</p>
        </div>
        <Button variant="primary" icon={<FiTrello />} onClick={() => navigate(`/projects/${project._id}/board`)}>
          Open task board
        </Button>
      </div>

      <div className="card-grid">
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span className="stat-card__icon stat-card__icon--primary">
            <FiUsers />
          </span>
          <div>
            <p style={{ fontWeight: 600 }}>{project.team?.name}</p>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Team</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span className="stat-card__icon stat-card__icon--muted">
            <FiUser />
          </span>
          <div>
            <p style={{ fontWeight: 600 }}>{project.createdBy?.name}</p>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Created by</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span className="stat-card__icon stat-card__icon--accent">
            <FiCalendar />
          </span>
          <div>
            <p style={{ fontWeight: 600 }}>{formatDate(project.startDate)}</p>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Start date</p>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <span className="stat-card__icon stat-card__icon--success">
            <FiCalendar />
          </span>
          <div>
            <p style={{ fontWeight: 600 }}>{formatDate(project.endDate)}</p>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Deadline</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
