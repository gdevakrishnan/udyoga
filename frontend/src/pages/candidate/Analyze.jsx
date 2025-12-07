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

  // NEXT STEPS
  const handleSubmit = (data) => {
    setSubmittedData(data);
    setCurrentStep("analyze");
  };

  const handleStartQuery = () => setCurrentStep("queries");

  // BACK BUTTON LOGIC
  const handleBack = () => {
    if (currentStep === "analyze") {
      setCurrentStep("submit"); // back to submit
    } else if (currentStep === "queries") {
      setCurrentStep("analyze"); // back to analyze results
    }
  };

  return (
    <Fragment>
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50 py-12">
        <div className="max-w-4xl mx-auto relative">
          {/* Header */}
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Resume Analysis
            </h1>
            <p className="text-gray-600">
              Analyze your resume against job requirements
            </p>
          </header>

          {/* Timeline */}
          <Timeline currentStep={currentStep} />

          {/* BACK BUTTON (only show after submit step) */}
          {currentStep !== "submit" && (
            <div className="flex items-center justify-end">
              <button
                onClick={handleBack}
                className="mb-6 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-400"
              >
                ← Back
              </button>
            </div>
          )}

          {/* Steps */}
          {currentStep === "submit" && (
            <SubmitForm user={user} onSubmit={handleSubmit} token={token} />
          )}

          {currentStep === "analyze" && (
            <AnalyzeGap onStartQuery={handleStartQuery} data={submittedData} token={token}/>
          )}

          {currentStep === "queries" && <QueryChat data={submittedData} token={token} />}
        </div>
      </div>
    </Fragment>
  );
};

export default Analyze;
