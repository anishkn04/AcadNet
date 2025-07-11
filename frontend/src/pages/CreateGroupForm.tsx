import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GroupDetailsSection from "@/components/own_components/GroupDetailsSection";
import SyllabusSection from "@/components/own_components/SyllabusSection";
import AdditionalResourcesSection from "@/components/own_components/AdditionalResourcesSection";
import { FormProvider, useForm } from "react-hook-form";
import type { CreateGroupInterface } from "@/models/User";
import { useNavigate } from "react-router-dom";
import { useData } from "@/hooks/userInfoContext";
import { toast } from "react-toastify";

const CreateGroupForm: React.FC = () => {
  const methods = useForm<CreateGroupInterface>();
  const navigate = useNavigate();
  const { createGroup } = useData();

  // Local validation before submit
  const validateSyllabus = (data: CreateGroupInterface): string | null => {
    if (!data.syllabus || !Array.isArray(data.syllabus.topics) || data.syllabus.topics.length === 0) {
      return "At least one topic is required in the syllabus.";
    }
    for (const topic of data.syllabus.topics) {
      if (!topic.title || topic.title.trim() === "") {                        
        return "Each topic must have a title.";
      }
      if (!Array.isArray(topic.subTopics) || topic.subTopics.length === 0) {
        return `Topic "${topic.title}" must contain at least one subtopic.`;
      }
      for (const sub of topic.subTopics) {
        if (!sub.title || sub.title.trim() === "") {
          return "Each subtopic must have a title.";
        }
      }
    }
    return null;
  };

  const handleData = async (data: CreateGroupInterface) => {
    // Local validation
    const errorMsg = validateSyllabus(data);
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    try {
      const result = await createGroup(data);
      console.log(data)
      if (result === true) {
        toast.success("Study group created successfully!");
        navigate('/join', { replace: true });
      } else {
        // If createGroup returns false, show a generic error
        toast.error("Failed to create group. Please check your input.");
      }
    } catch (err:any) {
      // Handle backend error response according to API documentation
      if (err?.response?.data) {
        const { statusCode, message } = err.response.data;
        // Show specific error messages from backend
        if (statusCode === 400) {
          toast.error(message || "Validation error. Please check your input.");
        } else if (statusCode === 404) {
          toast.error(message || "Creator user not found.");
        } else if (statusCode === 500) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(message || "An unexpected error occurred.");
        }
      } else if (err?.message) {
        console.log(err.message)
        toast.error(err.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleCancel = () => {
    methods.reset();
    navigate('/join', { replace: true });
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
            <form onSubmit={methods.handleSubmit(handleData)} className="space-y-6">
              <GroupDetailsSection />
              <SyllabusSection />
              <AdditionalResourcesSection
                topics={methods.watch('syllabus.topics') || []}
                setValue={methods.setValue}
                getValues={methods.getValues}
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  {...methods.register('isPrivate')}
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="isPrivate"
                  className="text-gray-700/80 select-none cursor-pointer"
                >
                  Do you want to make this Group Private?
                </label>
              </div>
              <div className="mt-8 flex justify-between space-x-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleCancel()}
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
