// src/models/Lead.js
import { query } from '../config/database.js';

export class Lead {
  static async findById(id) {
    const leads = await query('SELECT * FROM leads WHERE id = ?', [id]);
    return leads.length > 0 ? leads[0] : null;
  }

  static async findAll(filters = {}, limit = 20, offset = 0) {
    let whereClause = '1=1';
    const params = [];

    if (filters.status) {
      whereClause += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.priority) {
      whereClause += ' AND priority = ?';
      params.push(filters.priority);
    }
    if (filters.propertyId) {
      whereClause += ' AND propertyId = ?';
      params.push(filters.propertyId);
    }

    return await query(
      `SELECT * FROM leads WHERE ${whereClause} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
  }

  static async create(leadData) {
    const result = await query(
      'INSERT INTO leads (name, email, phone, propertyId, status, priority, source, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [leadData.name, leadData.email, leadData.phone, leadData.propertyId, 'new', 'medium', leadData.source || 'website', leadData.notes || '']
    );
    return result.insertId;
  }

  static async update(id, leadData) {
    await query(
      'UPDATE leads SET status = ?, priority = ?, notes = ?, updatedAt = NOW() WHERE id = ?',
      [leadData.status, leadData.priority, leadData.notes, id]
    );
  }

  static async delete(id) {
    await query('DELETE FROM leads WHERE id = ?', [id]);
  }

  static async count(filters = {}) {
    let whereClause = '1=1';
    const params = [];

    if (filters.status) {
      whereClause += ' AND status = ?';
      params.push(filters.status);
    }

    const result = await query(`SELECT COUNT(*) as count FROM leads WHERE ${whereClause}`, params);
    return result[0].count;
  }
}
