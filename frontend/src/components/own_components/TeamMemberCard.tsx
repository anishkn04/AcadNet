import React from "react";

interface TeamMemberCardProps {
  name: string;
  role: string;
  image: string;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  role,
  image,
}) => {
  return (
    <div className="text-center bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div
        className="w-32 h-32 mx-auto bg-center bg-no-repeat aspect-square bg-cover rounded-full mb-4"
        style={{ backgroundImage: `url("${image}")` }}
      ></div>
      <p className="text-xl font-semibold text-slate-900">{name}</p>
      <p className="text-slate-500">{role}</p>
    </div>
  );
};
