const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const Visit = require('../models/Visit'); // New model for visitor logs

/**
 * Dashboard: KPIs + real visitor metrics.
 * GET /api/admin/dashboard
 */
exports.dashboard = async (_req, res) => {
  try {
    // Core KPIs
    const [totalRevenueAgg, totalUsers, totalProducts, totalVisitors] = await Promise.all([
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, sum: { $sum: '$total' } } },
      ]),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      Visit.countDocuments(), // all‑time unique sessions
    ]);

    const totalRevenue = totalRevenueAgg[0]?.sum || 0;

    // Real‑time visitors (last 5 minutes)
    const realTimeVisitors = await Visit.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
    });

    // Visitor series aggregations
    const now = new Date();
// Aggregated totals for today, this week, this month
const startOfDay = new Date(now);
startOfDay.setHours(0,0,0,0);
const startOfWeek = new Date(now);
startOfWeek.setDate(now.getDate() - now.getDay() + 1);
startOfWeek.setHours(0,0,0,0);
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const todayVisitors = await Visit.countDocuments({ createdAt: { $gte: startOfDay } });
const thisWeekVisitors = await Visit.countDocuments({ createdAt: { $gte: startOfWeek } });
const thisMonthVisitors = await Visit.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Daily visitors for last 30 days
    const dailyVisitors = await Visit.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: '%b %d', date: '$createdAt' } }, visitors: { $sum: 1 } } },
      { $project: { label: '$_id', visitors: 1, _id: 0 } },
      { $sort: { label: 1 } },
    ]);

    // Weekly visitors (by weekday) for the past week
    const weeklyVisitors = await Visit.aggregate([
      { $match: { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dayOfWeek: '$createdAt' }, visitors: { $sum: 1 } } },
      {
        $project: {
          label: { $arrayElemAt: [
            ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            { $subtract: ['$_id', 1] },
          ] },
          visitors: 1,
          _id: 0,
        },
      },
      { $sort: { label: 1 } },
    ]);

    // Monthly visitors for last 12 months
    const monthlyVisitors = await Visit.aggregate([
      {
        $match: { createdAt: { $gte: new Date(now.getFullYear() - 1, now.getMonth(), 1) } },
      },
      { $group: { _id: { $dateToString: { format: '%b', date: '$createdAt' } }, visitors: { $sum: 1 } } },
      { $project: { label: '$_id', visitors: 1, _id: 0 } },
      { $sort: { label: 1 } },
    ]);

      // Real-time visitors per minute for last 30 minutes
      const realTimeSeries = await Visit.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getTime() - 30 * 60 * 1000) } } },
        { $group: { _id: { $dateToString: { format: "%H:%M", date: "$createdAt" } }, visitors: { $sum: 1 } } },
        { $project: { label: '$_id', visitors: 1, _id: 0 } },
        { $sort: { label: 1 } },
      ]);

    res.json({
      totalRevenue,
      totalUsers,
      totalProducts,
      totalVisitors,
      realTimeVisitors,
      todayVisitors,
      thisWeekVisitors,
      thisMonthVisitors,
      realTimeSeries,
      dailyVisitors,
      weeklyVisitors,
      monthlyVisitors,
    });
  } catch (e) {
    res.status(500).json({ message: e.message || 'Dashboard failed' });
  }
};
