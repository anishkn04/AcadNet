// syllabussection.tsx
import React from "react"; // No need for useState locally anymore
import { Button } from "@/components/ui/button";
import { useFormContext, useFieldArray } from "react-hook-form";
// Import your interfaces directly from user.ts
import type { CreateGroupInterface ,topics,subTopics} from "@/models/User";

// No need for TempSubtopic or TempUnit interfaces here!

const SyllabusSection: React.FC = () => {
  const { control, register } = useFormContext<CreateGroupInterface>();

  // This useFieldArray manages the 'unit' array nested within 'syllabus'
  // The 'fields' array will now contain objects conforming to UserUnit
  // but with an additional 'id' property added by useFieldArray for React keys.
  const { fields: unitFields, append: appendUnit, remove: removeUnit } = useFieldArray({
    control,
    name: "syllabus.topics", // The path to the array in your form data
  });

  const addSyllabusUnitHandler = () => {
    appendUnit({
      title: "",
      subTopics: [],
    } as topics); 
  };

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

      {unitFields.length > 0 && (
        <div className="space-y-4 mt-4">
          {unitFields.map((unit, unitIndex) => (
            <div
              key={unit.id} // use unit.id from useFieldArray for React key
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="block text-lg font-semibold text-gray-700 mr-2">
                    Unit {unitIndex + 1} {/* Display unit number based on index */}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeUnit(unitIndex)} // remove by index
                  className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors duration-200 flex items-center"
                >
                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Remove Unit
                </button>
              </div>
              <input
                type="text"
                id={`syllabus.topics.${unitIndex}.title`}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-base placeholder-gray-400 mb-3"
                placeholder="Unit Title"
                required
                // Register the unit title field, directly using the path to the 'title' property of the Unit interface
                {...register(`syllabus.topics.${unitIndex}.title` as const, { required: true })}
                defaultValue={unit.title} 
              />
              <textarea
                id={`syllabus.topics.${unitIndex}.deccription`}
                placeholder="Unit Description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm mb-3"
                {...register(`syllabus.topics.${unitIndex}.description` as const)}
              />

              {/* Nested SubtopicList Component */}
              <SubtopicList unitIndex={unitIndex} />
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        onClick={addSyllabusUnitHandler}
        className="w-full h-9 bg-green-600 text-white hover:bg-green-700 mt-6"
      >
        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Add New Unit
      </Button>
    </>
  );
};

export default SyllabusSection;

// --- Nested SubtopicList Component ---
interface SubtopicListProps {
  unitIndex: number;
}

const SubtopicList: React.FC<SubtopicListProps> = ({ unitIndex }) => {
  const { control, register } = useFormContext<CreateGroupInterface>();

  // This useFieldArray manages the 'subtopic' array within a specific unit
  // 'fields' here will contain objects conforming to UserSubtopic
  const { fields: subtopicFields, append: appendSubtopic, remove: removeSubtopic } = useFieldArray({
    control,
    name: `syllabus.topics.${unitIndex}.subTopics` as const, // Path to subtopic array for this unit
  });

  const addSubtopicHandler = () => {
    // Append a new subtopic to the current unit's subtopic array
    // Provide initial values matching the UserSubtopic structure
    appendSubtopic({ title: "" } as subTopics);
  };

  return (
    <>
      <h4 className="text-base font-medium text-gray-600 mb-2">
        <span>Subtopics:</span>
      </h4>
      <div className="space-y-2">
        {subtopicFields.map((subtopic, subtopicIndex) => (
          <div key={subtopic.id} className="flex flex-col items-center">
            <div className="w-full flex item-center">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-base placeholder-gray-400 mb-3"
                placeholder="Subtopic name"
                required
                {...register(`syllabus.topics.${unitIndex}.subTopics.${subtopicIndex}.title` as const, { required: true })}
                defaultValue={subtopic.title}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSubtopic(subtopicIndex)} // remove by index
                className="text-gray-400 hover:text-red-600 transition-colors duration-200 shrink-0"
                title="Remove Subtopic"
              >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </Button>
            </div>
               <textarea
                id={`syllabus.topics.${unitIndex}.subTopics.deccription`}
                placeholder="Unit Description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm mb-3"
                {...register(`syllabus.topics.${unitIndex}.subTopics.${subtopicIndex}.content` as const)}
              />

          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="secondary"
        onClick={addSubtopicHandler}
        className="mt-3 w-full"
      >
        <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        Add Subtopic
      </Button>
    </>
  );
};