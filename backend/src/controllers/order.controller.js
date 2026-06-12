const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');

/** POST /api/orders — public guest checkout (user optional) */
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { items, paymentMethod, shippingAddress, mockPaymentSuccess } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Cart is empty' });
    }
    if (!['cod', 'online'].includes(paymentMethod)) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    let total = 0;
    const lineItems = [];

    for (const line of items) {
      const product = await Product.findById(line.productId).session(session);
      if (!product || !product.isActive) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Product unavailable: ${line.productId}` });
      }
      const qty = Math.max(1, Number(line.quantity) || 1);
      if (product.stock < qty) {
        await session.abortTransaction();
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      const lineTotal = product.price * qty;
      total += lineTotal;
      lineItems.push({
        product: product._id,
        name: product.name,
        quantity: qty,
        price: product.price,
        image: product.image || '',
      });
      product.stock -= qty;
      await product.save({ session });
    }

    let paymentStatus = 'unpaid';
    if (paymentMethod === 'cod') {
      paymentStatus = 'unpaid';
    } else if (paymentMethod === 'online') {
      // Mock gateway: treat explicit flag as success
      paymentStatus = mockPaymentSuccess === true ? 'paid' : 'unpaid';
    }

    const orderData = {
      items: lineItems,
      total,
      paymentMethod,
      paymentStatus,
      shippingAddress: shippingAddress || (req.user && req.user.address) || '',
      status: 'pending',
    };
    if (req.user && req.user._id) {
      orderData.user = req.user._id;
    } else if (req.body.guest) {
      orderData.guest = req.body.guest;
    } else {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Guest information required' });
    }
    const [order] = await Order.create([orderData], { session });

    await session.commitTransaction();
    res.status(201).json(order);
  } catch (e) {
    await session.abortTransaction();
    res.status(500).json({ message: e.message || 'Order failed' });
  } finally {
    session.endSession();
  }
};

/** GET /api/orders/my/:orderId — one order for tracking (must belong to user) */
exports.getMyOrderById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.orderId)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id,
    })
      .populate('items.product', 'name image price category')
      .lean();
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to load order' });
  }
};

/** GET /api/orders/my */
exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name image price category')
      .lean();
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to load orders' });
  }
};

/** GET /api/orders — admin all */
exports.listAll = async (_req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone')
      .lean();
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to list orders' });
  }
};

/** PATCH /api/orders/:id/status — admin */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to update order' });
  }
};
