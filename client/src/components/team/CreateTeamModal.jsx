import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import teamService from '../../services/teamService';

const CreateTeamModal = ({ isOpen, onClose, onCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const resetAndClose = () => {
    setName('');
    setDescription('');
    setErrors({});
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setErrors({ name: 'Team name is required' });
      return;
    }

    try {
      setSubmitting(true);
      const team = await teamService.createTeam({ name, description });
      toast.success('Team created successfully');
      onCreated?.(team);
      resetAndClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create team');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Create a new team" isOpen={isOpen} onClose={resetAndClose}>
      <form onSubmit={handleSubmit}>
        <Input
          id="team-name"
          label="Team name"
          placeholder="e.g. Product Design"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <Input
          id="team-description"
          label="Description (optional)"
          as="textarea"
          rows={3}
          placeholder="What is this team working on?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <Button type="button" variant="secondary" block onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" block loading={submitting}>
            Create team
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTeamModal;
