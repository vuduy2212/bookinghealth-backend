const express = require('express');
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware';
import clinicController from '../controllers/clinicController';
router.post(
    '/create-new',
    authMiddleware.verifyTokenAndAdmin,
    clinicController.createNewClinic
);
router.get('/get-all-no-image', clinicController.getAllClinicNoImage);
router.get('/get-all-name', clinicController.getAllClinicName);
router.get('/get-limit/:limit', clinicController.getLimitClinic);
router.get('/get-one/:id', clinicController.getOneClinic);
router.patch(
    '/update/:id',
    authMiddleware.verifyTokenAndAdmin,
    clinicController.updateOneClinic
);
router.delete(
    '/delete/:id',
    authMiddleware.verifyTokenAndAdmin,
    clinicController.deleteOneClinic
);

module.exports = router;
