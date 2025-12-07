import React, { Fragment, useContext, useState } from 'react';
import { FileText, Link2, Send, CheckCircle, ArrowRight, MessageSquare, Sparkles } from 'lucide-react';
import AppContext from '../../context/AppContext';

// Timeline Component
const Timeline = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Submit', key: 'submit' },
    { id: 2, label: 'Analyze Gap', key: 'analyze' },
    { id: 3, label: 'Queries', key: 'queries' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  currentStep === step.key
                    ? 'bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg scale-110'
                    : steps.findIndex(s => s.key === currentStep) > index
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {steps.findIndex(s => s.key === currentStep) > index ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep === step.key
                    ? 'text-emerald-600'
                    : steps.findIndex(s => s.key === currentStep) > index
                    ? 'text-emerald-500'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                  steps.findIndex(s => s.key === currentStep) > index
                    ? 'bg-emerald-500'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

// Submit Form Component
const SubmitForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState({
    resumeSource: 'default',
    customResumeUrl: '',
    jdSource: 'url',
    jdUrl: '',
    jdText: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (formData.resumeSource === 'custom' && !formData.customResumeUrl.trim()) {
      newErrors.customResumeUrl = 'Resume URL is required';
    } else if (formData.resumeSource === 'custom' && !isValidUrl(formData.customResumeUrl)) {
      newErrors.customResumeUrl = 'Please enter a valid URL';
    }

    if (formData.jdSource === 'url') {
      if (!formData.jdUrl.trim()) {
        newErrors.jdUrl = 'Job Description URL is required';
      } else if (!isValidUrl(formData.jdUrl)) {
        newErrors.jdUrl = 'Please enter a valid URL';
      }
    } else {
      if (!formData.jdText.trim()) {
        newErrors.jdText = 'Job Description text is required';
      } else if (formData.jdText.trim().length < 50) {
        newErrors.jdText = 'Job Description must be at least 50 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submitData = {
        resumeUrl: formData.resumeSource === 'default' ? user?.resume : formData.customResumeUrl,
        jdUrl: formData.jdSource === 'url' ? formData.jdUrl : null,
        jdText: formData.jdSource === 'text' ? formData.jdText : null
      };
      console.log('Submit Data:', submitData);
      alert('Form submitted successfully! Starting analysis...');
      onSubmit(submitData);
    } else {
      alert('Please fix the errors in the form');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="space-y-6">
        {/* Resume Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Resume Source <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-emerald-50 transition">
              <input
                type="radio"
                name="resumeSource"
                value="default"
                checked={formData.resumeSource === 'default'}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="ml-3 flex items-center flex-1">
                <FileText className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-gray-700">Use Default Resume</span>
                {user?.resume && (
                  <span className="ml-auto text-sm text-gray-500 truncate max-w-xs">
                    {user.resume}
                  </span>
                )}
              </div>
            </label>
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-emerald-50 transition">
              <input
                type="radio"
                name="resumeSource"
                value="custom"
                checked={formData.resumeSource === 'custom'}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="ml-3 flex items-center">
                <Link2 className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-gray-700">Custom Resume URL</span>
              </div>
            </label>
          </div>
          {formData.resumeSource === 'custom' && (
            <div className="mt-3">
              <input
                type="url"
                name="customResumeUrl"
                value={formData.customResumeUrl}
                onChange={handleChange}
                placeholder="https://example.com/resume.pdf"
                className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
                  errors.customResumeUrl ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.customResumeUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.customResumeUrl}</p>
              )}
            </div>
          )}
        </div>

        {/* Job Description Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Job Description <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-emerald-50 transition">
              <input
                type="radio"
                name="jdSource"
                value="url"
                checked={formData.jdSource === 'url'}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="ml-3 flex items-center">
                <Link2 className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-gray-700">Job Description URL</span>
              </div>
            </label>
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-emerald-50 transition">
              <input
                type="radio"
                name="jdSource"
                value="text"
                checked={formData.jdSource === 'text'}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
              />
              <div className="ml-3 flex items-center">
                <FileText className="w-5 h-5 text-emerald-600 mr-2" />
                <span className="text-gray-700">Paste Job Description</span>
              </div>
            </label>
          </div>
          {formData.jdSource === 'url' && (
            <div className="mt-3">
              <div className="flex gap-2">
                <input
                  type="url"
                  name="jdUrl"
                  value={formData.jdUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/job-posting"
                  className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition ${
                    errors.jdUrl ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (formData.jdUrl.trim() && isValidUrl(formData.jdUrl)) {
                      console.log('Fetching JD from:', formData.jdUrl);
                      alert('Fetching job description...');
                      // Add fetch logic here
                    } else {
                      alert('Please enter a valid URL first');
                    }
                  }}
                  className="px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-emerald-700 transition whitespace-nowrap"
                >
                  Fetch
                </button>
              </div>
              {errors.jdUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.jdUrl}</p>
              )}
            </div>
          )}
          {formData.jdSource === 'text' && (
            <div className="mt-3">
              <textarea
                name="jdText"
                value={formData.jdText}
                onChange={handleChange}
                rows="8"
                placeholder="Paste the job description here..."
                className={`block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition resize-none ${
                  errors.jdText ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.jdText && (
                <p className="mt-1 text-sm text-red-600">{errors.jdText}</p>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-white font-semibold transition gap-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
        >
          Analyze Resume
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Analyze Gap Component
const AnalyzeGap = ({ onStartQuery }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete</h2>
        <p className="text-gray-600">Here's what we found</p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="font-semibold text-emerald-900 mb-3 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Matching Skills
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Your resume demonstrates strong alignment with the required technical skills including React, JavaScript, and modern web development practices. You have relevant experience in building user interfaces and working with component-based architecture.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Areas for Improvement
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Consider highlighting more experience with TypeScript and testing frameworks. The job description emphasizes cloud deployment experience, which could be expanded in your resume. Additionally, specific metrics and project outcomes would strengthen your application.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Recommendations
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Focus on showcasing collaborative projects and team leadership experience. Emphasize any CI/CD pipeline work and agile methodology experience. Consider adding quantifiable achievements to demonstrate impact.
          </p>
        </div>
      </div>

      <button
        onClick={onStartQuery}
        className="w-full flex justify-center items-center py-3 px-4 rounded-lg shadow-sm text-white font-semibold transition gap-2 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
      >
        Start Query Session
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

// Query Chat Component
const QueryChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm here to help answer any questions about your resume analysis. Feel free to ask me anything!"
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = {
        id: messages.length + 1,
        type: 'user',
        content: input
      };
      setMessages(prev => [...prev, userMessage]);
      
      setTimeout(() => {
        const assistantMessage = {
          id: messages.length + 2,
          type: 'assistant',
          content: "Thank you for your question! This is a demo response. In the full implementation, this would provide detailed answers based on your resume analysis."
        };
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);

      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="bg-linear-to-r from-emerald-500 to-emerald-600 p-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <MessageSquare className="w-6 h-6 mr-2" />
          Query Assistant
        </h2>
      </div>

      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                message.type === 'user'
                  ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about your analysis..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              input.trim()
                ? 'bg-linear-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Analyze Component
const Analyze = () => {
  const { user } = useContext(AppContext);
  const [currentStep, setCurrentStep] = useState('submit');
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = (data) => {
    setSubmittedData(data);
    setCurrentStep('analyze');
  };

  const handleStartQuery = () => {
    setCurrentStep('queries');
  };

  return (
    <Fragment>
      <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-4xl mx-auto relative">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Analysis</h1>
            <p className="text-gray-600">Analyze your resume against job requirements</p>
          </div>

          <Timeline currentStep={currentStep} />

          {currentStep === 'submit' && (
            <SubmitForm user={user} onSubmit={handleSubmit} />
          )}

          {currentStep === 'analyze' && (
            <AnalyzeGap onStartQuery={handleStartQuery} />
          )}

          {currentStep === 'queries' && (
            <QueryChat />
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Analyze;