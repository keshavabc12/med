const express = require('express');
const { body } = require('express-validator');
const product = require('../controllers/product.controller');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { productFields } = require('../middleware/upload');

const router = express.Router();

/** Multipart sends strings; controller coerces numbers and isActive */
const productBodyRules = [
  body('name').optional().trim().notEmpty(),
  body('description').optional().isString(),
  body('price').optional().isFloat({ min: 0 }),
  body('category')
    .optional()
    .isIn(['medicine', 'healthcare', 'vitamins', 'personal-care', 'devices']),
  body('stock').optional().isInt({ min: 0 }),
  body('costPrice').optional().isFloat({ min: 0 }),
  body('sku').optional().isString(),
];

/** Admin: low-stock before :id */
router.get('/admin/low-stock', protect, adminOnly, product.lowStock);

/** optionalAuth lets admins pass ?includeInactive=true with Bearer token */
router.get('/', optionalAuth, product.list);
router.get('/:id', optionalAuth, product.getById);

router.post('/', protect, adminOnly, productFields, productBodyRules, product.create);
router.put('/:id', protect, adminOnly, productFields, productBodyRules, product.update);
router.delete('/:id', protect, adminOnly, product.remove);
router.patch('/:id/stock', protect, adminOnly, product.updateStock);

module.exports = router;
