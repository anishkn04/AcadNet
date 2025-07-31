import { useState } from 'react';
import { Search, Key, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StudyGroupList from '@/components/own_components/StudyGroupList';
import JoinByCodeDialog from '@/components/own_components/JoinByCodeDialog';
import { Button } from '@/components/ui/button';

const StudyGroups: React.FC = () => {
  const [search, setSearch] = useState('');
  const [subject] = useState('');
  const [course] = useState('');
  const [timeSlot] = useState('');
  const [showJoinByCodeDialog, setShowJoinByCodeDialog] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Study Groups
                </h1>
                <p className="text-slate-600 max-w-2xl">
                  Discover and join study groups that match your academic interests. 
                  Collaborate with peers, share resources, and enhance your learning experience.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowJoinByCodeDialog(true)}
                  variant="outline"
                  className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                >
                  <Key size={16} />
                  Join by Code
                </Button>
                <Link to={'/create'}>
                  <Button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                    <Plus size={16} />
                    Create Group
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Search Groups
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-colors"
                    placeholder="Search by group name, subject, or keywords..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  Find groups that match your interests and academic goals
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Groups List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <StudyGroupList
            search={search}
            subject={subject}
            course={course}
            timeSlot={timeSlot}
          />
        </div>
      </div>
      
      <JoinByCodeDialog 
        isOpen={showJoinByCodeDialog}
        onClose={() => setShowJoinByCodeDialog(false)}
      />
    </div>
  );
};

export default StudyGroups;