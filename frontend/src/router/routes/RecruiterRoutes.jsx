import JobDescription from "../../pages/recruiter/JobDescription";
import Profile from "../../pages/recruiter/Profile";

const RecruiterRoutes = [
  {
    path: "job-description",
    element: <JobDescription />,
  },
  {
    path: "r/profile",
    element: <Profile />,
  },
];

export default RecruiterRoutes;
