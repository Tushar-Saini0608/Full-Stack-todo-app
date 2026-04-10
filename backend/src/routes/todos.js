const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const { TodoModel } = require('../models');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// All todo routes require authentication
router.use(authenticate);

// ─── GET /api/todos ──────────────────────────────────────────────────────────
router.get(
  '/',
  [
    query('completed').optional().isBoolean().toBoolean(),
    query('priority').optional().isIn(['low', 'medium', 'high']),
    query('search').optional().isString().trim(),
    query('sortBy').optional().isIn(['createdAt', 'updatedAt', 'title', 'dueDate', 'priority']),
    query('sortDir').optional().isIn(['asc', 'desc']),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { completed, priority, search, sortBy, sortDir } = req.query;
    const todos = TodoModel.findByUserId(req.user.id, {
      completed,
      priority,
      search,
      sortBy,
      sortDir,
    });

    res.json({ success: true, data: { todos, count: todos.length } });
  }
);

// ─── GET /api/todos/stats ────────────────────────────────────────────────────
router.get('/stats', (req, res) => {
  const stats = TodoModel.getStats(req.user.id);
  res.json({ success: true, data: stats });
});

// ─── GET /api/todos/:id ──────────────────────────────────────────────────────
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid todo ID')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const todo = TodoModel.findById(req.params.id);
    if (!todo || todo.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Todo not found.' });
    }

    res.json({ success: true, data: { todo } });
  }
);

// ─── POST /api/todos ─────────────────────────────────────────────────────────
router.post(
  '/',
  [
    body('title')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be 1–200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Description max 1000 characters'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Due date must be a valid ISO 8601 date'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const { title, description, priority, dueDate } = req.body;
    const todo = TodoModel.create({
      title,
      description,
      priority,
      dueDate: dueDate || null,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Todo created.',
      data: { todo },
    });
  }
);

// ─── PATCH /api/todos/:id ────────────────────────────────────────────────────
router.patch(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid todo ID'),
    body('title')
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Title must be 1–200 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high']),
    body('completed')
      .optional()
      .isBoolean()
      .toBoolean(),
    body('dueDate')
      .optional({ nullable: true })
      .isISO8601()
      .withMessage('Due date must be a valid ISO 8601 date'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const todo = TodoModel.findById(req.params.id);
    if (!todo || todo.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Todo not found.' });
    }

    const allowedFields = ['title', 'description', 'priority', 'completed', 'dueDate'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }

    const updated = TodoModel.update(req.params.id, updates);
    res.json({ success: true, message: 'Todo updated.', data: { todo: updated } });
  }
);

// ─── DELETE /api/todos/:id ───────────────────────────────────────────────────
router.delete(
  '/:id',
  [param('id').isUUID().withMessage('Invalid todo ID')],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, errors: errors.array() });
    }

    const todo = TodoModel.findById(req.params.id);
    if (!todo || todo.userId !== req.user.id) {
      return res.status(404).json({ success: false, message: 'Todo not found.' });
    }

    TodoModel.delete(req.params.id);
    res.json({ success: true, message: 'Todo deleted.' });
  }
);

// ─── DELETE /api/todos (bulk delete completed) ───────────────────────────────
router.delete('/', (req, res) => {
  const todos = TodoModel.findByUserId(req.user.id, { completed: true });
  todos.forEach(t => TodoModel.delete(t.id));
  res.json({
    success: true,
    message: `${todos.length} completed todo(s) deleted.`,
    data: { deletedCount: todos.length },
  });
});

module.exports = router;