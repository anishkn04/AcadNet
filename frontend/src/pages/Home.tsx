import React from 'react';
import { Features } from '@/components/own_components/Features';
import { stepsData } from '@/data/data';
import { TestimonialCard } from '@/components/own_components/TestonomialCard';
import { testimonialsData } from '@/data/data';
import { teamData } from '@/data/data';
import { TeamMemberCard } from '@/components/own_components/TeamMemberCard';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/userContext';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => {
  return (

    <div className="p-6">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-[#1993e5] text-white rounded-full size-12 flex items-center justify-center text-xl font-bold">
          {number}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
};
export const Home: React.FC = () => {
  return (
    <>
      <section className="relative py-20 sm:py-28 lg:py-36">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDRbv1f2l1kWVo1owo1m0X8X0qOeR8_BruQEtoUnuUn7tLKxxTAtfq77ecqmSQWUJOim0zpOeJHHSABTIhjGCYSZgNQQpp_XrQcM4r_a4j8Ldo1h0H8-WUh6iFRh6FBh4rE6cxd_Bu4szwgMjJVcD1jI6ECB5Sg4ucaQdmvAMMtNTXZym01h2PgKpaBRd-j2UT1WY_T5fDMlIACP8pOFHj8CbrwojSr4MyirBLKK1Y8ldYW6efslWFlqAh5mBl05kDv7cCJ-RqNGd-i")`
        }}
      ></div>
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tighter">
            Learn together, grow together
          </h1>
          <h2 className="text-slate-200 text-lg sm:text-xl mt-4 mb-8">
            Join or build study groups tailored to your syllabus.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="flex min-w-[180px] max-w-xs mx-auto sm:mx-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#1993e5] text-slate-50 text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#137abd] transition-colors shadow-lg">
              <span className="truncate"><Link to={'/join'}>Join a Study Group</Link></span>
            </button>
            <button className="flex min-w-[180px] max-w-xs mx-auto sm:mx-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-slate-100 text-slate-900 text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 transition-colors shadow-lg">
              <span className="truncate"><Link to={'/create'}>Create Study Group</Link></span>
            </button>
          </div>
        </div>
      </div>
    </section>
          <section className="py-16 sm:py-24 bg-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <p className="text-slate-700 text-lg leading-relaxed max-w-3xl mx-auto">
          AcadNet is a peer-led academic collaboration platform designed to help students connect, share resources, and support each other's learning journeys. Join study groups, access shared resources, and participate in Q&A forums to enhance your academic experience.
        </p>
      </div>
    </section>
      <Features />
          <section className="py-16 sm:py-24 bg-slate-100" id="how-it-works">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Getting started with AcadNet is simple. Follow these three easy steps:</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {stepsData.map((step, index) => (
            <StepCard 
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
         <section className="py-16 sm:py-24" id="testimonials">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Testimonials</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">See what our users are saying about AcadNet.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              quote={testimonial.quote}
              image={testimonial.image}
            />
          ))}
        </div>
      </div>
    </section>
         <section className="py-16 sm:py-24 bg-slate-100" id="team">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Our Team</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Meet the talented individuals behind AcadNet.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {teamData.map((member, index) => (
            <TeamMemberCard 
              key={index}
              name={member.name}
              role={member.role}
              image={member.image}
            />
          ))}
        </div>
      </div>
    </section>
    </>
  );
};