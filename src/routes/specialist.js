const express = require('express');
const router = express.Router();
import specialistController from '../controllers/specialistController';
import authMiddleware from '../middleware/authMiddleware';
router.post(
    '/create-new',
    authMiddleware.verifyTokenAndAdmin,
    specialistController.createNewSpecialist
);
router.get('/get-all-no-image', specialistController.getAllSpecialistNoImage);
router.get('/get-all', specialistController.getAllSpecialist);
router.get('/get-limit/:limit', specialistController.getTopSpecialist);
router.get('/get-all-name', specialistController.getAllSpecialistName);
router.get('/get-one/:id', specialistController.getOneSpecialist);
router.patch(
    '/update/:id',
    authMiddleware.verifyTokenAndAdmin,
    specialistController.updateOneSpecialist
);
router.delete(
    '/delete/:id',
    authMiddleware.verifyTokenAndAdmin,
    specialistController.deleteOneSpecialist
);

module.exports = router;
