const express = require('express');
const router = express.Router();
const { getDashboardStats, getRecentEnrollments } = require('../controllers/adminController');

router.get('/dashboard-stats', getDashboardStats);
router.get('/recent-enrollments', getRecentEnrollments);

module.exports = router;
