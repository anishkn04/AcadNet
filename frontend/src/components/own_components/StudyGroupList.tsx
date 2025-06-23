import React from 'react';
import type { StudyGroup } from '@/models/User';
import StudyGroupCard from './StudyGroupCard';

interface StudyGroupListProps {
  groups: StudyGroup[];
  onJoinGroup?: (id: string) => void;
}

const StudyGroupList: React.FC<StudyGroupListProps> = ({ groups, onJoinGroup }) => {
  return (
    <>
      <h2 className="text-[#101518] text-xl font-semibold leading-tight tracking-[-0.015em] px-4 pb-4 pt-2">
        Available Groups ({groups.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {groups.map((group) => (
          <StudyGroupCard key={group.id} group={group} onJoin={onJoinGroup} />
        ))}
      </div>
    </>
  );
};

export default StudyGroupList;