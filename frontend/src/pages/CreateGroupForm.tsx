import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GroupDetailsSection from "@/components/own_components/GroupDetailsSection";
import SyllabusSection from "@/components/own_components/SyllabusSection";
import AdditionalResourcesSection from "@/components/own_components/AdditionalResourcesSection";
import { FormProvider,useForm } from "react-hook-form";
import type { CreateGroupInterface } from "@/models/User";
import {  useNavigate } from "react-router-dom";
import { useData } from "@/hooks/userInfoContext";
const CreateGroupForm: React.FC = () => {
   const methods = useForm<CreateGroupInterface>()
   const navigate = useNavigate()
   const {createGroup} = useData()
   const handleData = async (data: CreateGroupInterface) => {
      console.log("Form submission triggered!");
        try{
          await createGroup(data)
        }catch{
          console.log('not entered')
        }
      
    };

    const handleCancel = () =>{
      methods.reset()
      navigate('/join',{replace:true})
    }
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
              <GroupDetailsSection  />
              <SyllabusSection />
              <AdditionalResourcesSection />
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
                  onClick={()=>handleCancel()}
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
