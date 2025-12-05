import React, { useState } from "react";
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Upload,
  Building,
  FileText,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../serviceWorkers/AuthServiceWorker";
import Spinner from "../../components/utils/Spinner";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const initialState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
    company_name: "",
    company_description: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors({
          ...errors,
          resume: "Please upload a PDF or DOC file",
        });
        setSelectedFile(null);
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          resume: "File size should not exceed 5MB",
        });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setErrors({
        ...errors,
        resume: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (formData.username.length > 200) {
      newErrors.username = "Username must not exceed 200 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role-specific validations
    if (formData.role === "candidate") {
      if (!selectedFile) {
        newErrors.resume = "Resume is required for candidates";
      }
    } else if (formData.role === "recruiter") {
      if (!formData.company_name.trim()) {
        newErrors.company_name = "Company name is required for recruiters";
      } else if (formData.company_name.length > 200) {
        newErrors.company_name = "Company name must not exceed 200 characters";
      }

      if (!formData.company_description.trim()) {
        newErrors.company_description =
          "Company description is required for recruiters";
      } else if (formData.company_description.length < 20) {
        newErrors.company_description =
          "Company description must be at least 20 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setLoading(true);
      const submitData = new FormData();
      submitData.append("username", formData.username);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("role", formData.role);

      if (formData.role === "candidate" && selectedFile) {
        submitData.append("resume", selectedFile);
      } else if (formData.role === "recruiter") {
        submitData.append("company_name", formData.company_name);
        submitData.append("company_description", formData.company_description);
      }

      try {
        await registerUser(submitData)
          .then(response => {
            if (response.status == 201 || response.status == 200) {
              alert(response?.data?.message ? response?.data?.message : "Registered successfully");
              navigate('/login');
              setFormData(initialState);
            }
          })
          .catch(e => e.message);
      } catch (err) {
        console.error(err);
        alert("Registration failed!");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please fix the errors in the form");
    }
  };

  return (
    <div className="py-12 min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-md w-full relative">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-9 h-9 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">
            Join Udyoga and start your career journey
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="space-y-4">
            {/* Role Selection */}
            <div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, role: "candidate" });
                    setFormData({...initialState, role: "candidate"});
                  }}
                  className={`py-3 px-4 rounded-lg border-2 transition ${
                    formData.role === "candidate"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <User className="w-5 h-5 mx-auto mb-1" />
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, role: "recruiter" });
                    setFormData({...initialState, role: "recruiter"});
                  }}
                  className={`py-3 px-4 rounded-lg border-2 transition ${
                    formData.role === "recruiter"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-700 font-semibold"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <Building className="w-5 h-5 mx-auto mb-1" />
                  Recruiter
                </button>
              </div>
            </div>

            {/* Username Input */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="johndoe"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Candidate-specific: Resume Upload */}
            {formData.role === "candidate" && (
              <div>
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Upload Resume <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    id="resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume"
                    className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition ${
                      errors.resume
                        ? "border-red-500 bg-red-50"
                        : selectedFile
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-300 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {selectedFile ? (
                        <>
                          <FileText className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm text-emerald-700 font-medium">
                            {selectedFile.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            Click to upload resume (PDF, DOC)
                          </span>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                {errors.resume && (
                  <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Max file size: 5MB</p>
              </div>
            )}

            {/* Recruiter-specific: Company Name */}
            {formData.role === "recruiter" && (
              <>
                <div>
                  <label
                    htmlFor="company_name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="company_name"
                      name="company_name"
                      type="text"
                      value={formData.company_name}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
                        errors.company_name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Your Company Name"
                    />
                  </div>
                  {errors.company_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.company_name}
                    </p>
                  )}
                </div>

                {/* Recruiter-specific: Company Description */}
                <div>
                  <label
                    htmlFor="company_description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Company Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="company_description"
                    name="company_description"
                    value={formData.company_description}
                    onChange={handleChange}
                    rows="3"
                    className={`block w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none ${
                      errors.company_description
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder="Tell us about your company..."
                  />
                  {errors.company_description && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.company_description}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum 20 characters
                  </p>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-white font-semibold transition gap-2
    ${
      loading
        ? "bg-emerald-400 cursor-not-allowed"
        : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
    }`}
            >
              {loading && <Spinner size={"xs"} />}
              {loading ? "Registering..." : "Create Account"}
              {!loading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />}
            </button>
          </div>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="font-semibold text-emerald-600 hover:text-emerald-500 transition"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
