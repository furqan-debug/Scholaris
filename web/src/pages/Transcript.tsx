import { useState } from 'react';
import { useSections } from '../hooks/useCourses';
import { useStudentEnrollments, useStudentGPA, useEnrollStudent } from '../hooks/useEnrollments';
import { useAuth } from '../contexts/AuthContext';

export default function Transcript() {
  const { session } = useAuth();
  const studentId = session?.user.id || '';
  
  const { data: sections, isLoading: loadingSections } = useSections();
  const { data: enrollments, isLoading: loadingEnrollments } = useStudentEnrollments(studentId);
  const { data: gpa } = useStudentGPA(studentId);
  const enrollStudent = useEnrollStudent();

  const [selectedSection, setSelectedSection] = useState('');

  const handleEnroll = async () => {
    if (!selectedSection) return;
    try {
      await enrollStudent.mutateAsync({ section_id: selectedSection, student_id: studentId });
      alert('Successfully enrolled!');
      setSelectedSection('');
    } catch (err: any) {
      alert('Enrollment failed: ' + err.message);
    }
  };

  if (loadingSections || loadingEnrollments) return <div className="page">Loading...</div>;

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
            <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
              <option value="">Select a Section to enroll</option>
              {sections?.filter(s => !enrollments?.some(e => e.section_id === s.id)).map(s => (
                <option key={s.id} value={s.id}>{s.course?.code} - {s.course?.name} ({s.semester} | {s.schedule})</option>
              ))}
            </select>
            <button className="btn-primary" onClick={handleEnroll} disabled={!selectedSection || enrollStudent.isPending}>
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
                    <td style={{ padding: '12px 8px' }}>{env.section?.semester}</td>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>{env.section?.course?.code} - {env.section?.course?.name}</td>
                    <td style={{ padding: '12px 8px' }}>{env.section?.course?.credits}</td>
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
