// backend/src/routes/order.routes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const auth = require('../Middleware/Auth.middleware');

// All routes require authentication
// router.use(authMiddleware);



console.log('Available controller methods:', Object.keys(orderController));

// Create new order
// router.post('/', auth, orderController.createOrder);

// // Get order by order number
// router.get('/:orderNumber', auth, orderController.getOrder);
router.post('/', (req, res, next) => {
    if (req.headers.authorization) {
      auth(req, res, next);
    } else {
      next();
    }
  }, orderController.createOrder);
  
  // Get order by order number - handles both authenticated and guest orders
  router.get('/:orderNumber', (req, res, next) => {
    if (req.headers.authorization) {
      auth(req, res, next);
    } else {
      next();
    }
  }, orderController.getOrder);
  

// Get all orders for user
router.get('/user/orders', auth, orderController.getUserOrders);

router.post('/guest/track', orderController.getGuestOrder);







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