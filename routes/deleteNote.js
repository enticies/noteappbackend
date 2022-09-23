const express = require('express');
const router = express.Router();
const { handleDelete } = require('../controllers/api/noteController');

router.delete('/', handleDelete);

module.exports = router;