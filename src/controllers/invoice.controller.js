// controllers/invoiceController.js
const shiprocketService = require('../services/shiprocket');

const generateInvoice = async (req, res) => {
  try {
    const { orderNumber, shipmentId } = req.body;

    if (!orderNumber || !shipmentId) {
      return res.status(400).json({
        success: false,
        error: 'Order number and shipment ID are required'
      });
    }

    // Get token
    const token = await shiprocketService.getToken();

    // Call Shiprocket API to generate invoice
    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/print/invoice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ids: [orderNumber]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate invoice');
    }

    // Return the invoice URL
    res.json({
      success: true,
      invoice_url: data.invoice_url,
      message: 'Invoice generated successfully'
    });
  } catch (error) {
    console.error('Invoice generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate invoice',
      details: error.message
    });
  }
};

module.exports = {
  generateInvoice
};