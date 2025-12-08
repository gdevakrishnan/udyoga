import React, { useEffect } from "react";
import {
  CheckCircle,
  Sparkles,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

const AnalyzeGap = ({
  onStartQuery,
  analysis,
  loading,
  error,
  onRegenerate,
}) => {
  useEffect(() => {
    console.log(analysis);
  }, [analysis]);
  
  if (loading)
    return (
      <div className="bg-white p-12 rounded-2xl shadow-lg border">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Analyzing Your Profile
          </h2>
          <p className="text-gray-500 mt-2">Please wait a moment...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="bg-white p-12 rounded-2xl shadow-lg border">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl text-white">⚠</span>
          </div>
          <h2 className="text-xl font-semibold text-red-600">Analysis Failed</h2>
          <p className="text-gray-600 mt-2">{error}</p>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Re-analyze
            </button>
          )}
        </div>
      </div>
    );

  if (!analysis) return null;

  const renderList = (items) =>
    items && items.length ? (
      <ul className="text-gray-700 leading-relaxed list-disc list-inside">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-700">Not available</p>
    );

  return (
    <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
      {/* Header */}
      <div className="bg-emerald-600 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Analysis Complete</h2>
            <p className="text-emerald-100 mt-1">Your gap analysis is ready</p>
          </div>
          <div className="text-center bg-white rounded-xl px-6 py-3">
            <div className="text-3xl font-bold text-emerald-600">
              {analysis?.match_score}
              <span className="text-xs text-gray-600">/ 10</span>
            </div>
            <div className="text-xs text-gray-600">Match Score</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Matching Skills */}
        <div className="border border-emerald-200 rounded-xl p-6 bg-emerald-50">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Matching Skills</h3>
          </div>
          {renderList(analysis?.matchingSkills)}
        </div>

        {/* Areas for Improvement */}
        <div className="border border-amber-200 rounded-xl p-6 bg-amber-50">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Areas for Improvement
            </h3>
          </div>
          {renderList(analysis?.areasForImprovement)}
        </div>

        {/* Recommendations */}
        <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
          <div className="flex items-center gap-3 mb-3">
            <MessageSquare className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
          </div>
          {renderList(analysis?.recommendations)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-8 pb-8 flex gap-3">
        <button
          onClick={onStartQuery}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
        >
          Start Query Session
          <ArrowRight className="w-5 h-5" />
        </button>

        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Re-analyze
          </button>
        )}
      </div>
    </div>
  );
};

export default AnalyzeGap;
