const { validationResult } = require('express-validator');
const Product = require('../models/Product');

/** GET /api/products — search, category filter, pagination */
exports.list = async (req, res) => {
  try {
    const {
      q = '',
      category,
      page = 1,
      limit = 12,
      includeInactive,
    } = req.query;
    const filter = {};
    const showInactive = includeInactive === 'true' && req.user?.role === 'admin';
    if (!showInactive) {
      filter.isActive = true;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (q) {
      filter.$or = [
        { name: new RegExp(q.trim(), 'i') },
        { description: new RegExp(q.trim(), 'i') },
        { sku: new RegExp(q.trim(), 'i') },
      ];
    }
    const skip = (Math.max(1, Number(page)) - 1) * Math.min(50, Math.max(1, Number(limit)));
    const take = Math.min(50, Math.max(1, Number(limit)));
    const [items, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(take).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ items, total, page: Number(page), limit: take });
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to list products' });
  }
};

/** GET /api/products/:id */
exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (!product.isActive && req.user?.role !== 'admin') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to get product' });
  }
};

/** POST /api/products — admin */
exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  try {
    const body = { ...req.body };
    if (body.price !== undefined) body.price = Number(body.price);
    if (body.costPrice !== undefined) body.costPrice = Number(body.costPrice);
    if (body.stock !== undefined) body.stock = Number(body.stock);
    if (body.isActive !== undefined) body.isActive = body.isActive === true || body.isActive === 'true';
    if (!body.name || !body.category || Number.isNaN(body.price)) {
      return res.status(400).json({ message: 'name, category, and valid price are required' });
    }
    if (req.files?.image?.[0]) {
      body.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.document?.[0]) {
      body.documentUrl = `/uploads/${req.files.document[0].filename}`;
    }
    const product = await Product.create(body);
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to create product' });
  }
};

/** PUT /api/products/:id — admin */
exports.update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
  }
  try {
    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (updates.costPrice !== undefined) updates.costPrice = Number(updates.costPrice);
    if (updates.stock !== undefined) updates.stock = Number(updates.stock);
    if (updates.isActive !== undefined) {
      updates.isActive = updates.isActive === true || updates.isActive === 'true';
    }
    if (req.files?.image?.[0]) {
      updates.image = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.document?.[0]) {
      updates.documentUrl = `/uploads/${req.files.document[0].filename}`;
    }
    const product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to update product' });
  }
};

/** DELETE /api/products/:id — admin (soft delete) or ?permanent=true to remove from DB */
exports.remove = async (req, res) => {
  try {
    const permanent = req.query.permanent === 'true';
    if (permanent) {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json({ message: 'Product deleted permanently', product });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deactivated', product });
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to delete product' });
  }
};

/** PATCH /api/products/:id/stock — admin */
exports.updateStock = async (req, res) => {
  try {
    const stock = Number(req.body.stock);
    if (Number.isNaN(stock) || stock < 0) {
      return res.status(400).json({ message: 'Invalid stock value' });
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to update stock' });
  }
};

/** GET /api/products/admin/low-stock — admin */
exports.lowStock = async (req, res) => {
  try {
    const threshold = Math.max(0, Number(req.query.threshold) || 10);
    const items = await Product.find({ isActive: true, stock: { $lte: threshold } })
      .sort({ stock: 1 })
      .lean();
    res.json({ items, threshold });
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed low stock query' });
  }
};
