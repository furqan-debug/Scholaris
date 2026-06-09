-- 1. Student Transcript View
CREATE OR REPLACE VIEW student_transcript_view AS
SELECT 
    s.student_id,
    s.name AS student_name,
    c.course_name,
    d.department_name,
    g.grade,
    c.credits,
    g.semester
FROM students s
JOIN grades g ON s.student_id = g.student_id
JOIN courses c ON g.course_id = c.course_id
JOIN departments d ON c.department_id = d.department_id;

-- 2. Department Performance View
CREATE OR REPLACE VIEW department_performance_view AS
SELECT 
    d.department_id,
    d.department_name,
    COUNT(DISTINCT s.student_id) AS total_students,
    COALESCE(ROUND(AVG(s.gpa), 2), 0.00) AS average_gpa,
    COUNT(DISTINCT c.course_id) AS total_courses
FROM departments d
LEFT JOIN students s ON d.department_id = s.department_id
LEFT JOIN courses c ON d.department_id = c.department_id
GROUP BY d.department_id, d.department_name;

-- 3. Course Enrollment View
CREATE OR REPLACE VIEW course_enrollment_view AS
SELECT 
    c.course_id,
    c.course_name,
    i.name AS instructor_name,
    COUNT(e.student_id) AS total_enrolled_students
FROM courses c
-- Assuming an instructor teaches a course if they are in the same department
-- (A more complex schema might have a course_assignments table, but we link via department here for simplicity)
LEFT JOIN instructors i ON c.department_id = i.department_id AND i.designation = 'Professor'
LEFT JOIN enrollments e ON c.course_id = e.course_id
GROUP BY c.course_id, c.course_name, i.name;
