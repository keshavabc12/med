const express = require('express');
const { body } = require('express-validator');
const order = require('../controllers/order.controller');
const { protect, adminOnly, userOnly } = require('../middleware/auth');

const router = express.Router();

const createRules = [
  body('items').isArray({ min: 1 }).withMessage('items required'),
  body('items.*.productId').isMongoId(),
  body('items.*.quantity').optional().isInt({ min: 1 }),
  body('paymentMethod').isIn(['cod', 'online']),
  body('shippingAddress').optional().isString(),
  body('mockPaymentSuccess').optional().isBoolean(),
];

router.post('/', createRules, order.create);
router.get('/my', protect, userOnly, order.myOrders);
/** Must be before GET / so "my" is not treated as :id */
router.get('/my/:orderId', protect, userOnly, order.getMyOrderById);
router.get('/', protect, adminOnly, order.listAll);
router.patch('/:id/status', protect, adminOnly, order.updateStatus);

module.exports = router;
