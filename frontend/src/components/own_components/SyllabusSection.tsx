// syllabussection.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext, useFieldArray } from "react-hook-form";
import type { CreateGroupInterface, topics, subTopics } from "@/models/User";

const SyllabusSection: React.FC = () => {
  const { control, register } = useFormContext<CreateGroupInterface>();

  const { fields: unitFields, append: appendUnit, remove: removeUnit } = useFieldArray({
    control,
    // CRITICAL FIX: Match the casing from CreateGroupInterface (Syllabus.Topics)
    name: "syllabus.topics",
  });

  const addSyllabusUnitHandler = () => {
    appendUnit({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      subTopics: [], // CRITICAL FIX: Match the casing from topics interface (SubTopics)
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
              key={unit.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="block text-lg font-semibold text-gray-700 mr-2">
                    Unit {unitIndex + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeUnit(unitIndex)}
                  className="text-red-500 hover:text-red-700 text-xs font-semibold transition-colors duration-200 flex items-center"
                >
                  <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  Remove Unit
                </button>
              </div>
              <input
                type="text"
                id={`Syllabus.Topics.${unitIndex}.title`} // Match casing
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 text-base placeholder-gray-400 mb-3"
                placeholder="Unit Title"
                required
                // CRITICAL FIX: Match the casing from CreateGroupInterface
                {...register(`syllabus.topics.${unitIndex}.title` as const, { required: true })}
                // defaultValue removed, let react-hook-form manage it
              />
              <textarea
                id={`Syllabus.Topics.${unitIndex}.description`} // Match casing and correct typo "deccription"
                placeholder="Unit Description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm mb-3"
                // CRITICAL FIX: Match the casing from CreateGroupInterface
                {...register(`syllabus.topics.${unitIndex}.description` as const)}
                // defaultValue removed
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

  const { fields: subtopicFields, append: appendSubtopic, remove: removeSubtopic } = useFieldArray({
    control,
    // CRITICAL FIX: Match the casing (Syllabus.Topics.SubTopics)
    name: `syllabus.topics.${unitIndex}.subTopics` as const,
  });

const addSubtopicHandler = () => {
  appendSubtopic({
    id: crypto.randomUUID(),
    title: "",
    content: "" // Initialize content as well, as it's optional but you use it
  } as subTopics);
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
                // CRITICAL FIX: Match the casing (Syllabus.Topics.SubTopics.title)
                {...register(`syllabus.topics.${unitIndex}.subTopics.${subtopicIndex}.title` as const, { required: true })}
                // defaultValue removed
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeSubtopic(subtopicIndex)}
                className="text-gray-400 hover:text-red-600 transition-colors duration-200 shrink-0"
                title="Remove Subtopic"
              >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </Button>
            </div>
            <textarea
                // CRITICAL FIX: Match the casing (Syllabus.Topics.SubTopics.content)
                id={`Syllabus.Topics.${unitIndex}.SubTopics.${subtopicIndex}.content`} // Corrected ID
                placeholder="Subtopic Content" // Changed placeholder for clarity
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm mb-3"
                // CRITICAL FIX: Match the casing (Syllabus.Topics.SubTopics.content)
                {...register(`syllabus.topics.${unitIndex}.subTopics.${subtopicIndex}.content` as const)}
                // defaultValue removed
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