const express = require('express');
const router = express.Router();
const { handleLogout } = require('../controllers/authController');

router.post('/', handleLogout);

module.exports = router;