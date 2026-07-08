import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPlus } from 'react-icons/fi';
import useProject from '../../hooks/useProject';
import useTasks from '../../hooks/useTasks';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import KanbanColumn from '../../components/task/KanbanColumn';
import CreateTaskModal from '../../components/task/CreateTaskModal';

const STATUSES = ['Todo', 'In Progress', 'Done'];

const TaskBoard = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { project, loading: projectLoading } = useProject(projectId);
  const { tasks, loading: tasksLoading, moveTask, removeTask, refetch, setTasks } = useTasks(projectId);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [draggingTask, setDraggingTask] = useState(null);

  const handleDragStart = (e, task) => {
    setDraggingTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => setDraggingTask(null);

  const handleDrop = async (status) => {
    if (!draggingTask || draggingTask.status === status) {
      setDraggingTask(null);
      return;
    }

    try {
      await moveTask(draggingTask._id, status);
    } catch {
      toast.error('Failed to update task status');
    } finally {
      setDraggingTask(null);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;

    try {
      await removeTask(task._id);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const handleSaved = (savedTask, isEditMode) => {
    if (isEditMode) {
      setTasks((current) => current.map((t) => (t._id === savedTask._id ? savedTask : t)));
    } else {
      setTasks((current) => [savedTask, ...current]);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  if (projectLoading || tasksLoading) {
    return (
      <div className="page-loader">
        <Spinner size="lg" />
      </div>
    );
  }

  const members = project?.team?.members || [];

  return (
    <div>
      <Link
        to={`/projects/${projectId}`}
        className="text-muted"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginBottom: 'var(--space-4)' }}
      >
        <FiArrowLeft size={14} /> Back to project
      </Link>

      <div className="section-header">
        <div className="section-header__text">
          <h2>{project?.name} board</h2>
          <p>Drag tasks between columns to update their status.</p>
        </div>
        <Button variant="primary" icon={<FiPlus />} onClick={() => setModalOpen(true)}>
          New task
        </Button>
      </div>

      <div className="kanban-board">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            draggingTaskId={draggingTask?._id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDropTask={handleDrop}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <CreateTaskModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSaved={handleSaved}
        projectId={projectId}
        members={members}
        task={editingTask}
      />
    </div>
  );
};

export default TaskBoard;
