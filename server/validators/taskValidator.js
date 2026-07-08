const { body } = require('express-validator');

const createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Task title is required'),
  body('project').trim().notEmpty().withMessage('Project is required'),
  body('priority')
    .optional({ checkFalsy: true })
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium or High'),
  body('dueDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid due date'),
];

const updateTaskValidator = [
  body('title').optional({ checkFalsy: true }).trim().notEmpty().withMessage('Title cannot be empty'),
  body('priority')
    .optional({ checkFalsy: true })
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium or High'),
  body('dueDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid due date'),
];

const updateTaskStatusValidator = [
  body('status')
    .trim()
    .isIn(['Todo', 'In Progress', 'Done'])
    .withMessage('Status must be Todo, In Progress or Done'),
];

module.exports = { createTaskValidator, updateTaskValidator, updateTaskStatusValidator };
