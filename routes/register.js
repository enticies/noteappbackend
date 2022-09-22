const express = require('express');
const router = express.Router();
const { handleRegister } = require('../controllers/authController');

router.post('/', handleRegister);

module.exports = router;