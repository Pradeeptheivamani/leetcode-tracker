const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// PUT /api/user/profile
// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { leetcodeUsername } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (leetcodeUsername !== undefined) {
      user.leetcodeUsername = leetcodeUsername;
    }

    await user.save();

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        leetcodeUsername: user.leetcodeUsername,
        trackedUsers: user.trackedUsers,
        problemsSolved: user.problemsSolved,
        streak: user.streak,
        interviewScore: user.interviewScore,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/user/track
// Add a user to tracked list
router.post('/track', auth, async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username is required' });

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.trackedUsers.includes(username)) {
      user.trackedUsers.push(username);
      await user.save();
    }

    res.json({ trackedUsers: user.trackedUsers });
  } catch (error) {
    console.error('Track user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/user/track/:username
// Remove a user from tracked list
router.delete('/track/:username', auth, async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.trackedUsers = user.trackedUsers.filter((u) => u !== username);
    await user.save();

    res.json({ trackedUsers: user.trackedUsers });
  } catch (error) {
    console.error('Untrack user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
