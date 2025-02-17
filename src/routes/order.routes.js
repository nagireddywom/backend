// backend/src/routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../Middleware/Auth.middleware');

// All routes require authentication
// router.use(authMiddleware);
// router.post('/', auth, orderController.createOrder);

// Get order by ID
// router.get('/:orderId', auth, orderController.getOrder);

// Get user's orders
// router.get('/user/orders', auth, orderController.getUserOrders);
// router.post('/orders', auth, orderController.createOrder);
// router.get('/orders/:orderNumber', auth, orderController.getOrder);
// router.get('/:orderNumber', auth, orderController.getOrder);

// Get all orders for authenticated user
// router.get('/user/orders', auth, orderController.getUserOrders);

console.log('Available controller methods:', Object.keys(orderController));

// Create new order
router.post('/', auth, orderController.createOrder);

// Get order by order number
router.get('/:orderNumber', auth, orderController.getOrder);

// Get all orders for user
router.get('/user/orders', auth, orderController.getUserOrders);





// Create new order
// router.post('/', orderController.createOrder);

// // Get specific order
// router.get('/:orderNumber', orderController.getOrder);

// // Get all orders for user
// router.get('/user/orders', orderController.getUserOrders);

// // Update shipping info
// router.put('/:orderNumber/shipping', orderController.updateShippingInfo);

// // Cancel order
// router.put('/:orderNumber/cancel', orderController.cancelOrder);

module.exports = router;