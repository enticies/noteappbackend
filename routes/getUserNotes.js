const express = require('express');
const router = express.Router();
const { getUserNotes } = require('../controllers/api/noteController');

router.get('/', getUserNotes);

module.exports = router;