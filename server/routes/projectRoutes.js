const express = require('express');
const { getProjects, createProject, getProjectById } = require('../controllers/projectController');
const { createProjectValidator } = require('../validators/projectValidator');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getProjects);
router.post('/', createProjectValidator, createProject);
router.get('/:id', getProjectById);

module.exports = router;
