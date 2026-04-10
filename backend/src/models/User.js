// // // const mongoose = require('mongoose');
// // // const bcrypt = require('bcryptjs');

// // // const UserSchema = new mongoose.Schema(
// // //     {
// // //         username: {
// // //             type: String,
// // //             required: [true, 'Username is required'],
// // //             unique: true,
// // //             trim: true,
// // //             minlength: [3, 'Username must be at least 3 characters'],
// // //             maxlength: [30, 'Username cannot exceed 30 characters'],
// // //             match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, underscores'],
// // //         },
// // //         email: {
// // //             type: String,
// // //             required: [true, 'Email is required'],
// // //             unique: true,
// // //             lowercase: true,
// // //             trim: true,
// // //             match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
// // //         },
// // //         password: {
// // //             type: String,
// // //             required: [true, 'Password is required'],
// // //             minlength: [6, 'Password must be at least 6 characters'],
// // //             select: false, // never returned in queries by default
// // //         },
// // //     },
// // //     { timestamps: true }
// // // );

// // // // Hash password before saving
// // // UserSchema.pre('save', async function (next) {
// // //     if (!this.isModified('password')) return next();
// // //     this.password = await bcrypt.hash(this.password, 12);
// // //     next();
// // // });

// // // // Compare password method
// // // UserSchema.methods.comparePassword = async function (candidatePassword) {
// // //     return bcrypt.compare(candidatePassword, this.password);
// // // };

// // // // Remove password from JSON output
// // // UserSchema.methods.toJSON = function () {
// // //     const obj = this.toObject();
// // //     delete obj.password;
// // //     return obj;
// // // };

// // // module.exports = mongoose.model('User', UserSchema);
// // const mongoose = require('mongoose');
// // const bcrypt   = require('bcryptjs');

// // const UserSchema = new mongoose.Schema(
// //   {
// //     username: {
// //       type: String,
// //       required: [true, 'Username is required'],
// //       unique: true,
// //       trim: true,
// //       minlength: [3, 'Username must be at least 3 characters'],
// //       maxlength: [30, 'Username cannot exceed 30 characters'],
// //       match: [/^[a-zA-Z0-9_]+$/, 'Username: letters, numbers, underscores only'],
// //     },
// //     email: {
// //       type: String,
// //       required: [true, 'Email is required'],
// //       unique: true,
// //       lowercase: true,
// //       trim: true,
// //       match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
// //     },
// //     password: {
// //       type: String,
// //       required: [true, 'Password is required'],
// //       minlength: [6, 'Password must be at least 6 characters'],
// //       select: false,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // // IMPORTANT: use regular function (not arrow) so `this` refers to the document
// // UserSchema.pre('save', async function (next) {
// //   if (!this.isModified('password')) return next();
// //   try {
// //     this.password = await bcrypt.hash(this.password, 12);
// //     return next();
// //   } catch (err) {
// //     return next(err);
// //   }
// // });

// // UserSchema.methods.comparePassword = async function (candidatePassword) {
// //   return bcrypt.compare(candidatePassword, this.password);
// // };

// // // Strip password from any JSON response
// // UserSchema.methods.toJSON = function () {
// //   const obj = this.toObject();
// //   delete obj.password;
// //   return obj;
// // };

// // module.exports = mongoose.model('User', UserSchema);
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: [true, 'Username is required'],
//       unique: true,
//       trim: true,
//       minlength: [3, 'Username must be at least 3 characters'],
//       maxlength: [30, 'Username cannot exceed 30 characters'],
//       match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, underscores'],
//     },
//     email: {
//       type: String,
//       required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
//     },
//     password: {
//       type: String,
//       required: [true, 'Password is required'],
//       minlength: [6, 'Password must be at least 6 characters'],
//       select: false,
//     },
//   },
//   { timestamps: true }
// );

// // Hash password before saving — use function keyword (NOT arrow) so `this` is the document
// UserSchema.pre('save', async function (next) {
//   try {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, 12);
//     return next();
//   } catch (err) {
//     return next(err); // pass error to Mongoose — fixes "next is not a function"
//   }
// });

// // Compare plain password against stored hash
// UserSchema.methods.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// // Strip password from any JSON response
// UserSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// };

// module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username: letters, numbers, underscores only'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
  },
  { timestamps: true }
);

// No `next` parameter — just use async/await with no callback
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', UserSchema);