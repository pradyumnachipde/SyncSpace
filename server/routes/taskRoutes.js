const express = require('express');
const {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const {
  createTaskValidator,
  updateTaskValidator,
  updateTaskStatusValidator,
} = require('../validators/taskValidator');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.post('/', createTaskValidator, createTask);
router.put('/:id', updateTaskValidator, updateTask);
router.put('/:id/status', updateTaskStatusValidator, updateTaskStatus);
router.delete('/:id', deleteTask);

module.exports = router;
