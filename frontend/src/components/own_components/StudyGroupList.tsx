import React, { useState, useEffect } from 'react';
import { useData } from '@/hooks/userInfoContext';
import type { Groups } from '@/models/User';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';

interface StudyGroupListProps {
  search: string;
  subject: string;
  course: string;
  timeSlot: string;
}

const StudyGroupList: React.FC<StudyGroupListProps> = ({
  search,
  subject,
  course,
  timeSlot,
}) => {
  const [groups, setGroups] = useState<Groups[]>([]);
  const { retreiveGroups } = useData();

  useEffect(() => {
    const groupList = async () => {
      const data = await retreiveGroups();
      if (Array.isArray(data)) {
        setGroups(data);
      } else {
        console.error("retreiveGroups did not return an array:", data);
        setGroups([]);
      }
    };
    groupList();
  }, []);

  // Filtering logic (adjust field names as needed)
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(search.toLowerCase()));
    // These fields are placeholders; replace with your actual group fields if available
    const matchesSubject = subject ? group.name.toLowerCase().includes(subject.toLowerCase()) : true;
    const matchesCourse = course ? group.name.toLowerCase().includes(course.toLowerCase()) : true;
    const matchesTimeSlot = timeSlot ? group.name.toLowerCase().includes(timeSlot.toLowerCase()) : true;
    return matchesSearch && matchesSubject && matchesCourse && matchesTimeSlot;
  });

  return (
    <>
      <h2 className="text-[#101518]  text-xl font-semibold leading-tight tracking-[-0.015em] px-4 ">
        Available Groups ({filteredGroups.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-10">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
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