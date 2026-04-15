const router = require('express').Router();
const { register, login, getDefaultUser } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/default', getDefaultUser);

module.exports = router;
