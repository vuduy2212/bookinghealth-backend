const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/alluser', homeController.getDisplayUsers);

module.exports = router;
