const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  ip: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Visit', VisitSchema);
