const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  ip: { type: String },
  deviceType: { type: String, enum: ['Mobile', 'Tablet', 'Desktop', 'Unknown'], default: 'Unknown' },
  browser: { type: String, default: 'Unknown' },
  lastActivity: { type: Date, default: Date.now },
}, { timestamps: true });

// Auto-delete visits older than 30 days based on lastActivity to save space
VisitSchema.index({ lastActivity: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Visit', VisitSchema);
