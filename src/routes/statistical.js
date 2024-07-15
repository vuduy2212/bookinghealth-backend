const express = require('express');
const router = express.Router();
const { default: medicationController } = require('../controllers/medicaitionController');
const authMiddleware = require('../middleware/authMiddleware');
import statisticalController from '../controllers/staticalController';

router.get('/count-patients', statisticalController.countAppointmentsByClinic);
router.get('/count-clinic', statisticalController.countClinics);
router.get('/count-specialist', statisticalController.countSpecialists);
router.get('/count-specialist', statisticalController.countSpecialists);
module.exports = router;
