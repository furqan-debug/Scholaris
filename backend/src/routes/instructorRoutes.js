const express = require('express');
const router = express.Router();
const { getAssignedCourses, getEnrolledStudents, assignGrade } = require('../controllers/instructorController');

router.get('/:instructorId/courses', getAssignedCourses);
router.get('/courses/:courseId/students', getEnrolledStudents);
router.post('/grade', assignGrade);

module.exports = router;
