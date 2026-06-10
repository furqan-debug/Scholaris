import { useProfiles, useCreateProfile, useUpdateProfile } from '../hooks/useProfiles';
import { Search } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/ui/Modal';

export default function Students() {
  const { data: students, isLoading, error } = useProfiles('student');
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ email: '', password: '', first_name: '', last_name: '', roll_number: '' });
  const [editData, setEditData] = useState({ first_name: '', last_name: '', roll_number: '' });

  const handleOpenEdit = (student: any) => {
    setEditingStudentId(student.id);
    setEditData({ first_name: student.first_name, last_name: student.last_name, roll_number: student.roll_number || '' });
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProfile.mutateAsync({ ...formData, role: 'student' });
      setIsModalOpen(false);
      setFormData({ email: '', password: '', first_name: '', last_name: '', roll_number: '' });
    } catch (err) {
      alert('Failed to create student: ' + (err as Error).message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudentId) return;
    try {
      await updateProfile.mutateAsync({ id: editingStudentId, updates: editData });
      setIsEditModalOpen(false);
    } catch (err) {
      alert('Failed to update student: ' + (err as Error).message);
    }
  };

  if (isLoading) return <div className="page">Loading students...</div>;
  if (error) return <div className="page"><div className="error-message">Error loading students: {(error as Error).message}</div></div>;

  return (
    <div className="page">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3>Students</h3>
          <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsModalOpen(true)}>Add Student</button>
        </div>
        
        <div className="input-group" style={{ marginBottom: '24px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search students..." style={{ paddingLeft: '36px' }} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Roll No.</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Email</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Joined</th>
                <th style={{ padding: '12px 8px', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!students || students.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 8px' }}>{student.roll_number || '-'}</td>
                    <td style={{ padding: '12px 8px' }}>{student.first_name} {student.last_name}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{student.email}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{new Date(student.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <button onClick={() => handleOpenEdit(student)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}>Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Student">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Roll Number</label>
            <input required value={formData.roll_number} onChange={e => setFormData({...formData, roll_number: e.target.value})} placeholder="e.g. S1001" />
          </div>
          <div className="input-group">
            <label>First Name</label>
            <input required value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input required value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary" disabled={createProfile.isPending}>
            {createProfile.isPending ? 'Saving...' : 'Save Student'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Student">
        <form onSubmit={handleEditSubmit}>
          <div className="input-group">
            <label>Roll Number</label>
            <input required value={editData.roll_number} onChange={e => setEditData({...editData, roll_number: e.target.value})} />
          </div>
          <div className="input-group">
            <label>First Name</label>
            <input required value={editData.first_name} onChange={e => setEditData({...editData, first_name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input required value={editData.last_name} onChange={e => setEditData({...editData, last_name: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
