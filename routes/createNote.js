const express = require('express');
const router = express.Router();
const { handleCreate } = require('../controllers/api/noteController');

router.post('/', handleCreate);

module.exports = router;