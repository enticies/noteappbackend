const express = require('express');
const router = express.Router();
const { handleUpdate } = require('../controllers/api/noteController');

router.put('/', handleUpdate);

module.exports = router;