import { RouterProvider } from 'react-router-dom';
import { publicRouter, authRouter } from './navigation';
import { useAppSelector } from './store/hooks';
import './App.css';

function App() {
  const isAuth = useAppSelector((state) => state.auth.isAuthenticated);
  
  return (
    <RouterProvider router={isAuth ? authRouter : publicRouter} />
  );
}

export default App;
