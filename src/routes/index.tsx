import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import VersionManagement from '../pages/VersionManagement';
import MemberManagement from '../pages/MemberManagement';
import DevManagement from '../pages/DevManagement';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'workbench/homepage',
        element: <Dashboard />,
      },
      {
        path: 'management/version-management',
        element: <VersionManagement />,
      },
      {
        path: 'management/result-management',
        element: <MemberManagement />,
      },
      {
        path: 'management/dev-management',
        element: <DevManagement />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
