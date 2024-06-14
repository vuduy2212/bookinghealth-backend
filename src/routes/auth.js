const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
// Register
router.post('/register', authController.registerUser);

//Create Clinic Admin Page
router.post('/create-clinic-admin', authMiddleware.verifyTokenAndAdmin, authController.createClinicAdmin);

router.post('/test-email', authController.testEmail);

// Login
router.post('/login', authController.loginUser);

// Refresh Token
router.post('/refresh-token', authController.requestRefreshToken);

// Log Out
router.post('/logout', authController.logOut);
module.exports = router;
