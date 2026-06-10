import { useClasses, useCreateClass } from '../hooks/useClasses';
import { useProfiles } from '../hooks/useProfiles';
import { Search } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/ui/Modal';

export default function Classes() {
  const { data: classes, isLoading, error } = useClasses();
  const { data: teachers } = useProfiles('teacher');
  const createClass = useCreateClass();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', teacher_id: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createClass.mutateAsync({ ...formData, teacher_id: formData.teacher_id || null });
      setIsModalOpen(false);
      setFormData({ name: '', description: '', teacher_id: '' });
    } catch (err) {
      alert('Failed to create class: ' + (err as Error).message);
    }
  };

  if (isLoading) return <div className="page">Loading classes...</div>;
  if (error) return <div className="page"><div className="error-message">Error loading classes: {(error as Error).message}</div></div>;

  return (
    <div className="page">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3>Classes</h3>
          <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsModalOpen(true)}>Create Class</button>
        </div>
        
        <div className="input-group" style={{ marginBottom: '24px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', top: '10px', left: '10px', color: 'var(--text-secondary)' }} />
          <input type="text" placeholder="Search classes..." style={{ paddingLeft: '36px' }} />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Description</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Instructor</th>
                <th style={{ padding: '12px 8px', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!classes || classes.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No classes found.
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 8px' }}>{cls.name}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>{cls.description}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                      {cls.teacher ? `${cls.teacher.first_name} ${cls.teacher.last_name}` : 'Unassigned'}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}>View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Class">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Class Name</label>
            <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Description</label>
            <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="input-group">
            <label>Instructor</label>
            <select 
              value={formData.teacher_id} 
              onChange={e => setFormData({...formData, teacher_id: e.target.value})}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            >
              <option value="">Unassigned</option>
              {teachers?.map(t => (
                <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={createClass.isPending}>
            {createClass.isPending ? 'Saving...' : 'Save Class'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
