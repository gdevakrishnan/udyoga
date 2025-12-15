import { useContext, useState } from "react";
import { FileText, ArrowRight, Upload, Check } from "lucide-react";
import Spinner from "../utils/Spinner";
import { getEmbeddingsResumeJd } from "../../serviceWorkers/AiServiceWorker";
import { parseResumeFile } from "../../utils/fileParser";
import AppContext from "../../context/AppContext";

const SubmitForm = ({ user, onSubmit, token }) => {
  const [formData, setFormData] = useState({
    resumeSource: "default",
    resumeText: "",
    jdSource: "text",
    jdText: "",
  });

  const [errors, setErrors] = useState({});
  const [parsing, setParsing] = useState(false);
  const [parsedSuccess, setParsedSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { setSuccess, setError } = useContext(AppContext);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setParsing(true);
    setParsedSuccess(false);

    const result = await parseResumeFile(file);
    setParsing(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      resumeSource: "custom",
      resumeText: result.text,
    }));

    setParsedSuccess(true);
    setSuccess("Resume parsed successfully");
  };

  const validate = () => {
    const err = {};
    if (formData.resumeSource === "custom" && !formData.resumeText.trim())
      err.resumeText = "Resume file must contain readable text";
    if (!formData.jdText.trim()) err.jdText = "Text required";
    else if (formData.jdText.length < 50)
      err.jdText = "Minimum 50 characters required";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);

    const resumeType =
      formData.resumeSource === "default" ? "default" : "custom";
    const resume_text =
      resumeType === "custom" ? formData.resumeText || "" : "";
    const resume_url = resumeType === "default" ? user?.resume || "" : "";
    const jd_text = formData.jdText;

    const payload = { type: resumeType, resume_url, resume_text, jd_text };

    try {
      const response = await getEmbeddingsResumeJd(payload, token);
      if (response.status === 200 || response.status === 201) {
        setSuccess(response?.data?.message || "Analyzed successfully");
        onSubmit({
          jd_emb: response?.data?.data?.jd_embedding,
          resume_emb: response?.data?.data?.resume_embedding,
          jd_text: response?.data?.data?.jd_text,
          resume_text: response?.data?.data?.resume_text,
        });
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
            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              formData.resumeSource === "default"
                ? "border-emerald-600 bg-emerald-50"
                : "border-gray-300 hover:border-gray-400"
            }`}>
              <input
                type="radio"
                name="resumeSource"
                value="default"
                checked={formData.resumeSource === "default"}
                onChange={(e) =>
                  setFormData({ ...formData, resumeSource: e.target.value })
                }
                className="w-4 h-4 text-emerald-600"
              />
              <div className="ml-3 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-emerald-600" />
                Use{" "}
                {user?.username.charAt(0).toUpperCase() +
                  user?.username.slice(1)}{" "}
                Resume (Default)
              </div>
            </label>

            <label className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
              formData.resumeSource === "custom"
                ? "border-emerald-600 bg-emerald-50"
                : "border-gray-300 hover:border-gray-400"
            }`}>
              <input
                type="radio"
                name="resumeSource"
                value="custom"
                checked={formData.resumeSource === "custom"}
                onChange={(e) =>
                  setFormData({ ...formData, resumeSource: e.target.value })
                }
                className="w-4 h-4 text-emerald-600"
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
                    accept=".pdf,.docx"
                    onChange={handleResumeUpload}
                    className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition ${
                      errors.resumeText ? "border-red-500" : "border-gray-300"
                    }`}
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
            <textarea
              rows={6}
              className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition resize-none ${
                errors.jdText ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Paste JD text..."
              value={formData.jdText}
              onChange={(e) =>
                setFormData({ ...formData, jdText: e.target.value })
              }
            />
            {errors.jdText && (
              <p className="text-red-600 text-sm">{errors.jdText}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`w-full bg-emerald-600 text-white p-3 rounded-lg font-semibold flex justify-center items-center gap-2 hover:bg-emerald-700 transition ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? (
            <>
              <Spinner size="sm" /> Analyzing...
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5" /> Analyze Resume
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SubmitForm;
