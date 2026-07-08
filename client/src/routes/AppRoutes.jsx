import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

import Landing from '../pages/landing/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Dashboard from '../pages/dashboard/Dashboard';
import Teams from '../pages/teams/Teams';
import TeamDetails from '../pages/teams/TeamDetails';
import Projects from '../pages/projects/Projects';
import ProjectDetails from '../pages/projects/ProjectDetails';
import TaskBoard from '../pages/tasks/TaskBoard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:teamId" element={<TeamDetails />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="/projects/:projectId/board" element={<TaskBoard />} />
      </Route>

      <Route path="*" element={<Landing />} />
    </Routes>
  );
};

export default AppRoutes;
