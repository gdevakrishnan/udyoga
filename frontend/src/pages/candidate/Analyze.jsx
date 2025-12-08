import React, { Fragment, useContext, useState } from "react";
import AppContext from "../../context/AppContext";

import Timeline from "../../components/analyze/Timeline";
import SubmitForm from "../../components/analyze/SubmitForm";
import AnalyzeGap from "../../components/analyze/AnalyzeGap";
import QueryChat from "../../components/analyze/QueryChat";
import { analyzeResumeJd } from "../../serviceWorkers/AiServiceWorker";

const Analyze = () => {
  const { user } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState("submit");
  const [submittedData, setSubmittedData] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // <-- Lift chat history state here
  const [chatHistory, setChatHistory] = useState([]);

  const runAnalysis = async (data) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const token = localStorage.getItem("udhyoga_access_token");
      if (!token) throw new Error("User not authenticated");

      const response = await analyzeResumeJd(data, token);
      if (response?.data?.status === 200) {
        setAnalysis(response.data);
      } else {
        setError(response?.data?.message || "Analysis failed");
      }
    } catch (err) {
      setError(err.message || "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (data) => {
    setSubmittedData(data);
    setCurrentStep("analyze");
    runAnalysis(data);
  };

  const handleRegenerate = () => {
    if (submittedData) runAnalysis(submittedData);
  };

  const handleStartQuery = () => setCurrentStep("queries");

  const handleBack = () => {
    if (currentStep === "analyze") setCurrentStep("submit");
    else if (currentStep === "queries") setCurrentStep("analyze");
  };

  return (
    <Fragment>
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50 py-12">
        <div className="max-w-4xl mx-auto relative">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Resume Analysis</h1>
            <p className="text-gray-600">Analyze your resume against job requirements</p>
          </header>

          <Timeline currentStep={currentStep} />

          {currentStep !== "submit" && (
            <div className="flex items-center justify-end">
              <button onClick={handleBack} className="mb-6 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-400">
                ← Back
              </button>
            </div>
          )}

          {currentStep === "submit" && (
            <SubmitForm user={user} onSubmit={handleSubmit} token={localStorage.getItem("udhyoga_access_token")} />
          )}

          {currentStep === "analyze" && (
            <AnalyzeGap
              onStartQuery={handleStartQuery}
              analysis={analysis}
              loading={loading}
              error={error}
              onRegenerate={handleRegenerate}
            />
          )}

          {currentStep === "queries" && (
            <QueryChat
              data={submittedData}
              token={localStorage.getItem("udhyoga_access_token")}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
            />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Analyze;
