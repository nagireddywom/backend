

// // controllers/razorpayController.js
// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const Order = require('../Models/order');
// const shiprocketService = require('../services/shiprocket');

// // Initialize Razorpay with your key credentials
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET_KEY,
// });

// const createOrder = async (req, res) => {
//     try {
//       const { orderNumber, amount } = req.body;
      
//       // Validate inputs
//       if (!orderNumber || !amount) {
//         return res.status(400).json({
//           success: false,
//           error: 'Order number and amount are required'
//         });
//       }
  
//       // Log the request data
//       console.log('Creating Razorpay order:', { orderNumber, amount });
  
//       // Find the order in your database
//       const order = await Order.findOne({ orderNumber });
//       if (!order) {
//         return res.status(404).json({
//           success: false,
//           error: 'Order not found'
//         });
//       }
  
//       // Ensure amount is a number and convert to paise
//       const amountInPaise = Math.round(parseFloat(amount) * 100);
      
//       if (isNaN(amountInPaise) || amountInPaise <= 0) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid amount'
//         });
//       }
  
//       // Create Razorpay order
//       const razorpayOrder = await razorpay.orders.create({
//         amount: amountInPaise,
//         currency: 'INR',
//         receipt: orderNumber,
//         payment_capture: 1,
//         notes: {
//           orderNumber: orderNumber
//         }
//       });
  
//       // Log the created order
//       console.log('Razorpay order created:', razorpayOrder);
  
//       res.json({
//         id: razorpayOrder.id,
//         currency: razorpayOrder.currency,
//         amount: razorpayOrder.amount,
//       });
//     } catch (error) {
//       console.error('Error creating Razorpay order:', error);
//       res.status(500).json({
//         success: false,
//         error: 'Failed to create payment order',
//         details: error.message
//       });
//     }
//   };

// // Verify payment// controllers/razorpayController.js
// const verifyPayment = async (req, res) => {
//     try {
//       console.log('Starting payment verification');
//       const {
//         orderNumber,
//         razorpay_order_id,
//         razorpay_payment_id,
//         razorpay_signature
//       } = req.body;
  
//       console.log('Payment verification request:', {
//         orderNumber,
//         razorpay_order_id,
//         razorpay_payment_id
//       });
  
//       // Find order in database
//       const order = await Order.findOne({ orderNumber });
//       if (!order) {
//         console.log('Order not found:', orderNumber);
//         return res.status(404).json({
//           success: false,
//           error: 'Order not found'
//         });
//       }
  
//       // Verify signature
//       const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//       const expectedSignature = crypto
//         .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
//         .update(body)
//         .digest('hex');
  
//       console.log('Signature verification:', {
//         expected: expectedSignature,
//         received: razorpay_signature
//       });
  
//       if (expectedSignature !== razorpay_signature) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid payment signature'
//         });
//       }
  
//       // Verify payment status with Razorpay
//       const payment = await razorpay.payments.fetch(razorpay_payment_id);
//       console.log('Payment details:', payment);
  
//       // Update order with payment details
//       order.paymentDetails = {
//         razorpayPaymentId: razorpay_payment_id,
//         razorpayOrderId: razorpay_order_id,
//         razorpaySignature: razorpay_signature,
//         paymentStatus: 'completed',
//         paymentDate: new Date()
//       };
//       order.status = 'processing';
      
//       await order.save();
//       console.log('Order updated with payment details');
  
//       res.json({
//         success: true,
//         orderNumber: order.orderNumber,
//         paymentId: razorpay_payment_id,
//         amount: payment.amount / 100
//       });
     
    
    
    
//     try {
//       // Create shipment in Shiprocket
//       const shippingDetails = await shiprocketService.createShipment(order);

//       // Update order with shipping details
//       order.shippingDetails = {
//         shiprocketOrderId: shippingDetails.shiprocketOrderId,
//         shipmentId: shippingDetails.shipmentId,
//         awbCode: shippingDetails.awbCode,
//         courierName: shippingDetails.courierName,
//         manifestUrl: shippingDetails.manifestUrl,
//         labelUrl: shippingDetails.labelUrl,
//         invoiceUrl: shippingDetails.invoiceUrl
//       };

//       await order.save();

//       // Send success response with shipping details
//       res.json({
//         success: true,
//         orderNumber: order.orderNumber,
//         paymentId: razorpay_payment_id,
//         amount: payment.amount / 100,
//         shipping: {
//           awbCode: shippingDetails.awbCode,
//           courierName: shippingDetails.courierName,
//           trackingUrl: `https://shiprocket.co/tracking/${shippingDetails.awbCode}`
//         }
//       });
//     } catch (shippingError) {
//       console.error('Shipping creation failed:', shippingError);
//       // Still send success response but with shipping error
//       res.json({
//         success: true,
//         orderNumber: order.orderNumber,
//         paymentId: razorpay_payment_id,
//         amount: payment.amount / 100,
//         shippingError: 'Shipping creation pending. Will be processed shortly.'
//       });
//     }
//   } catch (error) {
//     console.error('Payment verification error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Payment verification failed',
//       details: error.message
//     });
//   }
// }

  
//   module.exports = {
//     createOrder,
//     verifyPayment
//   };



// // controllers/razorpayController.js
// const Razorpay = require('razorpay');
// const crypto = require('crypto');
// const Order = require('../Models/order');
// const shiprocketService = require('../services/shiprocket');

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_SECRET_KEY,
// });

// const createOrder = async (req, res) => {
//   try {
//     const { orderNumber, amount } = req.body;
    
//     // Validate inputs
//     if (!orderNumber || !amount) {
//       return res.status(400).json({
//         success: false,
//         error: 'Order number and amount are required'
//       });
//     }

//     console.log('Creating Razorpay order:', { orderNumber, amount });

//     // Find the order in database
//     const order = await Order.findOne({ orderNumber });
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         error: 'Order not found'
//       });
//     }

//     // Ensure amount is a number and convert to paise
//     const amountInPaise = Math.round(parseFloat(amount) * 100);
    
//     if (isNaN(amountInPaise) || amountInPaise <= 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid amount'
//       });
//     }

//     // Create Razorpay order
//     const razorpayOrder = await razorpay.orders.create({
//       amount: amountInPaise,
//       currency: 'INR',
//       receipt: orderNumber,
//       payment_capture: 1,
//       notes: {
//         orderNumber: orderNumber
//       }
//     });

//     console.log('Razorpay order created:', razorpayOrder);

//     return res.json({
//       id: razorpayOrder.id,
//       currency: razorpayOrder.currency,
//       amount: razorpayOrder.amount,
//     });
//   } catch (error) {
//     console.error('Error creating Razorpay order:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to create payment order',
//       details: error.message
//     });
//   }
// };

// const verifyPayment = async (req, res) => {
//   try {
//     console.log('Starting payment verification');
//     const {
//       orderNumber,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature
//     } = req.body;

//     // Find order in database
//     const order = await Order.findOne({ orderNumber });
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         error: 'Order not found'
//       });
//     }

//     // Verify signature
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
//       .update(body)
//       .digest('hex');

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid payment signature'
//       });
//     }

//     // Verify payment status with Razorpay
//     const payment = await razorpay.payments.fetch(razorpay_payment_id);
    
//     // Update order with payment details
//     order.paymentDetails = {
//       razorpayPaymentId: razorpay_payment_id,
//       razorpayOrderId: razorpay_order_id,
//       razorpaySignature: razorpay_signature,
//       paymentStatus: 'completed',
//       paymentDate: new Date()
//     };
//     order.status = 'processing';
    
//     await order.save();

//     try {
//       // Create shipment in Shiprocket
//       const shippingDetails = await shiprocketService.createShipment(order);

//       // Update order with shipping details
//       order.shippingDetails = {
//         shiprocketOrderId: shippingDetails.shiprocketOrderId,
//         shipmentId: shippingDetails.shipmentId,
//         awbCode: shippingDetails.awbCode,
//         courierName: shippingDetails.courierName,
//         manifestUrl: shippingDetails.manifestUrl,
//         labelUrl: shippingDetails.labelUrl,
//         invoiceUrl: shippingDetails.invoiceUrl
//       };

//       await order.save();

//       // Return success with shipping details
//       return res.json({
//         success: true,
//         orderNumber: order.orderNumber,
//         paymentId: razorpay_payment_id,
//         amount: payment.amount / 100,
//         shipping: {
//           awbCode: shippingDetails.awbCode,
//           courierName: shippingDetails.courierName,
//           trackingUrl: `https://shiprocket.co/tracking/${shippingDetails.awbCode}`
//         }
//       });
//     } catch (shippingError) {
//       console.error('Shipping creation failed:', shippingError);
//       // Return success with payment but shipping pending
//       return res.json({
//         success: true,
//         orderNumber: order.orderNumber,
//         paymentId: razorpay_payment_id,
//         amount: payment.amount / 100,
//         shippingError: 'Shipping creation pending. Will be processed shortly.'
//       });
//     }
//   } catch (error) {
//     console.error('Payment verification error:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Payment verification failed',
//       details: error.message
//     });
//   }
// };

// module.exports = {
//   createOrder,
//   verifyPayment
// };




// controllers/razorpayController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../Models/order');
const shiprocketService = require('../services/shiprocket');

// Validate environment variables
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET_KEY) {
  console.error('❌ Missing Razorpay credentials in environment variables');
  process.exit(1);
}

console.log('✅ Razorpay credentials found');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

const createOrder = async (req, res) => {
  console.log('\n🚀 Starting Razorpay order creation...');
  try {
    const { orderNumber, amount } = req.body;
    console.log('📝 Order request details:', { orderNumber, amount });
    
    // Validate inputs
    if (!orderNumber || !amount) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Order number and amount are required'
      });
    }

    // Find the order in database
    console.log('🔍 Looking for order in database...');
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      console.log('❌ Order not found in database');
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    console.log('✅ Order found in database');

    // Convert amount to paise
    const amountInPaise = Math.round(parseFloat(amount) * 100);
    console.log('💰 Amount in paise:', amountInPaise);
    
    if (isNaN(amountInPaise) || amountInPaise <= 0) {
      console.log('❌ Invalid amount value');
      return res.status(400).json({
        success: false,
        error: 'Invalid amount'
      });
    }

    // Create Razorpay order
    console.log('📦 Creating Razorpay order...');
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: orderNumber,
      payment_capture: 1,
      notes: {
        orderNumber: orderNumber
      }
    });

    console.log('✅ Razorpay order created:', razorpayOrder);

    return res.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    return res.status(500).json({
      success: false,
      error: 'Failed to create payment order',
      details: error.message
    });
  }
};

const verifyPayment = async (req, res) => {
  console.log('\n🔍 Starting payment verification...');
  try {
    console.log('📝 Payment verification request:', req.body);
    const {
      orderNumber,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // Find order in database
    console.log('🔍 Looking for order:', orderNumber);
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      console.log('❌ Order not found in database');
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    console.log('✅ Order found in database');

    // Verify signature
    console.log('🔐 Verifying payment signature...');
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
      .update(body)
      .digest('hex');

    console.log('Signature comparison:', {
      expected: expectedSignature,
      received: razorpay_signature
    });

    if (expectedSignature !== razorpay_signature) {
      console.log('❌ Invalid payment signature');
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature'
      });
    }
    console.log('✅ Payment signature verified');

    // Verify payment status with Razorpay
    console.log('💳 Fetching payment details from Razorpay...');
    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    console.log('Payment details:', payment);
    
    // Update order with payment details
    console.log('📝 Updating order with payment details...');
    order.paymentDetails = {
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: 'completed',
      paymentDate: new Date()
    };
    order.status = 'processing';
    
    await order.save();
    console.log('✅ Order updated with payment details');

    try {
      // Create shipment in Shiprocket
      console.log('🚚 Creating shipment in Shiprocket...');
      const shippingDetails = await shiprocketService.createShipment(order);
      console.log('✅ Shipment created:', shippingDetails);

      // Update order with shipping details
      console.log('📝 Updating order with shipping details...');
      order.shippingDetails = {
        shiprocketOrderId: shippingDetails.shiprocketOrderId,
        shipmentId: shippingDetails.shipmentId,
        awbCode: shippingDetails.awbCode,
        courierName: shippingDetails.courierName,
        manifestUrl: shippingDetails.manifestUrl,
        labelUrl: shippingDetails.labelUrl,
        invoiceUrl: shippingDetails.invoiceUrl
      };

      await order.save();
      console.log('✅ Order updated with shipping details');

      return res.json({
        success: true,
        orderNumber: order.orderNumber,
        paymentId: razorpay_payment_id,
        amount: payment.amount / 100,
        shipping: {
          awbCode: shippingDetails.awbCode,
          courierName: shippingDetails.courierName,
          trackingUrl: `https://shiprocket.co/tracking/${shippingDetails.awbCode}`
        }
      });
    } catch (shippingError) {
      console.error('❌ Shipping creation failed:', shippingError);
      console.error('Shipping error details:', {
        message: shippingError.message,
        stack: shippingError.stack,
        response: shippingError.response?.data
      });

      return res.json({
        success: true,
        orderNumber: order.orderNumber,
        paymentId: razorpay_payment_id,
        amount: payment.amount / 100,
        shippingError: 'Shipping creation pending. Will be processed shortly.'
      });
    }
  } catch (error) {
    console.error('❌ Payment verification error:', error);
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    return res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      details: error.message
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};