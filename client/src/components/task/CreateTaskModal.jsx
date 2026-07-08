import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import taskService from '../../services/taskService';

const emptyForm = {
  title: '',
  description: '',
  assignedTo: '',
  priority: 'Medium',
  dueDate: '',
};

const CreateTaskModal = ({ isOpen, onClose, onSaved, projectId, members = [], task }) => {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const isEditMode = Boolean(task);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        assignedTo: task.assignedTo?._id || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
      });
    } else {
      setForm(emptyForm);
    }
  }, [task, isOpen]);

  const resetAndClose = () => {
    setForm(emptyForm);
    setErrors({});
    onClose();
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setErrors({ title: 'Task title is required' });
      return;
    }

    try {
      setSubmitting(true);
      let savedTask;

      if (isEditMode) {
        savedTask = await taskService.updateTask(task._id, form);
        toast.success('Task updated successfully');
      } else {
        savedTask = await taskService.createTask({ ...form, project: projectId });
        toast.success('Task created successfully');
      }

      onSaved?.(savedTask, isEditMode);
      resetAndClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal title={isEditMode ? 'Edit task' : 'Create a new task'} isOpen={isOpen} onClose={resetAndClose}>
      <form onSubmit={handleSubmit}>
        <Input
          id="task-title"
          label="Title"
          placeholder="e.g. Design the login screen"
          value={form.title}
          onChange={handleChange('title')}
          error={errors.title}
        />

        <Input
          id="task-description"
          label="Description (optional)"
          as="textarea"
          rows={3}
          placeholder="Add more detail about this task"
          value={form.description}
          onChange={handleChange('description')}
        />

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="task-assignee">
              Assignee
            </label>
            <select id="task-assignee" className="form-select" value={form.assignedTo} onChange={handleChange('assignedTo')}>
              <option value="">Unassigned</option>
              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-priority">
              Priority
            </label>
            <select id="task-priority" className="form-select" value={form.priority} onChange={handleChange('priority')}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <Input id="task-due" label="Due date (optional)" type="date" value={form.dueDate} onChange={handleChange('dueDate')} />

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
          <Button type="button" variant="secondary" block onClick={resetAndClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" block loading={submitting}>
            {isEditMode ? 'Save changes' : 'Create task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
