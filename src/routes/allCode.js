const express = require('express');
const router = express.Router();
import allCodeController from '../controllers/allCodeController';

router.get('/', allCodeController.getAllCode);

module.exports = router;
