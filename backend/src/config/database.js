// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     mongoose.connect(process.env.MONGO_URI);
//     console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
//   } catch (err) {
//     console.error(`❌ MongoDB connection failed: ${err.message}`);
//     process.exit(1);
//   }
// };

// // Handle connection events
// mongoose.connection.on('disconnected', () => {
//   console.warn('⚠️  MongoDB disconnected');
// });
// mongoose.connection.on('error', (err) => {
//   console.error('MongoDB error:', err);
// });

// module.exports = connectDB;
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌  MONGO_URI is not set in .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log(`✅  MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`❌  MongoDB connection failed: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;