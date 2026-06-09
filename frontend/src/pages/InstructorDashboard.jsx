import { useState } from 'react';
import { BookOpen, Users, FileEdit, Download, Mail, Filter, CheckSquare, Search } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

export default function InstructorDashboard() {
  const [courses] = useState([
    { id: 'CS201', course_name: 'Data Structures', credits: 4, term: 'Fall 2025', enrolled_students: 45, average: '3.42' },
    { id: 'CS301', course_name: 'Database Systems', credits: 3, term: 'Spring 2026', enrolled_students: 38, average: '-' }
  ]);

  const [students, setStudents] = useState([
    { student_id: 'STU-104928', name: 'Alice Smith', email: 'alice.smith@scholaris.edu', major: 'Comp. Sci', grade: 'A', selected: false },
    { student_id: 'STU-104929', name: 'Bob Jones', email: 'bob.jones@scholaris.edu', major: 'Software Eng', grade: 'B+', selected: false },
    { student_id: 'STU-104930', name: 'Charlie Brown', email: 'charlie.brown@scholaris.edu', major: 'Info Sys', grade: '-', selected: false },
    { student_id: 'STU-104931', name: 'Diana Prince', email: 'diana.prince@scholaris.edu', major: 'Comp. Sci', grade: '-', selected: false },
  ]);

  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [successMsg, setSuccessMsg] = useState('');

  // Mock grade distribution for chart
  const gradeData = [
    { name: 'A / A-', value: 15 },
    { name: 'B+ / B', value: 20 },
    { name: 'C+ / C', value: 8 },
    { name: 'D / F', value: 2 },
  ];
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  const handleGradeChange = (studentId, newGrade) => {
    setStudents(students.map(s => s.student_id === studentId ? { ...s, grade: newGrade } : s));
  };

  const handleSelectAll = (e) => {
    setStudents(students.map(s => ({ ...s, selected: e.target.checked })));
  };

  const handleSelect = (studentId) => {
    setStudents(students.map(s => s.student_id === studentId ? { ...s, selected: !s.selected } : s));
  };

  const handlePublish = () => {
    setSuccessMsg(`Grades for ${selectedCourse.id} have been officially submitted to the Registrar. Database triggers will recalculate student GPAs.`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-neutral">Faculty Portal</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Prof. Ada Lovelace</span>
          </div>
          <h1>Course Management</h1>
          <p>Manage your assigned classes, view analytics, and submit grade rosters.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="grid grid-cols-2 gap-6">
          {courses.map(course => (
            <div 
              key={course.id} 
              className="card"
              style={{ 
                marginBottom: 0, 
                cursor: 'pointer', 
                border: selectedCourse.id === course.id ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                boxShadow: selectedCourse.id === course.id ? 'var(--shadow-md)' : 'var(--shadow-sm)'
              }}
              onClick={() => setSelectedCourse(course)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent-color)' }}>{course.id}</span>
                  <h3 style={{ margin: '0.25rem 0', fontSize: '1.125rem' }}>{course.course_name}</h3>
                  <span className="text-tertiary" style={{ fontSize: '0.875rem' }}>{course.term}</span>
                </div>
                <div style={{ padding: '0.5rem', backgroundColor: 'var(--info-bg)', color: 'var(--info-color)', borderRadius: '0.375rem' }}>
                  <BookOpen size={20} />
                </div>
              </div>
              
              <div className="flex gap-6 mt-6" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Enrolled</div>
                  <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{course.enrolled_students}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Avg. Grade</div>
                  <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>{course.average}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Grade Distribution (Prev. Term)</h3>
          <div style={{ height: '180px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gradeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success animate-fade-in">
          <CheckSquare size={20} className="alert-icon" />
          <div className="alert-content">
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Final Grades Published</p>
            <p style={{ fontSize: '0.875rem' }}>{successMsg}</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header" style={{ alignItems: 'flex-end' }}>
          <div>
            <h3 style={{ marginBottom: '0.25rem' }}>Grade Roster: {selectedCourse.id}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Enter grades below. Changes are saved automatically as drafts until published.</p>
          </div>
          <div className="flex gap-3">
            <div className="search-bar" style={{ width: '220px' }}>
              <Search size={16} />
              <input type="text" placeholder="Search student..." />
            </div>
            <button className="btn btn-secondary btn-sm">
              <Download size={16} /> CSV
            </button>
            <button className="btn btn-primary btn-sm" onClick={handlePublish}>
              Publish Roster
            </button>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: '40px', paddingRight: 0 }}>
                  <input type="checkbox" onChange={handleSelectAll} checked={students.every(s => s.selected)} style={{ width: '16px', height: '16px' }} />
                </th>
                <th>Student Details</th>
                <th>Contact</th>
                <th>Major</th>
                <th>Status</th>
                <th style={{ width: '180px' }}>Final Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.student_id} style={{ backgroundColor: student.selected ? 'var(--info-bg)' : 'transparent' }}>
                  <td style={{ paddingRight: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={student.selected} 
                      onChange={() => handleSelect(student.student_id)}
                      style={{ width: '16px', height: '16px' }} 
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{student.name}</div>
                    <div className="table-cell-subtext">{student.student_id}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-secondary" style={{ fontSize: '0.875rem' }}>
                      <Mail size={14} />
                      {student.email}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{student.major}</td>
                  <td>
                    <span className={`badge ${student.grade !== '-' ? 'badge-success' : 'badge-neutral'}`}>
                      {student.grade !== '-' ? 'Drafted' : 'Empty'}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="form-control"
                      value={student.grade} 
                      onChange={(e) => handleGradeChange(student.student_id, e.target.value)}
                      style={{ padding: '0.375rem 2rem 0.375rem 0.75rem', width: '100%', borderColor: student.grade !== '-' ? 'var(--success-color)' : 'var(--border-color)', backgroundColor: student.grade !== '-' ? 'var(--success-bg)' : 'white' }}
                    >
                      <option value="-">Select Grade...</option>
                      <option value="A">A (4.0)</option>
                      <option value="B+">B+ (3.5)</option>
                      <option value="B">B (3.0)</option>
                      <option value="C+">C+ (2.5)</option>
                      <option value="C">C (2.0)</option>
                      <option value="D">D (1.0)</option>
                      <option value="F">F (0.0)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
