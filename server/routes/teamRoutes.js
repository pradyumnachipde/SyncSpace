const express = require('express');
const {
  getTeams,
  createTeam,
  joinTeam,
  getTeamById,
  leaveTeam,
} = require('../controllers/teamController');
const { createTeamValidator, joinTeamValidator } = require('../validators/teamValidator');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getTeams);
router.post('/', createTeamValidator, createTeam);
router.post('/join', joinTeamValidator, joinTeam);
router.get('/:id', getTeamById);
router.delete('/:id/leave', leaveTeam);

module.exports = router;
