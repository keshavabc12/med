const express = require('express');
const user = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, adminOnly, user.list);
router.get('/:id', protect, adminOnly, user.getById);

module.exports = router;
