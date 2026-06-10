import { useState } from 'react';
import { useCourses } from '../hooks/useCourses';
import { useStudentEnrollments, useStudentGPA, useEnrollStudent } from '../hooks/useEnrollments';
import { useAuth } from '../contexts/AuthContext';

export default function Transcript() {
  const { session } = useAuth();
  const studentId = session?.user.id || '';
  
  const { data: courses, isLoading: loadingCourses } = useCourses();
  const { data: enrollments, isLoading: loadingEnrollments } = useStudentEnrollments(studentId);
  const { data: gpa } = useStudentGPA(studentId);
  const enrollStudent = useEnrollStudent();

  const [selectedCourse, setSelectedCourse] = useState('');
  const [semester, setSemester] = useState('Fall 2026');

  const handleEnroll = async () => {
    if (!selectedCourse) return;
    try {
      await enrollStudent.mutateAsync({ course_id: selectedCourse, student_id: studentId, semester });
      alert('Successfully enrolled!');
      setSelectedCourse('');
    } catch (err: any) {
      alert('Enrollment failed: ' + err.message);
    }
  };

  if (loadingCourses || loadingEnrollments) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '8px' }}>Cumulative GPA</h3>
          <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {gpa !== undefined && gpa !== null ? gpa.toFixed(2) : '0.00'}
          </div>
        </div>
        
        <div className="card">
          <h3>Course Registration</h3>
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexDirection: 'column' }}>
            <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
              <option value="">Select a course to enroll</option>
              {courses?.filter(c => !enrollments?.some(e => e.course_id === c.id)).map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name} ({c.credits} Credits)</option>
              ))}
            </select>
            <select value={semester} onChange={e => setSemester(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
              <option value="Fall 2026">Fall 2026</option>
              <option value="Spring 2027">Spring 2027</option>
            </select>
            <button className="btn-primary" onClick={handleEnroll} disabled={!selectedCourse || enrollStudent.isPending}>
              {enrollStudent.isPending ? 'Processing...' : 'Register'}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Academic Transcript</h3>
        <div style={{ overflowX: 'auto', marginTop: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Term</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Course</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Credits</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Grade</th>
              </tr>
            </thead>
            <tbody>
              {!enrollments || enrollments.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '24px 8px', textAlign: 'center' }}>No enrollments found.</td></tr>
              ) : (
                enrollments.map((env) => (
                  <tr key={env.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 8px' }}>{env.semester}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>{env.course?.code} - {env.course?.name}</td>
                    <td style={{ padding: '12px 8px' }}>{env.course?.credits}</td>
                    <td style={{ padding: '12px 8px', textTransform: 'capitalize' }}>{env.status}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 'bold' }}>{env.grade !== 'None' ? env.grade : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
