
import React from "react";



interface AdditionalResourcesProps {
  triggerPdfUpload: () => void;
  triggerVideoUpload: () => void;
  triggerImageUpload: () => void;
  pdfInputRef: React.RefObject<HTMLInputElement | null>;
  videoInputRef: React.RefObject<HTMLInputElement | null>;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
  handlePdfFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AdditionalResourcesSection: React.FC<AdditionalResourcesProps> = ({
  triggerPdfUpload,
  triggerVideoUpload,
  triggerImageUpload,
  pdfInputRef,
  videoInputRef,
  imageInputRef,
  handlePdfFileSelect,
  handleVideoFileSelect,
  handleImageFileSelect,
}) => {
  return (
    <>
      <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-3">
        Additional Resources
      </h3>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        Upload initial PDF documents, videos, or images relevant to your study
        group.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label className="text-base font-medium text-gray-700 mb-2">
            PDF Documents
          </label>
          <button
            type="button"
            onClick={triggerPdfUpload}
            className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 w-full"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              ></path>
            </svg>
            Upload PDF
          </button>
          <input
            type="file"
            accept=".pdf"
            ref={pdfInputRef}
            className="hidden"
            title="Upload PDF Document"
            placeholder="Select PDF file"
          />
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label className="text-base font-medium text-gray-700 mb-2">
            Videos
          </label>
          <button
            type="button"
            onClick={triggerVideoUpload}
            className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 w-full"
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-5 3v1a3 3 0 003 3h4a3 3 0 003-3v-1M5 13l-4 4-4-4"
              ></path>
            </svg>
            Upload Video
          </button>
          <input
            type="file"
            accept="video/*"
            ref={videoInputRef}
            onChange={handleVideoFileSelect}
            className="hidden"
            title="Upload Video File"
            placeholder="Select video file"
          />
        </div>
        <div className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <label className="text-base font-medium text-gray-700 mb-2">
            Images
          </label>
          <button
            type="button"
            onClick={triggerImageUpload}
            className="flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 w-full"
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L20 16m-2-6a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            Upload Image
          </button>
          <input
            type="file"
            accept="image/*"
            ref={imageInputRef}
            onChange={handleImageFileSelect}
            className="hidden"
            title="Upload Image File"
            placeholder="Select image file"
          />
        </div>
      </div>
    </>
  );
};

export default AdditionalResourcesSection;
