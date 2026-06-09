import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, GraduationCap, Building2, BookOpen, Settings } from 'lucide-react';

export default function Navigation() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Building2 className="text-blue-600" size={24} color="var(--accent-color)" />
        <h2>Scholaris</h2>
      </div>
      
      <div className="nav-menu">
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0.5rem 0.5rem' }}>Portals</p>
        
        <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Administration</span>
        </NavLink>
        
        <NavLink to="/student" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <GraduationCap size={18} />
          <span>Student Center</span>
        </NavLink>
        
        <NavLink to="/instructor" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={18} />
          <span>Faculty Portal</span>
        </NavLink>
        
        <div style={{ marginTop: 'auto' }}>
          <NavLink to="#" className="nav-item">
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
}
