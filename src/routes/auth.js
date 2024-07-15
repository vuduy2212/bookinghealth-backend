const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const utils = require('../utils/utils');
// Register
router.post('/register', authController.registerUser);

//Create Clinic Admin Page
router.post('/create-clinic-admin', authController.createClinicAdmin);

router.post('/test-email', utils.sendEmailAdminClinic);

// Login
router.post('/login', authController.loginUser);

// Refresh Token
router.post('/refresh-token', authController.requestRefreshToken);

// Log Out
router.post('/logout', authController.logOut);

router.put('/change-password', authMiddleware.verifyToken, authController.changePassword);

module.exports = router;
