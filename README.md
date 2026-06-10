# Scholaris - Advanced University Management System

![Scholaris Logo](./web/public/logo.png)

**Scholaris** is a modern, full-stack university management system built with **React, Vite, and Supabase**. It provides a secure, role-based platform for university administration, teacher grading, and student enrollments.

---

## Architecture & Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite (Lightning fast HMR & optimized builds)
- **Styling**: Vanilla CSS with a custom Dark Theme UI system (`index.css`)
- **State Management & Data Fetching**: React Query (`@tanstack/react-query`)
- **Routing**: React Router DOM (`react-router-dom`)
- **Icons**: Lucide React
- **Backend as a Service**: Supabase
- **Database**: PostgreSQL (Managed by Supabase)
- **Deployment**: Vercel

---

## Role-Based Access Control (RBAC)

The platform is strictly divided into three primary user roles. Roles are stored in the database and enforced through strict PostgreSQL **Row-Level Security (RLS)** policies.

### 1. Admins
- **Access**: Unrestricted read/write access to system infrastructure.
- **Capabilities**:
  - Manage user accounts (Create Teachers and Students).
  - Manage the Course Catalog (Add/Edit courses).
  - Open new Sections/Offerings for courses.
  - Set Prerequisites and strict capacity limits for sections.
  - Override system constraints (e.g., enrolling students manually).

### 2. Teachers
- **Access**: Restricted access limited to their assigned sections.
- **Capabilities**:
  - View students enrolled in their assigned sections.
  - Create Assignments and Exams.
  - Grade student submissions.
  - Cannot modify course infrastructure or grade students outside their assigned sections.

### 3. Students
- **Access**: Read-only access to catalogs, read/write access to their own enrollments.
- **Capabilities**:
  - View the public Course Catalog and available Sections.
  - Enroll in sections (subject to Prerequisites and Capacity checks).
  - View their Academic Transcript, letter grades, and cumulative GPA.
  - Cannot alter their own grades or view other students' grades.

---

## 🗄️ Database Schema & Advanced Concepts

Since this is an advanced database management project, business logic is explicitly pushed directly down to the database layer to guarantee maximum data integrity, concurrency control, and security.

### Core Tables (Entities)
1. **`profiles`**: Stores user information (Role, Roll Number, cumulative GPA). Linked 1:1 with Supabase Auth (`auth.users`).
2. **`courses`**: Master catalog of academic subjects (Code, Name, Credits).
3. **`course_prerequisites`**: A junction table defining required course completion chains.
4. **`sections`**: Instances of courses offered (includes maximum `capacity`, schedule, and teacher foreign keys).
5. **`enrollments`**: Junction table tracking student section enrollments, storing final Letter Grades and Grade Points.
6. **`assignments`**: Teacher-defined tasks with `weight_percentage` impact metrics.
7. **`submissions`**: Student scores with foreign keys to `assignments` and `profiles`.

### ⚡ Automated Database Triggers (Active DBMS)
We utilize PostgreSQL triggers to automatically enforce academic constraints and perform complex cascading calculations:
- **`check_prerequisites` (`BEFORE INSERT`)**: Analyzes the student's transcript and rejects section enrollments if prerequisite courses aren't completed.
- **`update_enrollment_grade` (`AFTER INSERT/UPDATE`)**: Recalculates the student's weighted percentage across all assignments, dynamically converting it to a standard Letter Grade (A, B, C, F), and updating the `enrollments` table without any backend API intervention.
- **`update_student_gpa` (`AFTER UPDATE`)**: Automatically recalculates the global cumulative GPA based on course credits whenever a letter grade changes.

### 🛡️ ACID-Compliant Transactions & Concurrency Control
To prevent race conditions during high-traffic course registration periods, the system does not use simple REST API calls for enrollment. Instead, it utilizes a custom Stored Procedure (RPC) named `enroll_student`:
- **Isolation (`SELECT ... FOR UPDATE`)**: The transaction applies a strict Row-Level Lock on the `sections` table. If 100 students click "Register" at the exact same millisecond, the lock forces PostgreSQL to queue the transactions sequentially.
- **Atomicity & Consistency**: After locking the row, the function counts active enrollments and explicitly checks the `capacity` constraint. If the class is full, the transaction forcefully rolls back (`RAISE EXCEPTION`), completely preventing over-enrollment data anomalies.

### 🔒 Secure Deletion (Stored Procedures)
To bypass frontend security limitations without exposing the database Service Key, the system includes a `SECURITY DEFINER` Postgres function (`delete_user_by_admin`). When an Admin deletes a user, the function first strictly verifies the caller's role, and then executes a secure deletion on `auth.users`, which seamlessly triggers a cascade delete across their entire academic record.

---

## Security Model

### Row-Level Security (RLS)
The database is locked down by default. No data can be accessed without satisfying a policy:
- **Profiles**: Anyone can read basic profiles, but users can only update their own. Admins can update any profile.
- **Enrollments**: Students can only view their own enrollments. Teachers can view enrollments for their sections. Admins can view all.
- **Submissions**: Students can strictly only view their own grades. Teachers can only insert/update grades for sections they own. 

### Edge Functions
Since creating new Auth users requires a Service Role bypass (to prevent users from signing themselves up as Admins), Scholaris utilizes a **Supabase Edge Function** (`create-user`). 
When an Admin creates a new Teacher/Student, the frontend calls the Edge Function, which securely provisions the Auth account and sets up the user's `profile` in one atomic transaction.

---

## Setup & Development

### 1. Local Setup
1. Clone the repository.
2. Navigate to the `web` directory: `cd web`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`

### 2. Environment Variables
You must create a `.env.local` file in the `web` directory with the following keys:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Deployment
This application is configured for seamless deployment on **Vercel**:
1. Connect your Vercel account to the GitHub repository.
2. Set the **Root Directory** to `web`.
3. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the Vercel Environment Variables.
4. Click Deploy. Vercel will automatically run `tsc -b && vite build` and deploy the application.

---

## 🚀 Data Generation & Seeding

For demonstration purposes (like a DBMS Final Lab Project Demo), the project includes a sophisticated synthetic data generation script.

Run `node --env-file=.env.local web/scripts/seed.mjs` to automatically:
1. Safely wipe all existing non-admin data.
2. Interconnect and generate 40 Students and 10 Teachers.
3. Automatically build 15 Courses and 20 Sections.
4. Process thousands of simulated `submissions` to trigger the automated GPA calculation engine.
