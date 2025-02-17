const crypto = require('crypto');

class OTPService {
  constructor() {
    this.otpStore = new Map(); // In production, use Redis instead of Map
  }

  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async storeOTP(phoneNumber, otp) {
    const expiryTime = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
    this.otpStore.set(phoneNumber, {
      otp,
      expiryTime
    });
  }

  async verifyOTP(phoneNumber, otp) {
    const storedData = this.otpStore.get(phoneNumber);
    if (!storedData) return false;
    
    if (Date.now() > storedData.expiryTime) {
      this.otpStore.delete(phoneNumber);
      return false;
    }

    if (storedData.otp === otp) {
      this.otpStore.delete(phoneNumber);
      return true;
    }
    return false;
  }
}

module.exports = new OTPService();