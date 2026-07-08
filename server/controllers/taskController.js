const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');

// Helper: confirms the current user belongs to the team that owns a project
const assertProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId).populate('team', 'members');
  if (!project) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const isMember = project.team.members.some(
    (memberId) => memberId.toString() === userId.toString()
  );
  if (!isMember) {
    const error = new Error('You are not a member of this project\'s team');
    error.statusCode = 403;
    throw error;
  }

  return project;
};

// @desc    Get all tasks for a project
// @route   GET /api/tasks?project=<projectId>
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { project } = req.query;

    if (!project) {
      return res.status(400).json({ success: false, message: 'A project query parameter is required' });
    }

    await assertProjectAccess(project, req.user._id);

    const tasks = await Task.find({ project })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: { tasks } });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

// @desc    Create a new task under a project
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { title, description, project, assignedTo, priority, status, dueDate } = req.body;

    await assertProjectAccess(project, req.user._id);

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || 'Medium',
      status: status || 'Todo',
      dueDate: dueDate || undefined,
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task: populatedTask },
    });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

// @desc    Update a task's details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await assertProjectAccess(task.project, req.user._id);

    const { title, description, assignedTo, priority, dueDate } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || undefined;

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task: populatedTask },
    });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

// @desc    Update only a task's status (used by the Kanban board)
// @route   PUT /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await assertProjectAccess(task.project, req.user._id);

    task.status = req.body.status;
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'Task status updated',
      data: { task: populatedTask },
    });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await assertProjectAccess(task.project, req.user._id);

    await task.deleteOne();

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ success: false, message: error.message });
    next(error);
  }
};

module.exports = { getTasks, createTask, updateTask, updateTaskStatus, deleteTask };
