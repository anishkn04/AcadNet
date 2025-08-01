import React, { useState, useLayoutEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Scale,
  Phone,
} from "lucide-react";

const Terms = () => {
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
            <Icon className="h-5 w-5 text-blue-600" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <div className="flex justify-center mb-4">
                <Scale className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-4xl font-bold mb-2">
                Terms of Service
              </CardTitle>
              <p className="text-blue-100 text-lg">
                Simple terms for our educational platform
              </p>
              <p className="text-blue-200 text-sm mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Quick Overview */}
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg border-l-4 border-blue-500">
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                📖 Quick Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                By using AcadNet, you agree to use our educational platform
                responsibly, respect others, and follow academic integrity. We
                provide the platform "as-is" and both parties can terminate the
                agreement anytime. Click sections below for detailed terms.
              </p>
            </div>

            <div className="space-y-4">
              <CollapsibleSection
                id="service-description"
                title="What is AcadNet?"
                icon={FileText}
              >
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    AcadNet is an educational platform designed to enhance
                    collaborative learning through:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        📚 Study Groups
                      </h4>
                      <p className="text-blue-700 text-sm">
                        Collaborative learning environments
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">
                        💬 Forums
                      </h4>
                      <p className="text-green-700 text-sm">
                        Academic discussions and Q&A
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">
                        📖 Resources
                      </h4>
                      <p className="text-purple-700 text-sm">
                        Educational materials and tools
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-2">
                        🤝 Networking
                      </h4>
                      <p className="text-orange-700 text-sm">
                        Connect with fellow learners
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="user-responsibilities"
                title="Your Responsibilities"
                icon={Users}
              >
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">
                        ✅ Do:
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Be respectful and supportive</li>
                        <li>• Share knowledge responsibly</li>
                        <li>• Maintain academic integrity</li>
                        <li>• Keep your account secure</li>
                        <li>• Report inappropriate content</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">
                        ❌ Don't:
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Share copyrighted materials</li>
                        <li>• Engage in harassment or bullying</li>
                        <li>• Create fake accounts</li>
                        <li>• Spam or send unwanted messages</li>
                        <li>• Compromise platform security</li>
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">
                          Age Requirement
                        </h4>
                        <p className="text-yellow-700 text-sm">
                          You must be at least 13 years old.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="content-intellectual-property"
                title="Content & Intellectual Property"
                icon={Shield}
              >
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      Platform Content
                    </h4>
                    <p className="text-blue-700 text-sm">
                      AcadNet's platform, features, and original content are
                      protected by intellectual property laws.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">
                      Your Content
                    </h4>
                    <p className="text-green-700 text-sm">
                      You own content you create but grant us license to display
                      and distribute it on the platform for educational
                      purposes.
                    </p>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">
                      Educational Use
                    </h4>
                    <p className="text-orange-700 text-sm">
                      Respect copyright laws and fair use principles when
                      sharing educational materials.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="disclaimers-limitations"
                title="Disclaimers & Limitations"
                icon={AlertTriangle}
              >
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Service Availability
                      </h4>
                      <p className="text-gray-600 text-sm">
                        We strive for 99.9% uptime but cannot guarantee
                        uninterrupted service.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Content Accuracy
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Educational content is provided "as-is" - verify
                        important information independently.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Third-Party Links
                      </h4>
                      <p className="text-gray-600 text-sm">
                        External links are provided for convenience - we're not
                        responsible for their content.
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Liability Limitation
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Our liability is limited to the maximum extent permitted
                        by law.
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="termination"
                title="Account Termination"
                icon={AlertTriangle}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">By You</h4>
                    <p className="text-blue-700 text-sm">
                      You can delete your account anytime through settings.
                    </p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-800 mb-2">By Us</h4>
                    <p className="text-red-700 text-sm">
                      We may suspend accounts that violate these terms or engage
                      in harmful behavior.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection
                id="changes-updates"
                title="Changes to Terms"
                icon={FileText}
              >
                <div className="space-y-3">
                  <p className="text-gray-600">
                    We may update these terms occasionally to reflect changes in
                    our services or legal requirements.
                  </p>

                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-gray-700">
                        Acceptance
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Continued use after changes means you accept the new
                        terms
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>
            </div>

            {/* Contact Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">
                  Questions About Terms?
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Legal Questions:</p>
                  <p className="font-medium text-gray-800">legal@acadnet.com</p>
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
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-center text-sm text-gray-600">
                ⚖️ By using AcadNet, you agree to these terms. Thank you for
                being part of our learning community!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
