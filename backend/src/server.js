// // require('dotenv').config();
// // const express = require('express');
// // const cors = require('cors');
// // const helmet = require('helmet');
// // const morgan = require('morgan');
// // const rateLimit = require('express-rate-limit');

// // const authRoutes = require('./routes/auth');
// // const todoRoutes = require('./routes/todos');

// // const app = express();
// // const PORT = process.env.PORT || 5000;

// // // ─── Security Middleware ───────────────────────────────────────────────────────
// // app.use(helmet());
// // app.use(cors({
// //   origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
// //   credentials: true,
// // }));

// // // ─── Rate Limiting ─────────────────────────────────────────────────────────────
// // const limiter = rateLimit({
// //   windowMs: 15 * 60 * 1000, // 15 minutes
// //   max: 100,
// //   standardHeaders: true,
// //   legacyHeaders: false,
// //   message: { success: false, message: 'Too many requests, please try again later.' },
// // });
// // const authLimiter = rateLimit({
// //   windowMs: 60 * 60 * 1000, // 1 hour
// //   max: 20,
// //   message: { success: false, message: 'Too many auth attempts, please try again in an hour.' },
// // });

// // app.use('/api/', limiter);
// // app.use('/api/auth/', authLimiter);

// // // ─── Body Parsing ──────────────────────────────────────────────────────────────
// // app.use(express.json({ limit: '10kb' }));
// // app.use(express.urlencoded({ extended: true }));

// // // ─── Logging ───────────────────────────────────────────────────────────────────
// // if (process.env.NODE_ENV !== 'test') {
// //   app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// // }

// // // ─── Routes ────────────────────────────────────────────────────────────────────
// // app.use('/api/auth', authRoutes);
// // app.use('/api/todos', todoRoutes);

// // // ─── Health Check ──────────────────────────────────────────────────────────────
// // app.get('/api/health', (req, res) => {
// //   res.json({
// //     success: true,
// //     message: 'API is running',
// //     timestamp: new Date().toISOString(),
// //     env: process.env.NODE_ENV,
// //   });
// // });

// // // ─── 404 Handler ──────────────────────────────────────────────────────────────
// // app.use((req, res) => {
// //   res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
// // });

// // // ─── Global Error Handler ──────────────────────────────────────────────────────
// // app.use((err, req, res, next) => {
// //   console.error('Unhandled error:', err);
// //   res.status(err.status || 500).json({
// //     success: false,
// //     message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : err.message,
// //   });
// // });

// // // ─── Start Server ─────────────────────────────────────────────────────────────
// // app.listen(PORT, () => {
// //   console.log(`\n🚀 Todo API running at http://localhost:${PORT}`);
// //   console.log(`📖 Environment: ${process.env.NODE_ENV || 'development'}`);
// //   console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? '✓ Set' : '✗ NOT SET (using default)'}\n`);
// // });

// // module.exports = app;
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const connectDB = require('./config/database');

// const authRoutes = require('./routes/auth');
// const taskRoutes = require('./routes/tasks');

// // Connect to MongoDB
// connectDB();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ─── Security Middleware ───────────────────────────────────────────────────────
// app.use(helmet());
// app.use(cors({
//   origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
//   credentials: true,
// }));

// // ─── Rate Limiting ─────────────────────────────────────────────────────────────
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: { success: false, message: 'Too many requests. Try again later.' },
// });
// const authLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 20,
//   message: { success: false, message: 'Too many auth attempts. Try again in an hour.' },
// });
// app.use('/api/', limiter);
// app.use('/api/auth/', authLimiter);

// // ─── Body Parsing ──────────────────────────────────────────────────────────────
// app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded({ extended: true }));

// // ─── Logging ───────────────────────────────────────────────────────────────────
// if (process.env.NODE_ENV !== 'test') {
//   app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
// }

// // ─── Routes ────────────────────────────────────────────────────────────────────
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);

// // ─── Health Check ──────────────────────────────────────────────────────────────
// app.get('/api/health', (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'API is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV || 'development',
//   });
// });

// // ─── 404 Handler ──────────────────────────────────────────────────────────────
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
// });

// // ─── Global Error Handler ──────────────────────────────────────────────────────
// app.use((err, req, res, next) => {
//   console.error('Unhandled error:', err);
//   res.status(err.status || 500).json({
//     success: false,
//     message: process.env.NODE_ENV === 'production' ? 'Internal server error.' : `${err.message}`,
//   });
// });

// // ─── Start Server ─────────────────────────────────────────────────────────────
// app.listen(PORT, () => {
//   console.log(`\n🚀 Taskr API running at http://localhost:${PORT}`);
//   console.log(`📦 Database: MongoDB (${process.env.MONGO_URI || 'not set'})`);
//   console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? '✓ Set' : '✗ NOT SET'}`);
//   console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}\n`);
// });

// module.exports = app;
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');

const authRoutes  = require('./routes/auth');
const taskRoutes  = require('./routes/tasks');

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// ─── Rate limiting ─────────────────────────────────────────────────────────────
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use('/api/auth/', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
}));

// ─── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ───────────────────────────────────────────────────────────────────
app.use(morgan('dev'));

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running', timestamp: new Date().toISOString() });
});

// ─── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// ─── Global error handler (MUST have 4 params) ────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  });
});

// ─── Start (connect DB first, then listen) ────────────────────────────────────
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🚀 Taskr API running at http://localhost:${PORT}`);
    console.log(`📦 MongoDB: ${process.env.MONGO_URI}`);
    console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? '✓ Set' : '✗ NOT SET — app will crash on auth'}\n`);
  });
};

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;