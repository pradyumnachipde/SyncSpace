import { FiCalendar, FiEdit2, FiTrash2 } from 'react-icons/fi';

const priorityClass = {
  Low: 'badge-priority-low',
  Medium: 'badge-priority-medium',
  High: 'badge-priority-high',
};

const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const TaskCard = ({ task, onDragStart, onDragEnd, isDragging, onEdit, onDelete }) => {
  const initials = task.assignedTo?.name
    ? task.assignedTo.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : null;

  return (
    <div
      className={`task-card ${isDragging ? 'is-dragging' : ''}`}
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
    >
      <div className="task-card__top">
        <p className="task-card__title">{task.title}</p>
        <span className={`badge ${priorityClass[task.priority]}`}>{task.priority}</span>
      </div>

      {task.description && (
        <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: 'var(--space-2)' }}>
          {task.description.length > 80 ? `${task.description.slice(0, 80)}...` : task.description}
        </p>
      )}

      <div className="task-card__footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          {formatDate(task.dueDate) && (
            <span className="task-card__due">
              <FiCalendar size={12} />
              {formatDate(task.dueDate)}
            </span>
          )}
          <div className="task-card__actions">
            <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(task)} aria-label="Edit task">
              <FiEdit2 size={13} />
            </button>
            <button type="button" className="btn btn-ghost btn-icon btn-sm" onClick={() => onDelete(task)} aria-label="Delete task">
              <FiTrash2 size={13} color="var(--color-danger)" />
            </button>
          </div>
        </div>
        {initials && <span className="avatar avatar-sm">{initials}</span>}
      </div>
    </div>
  );
};

export default TaskCard;
