const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const studentCount = await db.query('SELECT COUNT(*) FROM students');
    const courseCount = await db.query('SELECT COUNT(*) FROM courses');
    const instructorCount = await db.query('SELECT COUNT(*) FROM instructors');
    const departmentCount = await db.query('SELECT COUNT(*) FROM departments');

    res.json({
      totalStudents: parseInt(studentCount.rows[0].count),
      totalCourses: parseInt(courseCount.rows[0].count),
      totalInstructors: parseInt(instructorCount.rows[0].count),
      totalDepartments: parseInt(departmentCount.rows[0].count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentEnrollments = async (req, res) => {
  try {
    const query = `
      SELECT e.enrollment_id, s.name as student_name, c.course_name, e.semester, e.enrollment_date
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      JOIN courses c ON e.course_id = c.course_id
      ORDER BY e.enrollment_date DESC
      LIMIT 10
    `;
    const result = await db.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
