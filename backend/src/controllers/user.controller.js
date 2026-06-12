const User = require('../models/User');

/** GET /api/users — admin list (no passwords) */
exports.list = async (_req, res) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to list users' });
  }
};

/** GET /api/users/:id — admin */
exports.getById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) {
    res.status(500).json({ message: e.message || 'Failed to get user' });
  }
};
