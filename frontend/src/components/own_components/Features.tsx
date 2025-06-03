import React from 'react';
import { featuresData } from '@/data/data';
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="mb-4">
        <span className="material-icons-outlined text-4xl text-[#1993e5]">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
};

export const Features: React.FC = () => {
  return (
    <section className="py-16 sm:py-24" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Features</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            AcadNet offers a suite of features designed to enhance your learning experience and foster collaboration among peers.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div 
            className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-xl shadow-md" 
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCW1V_Hr1joy9CBXUGBVH0UcJBMSaSfOerTyOsYt7CBtI5a74Iu1kiEPhq6eIDxt07VFNXd8yR7mFca6nc8W1x15k4j7EO1TmWQnqWYPKEbMyo1G5EL-54rhDF6nYO3OP51GemwIW3oWnhdgwyOn0yj7lE4Cw18TqT6NnY7jqDJFEq6UQWXEMEnh532b-1Go-v96zdlOPY8JmTHMR2NM74QNUPpj7ariPNHfTez4P0kF1JK3gqUTtFCqnULWq8FZI1okxsUUVAWK8jg")`
            }}
          ></div>
          <div 
            className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-xl shadow-md" 
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAl7BRFddqC_RFqISrlGc8-lPSP60ojMJ8y74iqem01WR1cJL4ca1b2LmiZ0fgLpu77eNjheilh5RUBAx_PEAF6D85VCKbf3YG2PZmnmKAbbtgBLAE-haXtWz2pS4E-wO5YxBVFsUdp1eNJRyfx0Iq8aRatmLiClf_uaWlHMrF3NEv0fJnzxihQEEdvFROKeHMXv0ujub3PPi8VvtTs94p0K3i8Xj2JSn1zIdnKNEH-3FauodLelNg1mNm-H7kwJ_AG_Eczjt4NWfyk")`
            }}
          ></div>
          <div 
            className="w-full aspect-[4/3] bg-center bg-no-repeat bg-cover rounded-xl shadow-md" 
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuASJKpTjXMX_azOWG0bowjalltn5ib65rc-b-MCUz5v7h0dJ6xOC5IMVS1r0-DtZ7Jc_NENlOJkzxKClL-1IPdyldsfkpKRbqj6DMtmTCAasU7QDvfpkp64_advR-DQS9DbQSJSZ9cPD2ZHYaGGC3sFzueuQG-hIgazJfJ8UlCwIHhOAZx8_-rSJvNV5NzIRn_AxhNzH2OhNHoVRtfncXHe846yKU342bb_5WHI6VbCvhHQ_SK1E-Exw7twj1AAPiaYVm5DAPtsPS4U")`
            }}
          ></div>
        </div>
      </div>
    </section>
  );
};