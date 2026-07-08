const MemberCard = ({ member, isOwner }) => {
  const initials = member.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className="card"
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)' }}
    >
      <span className="avatar avatar-md">{initials}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{member.name}</p>
        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
          {member.email}
        </p>
      </div>
      {isOwner && <span className="badge badge-priority-medium">Owner</span>}
    </div>
  );
};

export default MemberCard;
