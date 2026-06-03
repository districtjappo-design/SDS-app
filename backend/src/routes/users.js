const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, phone, first_name, last_name, date_of_birth, 
              place_of_birth, role, group_id, branch, function, insurance_number
       FROM users WHERE id = $1`,
      [req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { first_name, last_name, phone, date_of_birth, place_of_birth } = req.body;

    const result = await db.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, phone = $3, date_of_birth = $4, place_of_birth = $5, updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       RETURNING id, email, first_name, last_name, phone, role`,
      [first_name, last_name, phone, date_of_birth, place_of_birth, req.userId]
    );

    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get group members
router.get('/group/members', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, first_name, last_name, date_of_birth, branch, function, insurance_number
       FROM users
       WHERE group_id = (SELECT group_id FROM users WHERE id = $1)
       ORDER BY branch, date_of_birth ASC`,
      [req.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Add member to group
router.post('/group/members', authMiddleware, async (req, res) => {
  try {
    const { first_name, last_name, date_of_birth, place_of_birth, email, phone } = req.body;

    // Calculate branch based on age
    const birthDate = new Date(date_of_birth);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    let branch = 'routier';
    if (age >= 6 && age <= 12) branch = 'louveteau';
    else if (age >= 13 && age <= 17) branch = 'éclaireur';

    const userGroupId = (await db.query('SELECT group_id FROM users WHERE id = $1', [req.userId])).rows[0].group_id;

    const result = await db.query(
      `INSERT INTO users (first_name, last_name, date_of_birth, place_of_birth, email, phone, group_id, branch, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, first_name, last_name, branch, date_of_birth`,
      [first_name, last_name, date_of_birth, place_of_birth, email, phone, userGroupId, branch, 'member']
    );

    res.status(201).json({ message: 'Member added', member: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

module.exports = router;
