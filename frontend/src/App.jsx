import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import Navigation from './components/common/Navigation';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        
        <div className="main-content">
          <header className="topbar">
            <div className="search-bar">
              <Search size={16} />
              <input type="text" placeholder="Search students, courses, or IDs..." />
            </div>
            <div className="flex items-center gap-6">
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--text-secondary)' }}>
                <Bell size={20} />
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', backgroundColor: 'var(--danger-color)', borderRadius: '50%' }}></span>
              </button>
              <div className="user-profile">
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>System Admin</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>admin@university.edu</div>
                </div>
                <div className="avatar">A</div>
              </div>
            </div>
          </header>

          <main className="content-area">
            <Routes>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/instructor" element={<InstructorDashboard />} />
              <Route path="/" element={<Navigate to="/admin" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
