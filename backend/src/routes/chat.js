const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Send message
router.post('/messages', authMiddleware, async (req, res) => {
  try {
    const { content, recipient_id, group_id, message_type } = req.body;

    const result = await db.query(
      `INSERT INTO chat_messages (sender_id, recipient_id, group_id, message_type, content)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, sender_id, content, created_at`,
      [req.userId, recipient_id, group_id, message_type, content]
    );

    res.status(201).json({ message: 'Message sent', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get group messages
router.get('/group/:groupId', authMiddleware, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await db.query(
      `SELECT cm.id, cm.sender_id, cm.content, cm.message_type, cm.file_path, cm.created_at,
              u.first_name, u.last_name
       FROM chat_messages cm
       JOIN users u ON cm.sender_id = u.id
       WHERE cm.group_id = $1
       ORDER BY cm.created_at DESC
       LIMIT $2 OFFSET $3`,
      [groupId, limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get direct messages
router.get('/direct/:userId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const result = await db.query(
      `SELECT id, sender_id, content, message_type, created_at
       FROM chat_messages
       WHERE (sender_id = $1 AND recipient_id = $2) OR (sender_id = $2 AND recipient_id = $1)
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [req.userId, userId, limit, offset]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Mark message as read
router.put('/messages/:messageId/read', authMiddleware, async (req, res) => {
  try {
    const { messageId } = req.params;

    await db.query(
      'UPDATE chat_messages SET is_read = true WHERE id = $1',
      [messageId]
    );

    res.json({ message: 'Message marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

module.exports = router;
