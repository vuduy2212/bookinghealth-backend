const express = require('express');
const router = express.Router();
import userController from '../controllers/userController';
const authMiddleware = require('../middleware/authMiddleware');

router.patch(
    '/update/:id',
    authMiddleware.verifyTokenAndUserAuthorization,
    userController.updateOneUser
);

module.exports = router;
