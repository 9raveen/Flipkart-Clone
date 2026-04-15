const { Product, Category } = require('../models');
const { Op } = require('sequelize');

const DEFAULT_USER_ID = 'default-user-uuid-0000-000000000001';

exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 20 } = req.query;
    const where = {};
    const offset = (page - 1) * limit;

    if (search) where.name = { [Op.iLike]: `%${search}%` };
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    const include = [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }];
    if (category) {
      include[0].where = { slug: category };
    }

    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    else if (sort === 'price_desc') order = [['price', 'DESC']];
    else if (sort === 'rating') order = [['rating', 'DESC']];
    else if (sort === 'popularity') order = [['reviewCount', 'DESC']];

    const { count, rows } = await Product.findAndCountAll({
      where, include, order,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({ products: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category' }],
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isFeatured: true },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }],
      limit: 10,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
