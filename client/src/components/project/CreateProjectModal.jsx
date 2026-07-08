import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import projectService from '../../services/projectService';

const CreateProjectModal = ({ isOpen, onClose, onCreated, teams, defaultTeamId }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    team: defaultTeamId || '',
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const resetAndClose = () => {
    setForm({ name: '', description: '', team: defaultTeamId || '', startDate: '', endDate: '' });
    setErrors({});
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Project name is required';
    if (!form.team) newErrors.team = 'Please select a team';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSubmitting(true);
      const project = await projectService.createProject(form);
      toast.success('Project created successfully');
      onCreated?.(project);
      resetAndClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Create a new project" isOpen={isOpen} onClose={resetAndClose}>
      <form onSubmit={handleSubmit}>
        <Input
          id="project-name"
          label="Project name"
          placeholder="e.g. Website Redesign"
          value={form.name}
          onChange={handleChange('name')}
          error={errors.name}
        />

        <div className="form-group">
          <label className="form-label" htmlFor="project-team">
            Team
          </label>
          <select
            id="project-team"
            className={`form-select ${errors.team ? 'has-error' : ''}`}
            value={form.team}
            onChange={handleChange('team')}
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>
                {team.name}
              </option>
            ))}
          </select>
          {errors.team && <span className="form-error">{errors.team}</span>}
        </div>

        <Input
          id="project-description"
          label="Description (optional)"
          as="textarea"
          rows={3}
          placeholder="What is this project about?"
          value={form.description}
          onChange={handleChange('description')}
        />

        <div className="form-row">
          <Input
            id="project-start"
            label="Start date"
            type="date"
            value={form.startDate}
            onChange={handleChange('startDate')}
          />
          <Input
            id="project-end"
            label="Deadline"
            type="date"
            value={form.endDate}
            onChange={handleChange('endDate')}
          />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <Button type="button" variant="secondary" block onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" block loading={submitting}>
            Create project
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
