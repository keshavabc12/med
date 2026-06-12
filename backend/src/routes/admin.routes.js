const express = require('express');
const admin = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', protect, adminOnly, admin.dashboard);

module.exports = router;
