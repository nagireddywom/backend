// const express = require('express');
// const router = express.Router();
// const { createOrder, verifyPayment } = require('../controllers/razorpayController');

// router.post('/create-razorpay-order', createOrder);
// router.post('/verify-payment', verifyPayment);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  getPaymentStatus
} = require('../controllers/razorpayController');

// Create Razorpay order
router.post('/create-razorpay-order', createOrder);

// Verify payment
router.post('/verify-payment', verifyPayment);

// Get payment status
// router.get('/payment-status/:orderNumber', getPaymentStatus);

module.exports = router;