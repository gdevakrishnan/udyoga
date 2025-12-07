// components/SubmitForm.jsx
import React, { useState } from "react";
import { FileText, Link2, ArrowRight, Upload, Check } from "lucide-react";
import Spinner from "../utils/Spinner";
import {
  getEmbeddingsResumeJd,
  scrapeJobDescData,
} from "../../serviceWorkers/AiServiceWorker";

import { parseResumeFile } from "../../utils/fileParser";

const SubmitForm = ({ user, onSubmit, token }) => {
  const [formData, setFormData] = useState({
    resumeSource: "default",
    resumeText: "",
    jdSource: "url",
    jdUrl: user?.resume,
    jdText: "",
  });

  const [errors, setErrors] = useState({});
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedSuccess, setParsedSuccess] = useState(false);

  // -------------------------
  // Detect Browser
  // -------------------------
  async function detectBrowser() {
    try {
      if (navigator.brave && (await navigator.brave.isBrave())) return "brave";
    } catch {}

    const ua = navigator.userAgent;
    if (ua.includes("Edg")) return "edge";
    if (ua.includes("Firefox")) return "firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "safari";
    if (ua.includes("Chrome")) return "chrome";

    return "unknown";
  }

  // -------------------------
  // Resume File Upload → Parse via utils
  // -------------------------
  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setParsedSuccess(false);
    setParsing(true);

    try {
      const result = await parseResumeFile(file);

      if (!result.success) {
        alert(result.error || "Failed to parse resume");
        setParsing(false);
        return;
      }

      setFormData((prev) => ({
        ...prev,
        resumeSource: "custom",
        resumeText: result.text,
      }));

      setParsedSuccess(true);
      alert("Resume file parsed");
    } catch (error) {
      alert(error.message || "Failed to parse resume file");
    } finally {
      setParsing(false);
    }
  };

  // -------------------------
  // Validation
  // -------------------------
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validate = () => {
    const err = {};

    if (formData.resumeSource === "custom" && !formData.resumeText.trim()) {
      err.resumeText = "Resume file must contain readable text";
    }

    if (formData.jdSource === "url") {
      if (!formData.jdUrl.trim()) err.jdUrl = "URL required";
      else if (!isValidUrl(formData.jdUrl)) err.jdUrl = "Invalid URL";
    } else {
      if (!formData.jdText.trim()) err.jdText = "Text required";
      else if (formData.jdText.length < 50)
        err.jdText = "Minimum 50 characters required";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // -------------------------
  // Fetch JD Data
  // -------------------------
  const handleFetch = async () => {
    if (!token) return alert("Login required");
    if (!formData.jdUrl.trim() || !isValidUrl(formData.jdUrl))
      return alert("Enter valid URL");

    try {
      setFetching(true);
      const browser = await detectBrowser();

      const response = await scrapeJobDescData({ ...formData, browser }, token);

      if (response?.data?.data?.text) {
        setFormData((prev) => ({
          ...prev,
          jdText: response.data.data.text,
          jdSource: "text",
        }));

        alert("Job description fetched successfully");
      }
    } catch (e) {
      alert("Failed to fetch JD");
    } finally {
      setFetching(false);
    }
  };

  // -------------------------
  // Submit Form → Backend
  // -------------------------

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    // Determine resume type
    const resumeType =
      formData.resumeSource === "default" ? "default" : "custom";

    // Resume text (default → from user.resume.text)
    const resume_text =
      resumeType === "custom" ? formData.resumeText || "" : ""; 

    // Resume URL (default → from user.resume.url)
    const resume_url =
      resumeType === "default" ? user?.resume || "" : "";

    // JD Text
    const jd_text = formData.jdSource === "text" ? formData.jdText : "";

    // Final Payload
    const payload = {
      type: resumeType,
      resume_url,
      resume_text,
      jd_text,
    };

    try {
      const response = await getEmbeddingsResumeJd(payload, token);

      if (response.status === 200 || response.status === 201) {
        alert(response?.data?.message || "Analyzed successfully");
        onSubmit(response?.data?.data);
      }
    } catch (e) {
      console.log("Submission Error:", e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="space-y-6">
        {/* Resume Section */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Resume Source
          </label>

          <div className="space-y-3 mt-3">
            {/* Default Resume */}
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-emerald-50">
              <input
                type="radio"
                name="resumeSource"
                value="default"
                checked={formData.resumeSource === "default"}
                onChange={(e) =>
                  setFormData({ ...formData, resumeSource: e.target.value })
                }
              />
              <div className="ml-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                Use{" "}
                {user?.username.charAt(0).toUpperCase() +
                  user?.username.slice(1)}{" "}
                Resume (Default)
              </div>
            </label>

            {/* Custom File Upload */}
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-emerald-50">
              <input
                type="radio"
                name="resumeSource"
                value="custom"
                checked={formData.resumeSource === "custom"}
                onChange={(e) =>
                  setFormData({ ...formData, resumeSource: e.target.value })
                }
              />
              <div className="ml-3 flex items-center">
                <Upload className="w-5 h-5 mr-2 text-emerald-600" />
                Upload Resume File (.pdf / .doc / .docx)
              </div>
            </label>

            {formData.resumeSource === "custom" && (
              <>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full p-3 border rounded-lg"
                    onChange={handleResumeUpload}
                  />

                  {parsedSuccess && (
                    <Check className="text-emerald-600 w-6 h-6" />
                  )}
                </div>

                {parsing && (
                  <p className="text-emerald-600 text-sm mt-1">
                    Parsing resume...
                  </p>
                )}

                {errors.resumeText && (
                  <p className="text-red-600 text-sm">{errors.resumeText}</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Job Description Section */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Job Description
          </label>

          <div className="space-y-3 mt-3">
            {/* JD URL */}
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-emerald-50">
              <input
                type="radio"
                name="jdSource"
                value="url"
                checked={formData.jdSource === "url"}
                onChange={(e) =>
                  setFormData({ ...formData, jdSource: e.target.value })
                }
              />
              <div className="ml-3 flex items-center">
                <Link2 className="w-5 h-5 mr-2 text-emerald-600" />
                Job Description URL
              </div>
            </label>

            {/* JD Text */}
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-emerald-50">
              <input
                type="radio"
                name="jdSource"
                value="text"
                checked={formData.jdSource === "text"}
                onChange={(e) =>
                  setFormData({ ...formData, jdSource: e.target.value })
                }
              />
              <div className="ml-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                Paste Job Description
              </div>
            </label>

            {/* URL Input + Fetch */}
            {formData.jdSource === "url" && (
              <div className="flex gap-2 mt-3">
                <input
                  type="url"
                  className="w-full p-3 border rounded-lg"
                  placeholder="https://example.com/job"
                  value={formData.jdUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, jdUrl: e.target.value })
                  }
                />

                <button
                  onClick={handleFetch}
                  disabled={fetching}
                  className={`bg-emerald-600 text-white px-6 rounded-lg flex items-center
                    ${fetching ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {fetching ? <Spinner size="sm" /> : "Fetch"}
                </button>
              </div>
            )}

            {errors.jdUrl && (
              <p className="text-red-600 text-sm">{errors.jdUrl}</p>
            )}

            {/* JD Text */}
            {formData.jdSource === "text" && (
              <textarea
                rows={6}
                className="w-full p-3 border rounded-lg"
                placeholder="Paste JD text..."
                value={formData.jdText}
                onChange={(e) =>
                  setFormData({ ...formData, jdText: e.target.value })
                }
              />
            )}

            {errors.jdText && (
              <p className="text-red-600 text-sm">{errors.jdText}</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full bg-emerald-600 text-white p-3 rounded-lg font-semibold 
            flex justify-center items-center gap-2 
            ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {submitting ? (
            <>
              <Spinner size="sm" />
              Analyzing...
            </>
          ) : (
            <>
              Analyze Resume
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SubmitForm;
