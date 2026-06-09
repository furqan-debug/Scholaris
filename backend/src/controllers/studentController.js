const db = require('../config/db');

exports.getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const query = `
      SELECT s.*, d.department_name 
      FROM students s
      LEFT JOIN departments d ON s.department_id = d.department_id
      WHERE s.student_id = $1
    `;
    const result = await db.query(query, [studentId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Student not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId, semester } = req.body;
    
    // Call the stored procedure
    // Note: PostgreSQL CALL syntax
    await db.query('CALL enroll_student($1, $2, $3)', [studentId, courseId, semester]);
    
    res.json({ message: 'Enrollment successful' });
  } catch (err) {
    // The triggers will raise errors which will be caught here
    res.status(400).json({ error: err.message });
  }
};

exports.getTranscript = async (req, res) => {
  try {
    const { studentId } = req.params;
    const query = 'SELECT * FROM student_transcript_view WHERE student_id = $1';
    const result = await db.query(query, [studentId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
