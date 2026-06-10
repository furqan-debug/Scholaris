import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("🚀 Starting database wipe and seed process...");

  // 1. WIPE STRATEGY
  console.log("🧹 Wiping existing data...");

  // Delete all courses (cascades to sections, enrollments, prerequisites, assignments, submissions)
  console.log("   - Deleting courses...");
  const { error: err1 } = await supabase.from('courses').delete().neq('code', 'NON_EXISTENT');
  if (err1) console.error("Error wiping courses:", err1.message);

  // Get all users except the admin to delete their auth accounts
  console.log("   - Finding users to delete...");
  const { data: usersToDelete, error: err2 } = await supabase.from('profiles').select('id, email').neq('email', 'furqansddq2006@gmail.com');
  if (err2) console.error("Error fetching profiles:", err2.message);
  
  if (usersToDelete) {
    console.log(`   - Deleting ${usersToDelete.length} users from auth...`);
    for (const u of usersToDelete) {
      await supabase.auth.admin.deleteUser(u.id);
    }
  }

  // 2. GENERATE TEACHERS
  console.log("👨‍🏫 Generating 10 Teachers...");
  const teachers = [];
  
  // Create test teacher
  const { data: testTeacherAuth } = await supabase.auth.admin.createUser({
    email: 'test.teacher@faculty.edu',
    password: 'password123',
    email_confirm: true
  });
  
  if (testTeacherAuth?.user) {
    const { data: ttProf } = await supabase.from('profiles').insert({
      id: testTeacherAuth.user.id,
      email: 'test.teacher@faculty.edu',
      first_name: 'Test',
      last_name: 'Teacher',
      role: 'teacher'
    }).select().single();
    if (ttProf) teachers.push(ttProf);
  }

  for (let i = 0; i < 9; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName, provider: 'faculty.edu' }).toLowerCase();
    
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password: 'password123',
      email_confirm: true
    });
    
    if (authErr) {
      console.error(`Error creating teacher auth ${email}:`, authErr.message);
      continue;
    }
    
    const { data: profile, error: profErr } = await supabase.from('profiles').insert({
      id: authUser.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role: 'teacher'
    }).select().single();
    
    if (profErr) console.error("Error inserting teacher profile:", profErr.message);
    else teachers.push(profile);
  }

  // 3. GENERATE STUDENTS
  console.log("👨‍🎓 Generating 40 Students...");
  const students = [];
  
  // Create test student
  const { data: testStudentAuth } = await supabase.auth.admin.createUser({
    email: 'test.student@student.edu',
    password: 'password123',
    email_confirm: true
  });
  
  if (testStudentAuth?.user) {
    const { data: tsProf } = await supabase.from('profiles').insert({
      id: testStudentAuth.user.id,
      email: 'test.student@student.edu',
      first_name: 'Test',
      last_name: 'Student',
      role: 'student',
      roll_number: '2026TEST'
    }).select().single();
    if (tsProf) students.push(tsProf);
  }

  for (let i = 0; i < 39; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName, provider: 'student.edu' }).toLowerCase();
    const rollNumber = '2026' + faker.string.alphanumeric(4).toUpperCase();
    
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email,
      password: 'password123',
      email_confirm: true
    });
    
    if (authErr) continue;
    
    const { data: profile, error: profErr } = await supabase.from('profiles').insert({
      id: authUser.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role: 'student',
      roll_number: rollNumber
    }).select().single();
    
    if (!profErr) students.push(profile);
  }

  // 4. GENERATE COURSES
  console.log("📚 Generating 15 Courses...");
  const subjects = ['CS', 'MATH', 'PHY', 'ENG', 'BIO', 'HIST', 'ART', 'CHEM', 'ECON', 'PSY'];
  const courseList = [];
  for (let i = 0; i < 15; i++) {
    const subj = faker.helpers.arrayElement(subjects);
    const code = `${subj}${faker.number.int({ min: 100, max: 499 })}`;
    const { data: course, error: cErr } = await supabase.from('courses').insert({
      code,
      name: faker.company.catchPhrase(),
      description: faker.lorem.paragraph(),
      credits: faker.helpers.arrayElement([3, 4])
    }).select().single();
    if (!cErr) courseList.push(course);
  }

  // 5. GENERATE SECTIONS
  console.log("🏫 Generating 20 Sections...");
  const sections = [];
  for (let i = 0; i < 20; i++) {
    const course = faker.helpers.arrayElement(courseList);
    const teacher = faker.helpers.arrayElement(teachers);
    const semester = faker.helpers.arrayElement(['Fall 2026', 'Spring 2027']);
    const capacity = faker.helpers.arrayElement([20, 30, 40]);
    
    const { data: section, error: sErr } = await supabase.from('sections').insert({
      course_id: course.id,
      teacher_id: teacher.id,
      semester,
      schedule: `${faker.helpers.arrayElement(['Mon/Wed', 'Tue/Thu'])} ${faker.helpers.arrayElement(['9:00 AM', '11:00 AM', '2:00 PM'])}`,
      capacity
    }).select().single();
    
    if (!sErr) sections.push(section);
  }

  // 6. ENROLL STUDENTS
  console.log("📝 Enrolling Students into Sections...");
  const enrollments = [];
  for (const student of students) {
    // Enroll each student in 3-5 random sections
    const numSections = faker.number.int({ min: 3, max: 5 });
    const selectedSections = faker.helpers.arrayElements(sections, numSections);
    
    for (const section of selectedSections) {
      const { data: enr, error: eErr } = await supabase.from('enrollments').insert({
        student_id: student.id,
        section_id: section.id,
        status: 'enrolled'
      }).select().single();
      
      if (!eErr) enrollments.push(enr);
    }
  }

  // 7. GENERATE ASSIGNMENTS & SUBMISSIONS
  console.log("📝 Generating Assignments and Grading Submissions...");
  for (const section of sections) {
    const numAssignments = faker.number.int({ min: 2, max: 4 });
    const totalWeight = 100;
    
    let currentWeight = 0;
    
    for (let a = 1; a <= numAssignments; a++) {
      const weight = a === numAssignments ? (totalWeight - currentWeight) : Math.floor(totalWeight / numAssignments);
      currentWeight += weight;
      
      const { data: assignment, error: aErr } = await supabase.from('assignments').insert({
        section_id: section.id,
        title: `Assignment ${a}: ${faker.lorem.words(3)}`,
        description: faker.lorem.sentence(),
        max_score: 100,
        weight_percentage: weight,
        due_date: faker.date.future().toISOString()
      }).select().single();
      
      if (aErr) continue;
      
      // Get all enrollments for this section
      const sectionEnrollments = enrollments.filter(e => e.section_id === section.id);
      
      for (const enr of sectionEnrollments) {
        // 90% chance they submitted something
        if (faker.number.int({ min: 1, max: 10 }) <= 9) {
          const score = faker.number.int({ min: 40, max: 100 });
          await supabase.from('submissions').insert({
            assignment_id: assignment.id,
            student_id: enr.student_id,
            score
          });
        }
      }
    }
  }

  console.log("✅ Seeding Complete! Enjoy your realistic data.");
  console.log("\\n--- TEST ACCOUNTS ---");
  console.log("Teacher: test.teacher@faculty.edu / password123");
  console.log("Student: test.student@student.edu / password123");
  console.log("---------------------\\n");
}

run();
