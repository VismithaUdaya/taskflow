const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { stage, priority, search } = req.query;

    // Build filter object
    const filter = { user: req.user._id };

    if (stage && ['Todo', 'In Progress', 'Done'].includes(stage)) {
      filter.stage = stage;
    }
    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    // Group tasks by stage for kanban view
    const grouped = {
      Todo: tasks.filter((t) => t.stage === 'Todo'),
      'In Progress': tasks.filter((t) => t.stage === 'In Progress'),
      Done: tasks.filter((t) => t.stage === 'Done'),
    };

    res.json({
      tasks,
      grouped,
      total: tasks.length,
      counts: {
        Todo: grouped['Todo'].length,
        'In Progress': grouped['In Progress'].length,
        Done: grouped['Done'].length,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json({ task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, stage, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      stage: stage || 'Todo',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      user: req.user._id,
    });

    res.status(201).json({ message: 'Task created!', task });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const { title, description, stage, priority, dueDate } = req.body;

    // Only update fields that were actually sent
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (stage !== undefined) task.stage = stage;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    res.json({ message: 'Task updated!', task });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json({ message: 'Task deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Move task to a different stage quickly
// @route   PATCH /api/tasks/:id/stage
// @access  Private
const moveTask = async (req, res, next) => {
  try {
    const { stage } = req.body;
    if (!['Todo', 'In Progress', 'Done'].includes(stage)) {
      return res.status(400).json({ message: 'Invalid stage.' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { stage },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json({ message: `Task moved to ${stage}`, task });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, moveTask };
