import React, { useState, useLayoutEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
  Shield,
  Eye,
  Lock,
  Users,
  FileText,
  Mail,
} from "lucide-react";

const Privacy = () => {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const scrollPositionRef = useRef<number>(0);

  const toggleSection = (sectionId: string) => {
    // Store current scroll position before state change
    scrollPositionRef.current = window.scrollY;

    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Use useLayoutEffect to restore scroll position after DOM updates
  useLayoutEffect(() => {
    if (scrollPositionRef.current > 0) {
      window.scrollTo(0, scrollPositionRef.current);
    }
  });
  const CollapsibleSection = ({
    id,
    title,
    icon: Icon,
    children,
  }: {
    id: string;
    title: string;
    icon: any;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections[id];

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Icon className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {isExpanded && <div className="p-4 bg-white">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold mb-2">
                Privacy Policy
              </CardTitle>
              <p className="text-green-100 text-lg">
                Your privacy matters to us
              </p>
              <p className="text-green-200 text-sm mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Quick Summary */}
            <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border-l-4 border-green-500">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                📋 Quick Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We collect minimal data to provide our educational services,
                never sell your information, use industry-standard security, and
                give you full control over your data. Click sections below for
                detailed information.
              </p>
            </div>

            <div className="space-y-4">
              <CollapsibleSection
                id="data-collection"
                title="What Information We Collect"
                icon={Eye}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Personal Information:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Name and email address</li>
                      <li>Profile information</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Usage Data:
                    </h4>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      <li>Platform activity and engagement</li>
                      <li>Study group participation</li>
                    </ul>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="data-usage"
                title="How We Use Your Information"
                icon={Users}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Service Delivery
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Provide and improve our educational platform
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">Safety</h4>
                    <p className="text-red-700 text-sm">
                      Ensure platform security and safety
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="data-security"
                title="Data Security & Protection"
                icon={Lock}
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-700">
                        Access Control
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Strict access controls and authentication
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-700">
                        Regular Audits
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Ongoing security assessments and monitoring
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="user-rights"
                title="Your Privacy Rights"
                icon={FileText}
              >
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: "Access", desc: "View your data" },
                    { title: "Correct", desc: "Update information" },
                    { title: "Delete", desc: "Remove your data" },
                    { title: "Export", desc: "Download your data" },
                    { title: "Restrict", desc: "Limit processing" },
                    { title: "Object", desc: "Opt out of uses" },
                  ].map((right, index) => (
                    <div
                      key={index}
                      className="p-3 bg-gray-50 rounded-lg text-center"
                    >
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {right.title}
                      </h4>
                      <p className="text-gray-600 text-xs mt-1">{right.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Contact us at privacy@acadnet.com to exercise any of these
                  rights.
                </p>
              </CollapsibleSection>

              <CollapsibleSection
                id="cookies"
                title="Cookies & Tracking"
                icon={Eye}
              >
                <div className="space-y-3">
                  <p className="text-gray-600">We use cookies for:</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Session management
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        User preferences
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Platform analytics
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Security features
                      </span>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            </div>

            {/* Contact Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Mail className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Questions About Privacy?
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Privacy Questions:
                  </p>
                  <p className="font-medium text-gray-800">
                    privacy@acadnet.com
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">General Support:</p>
                  <p className="font-medium text-gray-800">
                    support@acadnet.com
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-center text-sm text-gray-600">
                🔒 Your privacy is our priority. We're committed to transparent
                and responsible data practices.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
