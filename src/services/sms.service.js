class SMSService {
    async sendSMS(phoneNumber, message) {
      // Integrate with your SMS provider (Twilio, MessageBird, etc.)
      console.log(`Sending SMS to ${phoneNumber}: ${message}`);
      // Example with Twilio:
      // const twilioClient = require('twilio')(accountSid, authToken);
      // return twilioClient.messages.create({
      //   body: message,
      //   to: phoneNumber,
      //   from: twilioNumber
      // });
    }
  }
  
  module.exports = new SMSService();