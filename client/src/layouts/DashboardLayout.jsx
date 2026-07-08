import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/teams': 'Teams',
  '/projects': 'Projects',
};

const resolveTitle = (pathname) => {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/teams/')) return 'Team details';
  if (pathname.startsWith('/projects/') && pathname.endsWith('/board')) return 'Task board';
  if (pathname.startsWith('/projects/')) return 'Project details';
  return 'SyncSpace';
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="dashboard-main">
        <Navbar title={resolveTitle(location.pathname)} onMenuClick={() => setSidebarOpen(true)} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
