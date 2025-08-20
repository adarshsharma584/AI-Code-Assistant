import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Tools from './pages/Tools';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import SignIn from "./pages/SignIn"
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '/pricing', element: <Pricing /> },
      { path: '/tools', element: <Tools /> },
      { path: '/profile', element: <Profile /> },
    ],
  },
  { path: '/sign-up', element: <SignUp /> },
  { path: '/sign-in', element: <SignIn /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;