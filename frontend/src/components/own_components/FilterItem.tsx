import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterItemProps {
  label: string;
  onClick?: () => void;
}

const FilterItem: React.FC<FilterItemProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex h-9 shrink-0 items-center justify-center gap-x-1.5 rounded-lg bg-white hover:bg-gray-100 transition-colors soft-shadow px-3 py-1.5"
    >
      <p className="text-gray-700 text-sm font-medium leading-normal">{label}</p>
      <div className="text-gray-500">
        <ChevronDown size={16} />
      </div>
    </button>
  );
};

export default FilterItem;