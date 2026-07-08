import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiFolder, FiLogOut, FiPlus, FiArrowLeft } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useTeam from '../../hooks/useTeam';
import useProjects from '../../hooks/useProjects';
import teamService from '../../services/teamService';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import MemberCard from '../../components/team/MemberCard';
import InviteCodeCard from '../../components/team/InviteCodeCard';
import ProjectCard from '../../components/project/ProjectCard';
import CreateProjectModal from '../../components/project/CreateProjectModal';

const TeamDetails = () => {
  const { teamId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { team, loading } = useTeam(teamId);
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjects(teamId);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleLeave = async () => {
    if (!window.confirm(`Leave ${team.name}? You'll need a new invite code to rejoin.`)) return;

    try {
      setLeaving(true);
      await teamService.leaveTeam(teamId);
      toast.success('You left the team');
      navigate('/teams');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to leave team');
    } finally {
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loader">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!team) {
    return (
      <EmptyState title="Team not found" text="This team doesn't exist or you don't have access to it." />
    );
  }

  const isOwner = team.owner?._id === user?.id;

  return (
    <div>
      <Link to="/teams" className="text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: 'var(--space-4)' }}>
        <FiArrowLeft size={14} /> Back to teams
      </Link>

      <div className="section-header">
        <div className="section-header__text">
          <h2>{team.name}</h2>
          <p>{team.description || 'No description provided'}</p>
        </div>
        {!isOwner && (
          <Button variant="danger" icon={<FiLogOut />} loading={leaving} onClick={handleLeave}>
            Leave team
          </Button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Projects</h3>
            <Button variant="secondary" size="sm" icon={<FiPlus />} onClick={() => setCreateProjectOpen(true)}>
              New project
            </Button>
          </div>

          {projectsLoading ? (
            <Spinner />
          ) : projects.length === 0 ? (
            <EmptyState
              icon={<FiFolder />}
              title="No projects yet"
              text="Create the first project for this team."
            />
          ) : (
            <div className="card-grid">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ marginBottom: 'var(--space-4)' }}>Invite code</h3>
          <InviteCodeCard inviteCode={team.inviteCode} />

          <h3 style={{ margin: 'var(--space-6) 0 var(--space-4)' }}>
            Members ({team.members?.length || 0})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {team.members?.map((member) => (
              <MemberCard key={member._id} member={member} isOwner={member._id === team.owner?._id} />
            ))}
          </div>
        </div>
      </div>

      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onCreated={() => refetchProjects()}
        teams={[team]}
        defaultTeamId={team._id}
      />
    </div>
  );
};

export default TeamDetails;
