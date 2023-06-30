const express = require('express');
const router = express.Router();
import userController from '../controllers/userController';
const authMiddleware = require('../middleware/authMiddleware');

router.patch(
    '/update/:id',
    authMiddleware.verifyTokenAndUserAuthorization,
    userController.updateOneUser
);

router.get(
    '/get-all/unconfirmed',
    authMiddleware.verifyTokenAndAdmin,
    userController.getAllUnConfirmed
);
router.get(
    '/get-all/:role',
    authMiddleware.verifyTokenAndAdmin,
    userController.getAllOneRole
);

router.delete(
    '/delete/:id',
    authMiddleware.verifyTokenAndAdmin,
    userController.deleteUser
);

module.exports = router;
