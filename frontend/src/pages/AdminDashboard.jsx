import { useState } from 'react';
import { Users, BookOpen, GraduationCap, Building2, TrendingUp, Download, MoreHorizontal, Activity, Filter, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDashboard() {
  const [stats] = useState({
    totalStudents: 1542,
    totalCourses: 124,
    totalInstructors: 86,
    totalDepartments: 12
  });
  
  const enrollmentData = [
    { month: 'Jan', students: 1200 },
    { month: 'Feb', students: 1250 },
    { month: 'Mar', students: 1300 },
    { month: 'Apr', students: 1350 },
    { month: 'May', students: 1480 },
    { month: 'Jun', students: 1542 },
  ];

  const departmentData = [
    { name: 'Comp. Sci', value: 450 },
    { name: 'Business', value: 380 },
    { name: 'Engineering', value: 320 },
    { name: 'Arts', value: 210 },
    { name: 'Science', value: 182 },
  ];

  const [recentEnrollments] = useState([
    { id: 'ENR-2025-001', student: 'Alice Smith', major: 'Computer Science', course: 'Data Structures (CS201)', date: '2025-08-15', status: 'Active' },
    { id: 'ENR-2025-002', student: 'Bob Jones', major: 'Software Engineering', course: 'Database Systems (CS301)', date: '2025-08-16', status: 'Pending' },
    { id: 'ENR-2025-003', student: 'Charlie Brown', major: 'Electrical Eng', course: 'Operating Systems (CS401)', date: '2025-08-17', status: 'Active' },
    { id: 'ENR-2025-004', student: 'Diana Prince', major: 'Business Admin', course: 'Marketing Principles (MKT101)', date: '2025-08-17', status: 'Active' },
    { id: 'ENR-2025-005', student: 'Evan Wright', major: 'Computer Science', course: 'Artificial Intelligence (CS501)', date: '2025-08-18', status: 'Dropped' },
  ]);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1>Administration Overview</h1>
          <p>Key metrics and recent activity across the university.</p>
        </div>
        <div className="flex gap-4">
          <div className="search-bar" style={{ width: '250px' }}>
             <Calendar size={16} />
             <input type="text" placeholder="Select Term: Fall 2025" disabled style={{ backgroundColor: 'var(--surface-color)', cursor: 'pointer' }}/>
          </div>
          <button className="btn btn-primary">
            <Download size={16} /> Export Report
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card" style={{ transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div className="flex justify-between items-center mb-4">
            <span className="stat-label">Total Enrollment</span>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--info-bg)', color: 'var(--info-color)', borderRadius: '0.375rem' }}>
              <Users size={20} />
            </div>
          </div>
          <div className="stat-value">
            {stats.totalStudents.toLocaleString()}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="stat-trend trend-up flex items-center gap-1"><TrendingUp size={14} /> +4.5%</span>
            <span className="text-tertiary" style={{ fontSize: '0.75rem' }}>vs last semester</span>
          </div>
        </div>
        
        <div className="stat-card" style={{ transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div className="flex justify-between items-center mb-4">
            <span className="stat-label">Active Courses</span>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--warning-bg)', color: 'var(--warning-color)', borderRadius: '0.375rem' }}>
              <BookOpen size={20} />
            </div>
          </div>
          <div className="stat-value">
            {stats.totalCourses}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="stat-trend flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>0.0%</span>
            <span className="text-tertiary" style={{ fontSize: '0.75rem' }}>vs last semester</span>
          </div>
        </div>

        <div className="stat-card" style={{ transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div className="flex justify-between items-center mb-4">
            <span className="stat-label">Faculty Members</span>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--success-bg)', color: 'var(--success-color)', borderRadius: '0.375rem' }}>
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="stat-value">
            {stats.totalInstructors}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="stat-trend trend-up flex items-center gap-1"><TrendingUp size={14} /> +2.1%</span>
            <span className="text-tertiary" style={{ fontSize: '0.75rem' }}>vs last semester</span>
          </div>
        </div>

        <div className="stat-card" style={{ transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div className="flex justify-between items-center mb-4">
            <span className="stat-label">Departments</span>
            <div style={{ padding: '0.5rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', borderRadius: '0.375rem' }}>
              <Building2 size={20} />
            </div>
          </div>
          <div className="stat-value">
            {stats.totalDepartments}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-tertiary" style={{ fontSize: '0.75rem' }}>Across 4 colleges</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8" style={{ gridTemplateColumns: '2fr 1fr' }}>
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3>Enrollment Growth (YTD)</h3>
            <span className="badge badge-neutral">2026</span>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <AreaChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                  labelStyle={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="students" stroke="var(--accent-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <h3>Students by Dept</h3>
          </div>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer>
              <BarChart data={departmentData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border-color)" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} width={80} />
                <Tooltip 
                  cursor={{ fill: 'var(--surface-hover)' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                />
                <Bar dataKey="value" fill="var(--info-color)" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div className="flex items-center gap-2">
            <Activity size={20} color="var(--text-secondary)" />
            <h3 style={{ margin: 0 }}>Registration Feed</h3>
          </div>
          <div className="flex gap-2">
            <div className="search-bar" style={{ width: '200px' }}>
              <Filter size={16} />
              <input type="text" placeholder="Filter status..." />
            </div>
            <button className="btn btn-secondary btn-sm">View All Logs</button>
          </div>
        </div>
        
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Enrollment ID</th>
                <th>Student</th>
                <th>Course Details</th>
                <th>Timestamp</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentEnrollments.map((enroll, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{enroll.id}</td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{enroll.student}</div>
                    <div className="table-cell-subtext">{enroll.major}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{enroll.course}</div>
                    <div className="table-cell-subtext">3 Credits</div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    <div>{enroll.date}</div>
                    <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>14:32:01 UTC</div>
                  </td>
                  <td>
                    <span className={`badge ${enroll.status === 'Active' ? 'badge-success' : enroll.status === 'Pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {enroll.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '0.25rem', borderRadius: '4px' }} className="hover:bg-gray-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
