import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import FilterItem from '@/components/own_components/FilterItem';
import StudyGroupList from '@/components/own_components/StudyGroupList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
const StudyGroups: React.FC = () => {

  // const handleJoinGroup = (id: string) => {
  //   console.log(`Joining group with id: ${id}`);
  //   // Implement joining functionality here
  // };

  return (
    <div className="contain mx-auto  justify-center item-center p-10 ">
        <Card className='flex flex-col md:flex-row w-full justify-start md:justify-center  md:items-center'>
          <CardHeader className='w-full'>
            <CardTitle className='text-3xl font-bold leading-tight'>Create a Study Group</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to={'/create'}><Button className='text-lg font-medium cursor-pointer'>Create</Button></Link>
          </CardContent>
        </Card>
      <div className="flex flex-col sm:flex-row justify-start items-center sm:items-center gap-4 p-4 mb-6">
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
    <StudyGroupList />
    </div>
  );
};

export default StudyGroups;