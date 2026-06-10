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

## Database Schema & Automation

The application uses a heavily automated PostgreSQL database. Business logic is pushed directly to the database layer using Triggers and Functions to guarantee data integrity regardless of frontend behavior.

### Core Tables
1. **`profiles`**: Stores user information (First Name, Last Name, Role, cumulative GPA). Linked 1:1 with Supabase Auth users.
2. **`courses`**: The master catalog of academic subjects (Code, Name, Credits).
3. **`course_prerequisites`**: A junction table defining which courses must be completed before taking another.
4. **`sections`**: Specific instances of a course offered in a given semester, assigned to a Teacher, with a defined max capacity.
5. **`enrollments`**: Junction table tracking which students are in which sections, along with their final Letter Grade and Grade Points.
6. **`assignments`**: Tasks/Exams created by teachers for specific sections. Includes a `weight_percentage` indicating its impact on the final grade.
7. **`submissions`**: Student scores for specific assignments.

### Database Triggers (Automated Logic)
Scholaris relies on PostgreSQL triggers to prevent illegal actions and automate calculations:
- **`check_prerequisites_before_enrollment`**: Fires `BEFORE INSERT` on `enrollments`. Checks if the student has a status of `completed` for all prerequisite courses. Rejects the insert if prerequisites are missing.
- **`check_capacity`**: Fires `BEFORE INSERT` on `enrollments`. Counts current enrollments and aborts the insert if the section has reached its maximum capacity limit.
- **`update_enrollment_grade`**: Fires `AFTER INSERT OR UPDATE` on `submissions`. Automatically recalculates the student's final weighted percentage, converts it to a letter grade (A+, B, F, etc.), and updates the `enrollments` record.
- **`update_student_gpa`**: Fires `AFTER INSERT OR UPDATE` on `enrollments`. Recalculates the student's global cumulative GPA based on course credits and grade points, updating their `profiles` record.

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

## Quality Assurance (QA)

The project includes an End-to-End QA script (`qa.mjs`) used during development to verify database constraints. It uses the Supabase JS client to simulate concurrent Admin, Teacher, and Student requests, guaranteeing that RLS, Capacity Checks, and Automated Grading Triggers perform flawlessly in production environments.
