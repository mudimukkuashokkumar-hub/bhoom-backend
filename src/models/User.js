// src/models/User.js
import { query } from '../config/database.js';

export class User {
  static async findByEmail(email) {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    return users.length > 0 ? users[0] : null;
  }

  static async findById(id) {
    const users = await query('SELECT * FROM users WHERE id = ?', [id]);
    return users.length > 0 ? users[0] : null;
  }

  static async findAll(limit = 20, offset = 0) {
    return await query(
      'SELECT id, email, firstName, lastName, role, status, phone, company, createdAt, updatedAt FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );
  }

  static async create(userData) {
    const result = await query(
      'INSERT INTO users (email, password, firstName, lastName, role, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [userData.email, userData.password, userData.firstName, userData.lastName, userData.role || 'user', 'active']
    );
    return result.insertId;
  }

  static async update(id, userData) {
    await query(
      'UPDATE users SET firstName = ?, lastName = ?, phone = ?, company = ?, status = ?, updatedAt = NOW() WHERE id = ?',
      [userData.firstName, userData.lastName, userData.phone, userData.company, userData.status, id]
    );
  }

  static async delete(id) {
    await query('DELETE FROM users WHERE id = ?', [id]);
  }

  static async count() {
    const result = await query('SELECT COUNT(*) as count FROM users');
    return result[0].count;
  }
}
