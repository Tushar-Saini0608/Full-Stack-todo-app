// // const express = require('express');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // const { body, validationResult } = require('express-validator');
// // const { UserModel } = require('../models');
// // const { authenticate } = require('../middleware/auth');

// // const router = express.Router();

// // const generateToken = (userId) =>
// //   jwt.sign({ userId }, process.env.JWT_SECRET, {
// //     expiresIn: process.env.JWT_EXPIRES_IN || '7d',
// //   });

// // // ─── POST /api/auth/register ────────────────────────────────────────────────
// // router.post(
// //   '/register',
// //   [
// //     body('username')
// //       .trim()
// //       .isLength({ min: 3, max: 30 })
// //       .withMessage('Username must be 3–30 characters')
// //       .matches(/^[a-zA-Z0-9_]+$/)
// //       .withMessage('Username can only contain letters, numbers, and underscores'),
// //     body('email')
// //       .isEmail()
// //       .normalizeEmail()
// //       .withMessage('Must be a valid email address'),
// //     body('password')
// //       .isLength({ min: 6 })
// //       .withMessage('Password must be at least 6 characters'),
// //   ],
// //   async (req, res) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(422).json({ success: false, errors: errors.array() });
// //     }

// //     const { username, email, password } = req.body;

// //     if (UserModel.findByEmail(email)) {
// //       return res.status(409).json({ success: false, message: 'Email already in use.' });
// //     }
// //     if (UserModel.findByUsername(username)) {
// //       return res.status(409).json({ success: false, message: 'Username already taken.' });
// //     }

// //     const hashed = await bcrypt.hash(password, 12);
// //     const user = UserModel.create({ username, email, password: hashed });
// //     const token = generateToken(user.id);

// //     res.status(201).json({
// //       success: true,
// //       message: 'Account created successfully.',
// //       data: { token, user: UserModel.toPublic(user) },
// //     });
// //   }
// // );

// // // ─── POST /api/auth/login ────────────────────────────────────────────────────
// // router.post(
// //   '/login',
// //   [
// //     body('email').isEmail().normalizeEmail().withMessage('Must be a valid email'),
// //     body('password').notEmpty().withMessage('Password is required'),
// //   ],
// //   async (req, res) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(422).json({ success: false, errors: errors.array() });
// //     }

// //     const { email, password } = req.body;
// //     const user = UserModel.findByEmail(email);

// //     if (!user) {
// //       return res.status(401).json({ success: false, message: 'Invalid email or password.' });
// //     }

// //     const valid = await bcrypt.compare(password, user.password);
// //     if (!valid) {
// //       return res.status(401).json({ success: false, message: 'Invalid email or password.' });
// //     }

// //     const token = generateToken(user.id);

// //     res.json({
// //       success: true,
// //       message: 'Logged in successfully.',
// //       data: { token, user: UserModel.toPublic(user) },
// //     });
// //   }
// // );

// // // ─── GET /api/auth/me ────────────────────────────────────────────────────────
// // router.get('/me', authenticate, (req, res) => {
// //   res.json({ success: true, data: { user: req.user } });
// // });

// // module.exports = router;
// const express = require('express');
// const jwt = require('jsonwebtoken');
// const { body, validationResult } = require('express-validator');
// const User = require('../models/User');
// const { authenticate } = require('../middleware/auth');

// const router = express.Router();

// const generateToken = (userId) =>
//   jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN || '7d',
//   });

// // ─── POST /api/auth/register ─────────────────────────────────────────────────
// router.post(
//   '/register',
//   [
//     body('username').trim().isLength({ min: 3, max: 30 })
//       .withMessage('Username must be 3–30 characters')
//       .matches(/^[a-zA-Z0-9_]+$/)
//       .withMessage('Username: letters, numbers, underscores only'),
//     body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
//     body('password').isLength({ min: 6 }).withMessage('Password min 6 characters'),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ success: false, errors: errors.array() });
//     }
//     try {
//       const { username, email, password } = req.body;

//       const existing = await User.findOne({ $or: [{ email }, { username }] });
//       if (existing) {
//         const field = existing.email === email.toLowerCase() ? 'Email' : 'Username';
//         return res.status(409).json({ success: false, message: `${field} already in use.` });
//       }

//       const user = await User.create({ username, email, password });
//       const token = generateToken(user._id);

//       res.status(201).json({
//         success: true,
//         message: 'Account created successfully.',
//         data: { token, user },
//       });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }
// );

// // ─── POST /api/auth/login ────────────────────────────────────────────────────
// router.post(
//   '/login',
//   [
//     body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
//     body('password').notEmpty().withMessage('Password is required'),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(422).json({ success: false, errors: errors.array() });
//     }
//     try {
//       const { email, password } = req.body;
//       const user = await User.findOne({ email }).select('+password');

//       if (!user || !(await user.comparePassword(password))) {
//         return res.status(401).json({ success: false, message: 'Invalid email or password.' });
//       }

//       const token = generateToken(user._id);
//       res.json({
//         success: true,
//         message: 'Logged in successfully.',
//         data: { token, user },
//       });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }
// );

// // ─── GET /api/auth/me ─────────────────────────────────────────────────────────
// router.get('/me', authenticate, async (req, res) => {
//   res.json({ success: true, data: { user: req.user } });
// });

// module.exports = router;
const express  = require('express');
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User     = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── POST /api/auth/register ──────────────────────────────────────────────────
router.post('/register', [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username: letters, numbers, underscores only'),
  body('email')
    .isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 }).withMessage('Password min 6 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { username }] });
    if (existing) {
      const field = existing.email === email.toLowerCase() ? 'Email' : 'Username';
      return res.status(409).json({ success: false, message: `${field} already in use.` });
    }

    const user  = await User.create({ username, email, password });
    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { token, user },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id);
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: { token, user },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
router.get('/me', authenticate, (req, res) => {
  return res.status(200).json({ success: true, data: { user: req.user } });
});

module.exports = router;