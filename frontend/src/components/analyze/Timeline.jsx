// components/Timeline.jsx
import React, { Fragment } from "react";
import { CheckCircle } from "lucide-react";

const Timeline = ({ currentStep }) => {
  const steps = [
    { id: 1, label: "Submit", key: "submit" },
    { id: 2, label: "Analyze Gap", key: "analyze" },
    { id: 3, label: "Queries", key: "queries" },
  ];

  const activeIndex = steps.findIndex((s) => s.key === currentStep);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <Fragment key={step.key}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center
                transition-all duration-300 
                ${
                  currentStep === step.key
                    ? "bg-emerald-600 text-white scale-110"
                    : activeIndex > index
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {activeIndex > index ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep === step.key
                    ? "text-emerald-600"
                    : activeIndex > index
                    ? "text-emerald-500"
                    : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 ${
                  activeIndex > index ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
