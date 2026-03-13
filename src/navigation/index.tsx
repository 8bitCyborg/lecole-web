import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Dashboard from '../pages/dashboard';

export const publicRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
