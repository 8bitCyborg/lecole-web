import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/dashboard';
import Auth from '../pages/auth';
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
    element: <Dashboard />,
  },
  {
    path: '*',
    element: <Dashboard />,
  }
]);
