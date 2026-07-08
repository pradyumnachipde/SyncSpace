const { body } = require('express-validator');

const createTeamValidator = [
  body('name').trim().notEmpty().withMessage('Team name is required'),
  body('description')
    .optional({ checkFalsy: true })
    .isLength({ max: 300 })
    .withMessage('Description cannot exceed 300 characters'),
];

const joinTeamValidator = [
  body('inviteCode').trim().notEmpty().withMessage('Invite code is required'),
];

module.exports = { createTeamValidator, joinTeamValidator };
