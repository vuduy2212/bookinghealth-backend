const express = require('express');
const router = express.Router();
import doctorController from '../controllers/doctorController';
const authMiddleware = require('../middleware/authMiddleware');

router.get('/top-doctor-home/:limit', doctorController.getTopDoctorHome);
router.patch(
    '/update-profile/:id',
    authMiddleware.verifyTokenAndUserAuthorization,
    authMiddleware.verifyTokenAndDoctor,
    doctorController.UpdateProfileDoctor
);
router.get('/get-profile/:id', doctorController.GetProfileDoctor);
router.get('/get-detail-doctor/:id', doctorController.GetDetailDoctor);
router.post('/bulk-create-schedule', doctorController.bulkCreateSchedule);
module.exports = router;
