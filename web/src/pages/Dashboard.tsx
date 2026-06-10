import { useProfiles } from '../hooks/useProfiles';
import { useClasses } from '../hooks/useClasses';

export default function Dashboard() {
  const { data: students, isLoading: loadingStudents } = useProfiles('student');
  const { data: teachers, isLoading: loadingTeachers } = useProfiles('teacher');
  const { data: classes, isLoading: loadingClasses } = useClasses();

  return (
    <div className="page">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Students</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>
            {loadingStudents ? '-' : students?.length || 0}
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Total Teachers</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>
            {loadingTeachers ? '-' : teachers?.length || 0}
          </div>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active Classes</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>
            {loadingClasses ? '-' : classes?.length || 0}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>
        <p>No recent activity to show.</p>
      </div>
    </div>
  );
}
