-- 1. Stored Procedure for Enrolling a Student
CREATE OR REPLACE PROCEDURE enroll_student(
    p_student_id INT,
    p_course_id INT,
    p_semester VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- The actual insertion.
    -- Triggers trg_check_prerequisites and trg_prevent_duplicate_enrollment 
    -- will fire before this insert and raise exceptions if rules are violated.
    INSERT INTO enrollments (student_id, course_id, semester)
    VALUES (p_student_id, p_course_id, p_semester);
    
    RAISE NOTICE 'Student % successfully enrolled in course % for semester %', p_student_id, p_course_id, p_semester;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Enrollment failed: %', SQLERRM;
END;
$$;
