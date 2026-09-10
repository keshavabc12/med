// backend/src/models/Order.js
const mongoose = require('mongoose');

// Sub‑schema for guest checkout information
const guestInfoSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
  },
  { _id: false }
);

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Optional reference to a registered user (admin can still see it)
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    // Guest information is required when `user` is not provided
    guest: { type: guestInfoSchema, required: function () { return !this.user; } },
    items: [orderItemSchema],
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    paymentMethod: { type: String, enum: ['cod', 'online'], required: true },
    // For mock online flow we store 'paid' | 'unpaid'
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    shippingAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
