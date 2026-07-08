import { useState } from 'react';
import TaskCard from './TaskCard';

const statusDotColor = {
  Todo: 'var(--color-muted)',
  'In Progress': 'var(--color-primary)',
  Done: 'var(--color-success)',
};

const KanbanColumn = ({ status, tasks, draggingTaskId, onDragStart, onDragEnd, onDropTask, onEdit, onDelete }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    onDropTask(status);
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'is-drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="kanban-column__header">
        <span className="kanban-column__title">
          <span className="kanban-column__dot" style={{ backgroundColor: statusDotColor[status] }} />
          {status}
        </span>
        <span className="kanban-column__count">{tasks.length}</span>
      </div>

      <div className="kanban-column__list">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            isDragging={draggingTaskId === task._id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
