// controllers/trackingController.js
const shiprocketService = require('../services/shiprocket');

const trackShipment = async (req, res) => {
  try {
    const { awbNumber } = req.params;

    // Get token and make request to Shiprocket
    const token = await shiprocketService.getToken();
    
    const response = await fetch(
      `https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbNumber}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tracking information');
    }

    res.json({
      current_status: data.tracking_data?.track_status || 'Status not available',
      etd: data.tracking_data?.expected_delivery_date,
      tracking_data: data.tracking_data?.shipment_track || []
    });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({
      error: 'Failed to fetch tracking information',
      details: error.message
    });
  }
};

module.exports = {
  trackShipment
};