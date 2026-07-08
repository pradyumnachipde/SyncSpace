import { useNavigate } from 'react-router-dom';
import { FiUsers, FiArrowRight } from 'react-icons/fi';

const TeamCard = ({ team, currentUserId }) => {
  const navigate = useNavigate();
  const isOwner = team.owner?._id === currentUserId;

  return (
    <div
      className="card card-hoverable fade-in-up"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/teams/${team._id}`)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3>{team.name}</h3>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
            {team.description || 'No description provided'}
          </p>
        </div>
        {isOwner && <span className="badge badge-priority-medium">Owner</span>}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'var(--space-5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="text-muted">
          <FiUsers size={14} />
          <span style={{ fontSize: '0.82rem' }}>
            {team.members?.length || 0} member{team.members?.length === 1 ? '' : 's'}
          </span>
        </div>
        <FiArrowRight color="var(--color-primary)" />
      </div>
    </div>
  );
};

export default TeamCard;
