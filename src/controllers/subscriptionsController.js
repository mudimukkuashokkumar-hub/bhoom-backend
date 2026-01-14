// src/controllers/subscriptionsController.js
import { Subscription } from '../models/Subscription.js';
import { query } from '../config/database.js';

export const getSubscriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const filters = {
      status: req.query.status,
    };

    const subscriptions = await Subscription.findAll(filters, limit, offset);
    const total = await Subscription.count(filters);

    res.json({
      success: true,
      data: subscriptions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      code: 'FETCH_SUBSCRIPTIONS_ERROR',
    });
  }
};

export const getUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;
    const subscription = await Subscription.findByUserId(userId);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
        code: 'SUBSCRIPTION_NOT_FOUND',
      });
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error('Get user subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      code: 'FETCH_SUBSCRIPTION_ERROR',
    });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const { userId, plan, autoRenew = true } = req.body;

    if (!userId || !plan) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
        code: 'MISSING_FIELDS',
      });
    }

    const subscriptionId = await Subscription.create({
      userId,
      plan,
      autoRenew,
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: {
        id: subscriptionId,
        userId,
        plan,
        status: 'active',
      },
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      code: 'CREATE_SUBSCRIPTION_ERROR',
    });
  }
};

export const cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
        code: 'SUBSCRIPTION_NOT_FOUND',
      });
    }

    await Subscription.update(id, { status: 'cancelled' });

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      code: 'CANCEL_SUBSCRIPTION_ERROR',
    });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsersResult = await query('SELECT COUNT(*) as count FROM users');
    const totalPropertiesResult = await query('SELECT COUNT(*) as count FROM properties');
    const totalLeadsResult = await query('SELECT COUNT(*) as count FROM leads');
    const activeSubscriptionsResult = await query('SELECT COUNT(*) as count FROM subscriptions WHERE status = ?', ['active']);
    const pendingApprovalsResult = await query('SELECT COUNT(*) as count FROM properties WHERE status = ?', ['pending']);
    const revenueResult = await query(
      'SELECT SUM(CASE WHEN plan = "premium_yearly" THEN 99 ELSE 9 END) as total FROM subscriptions WHERE status = ?',
      ['active']
    );

    res.json({
      success: true,
      data: {
        totalUsers: totalUsersResult[0].count,
        totalProperties: totalPropertiesResult[0].count,
        totalLeads: totalLeadsResult[0].count,
        activeSubscriptions: activeSubscriptionsResult[0].count,
        pendingApprovals: pendingApprovalsResult[0].count,
        totalRevenue: revenueResult[0].total || 0,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
      code: 'FETCH_STATS_ERROR',
    });
  }
};
