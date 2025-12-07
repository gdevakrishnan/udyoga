// components/SubmitForm.jsx
import React, { useState } from "react";
import { FileText, Link2, ArrowRight } from "lucide-react";
import Spinner from "../utils/Spinner";
import {
  getEmbeddingsResumeJd,
  scrapeJobDescData,
} from "../../serviceWorkers/AiServiceWorker";

const SubmitForm = ({ user, onSubmit, token }) => {
  const [formData, setFormData] = useState({
    resumeSource: "default",
    customResumeUrl: "",
    jdSource: "url",
    jdUrl: "",
    jdText: "",
  });

  const [errors, setErrors] = useState({});
  const [fetching, setFetching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
  // Validation Helpers
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

    // Resume
    if (formData.resumeSource === "custom") {
      if (!formData.customResumeUrl.trim())
        err.customResumeUrl = "URL required";
      else if (!isValidUrl(formData.customResumeUrl))
        err.customResumeUrl = "Invalid URL";
    }

    // JD
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
      return alert("Enter valid JD URL");

    try {
      setFetching(true);

      const browser = await detectBrowser();
      const payload = { ...formData, browser };

      const response = await scrapeJobDescData(payload, token);

      console.log("SCRAPER RESPONSE:", response);

      // Auto-fill text if response was successful
      if (response?.data?.data?.text) {
        setFormData((prev) => ({
          ...prev,
          jdText: response.data.data.text,
          jdSource: "text",
        }));

        alert("Job Description fetched successfully!");
      }
    } catch (e) {
      console.log("Fetch error:", e.message);
      alert("Failed to fetch JD!");
    } finally {
      setFetching(false);
    }
  };

  // -------------------------
  // Submit → prepare backend format
  // -------------------------
  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    const resume_url =
      formData.resumeSource === "default"
        ? user?.resume
        : formData.customResumeUrl;

    const jd_text = formData.jdSource === "text" ? formData.jdText : "";

    try {
      const response = await getEmbeddingsResumeJd(
        { resume_url, jd_text },
        token
      );

      if (response.status === 200 || response.status === 201) {
        alert(response?.data?.message || "Analyzed successfully");
        onSubmit(response?.data?.data);
      }
    } catch (e) {
      console.log(e.message);
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
                {user?.username
                  ? user?.username.charAt(0).toUpperCase() +
                    user?.username.slice(1)
                  : "default"}{" "}
                Resume
              </div>
            </label>

            {/* Custom Resume URL */}
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
                <Link2 className="w-5 h-5 mr-2 text-emerald-600" />
                Custom Resume URL
              </div>
            </label>

            {formData.resumeSource === "custom" && (
              <input
                type="url"
                className="w-full p-3 border rounded-lg mt-2"
                placeholder="https://example.com/resume.pdf"
                value={formData.customResumeUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customResumeUrl: e.target.value,
                  })
                }
              />
            )}

            {errors.customResumeUrl && (
              <p className="text-red-600 text-sm">{errors.customResumeUrl}</p>
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

            {/* Paste JD */}
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
    ${fetching ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}
  `}
                >
                  {fetching ? <Spinner size="sm" /> : "Fetch"}
                </button>
              </div>
            )}

            {errors.jdUrl && (
              <p className="text-red-600 text-sm">{errors.jdUrl}</p>
            )}

            {/* JD Textarea */}
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

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full bg-emerald-600 text-white p-3 rounded-lg font-semibold 
    flex justify-center items-center gap-2 
    ${submitting ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}`}
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
