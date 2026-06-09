import { useState } from 'react';
import { BookMarked, CheckCircle2, Award, AlertCircle, Calendar, CreditCard, UserCircle, Clock } from 'lucide-react';

export default function StudentDashboard() {
  const [profile] = useState({
    name: 'Alice Smith',
    id: 'STU-104928',
    major: 'B.S. Computer Science',
    creditsEarned: 84,
    creditsRequired: 120,
    gpa: '3.85',
    standing: 'Junior',
    advisor: 'Dr. John von Neumann',
    advisorEmail: 'j.neumann@scholaris.edu',
    balance: '$1,250.00',
    dueDate: 'Sep 15, 2026'
  });
  
  const [transcript] = useState([
    { code: 'CS201', name: 'Data Structures', credits: 4, grade: 'A', term: 'Fall 2025', instructor: 'Dr. Ada Lovelace' },
    { code: 'CS250', name: 'Computer Organization', credits: 3, grade: 'B+', term: 'Fall 2025', instructor: 'Dr. Nikola Tesla' }
  ]);

  const [availableCourses] = useState([
    { id: 3, code: 'CS301', name: 'Database Systems', credits: 3, prereq: 'CS201 Data Structures', availableSeats: 12, totalSeats: 40, schedule: 'Mon/Wed 10:00 AM' },
    { id: 5, code: 'CS401', name: 'Operating Systems', credits: 4, prereq: 'CS250 Computer Organization', availableSeats: 5, totalSeats: 35, schedule: 'Tue/Thu 1:00 PM' },
    { id: 6, code: 'CS501', name: 'Artificial Intelligence', credits: 3, prereq: 'CS201 Data Structures', availableSeats: 0, totalSeats: 30, schedule: 'Fri 9:00 AM' }
  ]);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const progressPercentage = (profile.creditsEarned / profile.creditsRequired) * 100;

  const handleEnroll = (course) => {
    if(course.availableSeats === 0) {
      setErrorMsg(`Registration failed: ${course.code} is currently full.`);
      setSuccessMsg('');
    } else if(course.id === 6) {
      setErrorMsg(`Constraint Violation: Prerequisite '${course.prereq}' not met for ${course.code}.`);
      setSuccessMsg('');
    } else {
      setSuccessMsg(`Successfully registered for ${course.code}: ${course.name}.`);
      setErrorMsg('');
    }
    setTimeout(() => { setErrorMsg(''); setSuccessMsg(''); }, 5000);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-end mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="badge badge-info">{profile.standing} Standing</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>ID: {profile.id}</span>
          </div>
          <h1>Student Center</h1>
          <p>{profile.name} • {profile.major}</p>
        </div>
        <div className="flex gap-4">
          <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', marginBottom: 0, minWidth: '320px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Cumulative GPA</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{profile.gpa}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="flex justify-between" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <span>Degree Progress</span>
                <span>{profile.creditsEarned} / {profile.creditsRequired} CR</span>
              </div>
              <div className="progress-container">
                <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="card" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--success-bg)', color: 'var(--success-color)', borderRadius: '50%' }}>
            <UserCircle size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Academic Advisor</div>
            <div style={{ fontWeight: 600 }}>{profile.advisor}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--info-color)' }}>{profile.advisorEmail}</div>
          </div>
        </div>
        
        <div className="card" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-color)', borderRadius: '50%' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Account Balance</div>
            <div style={{ fontWeight: 600, color: 'var(--danger-color)' }}>{profile.balance}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Due: {profile.dueDate}</div>
          </div>
        </div>
        
        <div className="card" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'var(--warning-bg)', color: 'var(--warning-color)', borderRadius: '50%' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Next Class</div>
            <div style={{ fontWeight: 600 }}>Data Structures</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Today, 10:00 AM</div>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="alert alert-danger animate-fade-in">
          <AlertCircle size={20} className="alert-icon" />
          <div className="alert-content">
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Registration Error</p>
            <p style={{ fontSize: '0.875rem' }}>{errorMsg}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="alert alert-success animate-fade-in">
          <CheckCircle2 size={20} className="alert-icon" />
          <div className="alert-content">
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Enrollment Confirmed</p>
            <p style={{ fontSize: '0.875rem' }}>{successMsg}</p>
          </div>
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <BookMarked size={20} color="var(--accent-color)" />
              <h3 style={{ margin: 0 }}>Course Registration</h3>
            </div>
            <span className="badge badge-neutral">Spring 2026</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {availableCourses.map(course => (
              <div key={course.id} style={{ border: '1px solid var(--border-color)', borderRadius: '0.5rem', padding: '1.25rem', transition: 'box-shadow 0.2s' }} className="hover:shadow-md">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>{course.code}</span>
                      <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{course.credits} Credits</span>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{course.name}</h4>
                  </div>
                  <span className={`badge ${course.availableSeats > 0 ? 'badge-success' : 'badge-danger'}`}>
                    {course.availableSeats > 0 ? `${course.availableSeats} Seats Left` : 'Waitlisted'}
                  </span>
                </div>
                
                <div className="flex gap-4 mb-3">
                  <div className="flex items-center gap-1 text-secondary" style={{ fontSize: '0.8125rem' }}>
                    <Clock size={14} /> {course.schedule}
                  </div>
                </div>
                
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1rem', backgroundColor: 'var(--surface-hover)', padding: '0.5rem', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600 }}>Prerequisite:</span> 
                  <span className="badge badge-neutral">{course.prereq}</span>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    className="btn btn-secondary btn-sm" 
                    onClick={() => handleEnroll(course)}
                    disabled={course.availableSeats === 0}
                    style={{ opacity: course.availableSeats === 0 ? 0.5 : 1, cursor: course.availableSeats === 0 ? 'not-allowed' : 'pointer' }}
                  >
                    Add Course
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} color="var(--success-color)" />
              <h3 style={{ margin: 0 }}>Academic Record</h3>
            </div>
            <button className="btn btn-secondary btn-sm">Download Official</button>
          </div>
          
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Course Info</th>
                  <th>Term</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {transcript.map((t, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.code}: {t.name}</div>
                      <div className="table-cell-subtext">{t.credits} Credits • {t.instructor}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{t.term}</td>
                    <td>
                      <span style={{ 
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', 
                        width: '32px', height: '32px', borderRadius: '0.375rem', 
                        backgroundColor: 'var(--surface-hover)', fontWeight: 600, border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)'
                      }}>
                        {t.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
