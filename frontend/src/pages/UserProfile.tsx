import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfileData } from "@/models/User";
import { useForm, type FieldErrors } from "react-hook-form";
import { formSections } from "@/data/UserFormSection";
import { useLocation } from "react-router-dom";
import { useData } from "@/hooks/userInfoContext";


const getError = (errors: FieldErrors, path: string) => {
  const pathArray = path.split(".");
  let current: any = errors;
  for (const key of pathArray) {
    if (current && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  return current;
};

const UserProfile = () => {
  const {getInfo} = useData()
  const location = useLocation()
  const [userData, setUserData] = useState<{message:UserProfileData}>();

  const getData = async () =>{
    const data = await getInfo();
    if (data){
      setUserData({message:data})
      console.log(userData)
    }
  }

  useEffect(() => {
    if (location.pathname === '/user'){
      getData()
    }
  },[location]) 
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserProfileData>({
    defaultValues: {
        email:"hello",
        fullName:"",
        isBanned:false,
        isVerified:false,
        lastOtp:"",
        password:"",
        role:"",
        updatedAt:"",
        username:""
      },

  });
  
  const onSubmit = async (data: UserProfileData) => {

    try {
      // TODO: Replace with actual API endpoint when backend is ready
      console.log("User Profile Data:", { user_profile: data });
      alert("Profile data logged to console. API integration pending.");
    } catch (error) {
      console.error("Error saving profile:", error);
      // Handle error
    }
  };
  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        User Profile
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {formSections.map((section) => (
          <Card
            key={section.title}
            className="w-full bg-transparent shadow-none border rounded-lg border-gray-200 dark:border-gray-700"
          >
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {section.fields.map((field) => {
                const error = getError(errors, field.name);
                return (
                  <div
                    key={field.name}
                    className={`space-y-2 ${field.className || ""}`}
                  >
                    <Label
                      htmlFor={field.name}
                      className="text-gray-700 dark:text-gray-300 font-medium"
                    >
                      {field.label}
                    </Label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        {...register(field.name as any, {
                          required: field.requiredMessage,
                        })}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-vertical bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={field.name}
                        title={`Select your ${field.label.toLowerCase()}`}
                        {...register(field.name as any, {
                          required: field.requiredMessage,
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="">Select {field.label}</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={field.name}
                        type={field.type}
                        {...register(field.name as any, {
                          required: field.requiredMessage,
                          ...(field.type === "number" && {
                            valueAsNumber: true,
                          }),
                        })}
                        className="bg-gray-50 border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    )}
                    {error && (
                      <p className="text-red-500 text-sm">
                        {(error as any).message}
                      </p>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="px-10 py-3 text-lg font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
          >
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
