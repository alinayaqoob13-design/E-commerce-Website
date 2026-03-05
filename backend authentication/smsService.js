// This is a placeholder for SMS service
// You can integrate with Twilio, MessageBird, or any other SMS provider

const twilio = require('twilio');

let twilioClient = null;

if (process.env.TWILIO_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Send OTP via SMS
exports.sendOTP = async (phone, otp) => {
  try {
    if (!twilioClient) {
      console.log(`SMS would be sent to ${phone}: Your OTP is ${otp}`);
      return { success: true, mock: true };
    }

    await twilioClient.messages.create({
      body: `Your ShopHub verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    return { success: true };
  } catch (error) {
    console.error('Send SMS error:', error);
    throw error;
  }
};

// Send order status SMS
exports.sendOrderStatusSMS = async (phone, orderNumber, status) => {
  try {
    const messages = {
      confirmed: `Your order #${orderNumber} has been confirmed.`,
      shipped: `Your order #${orderNumber} has been shipped.`,
      delivered: `Your order #${orderNumber} has been delivered.`,
      cancelled: `Your order #${orderNumber} has been cancelled.`
    };

    const message = messages[status] || `Your order #${orderNumber} status: ${status}`;

    if (!twilioClient) {
      console.log(`SMS would be sent to ${phone}: ${message}`);
      return { success: true, mock: true };
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    return { success: true };
  } catch (error) {
    console.error('Send order status SMS error:', error);
    throw error;
  }
};
