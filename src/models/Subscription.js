// src/models/Subscription.js
import { query } from '../config/database.js';

export class Subscription {
  static async findById(id) {
    const subscriptions = await query('SELECT * FROM subscriptions WHERE id = ?', [id]);
    return subscriptions.length > 0 ? subscriptions[0] : null;
  }

  static async findByUserId(userId) {
    const subscriptions = await query('SELECT * FROM subscriptions WHERE userId = ? ORDER BY createdAt DESC LIMIT 1', [userId]);
    return subscriptions.length > 0 ? subscriptions[0] : null;
  }

  static async findAll(filters = {}, limit = 20, offset = 0) {
    let whereClause = '1=1';
    const params = [];

    if (filters.status) {
      whereClause += ' AND status = ?';
      params.push(filters.status);
    }

    return await query(
      `SELECT * FROM subscriptions WHERE ${whereClause} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
  }

  static async create(subscriptionData) {
    const renewalDate = new Date();
    if (subscriptionData.plan === 'premium_yearly') {
      renewalDate.setDate(renewalDate.getDate() + 365);
    } else {
      renewalDate.setDate(renewalDate.getDate() + 30);
    }

    const result = await query(
      'INSERT INTO subscriptions (userId, plan, status, renewalDate, autoRenew, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [subscriptionData.userId, subscriptionData.plan, 'active', renewalDate, subscriptionData.autoRenew ? 1 : 0]
    );
    return result.insertId;
  }

  static async update(id, subscriptionData) {
    await query(
      'UPDATE subscriptions SET status = ?, updatedAt = NOW() WHERE id = ?',
      [subscriptionData.status, id]
    );
  }

  static async count(filters = {}) {
    let whereClause = '1=1';
    const params = [];

    if (filters.status) {
      whereClause += ' AND status = ?';
      params.push(filters.status);
    }

    const result = await query(`SELECT COUNT(*) as count FROM subscriptions WHERE ${whereClause}`, params);
    return result[0].count;
  }
}
