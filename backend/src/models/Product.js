const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, index: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    /** Cost / buy price for margin & profit charts (optional, default 0) */
    costPrice: { type: Number, default: 0, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ['medicine', 'healthcare', 'vitamins', 'personal-care', 'devices'],
    },
    /** Public URL path e.g. /uploads/filename.jpg */
    image: { type: String, default: '' },
    /** Public URL path for optional PDF document e.g. /uploads/doc.pdf */
    documentUrl: { type: String, default: '' },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
