// // src/routes/shiprocketRoutes.js
// const express = require('express');
// const router = express.Router();
// const shiprocketService = require('../services/shiprocket');

// // Test authentication route
// router.get('/test-auth', async (req, res) => {
//   try {
//     const token = await shiprocketService.testAuthentication();
//     res.json({ 
//       success: true, 
//       message: 'Shiprocket authentication successful',
//       token
//     });
//   } catch (error) {
//     res.status(500).json({ 
//       success: false, 
//       error: error.message 
//     });
//   }
// });

// module.exports = router;

// routes/shiprocketRoutes.js
const express = require('express');
const router = express.Router();
const { trackShipment } = require('../controllers/tracking.controller');
const { generateInvoice } = require('../controllers/invoice.controller');

router.get('/track/:awbNumber', trackShipment);
router.post('/generate-invoice', generateInvoice);

module.exports = router;