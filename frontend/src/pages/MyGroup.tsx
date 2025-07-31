import { useEffect, useState } from 'react';
import { useData } from '@/hooks/userInfoContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Users, Calendar, User } from 'lucide-react';
import type { Groups } from '@/models/User';

const MyGroup = () => {
  const { retreiveGroups, userId } = useData();
  const [myGroups, setMyGroups] = useState<Groups[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const data = await retreiveGroups();
      if (Array.isArray(data)) {
        const filtered = data.filter((group) =>
          Number(group.creatorId) === Number(userId) ||
          (Array.isArray(group.members) && group.members.some(member => Number(member.userId) === Number(userId)))
        );
        setMyGroups(filtered);
      } else {
        setMyGroups([]);
      }
    };
    fetchGroups();
  }, [retreiveGroups, userId]);

  const handleCreateGroup = () => {
    navigate('/create');
  };

  const handleJoinGroup = () => {
    navigate('/join');
  };

  const handleViewGroup = (groupCode: string) => {
    navigate(`/group?code=${groupCode}`);
  };

  const handleAdminGroup = (groupCode: string) => {
    navigate(`/user/groupadmin?code=${groupCode}`);
  };

  // Filter groups based on search
  const filteredGroups = myGroups.filter(group =>
    group.name.toLowerCase().includes(search.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap justify-between items-center gap-3 pb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 text-4xl font-bold leading-tight">My Study Groups</h1>
            <p className="text-slate-600 text-lg">Manage and access your study groups</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleJoinGroup}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Join Group
            </Button>
            <Button 
              onClick={handleCreateGroup}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Group
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Statistics */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow border border-slate-200 hover:shadow-md transition-shadow">
            <p className="text-slate-700 text-base font-medium">Total Groups</p>
            <p className="text-slate-900 text-3xl font-bold">{myGroups.length}</p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow border border-slate-200 hover:shadow-md transition-shadow">
            <p className="text-slate-700 text-base font-medium">Groups I Created</p>
            <p className="text-green-600 text-3xl font-bold">
              {myGroups.filter(group => Number(group.creatorId) === Number(userId)).length}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow border border-slate-200 hover:shadow-md transition-shadow">
            <p className="text-slate-700 text-base font-medium">Groups I Joined</p>
            <p className="text-blue-600 text-3xl font-bold">
              {myGroups.filter(group => 
                Number(group.creatorId) !== Number(userId) &&
                Array.isArray(group.members) && 
                group.members.some(member => Number(member.userId) === Number(userId))
              ).length}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 bg-white shadow border border-slate-200 hover:shadow-md transition-shadow">
            <p className="text-slate-700 text-base font-medium">Private Groups</p>
            <p className="text-amber-600 text-3xl font-bold">
              {myGroups.filter(group => group.isPrivate).length}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        {myGroups.length > 0 && (
          <div className="mb-6">
            <label className="flex flex-col w-full max-w-md">
              <div className="flex w-full items-stretch rounded-lg shadow-sm border border-slate-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <div className="text-slate-500 flex bg-slate-50 items-center justify-center pl-3 pr-2 rounded-l-lg border-r border-slate-300">
                  <Search className="h-5 w-5" />
                </div>
                <input 
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 focus:outline-none border-none bg-white h-11 placeholder:text-slate-400 px-3 text-base" 
                  placeholder="Search your groups by name or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </label>
          </div>
        )}
      </section>

      {/* Groups List */}
      <section>
        <h3 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight mb-4">Your Groups</h3>
        
        {filteredGroups.length === 0 ? (
          <div className="bg-white shadow rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-slate-900 text-xl font-semibold mb-2">
              {myGroups.length === 0 ? "No study groups yet" : "No groups found"}
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              {myGroups.length === 0 
                ? "Get started by creating your first study group or joining an existing one to collaborate with others."
                : "Try adjusting your search terms to find the group you're looking for."
              }
            </p>
            {myGroups.length === 0 && (
              <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={handleJoinGroup} variant="outline" className="min-w-[120px]">
                  <Users className="h-4 w-4 mr-2" />
                  Join Group
                </Button>
                <Button onClick={handleCreateGroup} className="min-w-[120px]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredGroups.map((group) => (
              <div key={group.id} className="bg-white shadow rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-slate-900 text-lg font-semibold">{group.name}</h3>
                      {group.isPrivate && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                          Private
                        </span>
                      )}
                      {Number(group.creatorId) === Number(userId) && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                          Owner
                        </span>
                      )}
                    </div>
                    
                    {group.description && (
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">{group.description}</p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" />
                        <span>{Array.isArray(group.members) ? group.members.length : 0} members</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
                      </div>
                      {group.groupCode && (
                        <div className="flex items-center gap-1.5">
                          <div className="h-4 w-4 flex items-center justify-center">
                            <span className="text-xs font-mono font-bold">#</span>
                          </div>
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">{group.groupCode}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewGroup(group.groupCode)}
                      className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors"
                    >
                      View Group
                    </Button>
                    {Number(group.creatorId) === Number(userId) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAdminGroup(group.groupCode)}
                        className="hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-300 transition-colors"
                      >
                        <User className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MyGroup;