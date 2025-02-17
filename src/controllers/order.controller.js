// // backend/src/controllers/order.controller.js
// const Order = require('../Models/order');
const User = require('../Models/User');

// exports.createOrder = async (req, res) => {
//   try {
//     const { orderDetails, shippingInfo, giftDetails, finalPrice } = req.body;
    
//     // Create new order
//     const order = new Order({
//       user: req.user._id,
//       orderDetails,
//       shippingInfo,
//       giftDetails,
//       finalPrice
//     });

//     await order.save();

//     // Send order confirmation email
//     // TODO: Implement email service
    
//     res.status(201).json({
//       success: true,
//       order: {
//         orderNumber: order.orderNumber,
//         totalAmount: order.finalPrice,
//         status: order.status
//       }
//     });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({ message: 'Error creating order', error: error.message });
//   }
// };

// exports.getOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({
//       orderNumber: req.params.orderNumber,
//       user: req.user._id
//     });

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     res.json({ order });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching order', error: error.message });
//   }
// };

// exports.getUserOrders = async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user._id })
//       .sort({ createdAt: -1 });

//     res.json({ orders });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching orders', error: error.message });
//   }
// };

// exports.updateShippingInfo = async (req, res) => {
//   try {
//     const { orderNumber } = req.params;
//     const { shippingInfo } = req.body;

//     const order = await Order.findOne({
//       orderNumber,
//       user: req.user._id,
//       status: 'pending' // Only allow updates for pending orders
//     });

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found or cannot be updated' });
//     }

//     order.shippingInfo = { ...order.shippingInfo, ...shippingInfo };
//     await order.save();

//     res.json({ message: 'Shipping information updated', order });
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating shipping info', error: error.message });
//   }
// };

// exports.cancelOrder = async (req, res) => {
//   try {
//     const { orderNumber } = req.params;

//     const order = await Order.findOne({
//       orderNumber,
//       user: req.user._id,
//       status: { $in: ['pending', 'processing'] } // Only allow cancellation for pending/processing orders
//     });

//     if (!order) {
//       return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
//     }

//     order.status = 'cancelled';
//     await order.save();

//     // Send cancellation email
//     // TODO: Implement email service

//     res.json({ message: 'Order cancelled successfully', order });
//   } catch (error) {
//     res.status(500).json({ message: 'Error cancelling order', error: error.message });
//   }
// };


// const Order = require('../Models/order');

// exports.createOrder = async (req, res) => {
//   try {
//     const orderData = req.body;
//     const order = new Order(orderData);
//     await order.save();

//     res.status(201).json({
//       success: true,
//       orderNumber: order.orderNumber,
//       order: order
//     });
//   } catch (error) {
//     console.error('Error creating order:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to create order',
//       error: error.message
//     });
//   }
// };

// exports.getOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderNumber: req.params.orderNumber });
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }
//     res.status(200).json({
//       success: true,
//       order: order
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch order',
//       error: error.message
//     });
//   }
// };


// // controllers/order.controller.js
// const Order = require('../Models/order');

// exports.createOrder = async (req, res) => {
//   try {
//     // Log the incoming request data
//     console.log('Received order data:', req.body);
//     console.log('Authenticated user:', req.user);

//     // Create new order instance
//     const order = new Order({
//       ...req.body,
//       user: req.user.id || req.user._id // Handle both id formats
//     });

//     // Save the order
//     await order.save();
    
//     console.log('Order created successfully:', {
//       orderNumber: order.orderNumber,
//       userId: order.user,
//       totalPrice: order.finalPrice
//     });

//     res.status(201).json({
//       success: true,
//       orderNumber: order.orderNumber,
//       order: {
//         _id: order._id,
//         orderNumber: order.orderNumber,
//         finalPrice: order.finalPrice,
//         status: order.status,
//         createdAt: order.createdAt
//       }
//     });
//   } catch (error) {
//     console.error('Error creating order:', error);
    
//     // Handle duplicate order number error
//     if (error.code === 11000 && error.keyPattern?.orderNumber) {
//       // Retry order creation
//       try {
//         const order = new Order({
//           ...req.body,
//           user: req.user.id || req.user._id
//         });
//         await order.save();
        
//         return res.status(201).json({
//           success: true,
//           orderNumber: order.orderNumber,
//           order: {
//             _id: order._id,
//             orderNumber: order.orderNumber,
//             finalPrice: order.finalPrice,
//             status: order.status,
//             createdAt: order.createdAt
//           }
//         });
//       } catch (retryError) {
//         console.error('Error in retry:', retryError);
//         return res.status(500).json({
//           success: false,
//           message: 'Failed to create order after retry',
//           error: retryError.message
//         });
//       }
//     }

//     // Handle validation errors
//     if (error.name === 'ValidationError') {
//       return res.status(400).json({
//         success: false,
//         message: 'Validation Error',
//         errors: Object.values(error.errors).map(err => err.message)
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: 'Failed to create order',
//       error: error.message
//     });
//   }
// };

// exports.getOrder = async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }

//     // Check if order belongs to user
//     if (order.user.toString() !== (req.user.id || req.user._id)) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized to access this order'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       order
//     });
//   } catch (error) {
//     console.error('Error fetching order:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch order',
//       error: error.message
//     });
//   }
// };




// controllers/order.controller.js
const Order = require ('../Models/order');
 

exports.createOrder = async (req, res) => {
  try {
    console.log('Creating order with data:', req.body);
    
    // Create new order instance
    const order = new Order({
      user: req.user.id || req.user._id,
      orderDetails: req.body.orderDetails,
      shippingInfo: req.body.shippingInfo,
      giftDetails: req.body.giftDetails,
      finalPrice: req.body.finalPrice
    });

    // Save the order - this will trigger the pre-save middleware
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder);

    res.status(201).json({
      success: true,
      orderNumber: savedOrder.orderNumber,
      order: {
        _id: savedOrder._id,
        orderNumber: savedOrder.orderNumber,
        finalPrice: savedOrder.finalPrice,
        status: savedOrder.status,
        createdAt: savedOrder.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if order belongs to user
    if (order.user.toString() !== (req.user.id || req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      user: req.user.id || req.user._id 
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: orders.map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        finalPrice: order.finalPrice,
        status: order.status,
        createdAt: order.createdAt
      }))
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};