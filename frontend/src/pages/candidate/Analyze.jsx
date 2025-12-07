// Analyze.jsx
import React, { Fragment, useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";

import Timeline from "../../components/analyze/Timeline";
import SubmitForm from "../../components/analyze/SubmitForm";
import AnalyzeGap from "../../components/analyze/AnalyzeGap";
import QueryChat from "../../components/analyze/QueryChat";

const Analyze = () => {
  const { user } = useContext(AppContext);

  const [currentStep, setCurrentStep] = useState("submit");
  const [submittedData, setSubmittedData] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (user) {
      setToken(localStorage.getItem("udhyoga_access_token"));
    }
  }, [user]);

  const handleSubmit = async (data) => {
    setSubmittedData(data);
    setCurrentStep("analyze");
  };

  const handleStartQuery = () => setCurrentStep("queries");

  return (
    <Fragment>
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50 py-12">
        <div className="max-w-4xl mx-auto relative">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Resume Analysis</h1>
            <p className="text-gray-600">
              Analyze your resume against job requirements
            </p>
          </header>

          <Timeline currentStep={currentStep} />

          {currentStep === "submit" && (
            <SubmitForm user={user} onSubmit={handleSubmit} token={token} />
          )}

          {currentStep === "analyze" && (
            <AnalyzeGap onStartQuery={handleStartQuery} data={submittedData} />
          )}

          {currentStep === "queries" && <QueryChat />}
        </div>
      </div>
    </Fragment>
  );
};

export default Analyze;
