import React, { Fragment, useContext } from "react";
import AppContext from "../../context/AppContext";

const Dashboard = () => {
  const { user } = useContext(AppContext);
  const { resume } = user || {};

  // Hide PDF controls + Fit to width
  const pdfSrc = resume
    ? `${resume}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-width`
    : "";

  return (
    <Fragment>
      <div className="w-screen h-screen flex justify-center items-center bg-gray-50 overflow-hidden p-4">
        {resume ? (
          <iframe
            src={pdfSrc}
            className="
              h-full
              w-[80%]
              md:w-[60%]
              shadow-lg rounded-lg bg-white
            "
            style={{ border: "none" }}
            title="Resume Viewer"
          ></iframe>
        ) : (
          <p className="text-center mt-10 text-gray-600">
            No resume uploaded.
          </p>
        )}
      </div>
    </Fragment>
  );
};

export default Dashboard;
