import React from "react";
import { useFormContext } from "react-hook-form";

// interface GroupDetailsProps {
//   groupName: string;
//   setGroupName: (name: string) => void;
//   subjectRelated: string;
//   setSubjectRelated: (subject: string) => void;
//   overview: string;
//   setOverview: (overview: string) => void;
// }

const GroupDetailsSection: React.FC = ({
}) => {

  const {register} = useFormContext()
  return (
    <>
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
        Group Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="groupName"
            className="block text-base font-medium text-gray-700 mb-2"
          >
            Study Group Name
          </label>
          <input
            type="text"
            id="groupName"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-base placeholder-gray-400"
         
            {...register('groupName')}
            placeholder="e.g., Software Dependability Study Group"
            required
          />
        </div>
        <div>
          <label
            htmlFor="subjectRelated"
            className="block text-base font-medium text-gray-700 mb-2"
          >
            Subject Related
          </label>
          <input
            type="text"
            id="subjectRelated"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-base placeholder-gray-400"
         
            {...register('subjectRelated')}
            placeholder="e.g., Software Engineering"
            required
          />
        </div>
      </div>
      <div className="mt-6">
        <label
          htmlFor="overview"
          className="block text-base font-medium text-gray-700 mb-2"
        >
          Overview
        </label>
        <textarea
          id="overview"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-base placeholder-gray-400"
         
          {...register('overview')}
          placeholder="Brief description of your study group, its goals, and target audience."
          required
        ></textarea>
      </div>
    </>
  );
};

export default GroupDetailsSection;
