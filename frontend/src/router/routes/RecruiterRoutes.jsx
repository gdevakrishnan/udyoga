import Dashboard from "../../pages/recruiter/Dashboard";
import Profile from "../../pages/recruiter/Profile";

const RecruiterRoutes = [
  {
    path: "recruiter",
    element: <Dashboard />,
  },
  {
    path: "r/profile",
    element: <Profile />,
  },
];

export default RecruiterRoutes;
