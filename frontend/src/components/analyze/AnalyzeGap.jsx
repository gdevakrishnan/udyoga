// components/AnalyzeGap.jsx
import React, { useEffect } from "react";
import { CheckCircle, Sparkles, MessageSquare, ArrowRight } from "lucide-react";

const AnalyzeGap = ({ onStartQuery, data, token }) => {
  console.log(data);
  console.log(token);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Analysis Complete</h2>
      </div>

      <div className="space-y-6">
        <Section
          title="Matching Skills"
          icon={<CheckCircle />}
          color="emerald"
          text="Your resume aligns with key technical skills including React, JS, and component architecture."
        />

        <Section
          title="Areas for Improvement"
          icon={<Sparkles />}
          color="amber"
          text="Add TypeScript and cloud deployment experience. Include metrics and impact."
        />

        <Section
          title="Recommendations"
          icon={<MessageSquare />}
          color="blue"
          text="Showcase leadership, CI/CD, and collaboration examples."
        />
      </div>

      <button
        onClick={onStartQuery}
        className="w-full mt-8 bg-emerald-600 text-white p-3 rounded-lg flex items-center gap-2 justify-center"
      >
        Start Query Session <ArrowRight />
      </button>
    </div>
  );
};

const Section = ({ title, icon, color, text }) => (
  <div className={`bg-${color}-50 p-6 rounded-lg border border-${color}-200`}>
    <h3 className={`text-${color}-900 font-semibold mb-2 flex items-center gap-2`}>
      {icon} {title}
    </h3>
    <p className="text-gray-700">{text}</p>
  </div>
);

export default AnalyzeGap;
