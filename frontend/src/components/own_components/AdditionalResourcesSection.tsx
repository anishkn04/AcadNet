import React, { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "../ui/button";
import type { CreateGroupInterface, Resource, topics } from "@/models/User";

interface AdditionalResourcesSectionProps {
  topics: topics[];
  setValue?: any;
  getValues?: any;
}

const AdditionalResourcesSection: React.FC<AdditionalResourcesSectionProps> = ({ topics }) => {
  const { setValue, watch, getValues } = useFormContext<CreateGroupInterface>();
  const currentResources = watch('additionalResources');

  // Helper: Build dropdown options
const buildOptions = () => {
  const options = [
    {
      value: JSON.stringify({ topic: null, subtopic: null }),
      label: 'General (All Topics)',
    },
  ];

  topics.forEach((topic) => {
    options.push({
      value: JSON.stringify({ topic: topic.id, subtopic: null }),
      label: `Topic: ${topic.title}`,
    });

    topic.subTopics?.forEach((sub) => {
      options.push({
        value: JSON.stringify({ topic: topic.id, subtopic: sub.id }),
        label: `↳ Subtopic: ${sub.title}`,
      });
    });
  });

  return options;
};
const handleFileUpload = useCallback(
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const existingResources = getValues('additionalResources') || [];
      const newResource: Resource = {
        filePath: URL.createObjectURL(file),
        file,
        linkedTo: {
          topic: null,
          subtopic: null
        },
      };
      setValue(
        'additionalResources',
        [...existingResources, newResource],
        { shouldDirty: true, shouldValidate: true }
      );
      e.target.value = '';
    }
  },
  [setValue, getValues]
);


  const removeResource = useCallback((indexToRemove: number) => {
    const existingResources = getValues('additionalResources') || [];
    if (existingResources[indexToRemove]?.filePath?.startsWith('blob:')) {
      URL.revokeObjectURL(existingResources[indexToRemove].filePath);
    }
    const updatedResources = existingResources.filter((_, index) => index !== indexToRemove);
    setValue('additionalResources', updatedResources, { shouldDirty: true, shouldValidate: true });
  }, [setValue, getValues]);

  // Handle dropdown change
const handleLinkedToChange = (index: number, value: string) => {
  const parsed = JSON.parse(value);
  const resources = getValues('additionalResources') || [];

  resources[index].linkedTo = {
    topic: parsed.topic !== null ? parsed.topic : null,
    subtopic: parsed.subtopic !== null ? parsed.subtopic : null,
  };

  setValue('additionalResources', [...resources], { shouldDirty: true, shouldValidate: true });
};


  const options = buildOptions();

  return (
    <>
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
        Additional Resources
      </h3>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        Upload initial PDF documents, videos, or images relevant to your study
        group, or provide useful links.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label htmlFor="pdf-upload" className="text-base font-medium text-gray-700 mb-2">
            PDF Documents
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept=".pdf"
            className="hidden"
            title="Upload PDF Document"
            onChange={(e) => handleFileUpload(e)}
          />
          <button
            type="button"
            onClick={() => document.getElementById('pdf-upload')?.click()}
            className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 w-full"
          >
            Upload PDF
          </button>
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label htmlFor="video-upload" className="text-base font-medium text-gray-700 mb-2">
            Videos
          </label>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            className="hidden"
            title="Upload Video File"
            onChange={(e) => handleFileUpload(e)}
          />
          <button
            type="button"
            onClick={() => document.getElementById('video-upload')?.click()}
            className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 w-full"
          >
            Upload Video
          </button>
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label htmlFor="image-upload" className="text-base font-medium text-gray-700 mb-2">
            Images
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            title="Upload Image File"
            onChange={(e) => handleFileUpload(e)}
          />
          <button
            type="button"
            onClick={() => document.getElementById('image-upload')?.click()}
            className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 w-full"
          >
            Upload Image
          </button>
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label htmlFor="other-upload" className="text-base font-medium text-gray-700 mb-2">
            Other Files
          </label>
          <input
            id="other-upload"
            type="file"
            className="hidden"
            title="Upload other resources"
            onChange={(e) => handleFileUpload(e)}
          />
          <button
            type="button"
            onClick={() => document.getElementById('other-upload')?.click()}
            className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 w-full"
          >
            Upload Other Files
          </button>
        </div>
      </div>
      {currentResources && currentResources.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Current Resources:</h4>
          <ul className="space-y-2">
            {currentResources.map((res, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md gap-2">
                <span className="text-sm text-gray-700 flex-1">
                  <span className="font-medium capitalize">file</span>: {res.filePath ? (
                    <a href={res.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                      {res.filePath.length > 50 ? res.filePath.substring(0, 47) + '...' : res.filePath}
                    </a>
                  ) : 'File selected (pending upload)'}
                </span>
           <select
              className="ml-2 rounded border px-2 py-1 text-sm"
              value={JSON.stringify(res.linkedTo || { topic: null, subtopic: null })}
              onChange={e => handleLinkedToChange(index, e.target.value)}
            >
              {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeResource(index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AdditionalResourcesSection;