import React from "react";
import { Link } from "react-router-dom";
export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">AcadNet</h3>
            <p className="text-sm">Learn together, grow together.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-[#1993e5] transition-colors" href="/#">
                  Home
                </a>
              </li>
              <li>
                <Link
                  className="hover:text-[#1993e5] transition-colors"
                  to="/join"
                >
                  Group
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#1993e5] transition-colors" to="#">
                  Guide
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-[#1993e5] transition-colors"
                  to="/about"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a className="hover:text-[#1993e5] transition-colors" href="#">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="hover:text-[#1993e5] transition-colors" href="#">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} AcadNet. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
