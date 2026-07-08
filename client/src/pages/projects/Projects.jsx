import { useState } from 'react';
import { FiPlus, FiFolder } from 'react-icons/fi';
import useTeams from '../../hooks/useTeams';
import useProjects from '../../hooks/useProjects';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import ProjectCard from '../../components/project/ProjectCard';
import CreateProjectModal from '../../components/project/CreateProjectModal';

const Projects = () => {
  const { teams } = useTeams();
  const [teamFilter, setTeamFilter] = useState('');
  const { projects, loading, refetch } = useProjects(teamFilter || undefined);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div>
      <div className="section-header">
        <div className="section-header__text">
          <h2>Projects</h2>
          <p>All projects across the teams you belong to.</p>
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={() => setCreateOpen(true)}>
          Create project
        </Button>
      </div>

      {teams.length > 0 && (
        <div className="form-group" style={{ maxWidth: '260px', marginBottom: 'var(--space-5)' }}>
          <select className="form-select" value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
            <option value="">All teams</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="page-loader">
          <Spinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FiFolder />}
          title="No projects yet"
          text="Create a project inside one of your teams to start tracking tasks."
          action={
            <Button variant="primary" onClick={() => setCreateOpen(true)}>
              Create project
            </Button>
          }
        />
      ) : (
        <div className="card-grid">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => refetch()}
        teams={teams}
      />
    </div>
  );
};

export default Projects;
