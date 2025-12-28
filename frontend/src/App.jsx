import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Tools from './pages/Tools';
import Profile from './pages/Profile';
import SignUp from './pages/SignUp';
import SignIn from "./pages/SignIn"
import {AuthProvider}  from './context/Providers/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Learn from './pages/Learn';
import Roadmap from './pages/Roadmap';
import Explain from './pages/Explain';
import Review from './pages/Review';
import PricingDetails from './pages/PricingDetails';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      {
        path: "/pricing",
        element: <Pricing />,
        children: [
          {
            path: "/pricing/:id",
            element: (
              <ProtectedRoute>
                <PricingDetails />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/tools",
        children: [
          {
            path: "",
            element: <Tools />,
          },
          {
            path: "learn",
            element: (
              <ProtectedRoute>
                <Learn />
              </ProtectedRoute>
            ),
          },
          {
            path: "roadmap",
            element: (
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            ),
          },
          {
            path: "review",
            element: (
              <ProtectedRoute>
                <Review />
              </ProtectedRoute>
            ),
          },
          {
            path: "explain",
            element: (
              <ProtectedRoute>
                <Explain />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // {
  //   path: "/profile",
  //   element: (
  //     <ProtectedRoute>
  //       <Profile />
  //     </ProtectedRoute>
  //   ),
  // },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/sign-in", element: <SignIn /> },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;