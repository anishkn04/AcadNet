import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GroupDetailsSection from "@/components/own_components/GroupDetailsSection";
import SyllabusSection from "@/components/own_components/SyllabusSection";
import AdditionalResourcesSection from "@/components/own_components/AdditionalResourcesSection";
import { FormProvider,useForm } from "react-hook-form";
interface Subtopic {
  id: string;
  name: string;
}

interface SyllabusUnit {
  id: string;
  unitNumber: string;
  title: string;
  subtopics: Subtopic[];
}

const CreateGroupForm: React.FC = () => {
  const methods = useForm()

 

  const pdfInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const triggerPdfUpload = () => pdfInputRef.current?.click();
  const triggerVideoUpload = () => videoInputRef.current?.click();
  const triggerImageUpload = () => imageInputRef.current?.click();

  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("PDF file selected:", e.target.files[0].name);
      e.target.value = "";
    }
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("Video file selected:", e.target.files[0].name);
      e.target.value = "";
    }
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log("Image file selected:", e.target.files[0].name);
      e.target.value = "";
    }
  };












  const handleData = () => {
    console.log("Form submitted! Check console for data.");
  };

  const handleCancel = () => {
    console.log("Form submission cancelled.");
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center w-full justify-center p-4 font-sans ">
      <FormProvider {...methods}>
        <Card className="w-full max-w-4xl border-none shadow-none bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold tracking-tight">
              Create Study Group
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={methods.handleSubmit(()=>handleData)} className="space-y-6">
              <GroupDetailsSection  />
              <SyllabusSection />
              <AdditionalResourcesSection
                triggerPdfUpload={triggerPdfUpload}
                triggerVideoUpload={triggerVideoUpload}
                triggerImageUpload={triggerImageUpload}
                pdfInputRef={pdfInputRef}
                videoInputRef={videoInputRef}
                imageInputRef={imageInputRef}
                handlePdfFileSelect={handlePdfFileSelect}
                handleVideoFileSelect={handleVideoFileSelect}
                handleImageFileSelect={handleImageFileSelect}
              />
              <div className="mt-8 flex justify-between space-x-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Create Study Group
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </FormProvider>
    </div>
  );
};

export default CreateGroupForm;
