const express = require('express');
const router = express.Router();
import userController from '../controllers/userController';
const authMiddleware = require('../middleware/authMiddleware');
// Update One User
router.patch(
    '/update/:id',
    authMiddleware.verifyTokenAndUserAuthorization,
    userController.updateOneUser
);

// Verify Doctor or Admin Acount
router.get(
    '/get-all/unconfirmed',
    authMiddleware.verifyTokenAndAdmin,
    userController.getAllUnConfirmed
);

// Get all 1 role user (R1, R2, R3)
router.get(
    '/get-all/:role',
    authMiddleware.verifyTokenAndAdmin,
    userController.getAllOneRole
);

// Delete One User
router.delete(
    '/delete/:id',
    authMiddleware.verifyTokenAndAdmin,
    userController.deleteUser
);

module.exports = router;
