-- 1. Prerequisite Validation Trigger
CREATE OR REPLACE FUNCTION check_prerequisites()
RETURNS TRIGGER AS $$
DECLARE
    prereq RECORD;
    passed_count INT;
BEGIN
    -- Loop through all prerequisites for the course the student is trying to enroll in
    FOR prereq IN 
        SELECT prerequisite_course_id FROM prerequisites WHERE course_id = NEW.course_id
    LOOP
        -- Check if the student has passed this prerequisite course
        -- We consider a grade other than 'F' as passed
        SELECT COUNT(*) INTO passed_count
        FROM grades
        WHERE student_id = NEW.student_id 
          AND course_id = prereq.prerequisite_course_id
          AND grade != 'F';

        IF passed_count = 0 THEN
            RAISE EXCEPTION 'You must complete prerequisite courses before enrolling.';
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_prerequisites ON enrollments;
CREATE TRIGGER trg_check_prerequisites
BEFORE INSERT ON enrollments
FOR EACH ROW
EXECUTE FUNCTION check_prerequisites();

-- 2. Duplicate Enrollment Prevention Trigger
CREATE OR REPLACE FUNCTION prevent_duplicate_enrollment()
RETURNS TRIGGER AS $$
DECLARE
    enrollment_count INT;
BEGIN
    -- Check if student is already enrolled in this course (any semester)
    SELECT COUNT(*) INTO enrollment_count
    FROM enrollments
    WHERE student_id = NEW.student_id AND course_id = NEW.course_id;

    IF enrollment_count > 0 THEN
        RAISE EXCEPTION 'Student is already enrolled in this course.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_duplicate_enrollment ON enrollments;
CREATE TRIGGER trg_prevent_duplicate_enrollment
BEFORE INSERT ON enrollments
FOR EACH ROW
EXECUTE FUNCTION prevent_duplicate_enrollment();

-- 3. GPA Update Trigger
CREATE OR REPLACE FUNCTION update_student_gpa()
RETURNS TRIGGER AS $$
DECLARE
    total_points NUMERIC := 0;
    total_credits INT := 0;
    new_gpa NUMERIC := 0.00;
BEGIN
    -- Calculate total points and credits for the student
    SELECT 
        COALESCE(SUM(c.credits * 
            CASE g.grade 
                WHEN 'A' THEN 4.0 
                WHEN 'B+' THEN 3.5 
                WHEN 'B' THEN 3.0 
                WHEN 'C+' THEN 2.5 
                WHEN 'C' THEN 2.0 
                WHEN 'D' THEN 1.0 
                ELSE 0.0 
            END
        ), 0),
        COALESCE(SUM(c.credits), 0)
    INTO total_points, total_credits
    FROM grades g
    JOIN courses c ON g.course_id = c.course_id
    WHERE g.student_id = NEW.student_id;

    -- Calculate new GPA
    IF total_credits > 0 THEN
        new_gpa := ROUND(total_points / total_credits, 2);
    END IF;

    -- Update the student record
    UPDATE students
    SET gpa = new_gpa
    WHERE student_id = NEW.student_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_student_gpa ON grades;
CREATE TRIGGER trg_update_student_gpa
AFTER INSERT OR UPDATE ON grades
FOR EACH ROW
EXECUTE FUNCTION update_student_gpa();
