import { useProfiles } from '../hooks/useProfiles';
import { useCourses } from '../hooks/useCourses';
import { useRecentActivity } from '../hooks/useEnrollments';

export default function Dashboard() {
  const { data: students, isLoading: loadingStudents } = useProfiles('student');
  const { data: teachers, isLoading: loadingTeachers } = useProfiles('teacher');
  const { data: courses, isLoading: loadingCourses } = useCourses();
  const { data: recentActivity, isLoading: loadingActivity } = useRecentActivity();

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
          <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Active Courses</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>
            {loadingCourses ? '-' : courses?.length || 0}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>
        {loadingActivity ? <p>Loading activity...</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
            {!recentActivity || recentActivity.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No recent activity to show.</p>
            ) : (
              recentActivity.map(activity => (
                <div key={activity.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)' }}>{activity.student?.first_name} {activity.student?.last_name}</strong> enrolled in 
                    <span style={{ color: 'var(--primary-color)', marginLeft: '4px' }}>{activity.section?.course?.code}</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {activity.created_at ? new Date(activity.created_at).toLocaleDateString() : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
