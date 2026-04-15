const { Order, OrderItem, CartItem, Product } = require('../models');
const { sendOrderConfirmationEmail } = require('../utils/mailer');

const DEFAULT_USER_ID = 'default-user-uuid-0000-000000000001';

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FK${timestamp}${random}`;
};

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    const { shippingAddress, paymentMethod = 'COD' } = req.body;

    if (!shippingAddress) return res.status(400).json({ error: 'Shipping address is required' });

    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product' }],
    });

    if (!cartItems.length) return res.status(400).json({ error: 'Cart is empty' });

    // Validate stock
    for (const item of cartItems) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${item.product.name}` });
      }
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const order = await Order.create({
      userId,
      totalAmount,
      shippingAddress,
      paymentMethod,
      orderNumber: generateOrderNumber(),
      status: 'confirmed',
    });

    // Create order items and reduce stock
    const orderItems = await Promise.all(cartItems.map(item =>
      OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
        productName: item.product.name,
        productImage: item.product.images?.[0] || '',
      })
    ));

    // Reduce stock
    await Promise.all(cartItems.map(item =>
      Product.decrement('stock', { by: item.quantity, where: { id: item.productId } })
    ));

    // Clear cart
    await CartItem.destroy({ where: { userId } });

    // Send email (non-blocking)
    if (shippingAddress.email) {
      sendOrderConfirmationEmail(shippingAddress.email, order, orderItems).catch(console.error);
    }

    const fullOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.status(201).json(fullOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    const orders = await Order.findAll({
      where: { userId },
      include: [{ model: OrderItem, as: 'items' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    const order = await Order.findOne({
      where: { id: req.params.id, userId },
      include: [{ model: OrderItem, as: 'items' }],
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
