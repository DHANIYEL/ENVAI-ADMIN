const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Protected route
router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'You have access to this protected route!' });
});

module.exports = router;
