// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     trim: true
//   },
//   email: {
//     type: String,
//     trim: true,
//     sparse: true,
//     lowercase: true
//   },
//   phoneNumber: {
//     type: String,
//     trim: true,
//     sparse: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   isEmailVerified: {
//     type: Boolean,
//     default: false
//   },
//   emailVerificationToken: String,
//   emailVerificationExpires: Date,
//   resetPasswordToken: String,
//   resetPasswordExpires: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model('User', userSchema);


// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     trim: true
//   },
//   email: {
//     type: String,
//     trim: true,
//     sparse: true,
//     lowercase: true
//   },
//   phoneNumber: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true
//   },
//   isPhoneVerified: {
//     type: Boolean,
//     default: false
//   },
//   isEmailVerified: {
//     type: Boolean,
//     default: false
//   },
//   emailVerificationToken: String,
//   emailVerificationExpires: Date,
//   address: {
//     street: String,
//     city: String,
//     state: String,
//     country: String,
//     zipCode: String
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   lastLogin: {
//     type: Date
//   }
// });

// // Hash OTP before saving
// userSchema.pre('save', async function(next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// module.exports = mongoose.model('User', userSchema);



// backend/src/models/user.js
// backend/src/Models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', userSchema);