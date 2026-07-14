const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

class CampingAuthorization {
  static async create(data) {
    const id = uuidv4();
    const query = `
      INSERT INTO camping_authorizations (
        id, group_id, district_id, group_leader_id, camp_location,
        start_date, end_date, number_of_scouts, camping_objective
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *;
    `;
    
    try {
      const result = await pool.query(query, [
        id,
        data.group_id,
        data.district_id,
        data.group_leader_id,
        data.camp_location,
        data.start_date,
        data.end_date,
        data.number_of_scouts,
        data.camping_objective
      ]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating camping authorization:', error);
      throw error;
    }
  }

  static async findById(id) {
    const query = `
      SELECT ca.*, sg.name as group_name, d.name as district_name,
             u1.first_name as leader_first_name, u1.last_name as leader_last_name,
             u1.email as leader_email, u1.phone as leader_phone,
             u2.first_name as commissioner_first_name, u2.last_name as commissioner_last_name
      FROM camping_authorizations ca
      LEFT JOIN scout_groups sg ON ca.group_id = sg.id
      LEFT JOIN districts d ON ca.district_id = d.id
      LEFT JOIN users u1 ON ca.group_leader_id = u1.id
      LEFT JOIN users u2 ON ca.district_commissioner_id = u2.id
      WHERE ca.id = $1;
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding camping authorization:', error);
      throw error;
    }
  }

  static async findByStatus(status, limit = 50, offset = 0) {
    const query = `
      SELECT ca.*, sg.name as group_name, d.name as district_name
      FROM camping_authorizations ca
      LEFT JOIN scout_groups sg ON ca.group_id = sg.id
      LEFT JOIN districts d ON ca.district_id = d.id
      WHERE ca.status = $1
      ORDER BY ca.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    
    try {
      const result = await pool.query(query, [status, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Error finding authorizations by status:', error);
      throw error;
    }
  }

  static async findByDistrictId(districtId, limit = 50, offset = 0) {
    const query = `
      SELECT ca.*, sg.name as group_name, d.name as district_name
      FROM camping_authorizations ca
      LEFT JOIN scout_groups sg ON ca.group_id = sg.id
      LEFT JOIN districts d ON ca.district_id = d.id
      WHERE ca.district_id = $1
      ORDER BY ca.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    
    try {
      const result = await pool.query(query, [districtId, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Error finding authorizations by district:', error);
      throw error;
    }
  }

  static async findByGroupId(groupId, limit = 50, offset = 0) {
    const query = `
      SELECT ca.*, sg.name as group_name, d.name as district_name
      FROM camping_authorizations ca
      LEFT JOIN scout_groups sg ON ca.group_id = sg.id
      LEFT JOIN districts d ON ca.district_id = d.id
      WHERE ca.group_id = $1
      ORDER BY ca.created_at DESC
      LIMIT $2 OFFSET $3;
    `;
    
    try {
      const result = await pool.query(query, [groupId, limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Error finding authorizations by group:', error);
      throw error;
    }
  }

  static async updateStatus(id, status, data = {}) {
    const query = `
      UPDATE camping_authorizations
      SET status = $1,
          approved_by = $2,
          approval_date = CASE WHEN $1 = 'approved' THEN CURRENT_TIMESTAMP ELSE approval_date END,
          rejection_reason = $3,
          additional_notes = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *;
    `;
    
    try {
      const result = await pool.query(query, [
        status,
        data.approved_by || null,
        data.rejection_reason || null,
        data.additional_notes || null,
        id
      ]);
      
      return result.rows[0];
    } catch (error) {
      console.error('Error updating authorization status:', error);
      throw error;
    }
  }

  static async delete(id) {
    const query = 'UPDATE camping_authorizations SET status = $1 WHERE id = $2 RETURNING *;';
    
    try {
      const result = await pool.query(query, ['cancelled', id]);
      return result.rows[0];
    } catch (error) {
      console.error('Error deleting camping authorization:', error);
      throw error;
    }
  }
}

module.exports = CampingAuthorization;
