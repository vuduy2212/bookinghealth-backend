const express = require('express');
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware';
import bookingController from '../controllers/bookingController';
router.post(
    '/create-new-appointment',
    //authMiddleware.verifyToken,
    bookingController.postBookAppointment
);
router.get(
    '/get-all-new-appointment',
    authMiddleware.verifyTokenAndDoctorAndAdmin,
    bookingController.getAllNewBooking
);

router.patch(
    '/confirm-booking',
    authMiddleware.verifyTokenAndAdmin,
    bookingController.confirmBooking
);
router.delete(
    '/cancel-booking/:id',
    authMiddleware.verifyTokenAndDoctorAndAdmin,
    bookingController.cancelBooking
);

router.get(
    '/get-all-confirmed-appointment/:doctorId/:date',
    authMiddleware.verifyTokenAndDoctorAndAdmin,
    bookingController.getConfirmedBookingOneDoctor
);
router.patch(
    '/finish-examination',
    authMiddleware.verifyTokenAndDoctor,
    bookingController.finishedExamination
);
router.get(
    '/get-patient-examined-one-date/:doctorId/:date',
    authMiddleware.verifyTokenAndDoctorAndAdmin,
    bookingController.getPatientExaminedOneDate
);

router.get(
    '/get-all-booking-one-patient/:id',
    authMiddleware.verifyTokenAndUserAuthorization,
    bookingController.getAllBookingOnePatient
);
module.exports = router;
