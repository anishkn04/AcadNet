import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GroupDetailsSection from "@/components/own_components/GroupDetailsSection";
import SyllabusSection from "@/components/own_components/SyllabusSection";
import AdditionalResourcesSection from "@/components/own_components/AdditionalResourcesSection";

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
  const [groupName, setGroupName] = useState<string>("");
  const [overview, setOverview] = useState<string>("");
  const [subjectRelated, setSubjectRelated] = useState<string>("");

  const [syllabusUnits, setSyllabusUnits] = useState<SyllabusUnit[]>([]);

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

  const addSyllabusUnit = () => {
    const nextUnitNum =
      syllabusUnits.length > 0
        ? (
            parseInt(
              syllabusUnits[syllabusUnits.length - 1].unitNumber || "0"
            ) + 1
          ).toString()
        : "1";

    setSyllabusUnits([
      ...syllabusUnits,
      {
        id: Date.now().toString(),
        unitNumber: nextUnitNum,
        title: "",
        subtopics: [],
      },
    ]);
  };

  const updateUnitTitle = (id: string, title: string) => {
    setSyllabusUnits(
      syllabusUnits.map((unit) => (unit.id === id ? { ...unit, title } : unit))
    );
  };

  const addSubtopic = (unitId: string) => {
    setSyllabusUnits(
      syllabusUnits.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              subtopics: [
                ...unit.subtopics,
                { id: Date.now().toString() + Math.random(), name: "" },
              ],
            }
          : unit
      )
    );
  };

  const updateSubtopicName = (
    unitId: string,
    subtopicId: string,
    name: string
  ) => {
    setSyllabusUnits(
      syllabusUnits.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              subtopics: unit.subtopics.map((subtopic) =>
                subtopic.id === subtopicId ? { ...subtopic, name } : subtopic
              ),
            }
          : unit
      )
    );
  };

  const removeSyllabusUnit = (id: string) => {
    setSyllabusUnits(syllabusUnits.filter((unit) => unit.id !== id));
  };

  const removeSubtopic = (unitId: string, subtopicId: string) => {
    setSyllabusUnits(
      syllabusUnits.map((unit) =>
        unit.id === unitId
          ? {
              ...unit,
              subtopics: unit.subtopics.filter(
                (subtopic) => subtopic.id !== subtopicId
              ),
            }
          : unit
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      groupName,
      overview,
      subjectRelated,
      syllabusUnits,
    });
    console.log("Form submitted! Check console for data.");
  };

  const handleCancel = () => {
    console.log("Form submission cancelled.");
    setGroupName("");
    setOverview("");
    setSubjectRelated("");
    setSyllabusUnits([]);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center w-full justify-center p-4 font-sans">
      <Card className="w-full max-w-4xl border-none shadow-none bg-gray-50">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            Create Study Group
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <GroupDetailsSection
              groupName={groupName}
              setGroupName={setGroupName}
              subjectRelated={subjectRelated}
              setSubjectRelated={setSubjectRelated}
              overview={overview}
              setOverview={setOverview}
            />
            <SyllabusSection
              syllabusUnits={syllabusUnits}
              addSyllabusUnit={addSyllabusUnit}
              removeSyllabusUnit={removeSyllabusUnit}
              updateUnitTitle={updateUnitTitle}
              addSubtopic={addSubtopic}
              removeSubtopic={removeSubtopic}
              updateSubtopicName={updateSubtopicName}
            />
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
    </div>
  );
};

export default CreateGroupForm;
