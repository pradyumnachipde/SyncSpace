import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiFolder } from 'react-icons/fi';

const formatDate = (date) => {
  if (!date) return 'No deadline';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      className="card card-hoverable fade-in-up"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
        <span className="stat-card__icon stat-card__icon--primary" style={{ width: 36, height: 36, fontSize: '1rem' }}>
          <FiFolder />
        </span>
        <h3 style={{ fontSize: '1.05rem' }}>{project.name}</h3>
      </div>

      <p className="text-muted" style={{ fontSize: '0.85rem', minHeight: '2.6em' }}>
        {project.description || 'No description provided'}
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-4)',
          borderTop: '1px solid var(--color-border)',
        }}
      >
        <span className="badge badge-status-todo">{project.team?.name || 'Team'}</span>
        <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.8rem' }}>
          <FiCalendar size={13} />
          {formatDate(project.endDate)}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
