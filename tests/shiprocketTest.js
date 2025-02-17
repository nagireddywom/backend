// src/tests/shiprocketTest.js
require('dotenv').config();
const shiprocketService = require('../services/shiprocket');

// Test Functions
async function runShiprocketTests() {
    try {
        // First get the token
        const token = await shiprocketService.getToken();
        console.log('Token received:', token);

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        // Test 1: Check serviceability
        console.log('\nTesting Serviceability...');
        const serviceabilityResponse = await fetch('https://apiv2.shiprocket.in/v1/external/courier/serviceability/', {
            method: 'GET',
            headers: headers,
            params: {
                pickup_postcode: "110001",
                delivery_postcode: "110002",
                weight: 0.5,
                cod: 0
            }
        });
        console.log('Serviceability Response:', await serviceabilityResponse.json());

        // Test 2: Create Test Order
        console.log('\nCreating Test Order...');
        const orderData = {
            order_id: `TEST-${Date.now()}`, // Unique order ID
            order_date: new Date().toISOString().split('T')[0],
            pickup_location: "warehous",
            billing_customer_name: "Test Name",
            billing_last_name: "Last",
            billing_address: "Test Address",
            billing_city: "New Delhi",
            billing_pincode: "110001",
            billing_state: "Delhi",
            billing_country: "India",
            billing_email: "test@test.com",
            billing_phone: "9972058537",
            shipping_is_billing: true,
            order_items: [{
                name: "Test",
                sku: `SKU-${Date.now()}`,
                units: 1,
                selling_price: "100",
            }],
            payment_method: "prepaid",
            sub_total: 100,
            length: 10,
            breadth: 10,
            height: 2,
            weight: 0.5
        };

        const orderResponse = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(orderData)
        });
        const orderResult = await orderResponse.json();
        console.log('Order Created:', orderResult);

        if (orderResult.shipment_id) {
            // Test 3: Generate AWB
            console.log('\nGenerating AWB...');
            const awbResponse = await fetch('https://apiv2.shiprocket.in/v1/external/courier/assign/awb', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    shipment_id: orderResult.shipment_id
                })
            });
            const awbResult = await awbResponse.json();
            console.log('AWB Generated:', awbResult);

            // Test 4: Generate Pickup
            if (awbResult.awb_code) {
                console.log('\nGenerating Pickup...');
                const pickupResponse = await fetch('https://apiv2.shiprocket.in/v1/external/courier/generate/pickup', {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        shipment_id: orderResult.shipment_id
                    })
                });
                console.log('Pickup Generated:', await pickupResponse.json());

                // Test 5: Track Order
                console.log('\nTracking Order...');
                const trackingResponse = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbResult.awb_code}`, {
                    method: 'GET',
                    headers: headers
                });
                console.log('Tracking Info:', await trackingResponse.json());
            }
        }

    } catch (error) {
        console.error('Test Error:', error);
    }
}

// Run the tests
console.log('Starting Shiprocket API Tests...');
runShiprocketTests();