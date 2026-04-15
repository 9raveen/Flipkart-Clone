const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOrderConfirmationEmail = async (email, order, items) => {
  const itemsList = items.map(i => `<li>${i.productName} x${i.quantity} - ₹${i.price}</li>`).join('');
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Order Confirmed - ${order.orderNumber}`,
    html: `
      <h2>Thank you for your order!</h2>
      <p>Order ID: <strong>${order.orderNumber}</strong></p>
      <p>Total: <strong>₹${order.totalAmount}</strong></p>
      <ul>${itemsList}</ul>
      <p>Your order will be delivered within 5-7 business days.</p>
    `,
  });
};
