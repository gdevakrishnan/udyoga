import React, { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Plus, X, Edit, Trash2, Sparkles, Copy, Check } from "lucide-react";
import Spinner from "../../components/utils/Spinner";
import {
  listJDs,
  createJD,
  updateJD,
  deleteJD,
  generateJDWithAI,
} from "../../serviceWorkers/jdServiceWorker";

const emptyJD = {
  title: "",
  department: "",
  location: "",
  experience_min: "",
  experience_max: "",
  skills: "",
  description: "",
  responsibilities: "",
  qualifications: "",
  status: "draft",
};

const JobDescription = () => {
  const token = localStorage.getItem("udhyoga_access_token");

  const [jds, setJds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState("basic"); // "basic" or "preview"
  const [isEdit, setIsEdit] = useState(false);
  const [selectedJD, setSelectedJD] = useState(null);
  const [form, setForm] = useState(emptyJD);
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [copied, setCopied] = useState(false);

  // -----------------------------
  // Load JDs
  // -----------------------------
  const loadJDs = async () => {
    const res = await listJDs(token);
    if (res?.status === 200) setJds(res.data);
  };

  useEffect(() => {
    loadJDs();
  }, []);

  // -----------------------------
  // Open Create Modal
  // -----------------------------
  const openCreate = () => {
    setForm(emptyJD);
    setSelectedJD(null);
    setModalStep("basic");
    setIsEdit(false);
    setGeneratedContent(null);
    setCopied(false);
    setShowModal(true);
  };

  // -----------------------------
  // Open View Modal
  // -----------------------------
  const openView = async (jd) => {
    setSelectedJD(jd);
    
    // Format responsibilities and qualifications for display
    let responsibilitiesFormatted = jd.responsibilities;
    let qualificationsFormatted = jd.qualifications;
    
    // Check if they are plain text without bullet points, then format them
    if (responsibilitiesFormatted && !responsibilitiesFormatted.includes('\n-') && !responsibilitiesFormatted.includes('\n*') && !responsibilitiesFormatted.includes('\n1.')) {
      const lines = responsibilitiesFormatted.split('\n').filter(line => line.trim());
      if (lines.length > 1) {
        responsibilitiesFormatted = lines.map(line => `- ${line.trim()}`).join('\n');
      }
    }
    
    if (qualificationsFormatted && !qualificationsFormatted.includes('\n-') && !qualificationsFormatted.includes('\n*') && !qualificationsFormatted.includes('\n1.')) {
      const lines = qualificationsFormatted.split('\n').filter(line => line.trim());
      if (lines.length > 1) {
        qualificationsFormatted = lines.map(line => `- ${line.trim()}`).join('\n');
      }
    }
    
    setForm({
      ...jd,
      skills: Array.isArray(jd.skills) ? jd.skills.join(", ") : jd.skills,
      responsibilities: responsibilitiesFormatted,
      qualifications: qualificationsFormatted,
    });
    setModalStep("preview");
    setIsEdit(false);
    setGeneratedContent(null);
    setCopied(false);
    setShowModal(true);
  };

  // -----------------------------
  // Handle Input Change
  // -----------------------------
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // Generate JD with AI
  // -----------------------------
  const handleGenerate = async () => {
    if (!form.title || !form.location) {
      alert("Title and location are required");
      return;
    }

    setGenerating(true);

    const payload = {
      title: form.title,
      department: form.department,
      location: form.location,
      experience_min: Number(form.experience_min) || 0,
      experience_max: Number(form.experience_max) || 0,
      skills: form.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      const response = await generateJDWithAI(payload);

      if (response?.status === 200) {
        const generated = response.data.data;
        
        // Store generated content separately
        setGeneratedContent(generated);
        
        // Move to preview step
        setModalStep("preview");
      } else {
        alert("Failed to generate JD");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  // -----------------------------
  // Copy JD Content
  // -----------------------------
  const handleCopy = () => {
    let copyText = `${form.title}\n\n`;
    copyText += `Department: ${form.department}\n`;
    copyText += `Location: ${form.location}\n`;
    copyText += `Experience: ${form.experience_min}-${form.experience_max} years\n`;
    copyText += `Skills: ${form.skills}\n\n`;
    
    if (generatedContent) {
      copyText += `Description:\n${generatedContent.description}\n\n`;
      copyText += `Responsibilities:\n`;
      if (Array.isArray(generatedContent.responsibilities)) {
        generatedContent.responsibilities.forEach((item, idx) => {
          copyText += `${idx + 1}. ${item}\n`;
        });
      } else {
        copyText += `${generatedContent.responsibilities}\n`;
      }
      copyText += `\nQualifications:\n`;
      if (Array.isArray(generatedContent.qualifications)) {
        generatedContent.qualifications.forEach((item, idx) => {
          copyText += `${idx + 1}. ${item}\n`;
        });
      } else {
        copyText += `${generatedContent.qualifications}\n`;
      }
    } else {
      copyText += `Description:\n${form.description}\n\n`;
      copyText += `Responsibilities:\n${form.responsibilities}\n\n`;
      copyText += `Qualifications:\n${form.qualifications}\n`;
    }

    navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // -----------------------------
  // Show Editor with Generated Content
  // -----------------------------
  const showEditor = () => {
    if (generatedContent) {
      // Format responsibilities and qualifications
      const responsibilitiesText = Array.isArray(generatedContent.responsibilities)
        ? generatedContent.responsibilities.map((item, idx) => `${idx + 1}. ${item}`).join("\n")
        : generatedContent.responsibilities;
      
      const qualificationsText = Array.isArray(generatedContent.qualifications)
        ? generatedContent.qualifications.map((item, idx) => `${idx + 1}. ${item}`).join("\n")
        : generatedContent.qualifications;

      setForm({
        ...form,
        description: generatedContent.description || "",
        responsibilities: responsibilitiesText || "",
        qualifications: qualificationsText || "",
      });
    }
    setIsEdit(true);
  };

  // -----------------------------
  // Enable Edit Mode (for existing JDs)
  // -----------------------------
  const enableEdit = () => setIsEdit(true);

  // -----------------------------
  // Save JD
  // -----------------------------
  const handleSave = async () => {
    if (!form.title || !form.department) {
      alert("Title and Department are required");
      return;
    }

    const payload = {
      ...form,
      experience_min: Number(form.experience_min) || 0,
      experience_max: Number(form.experience_max) || 0,
      skills: form.skills
        ? form.skills.split(",").map((s) => s.trim())
        : [],
    };

    // If we have generated content and haven't edited yet, save the generated content
    if (generatedContent && !isEdit) {
      const responsibilitiesText = Array.isArray(generatedContent.responsibilities)
        ? generatedContent.responsibilities.map((item, idx) => `${idx + 1}. ${item}`).join("\n")
        : generatedContent.responsibilities;
      
      const qualificationsText = Array.isArray(generatedContent.qualifications)
        ? generatedContent.qualifications.map((item, idx) => `${idx + 1}. ${item}`).join("\n")
        : generatedContent.qualifications;

      payload.description = generatedContent.description || "";
      payload.responsibilities = responsibilitiesText || "";
      payload.qualifications = qualificationsText || "";
    }

    let res;
    if (selectedJD) {
      res = await updateJD(selectedJD.id, payload, token);
    } else {
      res = await createJD(payload, token);
    }

    if (res?.status === 200 || res?.status === 201) {
      loadJDs();
      setShowModal(false);
      setForm(emptyJD);
      setGeneratedContent(null);
      setCopied(false);
    } else {
      alert(res?.message || "Failed to save JD");
    }
  };

  // -----------------------------
  // Delete JD
  // -----------------------------
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this JD?")) return;
    const res = await deleteJD(id, token);
    if (res?.status === 200 || res?.status === 204) {
      loadJDs();
      setShowModal(false);
    }
  };

  // -----------------------------
  // Close Modal
  // -----------------------------
  const closeModal = () => {
    setShowModal(false);
    setForm(emptyJD);
    setSelectedJD(null);
    setModalStep("basic");
    setIsEdit(false);
    setGeneratedContent(null);
    setCopied(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen" data-color-mode="light">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Descriptions</h1>
        <button
          onClick={openCreate}
          className="bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-emerald-700"
        >
          <Plus size={18} /> Create Job
        </button>
      </div>

      {/* JD List */}
      <div className="bg-white rounded shadow">
        {jds.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No job descriptions yet. Create one to get started!
          </div>
        ) : (
          <div className="divide-y">
            {jds.map((jd) => (
              <div
                key={jd.id}
                className="p-4 flex justify-between items-center hover:bg-gray-50"
              >
                <div className="flex-1">
                  <button
                    className="text-emerald-600 font-semibold hover:underline text-left"
                    onClick={() => openView(jd)}
                  >
                    {jd.title}
                  </button>
                  <div className="text-sm text-gray-600 mt-1">
                    {jd.department} • {jd.location || "Remote"} •{" "}
                    {jd.experience_min}-{jd.experience_max} years
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(jd.id);
                  }}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {selectedJD ? (
                  "Job Description"
                ) : modalStep === "basic" ? (
                  <>
                    <Sparkles className="text-emerald-600" />
                    AI Job Description Generator
                  </>
                ) : (
                  "Generated Job Description"
                )}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* STEP 1: Basic Details Form */}
              {modalStep === "basic" && !selectedJD && (
                <div className="space-y-4">
                  <input
                    name="title"
                    placeholder="Job Title"
                    className="input w-full"
                    value={form.title}
                    onChange={handleChange}
                  />

                  <input
                    name="department"
                    placeholder="Department"
                    className="input w-full"
                    value={form.department}
                    onChange={handleChange}
                  />

                  <input
                    name="location"
                    placeholder="Location"
                    className="input w-full"
                    value={form.location}
                    onChange={handleChange}
                  />

                  <div className="flex gap-4">
                    <input
                      name="experience_min"
                      placeholder="Min Experience"
                      type="number"
                      className="input w-full"
                      value={form.experience_min}
                      onChange={handleChange}
                    />
                    <input
                      name="experience_max"
                      placeholder="Max Experience"
                      type="number"
                      className="input w-full"
                      value={form.experience_max}
                      onChange={handleChange}
                    />
                  </div>

                  <input
                    name="skills"
                    placeholder="Skills (comma separated)"
                    className="input w-full"
                    value={form.skills}
                    onChange={handleChange}
                  />

                  <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {generating && <Spinner size="xs" />}
                    {generating ? "Generating..." : "Generate JD with AI"}
                  </button>
                </div>
              )}

              {/* STEP 2: Preview Generated Content */}
              {modalStep === "preview" && !selectedJD && !isEdit && generatedContent && (
                <div>
                  {/* Basic Info Display */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Job Title
                        </label>
                        <p className="text-gray-900">{form.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Department
                        </label>
                        <p className="text-gray-900">{form.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Location
                        </label>
                        <p className="text-gray-900">{form.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Experience
                        </label>
                        <p className="text-gray-900">
                          {form.experience_min} - {form.experience_max} years
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Skills
                        </label>
                        <p className="text-gray-900">{form.skills}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <div className="border rounded-lg p-4 bg-white">
                      <p className="text-gray-700">{generatedContent.description}</p>
                    </div>
                  </div>

                  {/* Responsibilities Preview */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Responsibilities</h3>
                    <div className="border rounded-lg p-4 bg-white">
                      <ul className="space-y-2" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                        {Array.isArray(generatedContent.responsibilities) ? (
                          generatedContent.responsibilities.map((item, idx) => (
                            <li key={idx} className="text-gray-700">{item}</li>
                          ))
                        ) : (
                          <li className="text-gray-700">{generatedContent.responsibilities}</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Qualifications Preview */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Qualifications</h3>
                    <div className="border rounded-lg p-4 bg-white">
                      <ul className="space-y-2" style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
                        {Array.isArray(generatedContent.qualifications) ? (
                          generatedContent.qualifications.map((item, idx) => (
                            <li key={idx} className="text-gray-700">{item}</li>
                          ))
                        ) : (
                          <li className="text-gray-700">{generatedContent.qualifications}</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Edit with Markdown Editor */}
              {modalStep === "preview" && isEdit && (
                <div>
                  {/* Basic Info Display */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Job Title
                        </label>
                        <p className="text-gray-900">{form.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Department
                        </label>
                        <p className="text-gray-900">{form.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Location
                        </label>
                        <p className="text-gray-900">{form.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Experience
                        </label>
                        <p className="text-gray-900">
                          {form.experience_min} - {form.experience_max} years
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Skills
                        </label>
                        <p className="text-gray-900">{form.skills}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description Editor */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <MDEditor
                      value={form.description}
                      onChange={(v) =>
                        setForm({ ...form, description: v || "" })
                      }
                      height={200}
                    />
                  </div>

                  {/* Responsibilities Editor */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">
                      Responsibilities
                    </h3>
                    <MDEditor
                      value={form.responsibilities}
                      onChange={(v) =>
                        setForm({ ...form, responsibilities: v || "" })
                      }
                      height={200}
                    />
                  </div>

                  {/* Qualifications Editor */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">
                      Qualifications
                    </h3>
                    <MDEditor
                      value={form.qualifications}
                      onChange={(v) =>
                        setForm({ ...form, qualifications: v || "" })
                      }
                      height={200}
                    />
                  </div>
                </div>
              )}

              {/* View Existing JD */}
              {modalStep === "preview" && selectedJD && (
                <div>
                  {/* Basic Info Display */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Job Title
                        </label>
                        <p className="text-gray-900">{form.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Department
                        </label>
                        <p className="text-gray-900">{form.department}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Location
                        </label>
                        <p className="text-gray-900">{form.location}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Experience
                        </label>
                        <p className="text-gray-900">
                          {form.experience_min} - {form.experience_max} years
                        </p>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Skills
                        </label>
                        <p className="text-gray-900">{form.skills}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    {isEdit ? (
                      <MDEditor
                        value={form.description}
                        onChange={(v) =>
                          setForm({ ...form, description: v || "" })
                        }
                        height={200}
                      />
                    ) : (
                      <div className="border rounded-lg p-4 bg-white">
                        <p className="text-gray-700">{form.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Responsibilities */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">
                      Responsibilities
                    </h3>
                    {isEdit ? (
                      <MDEditor
                        value={form.responsibilities}
                        onChange={(v) =>
                          setForm({ ...form, responsibilities: v || "" })
                        }
                        height={200}
                      />
                    ) : (
                      <div className="border rounded-lg p-4 bg-white">
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          {form.responsibilities
                            .split("\n")
                            .filter((line) => line.trim())
                            .map((line, idx) => (
                              <li key={idx}>{line.replace(/^[*-]\s*\d+\.\s*|^[*-]\s*|^\d+\.\s*/, "").trim()}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Qualifications */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-lg mb-2">
                      Qualifications
                    </h3>
                    {isEdit ? (
                      <MDEditor
                        value={form.qualifications}
                        onChange={(v) =>
                          setForm({ ...form, qualifications: v || "" })
                        }
                        height={200}
                      />
                    ) : (
                      <div className="border rounded-lg p-4 bg-white">
                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                          {form.qualifications
                            .split("\n")
                            .filter((line) => line.trim())
                            .map((line, idx) => (
                              <li key={idx}>{line.replace(/^[*-]\s*\d+\.\s*|^[*-]\s*|^\d+\.\s*/, "").trim()}</li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {modalStep === "preview" && (
              <div className="flex justify-between items-center p-6 border-t bg-gray-50">
                <div>
                  {selectedJD && (
                    <button
                      onClick={() => handleDelete(selectedJD.id)}
                      className="px-4 py-2 text-red-600 border border-red-600 rounded hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 border rounded hover:bg-gray-100 flex items-center gap-2"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  {!isEdit && !selectedJD && generatedContent && (
                    <>
                      <button
                        onClick={showEditor}
                        className="px-4 py-2 border rounded hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Edit size={16} /> Edit
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                      >
                        Save
                      </button>
                    </>
                  )}
                  {!isEdit && selectedJD && (
                    <button
                      onClick={enableEdit}
                      className="px-4 py-2 border rounded hover:bg-gray-100 flex items-center gap-2"
                    >
                      <Edit size={16} /> Edit
                    </button>
                  )}
                  {isEdit && (
                    <>
                      <button
                        onClick={closeModal}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                      >
                        Save
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDescription;