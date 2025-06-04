import React from 'react';

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  image: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, role, quote, image }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center mb-4">
        <div 
          className="w-12 h-12 bg-center bg-no-repeat aspect-square bg-cover rounded-full mr-4" 
          style={{ backgroundImage: `url("${image}")` }}
        ></div>
        <div>
          <p className="font-semibold text-slate-900">{name}</p>
          <p className="text-sm text-slate-500">{role}</p>
        </div>
      </div>
      <p className="text-slate-700 italic">{quote}</p>
    </div>
  );
};