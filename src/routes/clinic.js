const express = require('express');
const router = express.Router();
import authMiddleware from '../middleware/authMiddleware';
import clinicController from '../controllers/clinicController';
import adminClinicController from '../controllers/adminClinicController';
router.post('/create-new', authMiddleware.verifyTokenAndAdmin, clinicController.createNewClinic);
router.post(
    '/create-new-clinic-and-admin',
    authMiddleware.verifyTokenAndAdmin,
    clinicController.createNewClinicAndAdmin,
);

router.get('/get-all-no-image', clinicController.getAllClinicNoImage);
router.get('/get-all-clinic', clinicController.getAllClinic);
router.get('/get-all-with-admin-info', clinicController.getAllClinicWithAdminInfo);

router.get('/get-all-name', clinicController.getAllClinicName);
router.get('/get-limit/:limit', clinicController.getLimitClinic);
router.get('/get-one/:id', clinicController.getOneClinic);

router.delete('/delete/:id', authMiddleware.verifyTokenAndAdmin, clinicController.deleteOneClinic);
router.patch('/update/:id', authMiddleware.verifyTokenAndAdmin, clinicController.updateOneClinic);

//AdminClinic thao tác

router.get(
    '/get-one-by-admin-id/:id',
    authMiddleware.verifyTokenToUpdateClinic,
    adminClinicController.getOneClinicByAdminId,
);

router.patch(
    '/update-by-admin-id/:id',
    authMiddleware.verifyTokenToUpdateClinic,
    adminClinicController.updateClinicByAdminId,
);

module.exports = router;
