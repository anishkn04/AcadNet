import React,{useState,useEffect} from 'react';
import { useData } from '@/hooks/userInfoContext';
import type { Groups } from '@/models/User';
import { Card,CardHeader,CardTitle,CardContent,CardDescription } from '../ui/card';
import { Button } from '../ui/button';

const StudyGroupList: React.FC = () => {
  const [groups, setGroups] = useState<Groups[]>([]);
  const { retreiveGroups } = useData();

  useEffect(() => {
    const groupList = async () => {
      const data = await retreiveGroups();
      console.log(data);

      if (Array.isArray(data)) {
        setGroups(data);
      } else {
        console.error("retreiveGroups did not return an array:", data);
        setGroups([]);
      }
    };
    groupList();
  }, []);

  console.log('data:', groups);

  return (
    <>
      <h2 className="text-[#101518]  text-xl font-semibold leading-tight tracking-[-0.015em] px-4 pb-4 pt-2">
        Available Groups ({groups.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {Array.isArray(groups) && groups.length > 0 ? (
          groups.map((group) => (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle>
                  {group?.name}
                </CardTitle>
                <CardDescription>
                  {group?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button>Join Group</Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="px-4">No groups available at the moment.</p>
        )}
      </div>
    </>
  );
};

export default StudyGroupList;