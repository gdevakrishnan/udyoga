import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootLayout from "../pages/common/RootLayout";
import Home from "../pages/common/Home";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import RecruiterRoutes from "./routes/RecruiterRoutes"
import CandidateRoutes from "./routes/CandidateRoutes"

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      
      // Private Routes
      {
        element: <PrivateRoute />,
        children: [...CandidateRoutes, ...RecruiterRoutes],
      },

      // Public Routes
      {
        element: <PublicRoute />,
        children: [
          { path: "register", element: <Register /> },
          { path: "login", element: <Login /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}