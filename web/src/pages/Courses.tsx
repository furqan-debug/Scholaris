import { useState } from 'react';
import { useCourses, useCreateCourse, useSections, useCreateSection } from '../hooks/useCourses';
import { useProfiles } from '../hooks/useProfiles';
import Modal from '../components/ui/Modal';
import { Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Courses() {
  const { data: courses, isLoading: loadingCourses } = useCourses();
  const { data: sections, isLoading: loadingSections } = useSections();
  const { data: teachers } = useProfiles('teacher');
  
  const createCourse = useCreateCourse();
  const createSection = useCreateSection();
  const { session } = useAuth();
  
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseFormData, setCourseFormData] = useState({ code: '', name: '', credits: 3, description: '', teacher_id: '', prerequisites: [] as string[] });

  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [sectionFormData, setSectionFormData] = useState({ course_id: '', teacher_id: '', semester: 'Fall 2026', schedule: '', capacity: 30 });

  const isAdminOrTeacher = session?.user.email === 'admin@scholaris.com' || teachers?.some(t => t.id === session?.user.id);

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCourse.mutateAsync({ ...courseFormData, teacher_id: courseFormData.teacher_id || null });
      setIsCourseModalOpen(false);
      setCourseFormData({ code: '', name: '', credits: 3, description: '', teacher_id: '', prerequisites: [] });
    } catch (err) {
      alert('Failed to create course: ' + (err as Error).message);
    }
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createSection.mutateAsync({ ...sectionFormData, teacher_id: sectionFormData.teacher_id || null });
      setIsSectionModalOpen(false);
      setSectionFormData({ course_id: '', teacher_id: '', semester: 'Fall 2026', schedule: '', capacity: 30 });
    } catch (err) {
      alert('Failed to create section: ' + (err as Error).message);
    }
  };

  const handlePrereqChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions, option => option.value);
    setCourseFormData({ ...courseFormData, prerequisites: options });
  };

  if (loadingCourses || loadingSections) return <div className="page">Loading courses...</div>;

  return (
    <div className="page">
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3>Course Catalog</h3>
          {isAdminOrTeacher && (
            <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsCourseModalOpen(true)}>Add Course</button>
          )}
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Code</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Name</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Credits</th>
              </tr>
            </thead>
            <tbody>
              {!courses || courses.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>No courses found.</td></tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>{course.code}</td>
                    <td style={{ padding: '12px 8px' }}>{course.name}</td>
                    <td style={{ padding: '12px 8px' }}>{course.credits}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3>Active Sections (Offerings)</h3>
          {isAdminOrTeacher && (
            <button className="btn-primary" style={{ width: 'auto' }} onClick={() => setIsSectionModalOpen(true)}>Add Section</button>
          )}
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Course</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Semester</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Schedule</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Capacity</th>
                <th style={{ padding: '12px 8px', fontWeight: 500 }}>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {!sections || sections.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>No sections found.</td></tr>
              ) : (
                sections.map((section) => (
                  <tr key={section.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 8px', fontWeight: 500 }}>{section.course?.code} - {section.course?.name}</td>
                    <td style={{ padding: '12px 8px' }}>{section.semester}</td>
                    <td style={{ padding: '12px 8px' }}>{section.schedule}</td>
                    <td style={{ padding: '12px 8px' }}>{section.capacity}</td>
                    <td style={{ padding: '12px 8px', color: 'var(--text-secondary)' }}>
                      {section.teacher ? `${section.teacher.first_name} ${section.teacher.last_name}` : 'Unassigned'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title="Add Course">
        <form onSubmit={handleCourseSubmit}>
          <div className="input-group">
            <label>Course Code</label>
            <input required value={courseFormData.code} onChange={e => setCourseFormData({...courseFormData, code: e.target.value})} placeholder="e.g. CS101" />
          </div>
          <div className="input-group">
            <label>Course Name</label>
            <input required value={courseFormData.name} onChange={e => setCourseFormData({...courseFormData, name: e.target.value})} placeholder="e.g. Intro to Computer Science" />
          </div>
          <div className="input-group">
            <label>Credits</label>
            <input type="number" required value={courseFormData.credits} onChange={e => setCourseFormData({...courseFormData, credits: parseInt(e.target.value)})} min="1" max="6" />
          </div>
          <div className="input-group">
            <label>Prerequisites (Hold Ctrl/Cmd to select multiple)</label>
            <select multiple value={courseFormData.prerequisites} onChange={handlePrereqChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)', height: '100px' }}>
              {courses?.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={createCourse.isPending}>
            {createCourse.isPending ? 'Saving...' : 'Save Course'}
          </button>
        </form>
      </Modal>

      <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)} title="Add Section">
        <form onSubmit={handleSectionSubmit}>
          <div className="input-group">
            <label>Course</label>
            <select required value={sectionFormData.course_id} onChange={e => setSectionFormData({...sectionFormData, course_id: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
              <option value="">Select a Course</option>
              {courses?.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Semester</label>
            <input required value={sectionFormData.semester} onChange={e => setSectionFormData({...sectionFormData, semester: e.target.value})} placeholder="e.g. Fall 2026" />
          </div>
          <div className="input-group">
            <label>Schedule</label>
            <input required value={sectionFormData.schedule} onChange={e => setSectionFormData({...sectionFormData, schedule: e.target.value})} placeholder="e.g. Mon/Wed 10:00 AM" />
          </div>
          <div className="input-group">
            <label>Capacity</label>
            <input type="number" required value={sectionFormData.capacity} onChange={e => setSectionFormData({...sectionFormData, capacity: parseInt(e.target.value)})} min="1" max="500" />
          </div>
          <div className="input-group">
            <label>Instructor</label>
            <select value={sectionFormData.teacher_id} onChange={e => setSectionFormData({...sectionFormData, teacher_id: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
              <option value="">Unassigned</option>
              {teachers?.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={createSection.isPending}>
            {createSection.isPending ? 'Saving...' : 'Save Section'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
