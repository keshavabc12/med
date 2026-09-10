const express = require('express');
const Visit = require('../models/Visit');

const router = express.Router();

/**
 * POST /api/track
 * Public endpoint to track unique visitors.
 * Clients should send `{ sessionId, deviceType, browser }`.
 * `lastActivity` is automatically updated to `Date.now()`.
 */
router.post('/', async (req, res) => {
  try {
    const { sessionId, deviceType, browser } = req.body;
    
    // IP address extraction (fallback for proxies if needed)
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'Unknown';

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    // Upsert the visitor log based on sessionId
    await Visit.findOneAndUpdate(
      { sessionId },
      {
        ip,
        deviceType: deviceType || 'Unknown',
        browser: browser || 'Unknown',
        lastActivity: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Tracking Error:', error);
    // Return 200 anyway so we don't spam the client console with 500s for analytics pings
    res.status(200).json({ success: false, message: 'Tracking failed but ignored' });
  }
});

module.exports = router;
