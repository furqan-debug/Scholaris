const express = require('express');
const router = express.Router();
const { getStudentProfile, enrollCourse, getTranscript } = require('../controllers/studentController');

router.get('/:studentId/profile', getStudentProfile);
router.post('/:studentId/enroll', enrollCourse);
router.get('/:studentId/transcript', getTranscript);

module.exports = router;
