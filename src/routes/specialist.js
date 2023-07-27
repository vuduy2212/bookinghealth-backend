const express = require('express');
const router = express.Router();
import specialistController from '../controllers/specialistController';
import authMiddleware from '../middleware/authMiddleware';
router.post(
    '/create-new',
    authMiddleware.verifyTokenAndAdmin,
    specialistController.createNewSpecialist
);
router.get('/get-all', specialistController.getAllSpecialist);

module.exports = router;
