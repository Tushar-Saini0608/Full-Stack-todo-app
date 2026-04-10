const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Task = require('../models/Task');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

// ─── GET /api/tasks ──────────────────────────────────────────────────────────
// Query params: ?is_completed=true|false  &priority=low|medium|high
//               &search=text  &sort_by=created_at|due_date|title
//               &sort_dir=asc|desc
router.get('/', async (req, res) => {
  try {
    const { is_completed, priority, search, sort_by = 'created_at', sort_dir = 'desc' } = req.query;

    // Build filter — always scoped to authenticated user
    const filter = { user: req.user._id };

    if (is_completed !== undefined) {
      filter.is_completed = is_completed === 'true';
    }
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort
    const allowedSort = ['created_at', 'updated_at', 'title', 'due_date', 'priority'];
    const sortField = allowedSort.includes(sort_by) ? sort_by : 'created_at';
    const sortObj = { [sortField]: sort_dir === 'asc' ? 1 : -1 };

    const tasks = await Task.find(filter).sort(sortObj).lean();

    res.status(200).json({
      success: true,
      data: { tasks, count: tasks.length },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/tasks/stats ─────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [total, completed] = await Promise.all([
      Task.countDocuments({ user: req.user._id }),
      Task.countDocuments({ user: req.user._id, is_completed: true }),
    ]);
    const byPriority = await Task.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);
    const priorityMap = { low: 0, medium: 0, high: 0 };
    byPriority.forEach(p => { priorityMap[p._id] = p.count; });

    res.status(200).json({
      success: true,
      data: { total, completed, pending: total - completed, byPriority: priorityMap },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/tasks/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.status(200).json({ success: true, data: { task } });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/tasks ─────────────────────────────────────────────────────────
router.post(
  '/',
  [
    body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1–200 characters'),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority: low, medium, or high'),
    body('due_date').optional({ nullable: true }).isISO8601().withMessage('due_date must be a valid ISO date'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    try {
      const { title, description, priority, due_date } = req.body;
      const task = await Task.create({
        title,
        description,
        priority,
        due_date: due_date || null,
        user: req.user._id,
      });
      res.status(201).json({ success: true, message: 'Task created.', data: { task } });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─── PUT /api/tasks/:id ──────────────────────────────────────────────────────
// Used for updating task status OR text (per spec: PUT)
router.put(
  '/:id',
  [
    body('title').optional().trim().isLength({ min: 1, max: 200 }).withMessage('Title must be 1–200 characters'),
    body('description').optional().trim().isLength({ max: 1000 }),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('is_completed').optional().isBoolean().toBoolean(),
    body('due_date').optional({ nullable: true }).isISO8601().withMessage('due_date must be a valid ISO date'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }
    try {
      const allowed = ['title', 'description', 'priority', 'is_completed', 'due_date'];
      const updates = {};
      allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

      const task = await Task.findOneAndUpdate(
        { _id: req.params.id, user: req.user._id },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
      res.status(200).json({ success: true, message: 'Task updated.', data: { task } });
    } catch (err) {
      if (err.name === 'CastError') {
        return res.status(404).json({ success: false, message: 'Task not found.' });
      }
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─── DELETE /api/tasks/:id ───────────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found.' });
    res.status(200).json({ success: true, message: 'Task deleted.' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/tasks (bulk clear completed) ────────────────────────────────
router.delete('/', async (req, res) => {
  try {
    const result = await Task.deleteMany({ user: req.user._id, is_completed: true });
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} completed task(s) deleted.`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
