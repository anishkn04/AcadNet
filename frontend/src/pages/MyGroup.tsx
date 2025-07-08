import  { useEffect, useState } from 'react';
import { useData } from '@/hooks/userInfoContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import type { Groups } from '@/models/User';

const MyGroup = () => {
  const { retreiveGroups, userId } = useData();
  const [myGroups, setMyGroups] = useState<Groups[]>([]);
  const [search, setSearch] = useState(''); // Add search state
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

  // Filter groups based on search
  const filteredGroups = myGroups.filter(group =>
    group.name.toLowerCase().includes(search.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">My Groups</h1>
      {/* Search Bar */}
      {myGroups.length > 0 && (
        <div className="mb-6 max-w-md">
          <input
            type="text"
            className="form-input w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search your groups by name or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      )}
      {filteredGroups.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-gray-600">{myGroups.length === 0 ? "You haven't created any group yet." : "No groups match your search."}</p>
          <Button onClick={handleCreateGroup}>Create a Group</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle>{group.name}</CardTitle>
                <CardDescription>{group.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-2 sm:flex-row '>
                  <Button onClick={()=>navigate(`/group?code=${group.groupCode}`)}>Enter Group</Button>
                  <Button onClick={() => navigate(`/user/groupadmin?id=${group.id}`)}>Settings</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyGroup;