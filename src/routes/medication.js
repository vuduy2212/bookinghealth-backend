const express = require('express');
const router = express.Router();
const { default: medicationController } = require('../controllers/medicaitionController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/get-all-medication-one-clinic/:id', medicationController.getAllMedicationOne);
router.post(
    '/create-new-medication/:id',
    authMiddleware.verifyTokenAndAdminClinic,
    medicationController.createMedication,
);
router.delete(
    '/delete-one-medication/:id',
    authMiddleware.verifyTokenAndAdminClinic,
    medicationController.deleteMedication,
);
module.exports = router;
