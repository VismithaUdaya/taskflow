const express = require('express');
const { body } = require('express-validator');
const { getTasks, getTask, createTask, updateTask, deleteTask, moveTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(protect);

// Validation rules
const taskValidation = [
  body('title').trim().notEmpty().withMessage('Task title is required').isLength({ max: 200 }).withMessage('Title too long'),
  body('stage').optional().isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid stage'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
];

const updateValidation = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 200 }),
  body('stage').optional().isIn(['Todo', 'In Progress', 'Done']).withMessage('Invalid stage'),
  body('priority').optional().isIn(['Low', 'Medium', 'High']).withMessage('Invalid priority'),
];

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', taskValidation, createTask);
router.put('/:id', updateValidation, updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/stage', moveTask);

module.exports = router;
