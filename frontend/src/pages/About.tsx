import React from "react";
import { teamData } from "@/data/data";
import { TeamMemberCard } from "@/components/own_components/TeamMemberCard";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-6">
          <p
            className="text-2xl font-bold tracking-wide"
            style={{
              color: "#1993e5",
              textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            Learn More About AcadNet
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-50 p-8 text-center">
            <h2 className="text-2xl font-bold text-center mb-3">
              What Are We?
            </h2>
            <p className="text-slate-700 text-lg font-medium leading-relaxed tracking-wide text-center">
              AcadNet is a peer-led academic collaboration platform designed to
              help students connect, share resources, and support each other's
              learning journeys. Join study groups, access shared resources, and
              participate in forums to enhance your academic experience.
            </p>
          </div>
        </div>

        <section className="py-4 sm:py-6 mt-2">
          <div className="text-center mb-2 sm:mb-3">
            <h2 className="text-2xl font-bold text-center mb-1">Our Team</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Meet the talented individuals behind AcadNet.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {teamData.map((member, index) => (
              <TeamMemberCard
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
export default About;
