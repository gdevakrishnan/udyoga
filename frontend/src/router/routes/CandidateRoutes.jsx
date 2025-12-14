import Profile from "../../pages/candidate/Profile";
import Analyze from "../../pages/candidate/Analyze";

const CandidateRoutes = [
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
