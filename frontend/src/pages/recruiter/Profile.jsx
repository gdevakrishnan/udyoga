import React, { Fragment, useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar, 
  FileText,
  X,
  Building2
} from "lucide-react";

const Profile = () => {
  const { user } = useContext(AppContext);
  const [showResume, setShowResume] = useState(false);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Hide PDF controls + Fit to width
  const pdfSrc = user?.resume
    ? `${user.resume}#toolbar=0&navpanes=0&scrollbar=0&zoom=page-width`
    : "";

  return (
    <Fragment>
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-4xl mx-auto relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">Manage your career information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-linear-to-r from-emerald-500 to-emerald-600 px-8 py-12">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
                  <User className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {user?.username.charAt(0).toUpperCase() + user?.username.slice(1) || "User"}
                </h2>
                <div className="flex items-center gap-2 px-4 py-1 bg-emerald-400 bg-opacity-50 rounded-full">
                  <Briefcase className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium text-white capitalize">
                    {user?.role || "Candidate"}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-500">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <p className="text-gray-900 pl-6">
                    {user?.email || "Not provided"}
                  </p>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-500">
                    <User className="w-4 h-4 mr-2" />
                    Username
                  </label>
                  <p className="text-gray-900 pl-6">
                    {user?.username || "Not provided"}
                  </p>
                </div>

                {/* Company Name */}
                {user?.company_name && (
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-500">
                      <Building2 className="w-4 h-4 mr-2" />
                      Company Name
                    </label>
                    <p className="text-gray-900 pl-6">{user.company_name}</p>
                  </div>
                )}

                {/* Member Since */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    Member Since
                  </label>
                  <p className="text-gray-900 pl-6">
                    {formatDate(user?.created_at)}
                  </p>
                </div>
              </div>

              {/* Company Description */}
              {user?.company_description && (
                <div className="mt-6 space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-500">
                    <Building2 className="w-4 h-4 mr-2" />
                    Company Description
                  </label>
                  <p className="text-gray-900 pl-6 leading-relaxed">
                    {user.company_description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Profile;