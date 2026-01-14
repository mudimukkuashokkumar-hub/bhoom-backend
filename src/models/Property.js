// src/models/Property.js
import { query } from '../config/database.js';

export class Property {
  static async findById(id) {
    const properties = await query('SELECT * FROM properties WHERE id = ?', [id]);
    return properties.length > 0 ? properties[0] : null;
  }

  static async findAll(filters = {}, limit = 20, offset = 0) {
    let whereClause = '1=1';
    const params = [];

    if (filters.status) {
      whereClause += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.city) {
      whereClause += ' AND city = ?';
      params.push(filters.city);
    }
    if (filters.type) {
      whereClause += ' AND type = ?';
      params.push(filters.type);
    }

    return await query(
      `SELECT * FROM properties WHERE ${whereClause} LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
  }

  static async create(propertyData) {
    const result = await query(
      'INSERT INTO properties (title, description, type, transactionType, price, currency, bedrooms, bathrooms, area, location, city, state, country, agentId, status, views, leads, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [propertyData.title, propertyData.description, propertyData.type, propertyData.transactionType, propertyData.price, propertyData.currency, propertyData.bedrooms, propertyData.bathrooms, propertyData.area, propertyData.location, propertyData.city, propertyData.state, propertyData.country, propertyData.agentId, 'draft', 0, 0]
    );
    return result.insertId;
  }

  static async update(id, propertyData) {
    await query(
      'UPDATE properties SET title = ?, description = ?, type = ?, transactionType = ?, price = ?, currency = ?, bedrooms = ?, bathrooms = ?, area = ?, location = ?, city = ?, state = ?, country = ?, status = ?, updatedAt = NOW() WHERE id = ?',
      [propertyData.title, propertyData.description, propertyData.type, propertyData.transactionType, propertyData.price, propertyData.currency, propertyData.bedrooms, propertyData.bathrooms, propertyData.area, propertyData.location, propertyData.city, propertyData.state, propertyData.country, propertyData.status, id]
    );
  }

  static async delete(id) {
    await query('DELETE FROM properties WHERE id = ?', [id]);
  }

  static async count(filters = {}) {
    let whereClause = '1=1';
    const params = [];

    if (filters.status) {
      whereClause += ' AND status = ?';
      params.push(filters.status);
    }

    const result = await query(`SELECT COUNT(*) as count FROM properties WHERE ${whereClause}`, params);
    return result[0].count;
  }
}
