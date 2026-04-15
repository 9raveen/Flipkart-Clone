const router = require('express').Router();
const { getProducts, getProductById, getFeaturedProducts } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

module.exports = router;
