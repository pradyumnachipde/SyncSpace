const { body } = require('express-validator');

const createProjectValidator = [
  body('name').trim().notEmpty().withMessage('Project name is required'),
  body('team').trim().notEmpty().withMessage('Team is required'),
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('startDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid start date'),
  body('endDate').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid end date'),
];

module.exports = { createProjectValidator };
