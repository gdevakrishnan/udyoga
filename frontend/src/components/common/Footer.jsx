import { Briefcase } from "lucide-react";
import React, { Fragment } from "react";

const Footer = () => {
  return (
    <Fragment>
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Udyoga</span>
              </div>
              <p className="text-sm">
                AI-powered career assistant for college students
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Career Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-emerald-400 transition">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 Udyoga. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </Fragment>
  );
};

export default Footer;
