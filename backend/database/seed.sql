-- Insert Departments
INSERT INTO departments (department_name, head_name) VALUES
('Computer Science', 'Dr. Alan Turing'),
('Software Engineering', 'Dr. Margaret Hamilton'),
('Business Administration', 'Dr. Peter Drucker'),
('Electrical Engineering', 'Dr. Nikola Tesla');

-- Insert Instructors
INSERT INTO instructors (name, email, department_id, designation) VALUES
('Dr. Ada Lovelace', 'ada@univ.edu', 1, 'Professor'),
('Dr. Grace Hopper', 'grace@univ.edu', 2, 'Professor'),
('Dr. John von Neumann', 'john@univ.edu', 1, 'Associate Professor');

-- Insert Courses
INSERT INTO courses (course_name, credits, semester, department_id) VALUES
('Introduction to Programming', 3, 'Fall 2025', 1),
('Data Structures', 4, 'Fall 2025', 1),
('Database Systems', 3, 'Spring 2026', 1),
('Computer Organization', 3, 'Fall 2025', 4),
('Operating Systems', 4, 'Spring 2026', 1),
('Artificial Intelligence', 3, 'Fall 2026', 1);

-- Insert Prerequisites
-- Assuming course IDs match the insertion order above:
-- 2: Data Structures
-- 3: Database Systems
-- 4: Computer Organization
-- 5: Operating Systems
-- 6: Artificial Intelligence

INSERT INTO prerequisites (course_id, prerequisite_course_id) VALUES
(3, 2), -- Database Systems requires Data Structures
(6, 2), -- AI requires Data Structures
(5, 4); -- OS requires Computer Organization

-- Insert Students
INSERT INTO students (name, email, phone, dob, gender, department_id) VALUES
('Alice Smith', 'alice@student.univ.edu', '555-0101', '2000-05-15', 'Female', 1),
('Bob Jones', 'bob@student.univ.edu', '555-0102', '2001-08-22', 'Male', 2),
('Charlie Brown', 'charlie@student.univ.edu', '555-0103', '1999-11-10', 'Male', 1);

-- Give Alice 'Data Structures' and 'Computer Organization' so she can take advanced courses
INSERT INTO enrollments (student_id, course_id, semester) VALUES
(1, 2, 'Fall 2025'),
(1, 4, 'Fall 2025');

-- Assign grades to Alice so prerequisites are met
INSERT INTO grades (student_id, course_id, grade, semester) VALUES
(1, 2, 'A', 'Fall 2025'),
(1, 4, 'B+', 'Fall 2025');

-- At this point, Alice's GPA should be automatically calculated by the trigger.
