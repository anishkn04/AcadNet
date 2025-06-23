import React, { useState } from 'react';
import { Search } from 'lucide-react';
import FilterItem from '@/components/own_components/FilterItem';
// import SearchFilter from './SearchFilter';
// import FilterBar from './FilterBar';
// import StudyGroupList from './StudyGroupList';
// import { studyGroups } from '../../data/studyGroups';
import { studyGroups } from '@/data/studyGroups';
import StudyGroupList from '@/components/own_components/StudyGroupList';
const StudyGroups: React.FC = () => {
  const [groups] = useState(studyGroups);

  const handleJoinGroup = (id: string) => {
    console.log(`Joining group with id: ${id}`);
    // Implement joining functionality here
  };


  return (
    <div className=" flex flex-col container max-auto justify-center item-center p-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 mb-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-[#101518] tracking-tight text-3xl font-bold leading-tight">Study Groups</h1>
        <p className="text-gray-500 text-sm font-normal leading-normal">
          Find a study group that fits your schedule and academic needs.
        </p>
      </div>
    </div>
      <div className="px-4 pb-6">
      <label className="flex flex-col min-w-40 h-12 w-full">
        <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-white soft-shadow">
          <div className="text-gray-400 flex border-none items-center justify-center pl-4 rounded-l-xl border-r-0">
            <Search size={24} />
          </div>
          <input
            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#101518] focus:outline-0 focus:ring-0 border-none bg-transparent focus:border-none h-full placeholder:text-gray-400 px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
            placeholder="Search for groups by name, subject, or keywords..."
          />
        </div>
      </label>
    </div>
       <div className="flex flex-wrap gap-3 p-4 mb-6 items-center">
      <span className="text-gray-600 text-sm font-medium">Filters:</span>
      <FilterItem label="Subject" />
      <FilterItem label="Course" />
      <FilterItem label="Time Slot" />
    </div>
    <StudyGroupList groups={groups} onJoinGroup={handleJoinGroup}/>
    </div>
  );
};

export default StudyGroups;