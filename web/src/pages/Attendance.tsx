import { useState } from 'react';
import { useAttendance, useCreateAttendance } from '../hooks/useAttendance';
import { useClasses } from '../hooks/useClasses';
import { useProfiles } from '../hooks/useProfiles';
import { format } from 'date-fns';
import Modal from '../components/ui/Modal';

export default function Attendance() {
  const [date, setDate] = useState(new Date());
  const { data: attendanceLogs, isLoading, error } = useAttendance(date);
  const { data: classes } = useClasses();
  const { data: students } = useProfiles('student');
  const createAttendance = useCreateAttendance();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ class_id: '', student_id: '', status: 'present', notes: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAttendance.mutateAsync({ ...formData, date: format(date, 'yyyy-MM-dd') });
      setIsModalOpen(false);
      setFormData({ class_id: '', student_id: '', status: 'present', notes: '' });
    } catch (err) {
      alert('Failed to log attendance: ' + (err as Error).message);
    }
  };

  return (
    <div className="page">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3>Daily Attendance</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="date" 
              value={format(date, 'yyyy-MM-dd')} 
              onChange={(e) => setDate(new Date(e.target.value))}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
            <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsModalOpen(true)}>Log Attendance</button>
          </div>
        </div>

        {isLoading ? (
          <div>Loading attendance...</div>
        ) : error ? (
          <div className="error-message">Error loading attendance: {(error as Error).message}</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 8px', fontWeight: 500 }}>Student Name</th>
                  <th style={{ padding: '12px 8px', fontWeight: 500 }}>Class</th>
                  <th style={{ padding: '12px 8px', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '12px 8px', fontWeight: 500 }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {!attendanceLogs || attendanceLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No attendance records for this date.
                    </td>
                  </tr>
                ) : (
                  attendanceLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 8px' }}>
                        {log.student ? `${log.student.first_name} ${log.student.last_name}` : 'Unknown'}
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                        {log.class ? log.class.name : 'Unknown'}
                      </td>
                      <td style={{ padding: '12px 8px' }}>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          backgroundColor: log.status === 'present' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                          color: log.status === 'present' ? '#22c55e' : '#ef4444'
                        }}>
                          {log.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{log.notes || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Attendance">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Class</label>
            <select required value={formData.class_id} onChange={e => setFormData({...formData, class_id: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
              <option value="">Select a class</option>
              {classes?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Student</label>
            <select required value={formData.student_id} onChange={e => setFormData({...formData, student_id: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
              <option value="">Select a student</option>
              {students?.map(s => <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Status</label>
            <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="excused">Excused</option>
            </select>
          </div>
          <div className="input-group">
            <label>Notes</label>
            <input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary" disabled={createAttendance.isPending}>
            {createAttendance.isPending ? 'Saving...' : 'Save Record'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
