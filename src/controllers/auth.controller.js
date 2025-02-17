


const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../services/mail.service');
const otpService = require('../services/otp.service');
const smsService = require('../services/sms.service');


exports.register = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phoneNumber, 
      password,
      address,
      city,
      state,
      pincode
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { phoneNumber }
      ]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already registered' });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(400).json({ message: 'Phone number already registered' });
      }
    }

    // Create new user
    const user = new User({
      name,
      email,
      phoneNumber,
      password,
      address: {
        street: address,
        city,
        state,
        pincode
      },
      isEmailVerified: true // Auto-verifying for now
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        isEmailVerified: user.isEmailVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // Check if identifier is email or phone number
    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phoneNumber: identifier };
    
    const user = await User.findOne(query);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const otp = otpService.generateOTP();
    await otpService.storeOTP(phoneNumber, otp);
    
    // Send OTP via SMS
    await smsService.sendSMS(
      phoneNumber,
      `Your OTP for verification is: ${otp}`
    );

    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    
    const isValid = await otpService.verifyOTP(phoneNumber, otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Find or create user
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({
        phoneNumber,
        isPhoneVerified: true
      });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        phoneNumber: user.phoneNumber,
        name: user.name,
        email: user.email,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    const isEmail = identifier.includes('@');
    const query = isEmail ? { email: identifier } : { phoneNumber: identifier };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (isEmail) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: `Please use this token to reset your password: ${resetToken}`
      });
    } else {
      // For phone numbers, use OTP instead of reset token
      const otp = otpService.generateOTP();
      await otpService.storeOTP(user.phoneNumber, otp, 'reset');
      
      await smsService.sendSMS(
        user.phoneNumber,
        `Your OTP for password reset is: ${otp}`
      );
    }

    res.json({ message: 'Reset instructions sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password, phoneNumber, otp } = req.body;
    
    let user;
    
    if (token) {
      // Email-based reset
      user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }

      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
    } else if (phoneNumber && otp) {
      // OTP-based reset
      const isValid = await otpService.verifyOTP(phoneNumber, otp, 'reset');
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid reset request' });
    }

    user.password = password;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (email && email !== user.email) {
      const verificationToken = crypto.randomBytes(32).toString('hex');
      user.emailVerificationToken = verificationToken;
      user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
      
      await sendEmail({
        to: email,
        subject: 'Email Verification',
        text: `Please verify your email using this token: ${verificationToken}`
      });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        valid: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        valid: false,
        message: 'User not found'
      });
    }

    return res.status(200).json({
      valid: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
        // Add other non-sensitive user data as needed
      }
    });
  } catch (error) {
    return res.status(401).json({
      valid: false,
      message: 'Invalid token'
    });
  }
};


// backend/src/services/otp.service.js
// class OTPService {
//   constructor() {
//     this.otpStore = new Map();
//   }

//   generateOTP() {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   }

//   async storeOTP(phoneNumber, otp, type = 'verification') {
//     const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes
//     this.otpStore.set(phoneNumber, {
//       otp,
//       type,
//       expiryTime
//     });
//   }

//   async verifyOTP(phoneNumber, otp, type = 'verification') {
//     const storedData = this.otpStore.get(phoneNumber);
//     if (!storedData) return false;
    
//     if (Date.now() > storedData.expiryTime) {
//       this.otpStore.delete(phoneNumber);
//       return false;
//     }

//     if (storedData.otp === otp && storedData.type === type) {
//       this.otpStore.delete(phoneNumber);
//       return true;
//     }
//     return false;
//   }
// }

// module.exports = new OTPService();

// Add this to your existing auth.controller.js