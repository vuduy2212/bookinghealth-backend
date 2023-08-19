const express = require('express');
const router = express.Router();
import doctorController from '../controllers/doctorController';
const authMiddleware = require('../middleware/authMiddleware');
// Get Top Doctor in Home Page
router.get('/top-doctor-home/:limit', doctorController.getTopDoctorHome);
router.get('/get-all-one-specialist/:id', doctorController.getAllOneSpecialist);
router.get('/get-all-one-clinic/:id', doctorController.getAllOneClinic);

// Update profile of 1 Doctor in page UpdateProfile by doctor
router.patch(
    '/update-profile/:id',
    authMiddleware.verifyTokenAndUserAuthorization,
    authMiddleware.verifyTokenAndDoctor,
    doctorController.UpdateProfileDoctor
);

// Get profile of 1 Doctor in page UpdateProfile by doctor
router.get('/get-profile/:id', doctorController.GetProfileDoctor);

// Get detail profile of 1 Doctor in page Doctor Detail by user
router.get('/get-detail-doctor/:id', doctorController.GetDetailDoctor);

// Save Schedule Doctor by doctor
router.post(
    '/bulk-create-schedule/:id',
    authMiddleware.verifyTokenAndUserAuthorization,
    authMiddleware.verifyTokenAndDoctor,
    doctorController.bulkCreateSchedule
);

// Get Schedule Doctor
router.get('/get-schedule-one-date/:id/:date', doctorController.getoneSchedule);
module.exports = router;
