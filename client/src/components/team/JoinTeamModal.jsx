import { useState } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import teamService from '../../services/teamService';

const JoinTeamModal = ({ isOpen, onClose, onJoined }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const resetAndClose = () => {
    setInviteCode('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inviteCode.trim()) {
      setError('Invite code is required');
      return;
    }

    try {
      setSubmitting(true);
      const team = await teamService.joinTeam(inviteCode.trim().toUpperCase());
      toast.success(`You joined ${team.name}`);
      onJoined?.(team);
      resetAndClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join team');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title="Join a team" isOpen={isOpen} onClose={resetAndClose}>
      <form onSubmit={handleSubmit}>
        <Input
          id="invite-code"
          label="Invite code"
          placeholder="e.g. 7QK4P2XA"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
          error={error}
          className="mono"
          maxLength={8}
        />
        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <Button type="button" variant="secondary" block onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" block loading={submitting}>
            Join team
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JoinTeamModal;
