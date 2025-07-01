import React from "react";
import { Button } from "@/components/ui/button";

// Define the structure for a subtopic
interface Subtopic {
  id: string; // Unique ID for keying in React lists
  name: string;
}

// Define the structure for a syllabus unit
interface SyllabusUnit {
  id: string; // Unique ID for keying in React lists
  unitNumber: string; // Will be displayed, not editable
  title: string;
  subtopics: Subtopic[];
}

interface SyllabusSectionProps {
  syllabusUnits: SyllabusUnit[];
  addSyllabusUnit: () => void;
  removeSyllabusUnit: (id: string) => void;
  updateUnitTitle: (id: string, title: string) => void;
  addSubtopic: (unitId: string) => void;
  removeSubtopic: (unitId: string, subtopicId: string) => void;
  updateSubtopicName: (
    unitId: string,
    subtopicId: string,
    name: string
  ) => void;
}

const SyllabusSection: React.FC<SyllabusSectionProps> = ({
  syllabusUnits,
  addSyllabusUnit,
  removeSyllabusUnit,
  updateUnitTitle,
  addSubtopic,
  removeSubtopic,
  updateSubtopicName,
}) => {
  return (
    <>
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
        Syllabus Content
      </h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-2">
        Add your syllabus content by creating units and then adding subtopics
        within each unit. Use the "Add New Unit" button to start, and the "Add
        Subtopic" button to detail each unit's content.
      </p>
      {syllabusUnits.length > 0 && (
        <div className="space-y-4 mt-4">
          {syllabusUnits.map((unit) => (
            <div
              key={unit.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="block text-lg font-semibold text-gray-700 mr-2">
                    Unit {unit.unitNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeSyllabusUnit(unit.id)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors duration-200 flex items-center"
                >
                  <svg
                    className="h-3 w-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  Remove Unit
                </button>
              </div>
              <input
                type="text"
                id={`unit-title-${unit.id}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-base placeholder-gray-400 mb-3"
                value={unit.title}
                onChange={(e) => updateUnitTitle(unit.id, e.target.value)}
                placeholder="Unit Title"
                required
              />
              <h4 className="text-base font-medium text-gray-600 mb-2">
                Subtopics:
              </h4>
              <div className="space-y-2">
                {unit.subtopics.map((subtopic) => (
                  <div key={subtopic.id} className="flex items-center">
                    <input
                      type="text"
                      className="flex-grow px-3 py-1 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm placeholder-gray-400 mr-2"
                      value={subtopic.name}
                      onChange={(e) =>
                        updateSubtopicName(unit.id, subtopic.id, e.target.value)
                      }
                      placeholder="Subtopic name"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubtopic(unit.id, subtopic.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors duration-200 shrink-0"
                      title="Remove Subtopic"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        ></path>
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => addSubtopic(unit.id)}
                className="mt-3 w-full"
              >
                <svg
                  className="h-4 w-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
                Add Subtopic
              </Button>
            </div>
          ))}
        </div>
      )}
      <Button
        type="button"
        onClick={addSyllabusUnit}
        className="w-full h-9 bg-green-600 text-white hover:bg-green-700"
      >
        <svg
          className="h-5 w-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        Add New Unit
      </Button>
    </>
  );
};

export default SyllabusSection;
