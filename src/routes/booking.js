const express = require('express');
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware';
import bookingController from '../controllers/bookingController';
import medicalRecordAndPrescriptionController from '../controllers/medicalRecordAndPrescriptionController';
router.post(
    '/create-new-appointment',
    //authMiddleware.verifyToken,
    bookingController.postBookAppointment,
);
router.get('/get-all-new-appointment', authMiddleware.verifyTokenAndDoctorAndAdmin, bookingController.getAllNewBooking);
router.get(
    '/get-all-new-appointment-one-clinic/:id',
    authMiddleware.verifyTokenAndAdminClinic,
    bookingController.getAllNewBookingOneClinic,
);

router.patch('/confirm-booking', authMiddleware.verifyTokenAndAdminClinic, bookingController.confirmBooking);
router.patch('/cancel-booking/:id', bookingController.cancelBooking);

router.get(
    '/get-all-confirmed-appointment/:doctorId/:date',
    authMiddleware.verifyTokenAndDoctorAndAdmin,
    bookingController.getConfirmedBookingOneDoctor,
);
router.patch(
    '/finish-examination',
    // authMiddleware.verifyTokenAndDoctor,
    bookingController.finishedExamination,
);
router.get(
    '/get-patient-examined-one-date/:doctorId/:date',
    authMiddleware.verifyTokenAndDoctorAndAdmin,
    bookingController.getPatientExaminedOneDate,
);

router.get(
    '/get-all-booking-one-patient/:id',
    authMiddleware.verifyTokenAndUserAuthorization,
    bookingController.getAllBookingOnePatient,
);

/// New
router.post(
    '/complete-medical-examination',
    authMiddleware.verifyTokenAndDoctorAndAdmin,
    medicalRecordAndPrescriptionController.completeMedicalExamination,
);
router.get(
    '/get-patient-examined-one-date-v2/:doctorId/:date',
    authMiddleware.verifyTokenAndDoctorAndAdmin,
    medicalRecordAndPrescriptionController.getPatientExaminedOneDateV2,
);
router.get('/get-all-examined-one-patient/:id', medicalRecordAndPrescriptionController.getAllExaminedOnePatient);
module.exports = router;
