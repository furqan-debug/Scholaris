const db = require('../config/db');

exports.getAssignedCourses = async (req, res) => {
  try {
    const { instructorId } = req.params;
    const query = `
      SELECT c.*, 
        (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.course_id) as enrolled_students
      FROM courses c
      JOIN instructors i ON c.department_id = i.department_id
      WHERE i.instructor_id = $1
    `;
    const result = await db.query(query, [instructorId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEnrolledStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const query = `
      SELECT s.student_id, s.name, s.email, e.semester, g.grade
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      LEFT JOIN grades g ON s.student_id = g.student_id AND e.course_id = g.course_id AND e.semester = g.semester
      WHERE e.course_id = $1
    `;
    const result = await db.query(query, [courseId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.assignGrade = async (req, res) => {
  try {
    const { studentId, courseId, grade, semester } = req.body;
    
    // Check if grade already exists for this semester
    const checkQuery = 'SELECT grade_id FROM grades WHERE student_id = $1 AND course_id = $2 AND semester = $3';
    const checkResult = await db.query(checkQuery, [studentId, courseId, semester]);
    
    if (checkResult.rows.length > 0) {
      // Update
      const updateQuery = 'UPDATE grades SET grade = $1 WHERE grade_id = $2 RETURNING *';
      const result = await db.query(updateQuery, [grade, checkResult.rows[0].grade_id]);
      res.json(result.rows[0]);
    } else {
      // Insert
      const insertQuery = 'INSERT INTO grades (student_id, course_id, grade, semester) VALUES ($1, $2, $3, $4) RETURNING *';
      const result = await db.query(insertQuery, [studentId, courseId, grade, semester]);
      res.json(result.rows[0]);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
