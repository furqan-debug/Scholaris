import { useState } from 'react';
import { useSections } from '../hooks/useCourses';
import { useSectionEnrollments } from '../hooks/useEnrollments';
import { useAssignments, useCreateAssignment, useSubmissions, useSubmitScore } from '../hooks/useAssignments';
import Modal from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';

function SubmissionsTable({ assignmentId, sectionId }: { assignmentId: string, sectionId: string }) {
  const { data: enrollments } = useSectionEnrollments(sectionId);
  const { data: submissions } = useSubmissions(assignmentId);
  const submitScore = useSubmitScore();

  const getScore = (studentId: string) => {
    return submissions?.find(s => s.student_id === studentId)?.score || '';
  };

  const handleScoreChange = async (studentId: string, score: string) => {
    if (score === '') return;
    try {
      await submitScore.mutateAsync({ assignment_id: assignmentId, student_id: studentId, score: parseInt(score) });
    } catch (err: any) {
      alert('Failed to save score: ' + err.message);
    }
  };

  return (
    <div style={{ marginTop: '16px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '8px', fontWeight: 500 }}>Student</th>
            <th style={{ padding: '8px', fontWeight: 500 }}>Score</th>
          </tr>
        </thead>
        <tbody>
          {enrollments?.map(env => (
            <tr key={env.student_id} style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '8px' }}>{env.student?.first_name} {env.student?.last_name}</td>
              <td style={{ padding: '8px' }}>
                <input 
                  type="number" 
                  defaultValue={getScore(env.student_id)} 
                  onBlur={(e) => handleScoreChange(env.student_id, e.target.value)}
                  style={{ width: '80px', padding: '4px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Grading() {
  const { user, profile } = useAuth();
  const [selectedSection, setSelectedSection] = useState('');
  const { data: allSections } = useSections();
  
  const sections = allSections?.filter(s => profile?.role === 'admin' || s.teacher_id === user?.id);

  const { data: assignments } = useAssignments(selectedSection);
  const createAssignment = useCreateAssignment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', max_score: 100, weight_percentage: 20 });

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAssignment.mutateAsync({ ...formData, section_id: selectedSection });
      setIsModalOpen(false);
      setFormData({ title: '', max_score: 100, weight_percentage: 20 });
    } catch (err: any) {
      alert('Failed to create assignment: ' + err.message);
    }
  };

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3>Select Section for Grading</h3>
        <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', width: '100%', marginTop: '16px', maxWidth: '500px' }}>
          <option value="">-- Choose a Section --</option>
          {sections?.map(s => <option key={s.id} value={s.id}>{s.course?.code} - {s.course?.name} ({s.semester} | {s.schedule})</option>)}
        </select>
      </div>

      {selectedSection && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Assignments & Grading</h3>
            <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsModalOpen(true)}>Add Assignment</button>
          </div>

          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {!assignments || assignments.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No assignments found. Create one to start grading.</p>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h4 style={{ margin: 0 }}>{assignment.title}</h4>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Weight: {assignment.weight_percentage}%</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>Max Score: {assignment.max_score}</div>
                  
                  <SubmissionsTable assignmentId={assignment.id} sectionId={selectedSection} />
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Assignment">
        <form onSubmit={handleAddAssignment}>
          <div className="input-group">
            <label>Title</label>
            <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Midterm Exam" />
          </div>
          <div className="input-group">
            <label>Max Score</label>
            <input type="number" required value={formData.max_score} onChange={e => setFormData({...formData, max_score: parseInt(e.target.value)})} min="1" max="1000" />
          </div>
          <div className="input-group">
            <label>Weight Percentage (%)</label>
            <input type="number" required value={formData.weight_percentage} onChange={e => setFormData({...formData, weight_percentage: parseInt(e.target.value)})} min="1" max="100" />
          </div>
          <button type="submit" className="btn-primary" disabled={createAssignment.isPending}>
            {createAssignment.isPending ? 'Saving...' : 'Save Assignment'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
