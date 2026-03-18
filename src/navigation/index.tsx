import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/dashboard';
import Auth from '../pages/auth';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export const publicRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/signup',
    element: <Auth />
  },
  {
    path: '/login',
    element: <Auth />
  },
  {
    path: '*',
    element: <Home />,
  }
]);

export const authRouter = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'courses',
        element: <Dashboard />, // Placeholder for now
      },
      {
        path: 'assignments',
        element: <Dashboard />, // Placeholder
      },
      {
        path: 'messages',
        element: <Dashboard />, // Placeholder
      },
      {
        path: 'settings',
        element: <Dashboard />, // Placeholder
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
