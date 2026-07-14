const express = require('express');
const router = express.Router();
const CampingAuthorization = require('../models/CampingAuthorization');
const Notification = require('../models/Notification');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { validateCampingAuth } = require('../middleware/validation');

// Create camping authorization request
router.post('/', authMiddleware, roleMiddleware(['group_leader']), validateCampingAuth, async (req, res) => {
  try {
    const { group_id, district_id, camp_location, start_date, end_date, number_of_scouts, camping_objective } = req.body;
    
    const authorization = await CampingAuthorization.create({
      group_id,
      district_id,
      group_leader_id: req.user.id,
      camp_location,
      start_date,
      end_date,
      number_of_scouts,
      camping_objective
    });
    
    // Create notification for district commissioner
    const districtComm = await pool.query(
      'SELECT id FROM users WHERE district_id = $1 AND role = $2',
      [district_id, 'district_commissioner']
    );
    
    if (districtComm.rows.length > 0) {
      const notification = await Notification.create({
        user_id: districtComm.rows[0].id,
        camping_authorization_id: authorization.id,
        type: 'authorization_pending',
        title: 'New Camping Authorization Request',
        message: `A new camping authorization request has been submitted by ${req.user.first_name} ${req.user.last_name}`
      });
      
      // Emit real-time notification via Socket.IO
      req.io.to(`user-${districtComm.rows[0].id}`).emit('notification', notification);
    }
    
    res.status(201).json({ success: true, data: authorization });
  } catch (error) {
    console.error('Error creating camping authorization:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all pending authorizations for district commissioner
router.get('/pending', authMiddleware, roleMiddleware(['district_commissioner']), async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const authorizations = await CampingAuthorization.findByStatus('pending', limit, offset);
    
    res.json({ success: true, data: authorizations });
  } catch (error) {
    console.error('Error fetching pending authorizations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get authorization by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const authorization = await CampingAuthorization.findById(req.params.id);
    
    if (!authorization) {
      return res.status(404).json({ success: false, error: 'Authorization not found' });
    }
    
    res.json({ success: true, data: authorization });
  } catch (error) {
    console.error('Error fetching authorization:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Approve authorization
router.post('/:id/approve', authMiddleware, roleMiddleware(['district_commissioner', 'admin']), async (req, res) => {
  try {
    const { additional_notes } = req.body;
    
    const authorization = await CampingAuthorization.updateStatus(
      req.params.id,
      'approved',
      {
        approved_by: req.user.id,
        additional_notes
      }
    );
    
    // Create and send notification to group leader
    const notification = await Notification.create({
      user_id: authorization.group_leader_id,
      camping_authorization_id: authorization.id,
      type: 'authorization_approved',
      title: 'Camping Authorization Approved ✅',
      message: `Your camping authorization for ${authorization.camp_location} has been approved!`
    });
    
    // Emit real-time notification
    req.io.to(`user-${authorization.group_leader_id}`).emit('notification', notification);
    
    res.json({ success: true, data: authorization });
  } catch (error) {
    console.error('Error approving authorization:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reject authorization
router.post('/:id/reject', authMiddleware, roleMiddleware(['district_commissioner', 'admin']), async (req, res) => {
  try {
    const { rejection_reason, additional_notes } = req.body;
    
    const authorization = await CampingAuthorization.updateStatus(
      req.params.id,
      'rejected',
      {
        approved_by: req.user.id,
        rejection_reason,
        additional_notes
      }
    );
    
    // Create and send notification to group leader
    const notification = await Notification.create({
      user_id: authorization.group_leader_id,
      camping_authorization_id: authorization.id,
      type: 'authorization_rejected',
      title: 'Camping Authorization Rejected ❌',
      message: `Your camping authorization request has been rejected. Reason: ${rejection_reason}`
    });
    
    // Emit real-time notification
    req.io.to(`user-${authorization.group_leader_id}`).emit('notification', notification);
    
    res.json({ success: true, data: authorization });
  } catch (error) {
    console.error('Error rejecting authorization:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get my authorizations (group leader)
router.get('/my/requests', authMiddleware, roleMiddleware(['group_leader']), async (req, res) => {
  try {
    // First get user's group
    const userGroups = await pool.query(
      'SELECT id FROM scout_groups WHERE leader_id = $1',
      [req.user.id]
    );
    
    if (userGroups.rows.length === 0) {
      return res.json({ success: true, data: [] });
    }
    
    const authorizations = await CampingAuthorization.findByGroupId(userGroups.rows[0].id);
    
    res.json({ success: true, data: authorizations });
  } catch (error) {
    console.error('Error fetching user authorizations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
