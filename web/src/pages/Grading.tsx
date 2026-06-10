import { useState } from 'react';
import { useCourses } from '../hooks/useCourses';
import { useCourseEnrollments, useAssignGrade } from '../hooks/useEnrollments';

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, 'A': 3.8, 'A-': 3.6,
  'B+': 3.3, 'B': 3.0,
  'C+': 2.8, 'C': 2.2,
  'D': 1.5,
  'F': 0.0,
  'None': 0.0
};

export default function Grading() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const { data: courses } = useCourses();
  const { data: enrollments, isLoading } = useCourseEnrollments(selectedCourse);
  const assignGrade = useAssignGrade();

  const handleGradeChange = async (enrollmentId: string, grade: string) => {
    const point = GRADE_POINTS[grade];
    const status = grade === 'None' ? 'enrolled' : 'completed';
    try {
      await assignGrade.mutateAsync({ id: enrollmentId, grade, grade_point: point, status });
    } catch (err: any) {
      alert('Failed to save grade: ' + err.message);
    }
  };

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Select Course for Grading</h3>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', width: '100%', marginTop: '16px', maxWidth: '400px' }}>
          <option value="">-- Choose a Course --</option>
          {courses?.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
        </select>
      </div>

      {selectedCourse && (
        <div className="card">
          <h3>Enrolled Students</h3>
          {isLoading ? <p>Loading...</p> : (
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 8px', fontWeight: 500 }}>Roll No.</th>
                    <th style={{ padding: '12px 8px', fontWeight: 500 }}>Name</th>
                    <th style={{ padding: '12px 8px', fontWeight: 500 }}>Semester</th>
                    <th style={{ padding: '12px 8px', fontWeight: 500 }}>Assign Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {!enrollments || enrollments.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: '24px 8px', textAlign: 'center' }}>No students enrolled.</td></tr>
                  ) : (
                    enrollments.map((env) => (
                      <tr key={env.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 8px' }}>{env.student?.roll_number}</td>
                        <td style={{ padding: '12px 8px', fontWeight: 500 }}>{env.student?.first_name} {env.student?.last_name}</td>
                        <td style={{ padding: '12px 8px' }}>{env.semester}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <select 
                            value={env.grade || 'None'} 
                            onChange={(e) => handleGradeChange(env.id, e.target.value)}
                            style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                          >
                            <option value="None">None</option>
                            <option value="A+">A+ (4.0)</option>
                            <option value="A">A (3.8)</option>
                            <option value="A-">A- (3.6)</option>
                            <option value="B+">B+ (3.3)</option>
                            <option value="B">B (3.0)</option>
                            <option value="C+">C+ (2.8)</option>
                            <option value="C">C (2.2)</option>
                            <option value="D">D (1.5)</option>
                            <option value="F">F (0.0)</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
