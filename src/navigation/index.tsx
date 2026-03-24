import { createBrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/dashboard';
import Auth from '../pages/auth';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import School from '../pages/school';
import Class from '../pages/class';
import ClassArms from '../pages/class/classArms';

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
        path: 'school',
        element: <School />,
      },
      {
        path: 'classes',
        children: [
          {
            index: true,
            element: <Class />,
          },
          {
            path: ':classId',
            element: <ClassArms />,
          },
        ]
      },
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);
