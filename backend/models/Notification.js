const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class Notification {
  static async create(data) {
    const id = uuidv4();
    const query = `
      INSERT INTO notifications (
        id, user_id, camping_authorization_id, type, title, message, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    
    try {
      const result = await pool.query(query, [
        id,
        data.user_id,
        data.camping_authorization_id || null,
        data.type,
        data.title,
        data.message,
        data.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
      ]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async findByUserId(userId, limit = 20, offset = 0) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    
    try {
      const result = await pool.query(query, [userId, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Error finding notifications:', error);
      throw error;
    }
  }

  static async findUnreadByUserId(userId) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1 AND status = 'unread'
      ORDER BY created_at DESC;
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error finding unread notifications:', error);
      throw error;
    }
  }

  static async markAsRead(id) {
    const query = `
      UPDATE notifications
      SET status = 'read', read_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *;
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead(userId) {
    const query = `
      UPDATE notifications
      SET status = 'read', read_at = CURRENT_TIMESTAMP
      WHERE user_id = $1 AND status = 'unread'
      RETURNING *;
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

module.exports = Notification;
