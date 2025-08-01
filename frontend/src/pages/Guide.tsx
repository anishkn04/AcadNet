import React from "react";

const guideSteps = [
  {
    icon: (
      <svg
        fill="currentColor"
        height="20px"
        viewBox="0 0 256 256"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
      </svg>
    ),
    title: "1. Navigate to Groups",
    description: "Click on the 'Groups' tab in the main navigation bar.",
  },
  {
    icon: (
      <svg
        fill="currentColor"
        height="20px"
        viewBox="0 0 256 256"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
      </svg>
    ),
    title: "2. Search for Groups",
    description:
      "Use the search bar to find groups by course name, topic, or keywords.",
  },
  {
    icon: (
      <svg
        fill="currentColor"
        height="20px"
        viewBox="0 0 256 256"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
      </svg>
    ),
    title: "3. Join a Group",
    description:
      "If you find a group that interests you, click on it to overview and join.",
  },
  {
    icon: (
      <svg
        fill="currentColor"
        height="20px"
        viewBox="0 0 256 256"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM51.31,160,136,75.31,152.69,92,68,176.68ZM48,179.31,76.69,208H48Zm48,25.38L79.31,188,164,103.31,180.69,120Zm96-96L147.31,64l24-24L216,84.68Z"></path>
      </svg>
    ),
    title: "4. Create a Group",
    description:
      "If no existing group fits your needs, click the 'Create Group' button.",
  },
  {
    icon: (
      <svg
        fill="currentColor"
        height="20px"
        viewBox="0 0 256 256"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14-6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z"></path>
      </svg>
    ),
    title: "5. Configure Group",
    description:
      "Fill out the group details, including name, description, syllabus and additional resources.",
  },
  {
    icon: (
      <svg
        fill="currentColor"
        height="20px"
        viewBox="0 0 256 256"
        width="20px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M229.66,109.66l-48,48a8,8,0,0,1-11.32-11.32L204.69,112H165a88,88,0,0,0-85.23,66,8,8,0,0,1-15.5-4A103.94,103.94,0,0,1,165,96h39.71L170.34,61.66a8,8,0,0,1,11.32-11.32l48,48A8,8,0,0,1,229.66,109.66ZM192,208H40V88a8,8,0,0,0-16,0V208a16,16,0,0,0,16,16H192a8,8,0,0,0,0-16Z"></path>
      </svg>
    ),
    title: "6. Invite Members",
    description: "Once created, invite mates or share the group code.",
  },
];

const Guide = () => {
  return (
    <>
      <div className="bg-gray-100">
        <div
          className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden"
          style={{
            fontFamily: 'Inter, "Noto Sans", sans-serif',
          }}
        >
          <div className="layout-container flex h-full grow flex-col">
            <div className="fixed top-25 right-6 z-10">
              <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white text-center max-w-xs">
                <h3 className="text-lg font-semibold leading-tight mb-3">
                  Need More Help?
                </h3>
                <p className="text-sm font-normal leading-relaxed mb-4">
                  See Our GitHub Documentation <br /> We have properly
                  documented Acadnet there.
                </p>
                <a
                  className="inline-block bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                  href="https://gist.github.com/anishkn04/557c475490ed16b831c3e9c507dc0de1"
                  target="_blank"
                >
                  Link To Documentation
                </a>
              </div>
            </div>
            <main className="flex-1 bg-gray-50 pt-8 pb-8 px-4 md:px-6 lg:px-8">
              <div className="max-w-4xl space-y-8 mr-[24rem] ml-auto">
                {/* Getting Started Card */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-8">
                  <header>
                    <h1 className="text-gray-900 text-3xl font-bold leading-tight">
                      User Guide
                    </h1>
                  </header>
                  <section id="getting-started">
                    <h2 className="text-gray-800 text-2xl font-semibold leading-tight tracking-tight mb-4">
                      How to Join or Create a Study Group
                    </h2>
                    <div className="space-y-4">
                      {guideSteps.map((step, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
                        >
                          <div className="text-blue-600 flex items-center justify-center rounded-full bg-blue-100 shrink-0 size-10 mt-1">
                            {step.icon}
                          </div>
                          <div>
                            <h3 className="text-gray-800 text-base font-semibold leading-normal">
                              {step.title}
                            </h3>
                            <p className="text-gray-600 text-sm font-normal leading-normal">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Rules & Regulations Card */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                  <section id="rules-regulations">
                    <h2 className="text-gray-800 text-2xl font-semibold leading-tight tracking-tight mb-4">
                      Rules &amp; Regulations
                    </h2>
                    <p className="text-gray-700 text-base font-normal leading-relaxed mb-6">
                      AcadNet is committed to fostering a respectful and
                      collaborative learning environment. All users must adhere
                      to the following guidelines:
                    </p>
                    <ul className="space-y-3 list-disc list-inside text-gray-700">
                      <li>
                        <span className="font-medium text-gray-800">
                          Respectful Communication:
                        </span>{" "}
                        Engage in constructive discussions and avoid offensive
                        language.
                      </li>
                      <li>
                        <span className="font-medium text-gray-800">
                          Academic Integrity:
                        </span>{" "}
                        Do not share or request unauthorized materials or engage
                        in plagiarism.
                      </li>
                      <li>
                        <span className="font-medium text-gray-800">
                          Privacy:
                        </span>{" "}
                        Respect the privacy of others and do not share personal
                        information without consent.
                      </li>
                      <li>
                        <span className="font-medium text-gray-800">
                          Content Moderation:
                        </span>{" "}
                        AcadNet reserves the right to remove inappropriate
                        content and suspend accounts that violate these rules.
                      </li>
                    </ul>
                  </section>
                </div>

                {/* FAQ Card */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
                  <section id="faq">
                    <h2 className="text-gray-800 text-2xl font-semibold leading-tight tracking-tight mb-4">
                      Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                      <details
                        className="group rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 transition-all"
                        open
                      >
                        <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 list-none">
                          <h3 className="text-gray-800 text-sm font-medium leading-normal">
                            How do I reset my password?
                          </h3>
                          <div className="text-gray-500 group-open:rotate-180 transition-transform">
                            <svg
                              fill="currentColor"
                              height="20px"
                              viewBox="0 0 256 256"
                              width="20px"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                            </svg>
                          </div>
                        </summary>
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 text-sm font-normal leading-relaxed">
                            To reset your password, go to the login page and
                            click on 'Forgot Password'. You will receive OTP on
                            your registered email, using which password can be
                            reset.
                          </p>
                        </div>
                      </details>
                      <details className="group rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 transition-all">
                        <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 list-none">
                          <h3 className="text-gray-800 text-sm font-medium leading-normal">
                            Can I join multiple study groups?
                          </h3>
                          <div className="text-gray-500 group-open:rotate-180 transition-transform">
                            <svg
                              fill="currentColor"
                              height="20px"
                              viewBox="0 0 256 256"
                              width="20px"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                            </svg>
                          </div>
                        </summary>
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 text-sm font-normal leading-relaxed">
                            Yes, you can join as many study groups as you find
                            relevant to your academic needs. There is no limit
                            to the number of groups you can be a part of.
                          </p>
                        </div>
                      </details>
                      <details className="group rounded-lg border border-gray-200 bg-gray-50 hover:border-blue-300 transition-all">
                        <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 list-none">
                          <h3 className="text-gray-800 text-sm font-medium leading-normal">
                            How do I report a user?
                          </h3>
                          <div className="text-gray-500 group-open:rotate-180 transition-transform">
                            <svg
                              fill="currentColor"
                              height="20px"
                              viewBox="0 0 256 256"
                              width="20px"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                            </svg>
                          </div>
                        </summary>
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 text-sm font-normal leading-relaxed">
                            If you encounter a user violating platform rules,
                            you can report them by clicking the 'Report' button
                            in the discussion area. Provide a brief description
                            of the issue for moderation team.
                          </p>
                        </div>
                      </details>
                    </div>
                  </section>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Guide;
