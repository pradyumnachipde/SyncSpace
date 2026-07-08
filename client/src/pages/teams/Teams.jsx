import { useState } from 'react';
import { FiPlus, FiUserPlus, FiUsers } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useTeams from '../../hooks/useTeams';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import TeamCard from '../../components/team/TeamCard';
import CreateTeamModal from '../../components/team/CreateTeamModal';
import JoinTeamModal from '../../components/team/JoinTeamModal';

const Teams = () => {
  const { user } = useAuth();
  const { teams, loading, refetch } = useTeams();
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  return (
    <div>
      <div className="section-header">
        <div className="section-header__text">
          <h2>Teams</h2>
          <p>Every team you own or belong to.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <Button variant="secondary" icon={<FiUserPlus />} onClick={() => setJoinOpen(true)}>
            Join team
          </Button>
          <Button variant="primary" icon={<FiPlus />} onClick={() => setCreateOpen(true)}>
            Create team
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="page-loader">
          <Spinner size="lg" />
        </div>
      ) : teams.length === 0 ? (
        <EmptyState
          icon={<FiUsers />}
          title="No teams yet"
          text="Create your first team or join one with an invite code to get started."
          action={
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <Button variant="secondary" onClick={() => setJoinOpen(true)}>
                Join team
              </Button>
              <Button variant="primary" onClick={() => setCreateOpen(true)}>
                Create team
              </Button>
            </div>
          }
        />
      ) : (
        <div className="card-grid">
          {teams.map((team) => (
            <TeamCard key={team._id} team={team} currentUserId={user?.id} />
          ))}
        </div>
      )}

      <CreateTeamModal isOpen={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => refetch()} />
      <JoinTeamModal isOpen={joinOpen} onClose={() => setJoinOpen(false)} onJoined={() => refetch()} />
    </div>
  );
};

export default Teams;
