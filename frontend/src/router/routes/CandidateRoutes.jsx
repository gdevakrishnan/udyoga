import Dashboard from "../../pages/candidate/Dashboard";
import Profile from "../../pages/candidate/Profile";
import Analyze from "../../pages/candidate/Analyze";

const CandidateRoutes = [
  {
    path: "candidate",
    element: <Dashboard />,
  },
  {
    path: "c/profile",
    element: <Profile />,
  },
  {
    path: "analyze",
    element: <Analyze />
  }
];

export default CandidateRoutes;
