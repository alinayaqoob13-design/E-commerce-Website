exports.emailTemplates = {
  // Email verification template
  verification: (otp) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp { font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; padding: 20px; background-color: #f0f0f0; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>Thank you for signing up! Please use the following verification code to complete your registration:</p>
          <div class="otp">${otp}</div>
          <p>This code will expire in <strong>5 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Password reset template
  passwordReset: (resetUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
          <p>This link will expire in <strong>1 hour</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Welcome email template
  welcome: (name) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 15px 30px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to ShopHub!</h1>
        </div>
        <div class="content">
          <p>Hello ${name},</p>
          <p>Welcome to ShopHub! We're excited to have you on board.</p>
          <p>Start shopping and discover amazing products at great prices.</p>
          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/shop" class="button">Start Shopping</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `,

  // Order confirmation template
  orderConfirmation: (orderData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background-color: white; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; color: #666; margin-top: 20px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed!</h1>
        </div>
        <div class="content">
          <p>Thank you for your order!</p>
          <div class="order-details">
            <p><strong>Order Number:</strong> ${orderData.orderNumber}</p>
            <p><strong>Total:</strong> $${orderData.total}</p>
            <p><strong>Status:</strong> ${orderData.status}</p>
          </div>
          <p>We'll send you another email when your order ships.</p>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
};
