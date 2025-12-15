import React, { useContext } from 'react';
import { Target, TrendingUp, Sparkles, CheckCircle, ArrowRight, Briefcase, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../../context/AppContext';

const Home = () => {
  const { isAuthenticated, user } = useContext(AppContext);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isAuthenticated && user) {
      if (user.role === 'candidate') {
        navigate('/analyze');
      } else if (user.role === 'recruiter') {
        navigate('/job-description');
      }
    } else {
      navigate('/login');
    }
  };

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Resume Matching",
      description: "AI-powered analysis provides instant match scores and identifies gaps between your profile and job requirements."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Gap Analysis",
      description: "Discover missing skills and get personalized recommendations to strengthen your application."
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Job Recommendations",
      description: "Get curated job suggestions tailored to your skills, experience, and career goals."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "AI Career Guidance",
      description: "Ask questions and receive intelligent career advice powered by advanced language models."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Your Resume",
      description: "Simply paste or upload your resume in PDF or DOC format."
    },
    {
      number: "02",
      title: "Add Job Description",
      description: "Paste the job description you're interested in applying for."
    },
    {
      number: "03",
      title: "Get AI Insights",
      description: "Receive instant match scores, gap analysis, and improvement tips."
    },
    {
      number: "04",
      title: "Take Action",
      description: "Follow personalized recommendations to enhance your application."
    }
  ];

  const benefits = [
    "ATS-optimized keyword matching",
    "Semantic similarity analysis",
    "Real-time improvement suggestions",
    "Personalized learning paths",
    "Industry-specific insights",
    "Interview preparation tips"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-4 pb-16 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-emerald-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">AI-Powered Career Intelligence</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Land Your Dream Job with <span className="text-emerald-600">AI Guidance</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Udhyoga analyzes your resume against job descriptions, identifies skill gaps, and provides personalized recommendations to boost your career.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={handleButtonClick} className="px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                  <span className="font-semibold">Start Free Analysis</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Match Score</span>
                    <span className="text-3xl font-bold text-emerald-600">8.5/10</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-linear-to-r from-emerald-500 to-emerald-600 h-3 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <div className="pt-4 space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Strong Technical Skills</p>
                        <p className="text-sm text-gray-600">React, Python, MongoDB matched</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 rounded-full border-2 border-amber-500 mt-0.5"></div>
                      <div>
                        <p className="font-medium text-gray-900">Missing: AWS Experience</p>
                        <p className="text-sm text-gray-600">Recommended: 30-day learning path</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-emerald-200 rounded-full blur-3xl opacity-50"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-emerald-300 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for Your Career Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leverage cutting-edge AI technology to optimize your job applications and accelerate your career growth.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-linear-to-br from-emerald-50 to-white p-6 rounded-xl border border-emerald-100 hover:shadow-lg transition">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How Udhyoga Works
            </h2>
            <p className="text-xl text-gray-600">
              Get AI-powered career insights in four simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
                  <div className="text-5xl font-bold text-emerald-100 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-emerald-300 w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Udhyoga?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our AI-powered platform gives you the competitive edge you need in today's job market.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Start Your Career Journey Today</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span>Free resume analysis</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span>Unlimited job matching</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span>Personalized guidance</span>
                </div>
              </div>
              <button onClick={handleButtonClick} className="w-full px-8 py-4 bg-white text-emerald-600 rounded-lg hover:bg-gray-50 transition font-semibold shadow-lg">
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-br from-emerald-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of students who have successfully landed their dream jobs with Udhyoga's AI-powered guidance.
          </p>
          <button onClick={handleButtonClick} className="px-10 py-4 bg-white text-emerald-600 rounded-lg hover:bg-gray-50 transition font-semibold text-lg shadow-xl hover:shadow-2xl">
            Start Your Free Analysis Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;