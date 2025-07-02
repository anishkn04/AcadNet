import React from "react";
import { Features } from "@/components/own_components/Features";
import { stepsData } from "@/data/data";
import { TestimonialCard } from "@/components/own_components/TestonomialCard";
import { testimonialsData } from "@/data/data";
import { Link } from "react-router-dom";

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
      <section className="relative pt-4 pb-8 sm:pt-6 sm:pb-12 lg:pt-8 lg:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 items-center min-h-[500px] lg:min-h-[600px]">
            <div className="order-2 lg:order-1 text-center lg:text-left w-full">
              <h1 className="text-slate-900 text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tighter mb-6">
                Learn together, Grow together
              </h1>
              <h2 className="text-slate-600 text-lg sm:text-xl mb-8">
                Join or build study groups tailored to your syllabus.
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to={"/join"}>
                  <button className="flex min-w-[180px] max-w-xs mx-auto sm:mx-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#1993e5] text-slate-50 text-base font-bold leading-normal tracking-[0.015em] hover:bg-[#137abd] transition-colors shadow-lg">
                    J<span className="truncate">oin a Study Group</span>
                  </button>
                </Link>
                <Link to={"/create"}>
                  <button className="flex min-w-[180px] max-w-xs mx-auto sm:mx-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-slate-100 text-slate-900 text-base font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 transition-colors shadow-lg">
                    <span className="truncate">Create Study Group</span>
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative order-1 lg:order-2 w-full">
              <div
                className="w-full h-[350px] sm:h-[400px] lg:h-[500px] bg-cover bg-center rounded-xl shadow-lg flex-shrink-0"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDRbv1f2l1kWVo1owo1m0X8X0qOeR8_BruQEtoUnuUn7tLKxxTAtfq77ecqmSQWUJOim0zpOeJHHSABTIhjGCYSZgNQQpp_XrQcM4r_a4j8Ldo1h0H8-WUh6iFRh6FBh4rE6cxd_Bu4szwgMjJVcD1jI6ECB5Sg4ucaQdmvAMMtNTXZym01h2PgKpaBRd-j2UT1WY_T5fDMlIACP8pOFHj8CbrwojSr4MyirBLKK1Y8ldYW6efslWFlqAh5mBl05kDv7cCJ-RqNGd-i")`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <section className="py-16 sm:py-24 bg-slate-100" id="how-it-works">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Getting started with AcadNet is simple. Follow these three easy
              steps:
            </p>
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
          <div className="text-center mb-6 sm:mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
              Testimonials
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              See what our users are saying about AcadNet.
            </p>
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
    </>
  );
};
