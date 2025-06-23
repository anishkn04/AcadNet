import React from 'react';
import type { StudyGroup } from '@/models/User';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface StudyGroupCardProps {
  group: StudyGroup;
  onJoin?: (id: string) => void;
}

const StudyGroupCard: React.FC<StudyGroupCardProps> = ({ group, onJoin }) => {
  return (
    <div className="flex flex-col gap-3 bg-white rounded-xl soft-shadow transition-all hover:shadow-lg ">
      {/* <h3 className="text-[#101518] text-lg font-semibold leading-snug">{group.name}</h3>
      <p className="text-gray-500 text-sm font-normal leading-relaxed line-clamp-2">
        {group.description}
      </p>
      <div className="flex items-center text-gray-500 text-xs mt-1">
        <Users size={16} className="mr-1.5" />
        <span>{group.memberCount} Members</span>
      </div>
      <button
        onClick={() => onJoin && onJoin(group.id)}
        className="w-full mt-auto flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#b2d1e5] text-[#101518] text-sm font-semibold leading-normal hover:bg-opacity-90 transition-colors"
      >
        <span className="truncate">Join Group</span>
      </button> */}
      <Card>
        <CardHeader>
            <CardTitle>
                {group.name}
            </CardTitle>
            <CardDescription>
                {group.description}
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Button>Join Group</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudyGroupCard;