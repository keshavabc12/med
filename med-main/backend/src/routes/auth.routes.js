// backend/src/routes/auth.routes.js
const express = require('express');
const { body } = require('express-validator');
const auth = require('../controllers/auth.controller');

const router = express.Router();
const { protect } = require('../middleware/auth');

// Validation rules
const loginRules = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const registerRules = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

router.post('/register', registerRules, auth.register);
router.post('/login', loginRules, auth.login);
router.post('/admin/login', loginRules, auth.adminLogin);
router.get('/me', protect, auth.me);

module.exports = router;

