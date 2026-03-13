import { RouterProvider } from 'react-router-dom';
import { publicRouter, authRouter } from './navigation';
import './App.css';

function App() {
  // Dummy isAuth flag
  const isAuth = false;
  return (
    <RouterProvider router={isAuth ? authRouter : publicRouter} />
  );
}

export default App;
