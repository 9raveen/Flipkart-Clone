const { CartItem, Product, Category } = require('../models');

const DEFAULT_USER_ID = 'default-user-uuid-0000-000000000001';

exports.getCart = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    const items = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product', include: [{ model: Category, as: 'category' }] }],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ error: 'Insufficient stock' });

    const [item, created] = await CartItem.findOrCreate({
      where: { userId, productId },
      defaults: { quantity },
    });

    if (!created) {
      item.quantity += quantity;
      await item.save();
    }

    const updatedItem = await CartItem.findByPk(item.id, {
      include: [{ model: Product, as: 'product' }],
    });
    res.status(created ? 201 : 200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    const { quantity } = req.body;
    const item = await CartItem.findOne({ where: { id: req.params.id, userId } });
    if (!item) return res.status(404).json({ error: 'Cart item not found' });

    if (quantity <= 0) {
      await item.destroy();
      return res.json({ message: 'Item removed from cart' });
    }

    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    const item = await CartItem.findOne({ where: { id: req.params.id, userId } });
    if (!item) return res.status(404).json({ error: 'Cart item not found' });
    await item.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    await CartItem.destroy({ where: { userId } });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
