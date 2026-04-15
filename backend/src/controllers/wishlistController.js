const { Wishlist, Product, Category } = require('../models');

const DEFAULT_USER_ID = 'default-user-uuid-0000-000000000001';

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    const items = await Wishlist.findAll({
      where: { userId },
      include: [{ model: Product, as: 'product', include: [{ model: Category, as: 'category' }] }],
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    const { productId } = req.body;
    const [item, created] = await Wishlist.findOrCreate({ where: { userId, productId } });
    res.status(created ? 201 : 200).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.id || DEFAULT_USER_ID;
    await Wishlist.destroy({ where: { productId: req.params.productId, userId } });
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
