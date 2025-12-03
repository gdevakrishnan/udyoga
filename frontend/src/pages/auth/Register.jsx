import React, { useState } from "react";
import { registerUser } from "../../serviceWorkers/AuthServiceWorker";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "candidate",
    resume: "",
    password: "",
    confirmPassword: "",
  });

  const { username, email, role, resume, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Convert file to Base64
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData({ ...formData, resume: reader.result }); // Base64 string
    };

    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const errors = [];

    !username.trim() && errors.push("Username is required");
    !email.trim() && errors.push("Email is required");
    !password.trim() && errors.push("Password is required");
    !confirmPassword.trim() && errors.push("Confirm password is required");

    password !== confirmPassword &&
      errors.push("Passwords do not match");

    role === "candidate" && !resume &&
      errors.push("Resume is required for candidates");

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    alert("Form validated successfully!");
    await registerUser(formData)
      .then(response => console.log(response))
      .catch(e => console.log(e.message));
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={onSubmit}>

        {/* Username */}
        <div className="form_group mb-4">
          <label className="block mb-1" htmlFor="username">Username</label>
          <input
            className="border-2 border-gray-300 w-full p-2"
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>

        {/* Email */}
        <div className="form_group mb-4">
          <label className="block mb-1" htmlFor="email">Email</label>
          <input
            className="border-2 border-gray-300 w-full p-2"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>

        {/* Role */}
        <div className="form_group mb-4">
          <label className="block mb-1">Role</label>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="candidate"
                checked={role === "candidate"}
                onChange={onChange}
              />
              Candidate
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={role === "recruiter"}
                onChange={onChange}
              />
              Recruiter
            </label>
          </div>
        </div>

        {/* Resume File Upload */}
        {formData.role === "candidate" && <div className="form_group mb-4">
          <label className="block mb-1" htmlFor="resume">Resume (Upload File)</label>
          <input
            className="border-2 border-gray-300 w-full p-2"
            type="file"
            id="resume"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
          />

          {resume && (
            <p className="text-green-600 text-sm mt-1">
              File uploaded ✔ (Base64 ready)
            </p>
          )}
        </div>}

        {/* Password */}
        <div className="form_group mb-4">
          <label className="block mb-1" htmlFor="password">Password</label>
          <input
            className="border-2 border-gray-300 w-full p-2"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="form_group mb-6">
          <label className="block mb-1" htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="border-2 border-gray-300 w-full p-2"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
