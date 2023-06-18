const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Register
router.post('/register', authController.registerUser);

// Login
router.post('/login', authController.loginUser);

// Refresh Token
router.post('/refresh-token', authController.requestRefreshToken);

// Log Out
router.post('/logout', authController.logOut);
module.exports = router;
