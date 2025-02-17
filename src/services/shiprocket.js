// // src/services/shiprocketService.js
// const axios = require('axios');
// require('dotenv').config();

// class ShiprocketService {
//   constructor() {
//     this.baseURL = 'https://apiv2.shiprocket.in/v1/external';
//     this.token = null;
//     this.tokenExpiry = null;
//   }

//   async getAuthToken() {
//     if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
//       return this.token;
//     }

//     try {
//       const response = await axios.post(`${this.baseURL}/auth/login`, {
//         email: process.env.SHIPROCKET_EMAIL,
//         password: process.env.SHIPROCKET_PASSWORD
//       });

//       this.token = response.data.token;
//       // Set token expiry to 9 days (to be safe)
//       this.tokenExpiry = new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000);
//       return this.token;
//     } catch (error) {
//       console.error('Shiprocket authentication failed:', error.response?.data || error.message);
//       throw new Error('Failed to authenticate with Shiprocket');
//     }
//   }

//   async getAxiosInstance() {
//     const token = await this.getAuthToken();
//     return axios.create({
//       baseURL: this.baseURL,
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });
//   }

//   async createShipment(orderData) {
//     try {
//       const axios = await this.getAxiosInstance();
      
//       // Format order data for Shiprocket
//       const shipmentData = {
//         order_id: orderData.orderNumber,
//         order_date: new Date().toISOString().split('T')[0],
//         pickup_location: "warehous",
//         billing_customer_name: `${orderData.shippingInfo.firstName} ${orderData.shippingInfo.lastName}`,
//         billing_last_name: orderData.shippingInfo.lastName,
//         billing_address: orderData.shippingInfo.address1,
//         billing_address_2: orderData.shippingInfo.address2,
//         billing_city: orderData.shippingInfo.city,
//         billing_pincode: orderData.shippingInfo.zipCode,
//         billing_state: orderData.shippingInfo.state,
//         billing_country: orderData.shippingInfo.country,
//         billing_email: orderData.shippingInfo.email,
//         billing_phone: orderData.shippingInfo.phone,
//         shipping_is_billing: true,
//         order_items: [{
//           name: orderData.orderDetails.product,
//           sku: 'BOOK-' + orderData.orderNumber,
//           units: orderData.orderDetails.customization.quantity,
//           selling_price: orderData.orderDetails.pricing.basePrice,
//         }],
//         payment_method: "prepaid",
//         sub_total: orderData.finalPrice,
//         length: 10,
//         breadth: 10,
//         height: 2,
//         weight: 0.5
//       };

//       // Create order in Shiprocket
//       const orderResponse = await axios.post('/orders/create/adhoc', shipmentData);
//       const { order_id, shipment_id } = orderResponse.data;

//       // Assign AWB
//       const awbResponse = await axios.post('/courier/assign/awb', {
//         shipment_id: shipment_id
//       });

//       // Generate pickup
//       await axios.post('/courier/generate/pickup', {
//         shipment_id: shipment_id
//       });

//       // Generate manifest
//       const manifestResponse = await axios.post('/manifests/generate', {
//         shipment_id: shipment_id
//       });

//       // Generate label
//       const labelResponse = await axios.post('/courier/generate/label', {
//         shipment_id: shipment_id
//       });

//       // Generate invoice
//       const invoiceResponse = await axios.post('/orders/print/invoice', {
//         ids: [order_id]
//       });

//       return {
//         shiprocketOrderId: order_id,
//         shipmentId: shipment_id,
//         awbCode: awbResponse.data.awb_code,
//         courierName: awbResponse.data.courier_name,
//         manifestUrl: manifestResponse.data.manifest_url,
//         labelUrl: labelResponse.data.label_url,
//         invoiceUrl: invoiceResponse.data.invoice_url
//       };
//     } catch (error) {
//       console.error('Shiprocket API error:', error.response?.data || error.message);
//       throw new Error('Failed to create shipment');
//     }
//   }

//   async trackShipment(awbCode) {
//     try {
//       const axios = await this.getAxiosInstance();
//       const response = await axios.get(`/courier/track/awb/${awbCode}`);
//       return response.data;
//     } catch (error) {
//       console.error('Tracking error:', error.response?.data || error.message);
//       throw new Error('Failed to track shipment');
//     }
//   }
// }

// module.exports = new ShiprocketService();

// // src/services/shiprocketService.js// src/services/shiprocketService.js
// const axios = require('axios');
// require('dotenv').config();



// class ShiprocketService {
//   constructor() {
//     this.baseURL = 'https://apiv2.shiprocket.in/v1/external';
//     this.token = null;
//   }

//   // Add delay helper
//   async delay(ms) {
//     return new Promise(resolve => setTimeout(resolve, ms));
//   }

//   async getToken() {
//     try {
//       const response = await axios.post(`${this.baseURL}/auth/login`, {
//         email: process.env.SHIPROCKET_EMAIL,
//         password: process.env.SHIPROCKET_PASSWORD
//       });

//       this.token = response.data.token;
//       console.log('Token received successfully');
//       return this.token;
//     } catch (error) {
//       console.error('Authentication Error:', error.response?.data || error.message);
//       throw new Error('Failed to authenticate with Shiprocket');
//     }
//   }

//   async createShipment(orderData) {
//     try {
//       // Get fresh token for entire process
//       const token = await this.getToken();
//       const headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${token}`
//       };
//     console.log("orderdata",orderData)
//       // Create test order data matching the working test
//       const shipmentData = {
//         order_id: orderData.orderNumber,// Match test format
//         order_date: new Date().toISOString().split('T')[0],
//         pickup_location: "warehous", // Use exact same pickup location as test
//         billing_customer_name: `${orderData.shippingInfo.firstName} ${orderData.shippingInfo.lastName}`,
//         billing_last_name: orderData.shippingInfo.lastName,
//         billing_address: orderData.shippingInfo.address1,
//         billing_city: orderData.shippingInfo.city,
//         billing_pincode: orderData.shippingInfo.zipCode,
//         billing_state: orderData.shippingInfo.state,
//         billing_country: "India",
//         billing_email: orderData.shippingInfo.email,
//         billing_phone: orderData.shippingInfo.phone,
//         shipping_is_billing: true,
//         order_items: [{
//                       name: orderData.orderDetails.product,
//                       sku: 'BOOK-' + orderData.orderNumber,
//                       units: orderData.orderDetails.customization.quantity,
//                       selling_price: orderData.orderDetails.pricing.basePrice,
//                  }],
//         payment_method: "prepaid",
//         sub_total: 100,
//         length: 10,
//         breadth: 10,
//         height: 2,
//         weight: 0.5
//       };
//       console.log('Creating order', shipmentData);

//       console.log('Creating order with data:', shipmentData);

//       // Create order
//       const orderResponse = await axios.post(
//         `${this.baseURL}/orders/create/adhoc`,
//       {shipmentData},
//         { headers }
//       );

//       console.log('Order', orderResponse.data);

//       if (!orderResponse.data.shipment_id) {
//         throw new Error('No shipment ID received');
//       }

//       // Wait before AWB generation
//       await this.delay(2000);

//       // Generate AWB
//       console.log('Generating AWB for shipment:', orderResponse.data.shipment_id);
//       const awbResponse = await axios.post(
//         `${this.baseURL}/courier/assign/awb`,
//         {
//           shipment_id: orderResponse.data.shipment_id
//         },
//         { headers }
//       );

//       console.log('AWB Response:', awbResponse.data);

//       if (!awbResponse.data.awb_code) {
//         throw new Error('AWB generation failed');
//       }

//       // Wait before pickup generation
//       await this.delay(2000);

//       // Generate pickup
//       console.log('Generating pickup...');
//       const pickupResponse = await axios.post(
//         `${this.baseURL}/courier/generate/pickup`,
//         {
//           shipment_id: orderResponse.data.shipment_id
//         },
//         { headers }
//       );

//       console.log('Pickup generated:', pickupResponse.data);

//       // Wait before manifest generation
//       await this.delay(1000);

//       // Generate manifest
//       const manifestResponse = await axios.post(
//         `${this.baseURL}/manifests/generate`,
//         {
//           shipment_id: orderResponse.data.shipment_id
//         },
//         { headers }
//       );

//       // Generate label
//       const labelResponse = await axios.post(
//         `${this.baseURL}/courier/generate/label`,
//         {
//           shipment_id: orderResponse.data.shipment_id
//         },
//         { headers }
//       );

//       // Generate invoice
//       const invoiceResponse = await axios.post(
//         `${this.baseURL}/orders/print/invoice`,
//         {
//           ids: [orderResponse.data.order_id]
//         },
//         { headers }
//       );

//       return {
//         shiprocketOrderId: orderResponse.data.order_id,
//         shipmentId: orderResponse.data.shipment_id,
//         awbCode: awbResponse.data.awb_code,
//         courierName: awbResponse.data.courier_name,
//         manifestUrl: manifestResponse.data?.manifest_url,
//         labelUrl: labelResponse.data?.label_url,
//         invoiceUrl: invoiceResponse.data?.invoice_url
//       };
//     } catch (error) {
//       console.error('Shiprocket API error:', 
//         error.response?.data || error.message,
//         '\nFull error:', error
//       );
//       throw new Error(`Failed to create shipment: ${error.message}`);
//     }
//   }

//   async trackShipment(awbCode) {
//     try {
//       const token = await this.getToken();
//       const response = await axios.get(
//         `${this.baseURL}/courier/track/awb/${awbCode}`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
//       return response.data;
//     } catch (error) {
//       console.error('Tracking error:', error.response?.data || error.message);
//       throw new Error('Failed to track shipment');
//     }
//   }
// }

// module.exports = new ShiprocketService();


// services/shiprocket.js
const axios = require('axios');
require('dotenv').config();

// Validate environment variables
if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
  console.error('❌ Missing Shiprocket credentials in environment variables');
  process.exit(1);
}

console.log('✅ Shiprocket credentials found');

class ShiprocketService {
  constructor() {
    this.baseURL = 'https://apiv2.shiprocket.in/v1/external';
    this.token = null;
  }

  async delay(ms) {
    console.log(`⏳ Waiting for ${ms}ms...`);
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getToken() {
    console.log('🔑 Getting Shiprocket token...');
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      });

      this.token = response.data.token;
      console.log('✅ Token received successfully');
      return this.token;
    } catch (error) {
      console.error('❌ Authentication Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Shiprocket');
    }
  }

  async createShipment(orderData) {
    console.log('\n🚀 Starting shipment creation...');
    try {
      const token = await this.getToken();
      console.log('✅ Got authentication token');

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Format order data
      console.log('📝 Formatting order data...');
      const shipmentData = {
        order_id: orderData.orderNumber,
        order_date: new Date().toISOString().split('T')[0],
        pickup_location: "warehous",
        billing_customer_name: `${orderData.shippingInfo.firstName}`,
        billing_last_name: orderData.shippingInfo.lastName,
        billing_address: orderData.shippingInfo.address1,
        billing_city: orderData.shippingInfo.city,
        billing_pincode: orderData.shippingInfo.zipCode,
        billing_state: orderData.shippingInfo.state,
        billing_country: "India",
        billing_email: orderData.shippingInfo.email,
        billing_phone: orderData.shippingInfo.phone,
        shipping_is_billing: true,
        order_items: [{
                              name: orderData.orderDetails.product,
                               sku: 'BOOK-' + orderData.orderNumber,
                                units: orderData.orderDetails.customization.quantity,
                               selling_price: orderData.orderDetails.pricing.basePrice,
                          }],
        payment_method: "prepaid",
        sub_total: 100,
        length: 10,
        breadth: 10,
        height: 2,
        weight: 0.5
      };

      console.log('📦 Creating order in Shiprocket...', shipmentData);
      const orderResponse = await axios.post(
        `${this.baseURL}/orders/create/adhoc`,
        shipmentData,
        { headers }
      );
      console.log('✅ Order created:', orderResponse.data);

      if (!orderResponse.data.shipment_id) {
        throw new Error('No shipment ID received');
      }

      // Wait before AWB generation
      await this.delay(2000);

      // Generate AWB
      console.log('🏷️ Generating AWB...');
      const awbResponse = await axios.post(
        `${this.baseURL}/courier/assign/awb`,
        {
          shipment_id: orderResponse.data.shipment_id
        },
        { headers }
      );
      console.log('✅ AWB generated:', awbResponse.data);

      const awbDetails = awbResponse.data.response.data;
      console.log('AWB Details:', awbDetails);
  
      if (!awbDetails || !awbDetails.awb_code) {
        throw new Error('AWB code not found in response');
      }
  
      // Wait before pickup generation
      await this.delay(2000);
  

      // Wait before pickup generation
      await this.delay(2000);

      // Generate pickup
      console.log('🚚 Generating pickup...');
      await axios.post(
        `${this.baseURL}/courier/generate/pickup`,
        {
          shipment_id: orderResponse.data.shipment_id
        },
        { headers }
      );

      // Generate manifest
      console.log('📄 Generating manifest...');
      const manifestResponse = await axios.post(
        `${this.baseURL}/manifests/generate`,
        {
          shipment_id: orderResponse.data.shipment_id
        },
        { headers }
      );

      // Generate label
      console.log('🏷️ Generating label...');
      const labelResponse = await axios.post(
        `${this.baseURL}/courier/generate/label`,
        {
          shipment_id: orderResponse.data.shipment_id
        },
        { headers }
      );

      // Generate invoice
      console.log('📑 Generating invoice...');
      const invoiceResponse = await axios.post(
        `${this.baseURL}/orders/print/invoice`,
        {
          ids: [orderResponse.data.order_id]
        },
        { headers }
      );

      const result = {
        shiprocketOrderId: orderResponse.data.order_id,
        shipmentId: orderResponse.data.shipment_id,
        awbCode: awbResponse.data.awb_code,
        courierName: awbResponse.data.courier_name,
        manifestUrl: manifestResponse.data?.manifest_url,
        labelUrl: labelResponse.data?.label_url,
        invoiceUrl: invoiceResponse.data?.invoice_url
      };

      console.log('✅ Shipment creation completed:', result);
      return result;
    } catch (error) {
      console.error('❌ Shiprocket API error:', error.response?.data || error.message);
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      throw new Error(`Failed to create shipment: ${error.message}`);
    }
  }
}

module.exports = new ShiprocketService();