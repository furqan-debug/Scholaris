-- Drop tables if they exist to allow clean re-runs
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS prerequisites CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

-- 1. Departments Table
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    head_name VARCHAR(100) NOT NULL
);

-- 2. Students Table
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    dob DATE,
    gender VARCHAR(10),
    department_id INT REFERENCES departments(department_id) ON DELETE SET NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    gpa NUMERIC(3, 2) DEFAULT 0.00 -- Calculated field updated by trigger
);

-- 3. Courses Table
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    credits INT NOT NULL CHECK (credits > 0 AND credits <= 6),
    semester VARCHAR(20) NOT NULL,
    department_id INT REFERENCES departments(department_id) ON DELETE CASCADE
);

-- 4. Instructors Table
CREATE TABLE instructors (
    instructor_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department_id INT REFERENCES departments(department_id) ON DELETE SET NULL,
    designation VARCHAR(50)
);

-- 5. Course Prerequisites Table
CREATE TABLE prerequisites (
    prerequisite_id SERIAL PRIMARY KEY,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    prerequisite_course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE (course_id, prerequisite_course_id) -- Prevent duplicate prerequisite entries
);

-- 6. Enrollments Table
CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    semester VARCHAR(20) NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE
);

-- 7. Grades Table
CREATE TABLE grades (
    grade_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INT REFERENCES courses(course_id) ON DELETE CASCADE,
    grade VARCHAR(2) NOT NULL CHECK (grade IN ('A', 'B+', 'B', 'C+', 'C', 'D', 'F')),
    semester VARCHAR(20) NOT NULL,
    UNIQUE (student_id, course_id, semester) -- A student gets one grade per course per semester
);
