import { useProfiles, useCreateProfile, useUpdateProfile } from '../hooks/useProfiles';
import { Search } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/ui/Modal';

export default function Teachers() {
  const { data: teachers, isLoading, error } = useProfiles('teacher');
  const createProfile = useCreateProfile();
  const updateProfile = useUpdateProfile();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ email: '', password: '', first_name: '', last_name: '' });
  const [editData, setEditData] = useState({ first_name: '', last_name: '' });

  const handleOpenEdit = (teacher: any) => {
    setEditingTeacherId(teacher.id);
    setEditData({ first_name: teacher.first_name, last_name: teacher.last_name });
    setIsEditModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProfile.mutateAsync({ ...formData, role: 'teacher' });
      setIsModalOpen(false);
      setFormData({ email: '', password: '', first_name: '', last_name: '' });
    } catch (err) {
      alert('Failed to create teacher: ' + (err as Error).message);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacherId) return;
    try {
      await updateProfile.mutateAsync({ id: editingTeacherId, updates: editData });
      setIsEditModalOpen(false);
    } catch (err) {
      alert('Failed to update teacher: ' + (err as Error).message);
    }
  };

  if (isLoading) return <div className="page">Loading teachers...</div>;
  if (error) return <div className="page"><div className="error-message">Error loading teachers: {(error as Error).message}</div></div>;

  return (
    <div className="page">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3>Teachers</h3>
          <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsModalOpen(true)}>Add Teacher</button>
        </div>
        
        <div className="input-group" style={{ marginBottom: '24px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search teachers..." style={{ paddingLeft: '36px' }} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Email</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Joined</th>
                <th style={{ padding: '12px 8px', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!teachers || teachers.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No teachers found.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 8px' }}>{teacher.first_name} {teacher.last_name}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{teacher.email}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{new Date(teacher.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <button onClick={() => handleOpenEdit(teacher)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}>Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Teacher">
        <form onSubmit={handleSubmit}>
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
            {createProfile.isPending ? 'Saving...' : 'Save Teacher'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Teacher">
        <form onSubmit={handleEditSubmit}>
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
