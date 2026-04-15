const router = require('express').Router();
const { placeOrder, getOrders, getOrderById } = require('../controllers/orderController');

router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;
