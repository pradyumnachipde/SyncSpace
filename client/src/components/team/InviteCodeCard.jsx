import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiCopy, FiCheck } from 'react-icons/fi';

const InviteCodeCard = ({ inviteCode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success('Invite code copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy the code');
    }
  };

  return (
    <div className="invite-code-chip">
      <span className="invite-code-chip__code">{inviteCode}</span>
      <button type="button" className="btn btn-ghost btn-sm btn-icon" onClick={handleCopy} aria-label="Copy invite code">
        {copied ? <FiCheck color="var(--color-success)" /> : <FiCopy />}
      </button>
    </div>
  );
};

export default InviteCodeCard;
