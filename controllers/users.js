const express = require('express');
const router = express.Router();
const User = require('../models/User');

const verifyToken = require('../middleware/verify-token');
const authorizeRoles = require('../middleware/authorize-roles');

/* =========================
   USER ROUTES
========================= */

// Request owner role
router.put(
  '/request-owner',
  verifyToken,
  authorizeRoles('user'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.ownerRequestStatus === 'pending') {
        return res.status(400).json({ message: 'Request already pending' });
      }

      user.ownerRequestStatus = 'pending';
      await user.save();

      res.json({ success: true, message: 'Owner request submitted' });
    } catch (err) {
      console.error('REQUEST OWNER ERROR:', err);
      res.status(500).json({ message: err.message });
    }
  }
);

// Admin: view owner requests
router.get(
  '/owner-requests',
  verifyToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const users = await User.find({
        ownerRequestStatus: 'pending',
      }).select('username email ownerRequestStatus');

      res.json({ success: true, data: users });
    } catch (err) {
      console.error('OWNER REQUESTS ERROR:', err);
      res.status(500).json({ message: err.message });
    }
  }
);

// Admin: approve / reject owner
router.put(
  '/owner-requests/:id/:action',
  verifyToken,
  authorizeRoles('admin'),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (req.params.action === 'approve') {
        user.role = 'owner';
        user.ownerRequestStatus = 'approved';
      } else if (req.params.action === 'reject') {
        user.ownerRequestStatus = 'rejected';
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }

      await user.save();
      res.json({ success: true });
    } catch (err) {
      console.error('OWNER ACTION ERROR:', err);
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
