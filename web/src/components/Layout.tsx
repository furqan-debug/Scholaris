import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, BookOpen, CalendarCheck, LogOut, UserCircle, GraduationCap, ClipboardCheck } from 'lucide-react';

export default function Layout() {
  const { signOut, user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const allNavItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
    { path: '/students', label: 'Students', icon: Users, roles: ['admin', 'teacher'] },
    { path: '/teachers', label: 'Teachers', icon: UserCircle, roles: ['admin'] },
    { path: '/courses', label: 'Course Catalog', icon: BookOpen, roles: ['admin', 'teacher', 'student'] },
    { path: '/transcript', label: 'Transcript & Enroll', icon: GraduationCap, roles: ['student'] },
    { path: '/grading', label: 'Grading Portal', icon: ClipboardCheck, roles: ['teacher', 'admin'] },
  ];

  const role = profile?.role || 'student';
  const navItems = allNavItems.filter(item => item.roles.includes(role));


  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-box"></div>
          <h2>Scholaris</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-email">{user?.email}</span>
          </div>
          <button onClick={handleSignOut} className="btn-logout">
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-title">
            {navItems.find(item => item.path === location.pathname)?.label || 'Overview'}
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
