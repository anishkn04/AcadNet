import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfileData } from "@/models/User";
import { useForm, type FieldErrors } from "react-hook-form";

const formSections = [
  {
    title: "Personal Information",
    fields: [
      {
        name: "full_name",
        label: "Full Name",
        type: "text",
        placeholder: "Enter your full name",
        requiredMessage: "Full name is required.",
      },
      {
        name: "gender",
        label: "Gender",
        type: "select",
        requiredMessage: "Gender is required.",
        options: ["Male", "Female", "Other"],
      },
      {
        name: "date_of_birth",
        label: "Date of Birth",
        type: "date",
        requiredMessage: "Date of birth is required.",
      },
      {
        name: "bio",
        label: "Bio",
        type: "textarea",
        placeholder: "Tell us about yourself...",
        requiredMessage: "Bio is required.",
        className: "md:col-span-2",
      },
    ],
  },
  {
    title: "Contact Information",
    fields: [
      {
        name: "contact.email",
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
        requiredMessage: "Email is required.",
      },
      {
        name: "contact.phone",
        label: "Phone",
        type: "tel",
        placeholder: "Enter your phone number",
        requiredMessage: "Phone number is required.",
      },
    ],
  },
  {
    title: "Address Information",
    fields: [
      {
        name: "address.province",
        label: "Province",
        type: "text",
        placeholder: "Enter your province",
        requiredMessage: "Province is required.",
      },
      {
        name: "address.district",
        label: "District",
        type: "text",
        placeholder: "Enter your district",
        requiredMessage: "District is required.",
      },
      {
        name: "address.municipality",
        label: "Municipality",
        type: "text",
        placeholder: "Enter your municipality",
        requiredMessage: "Municipality is required.",
      },
      {
        name: "address.ward_no",
        label: "Ward No.",
        type: "number",
        placeholder: "Enter ward number",
        requiredMessage: "Ward number is required.",
      },
    ],
  },
  {
    title: "Academic Details",
    fields: [
      {
        name: "academic_details.level",
        label: "Level",
        type: "select",
        requiredMessage: "Level is required.",
        options: ["School", "Undergraduate", "Graduate"],
      },
      {
        name: "academic_details.field_of_study",
        label: "Field of Study",
        type: "select",
        requiredMessage: "Field of study is required.",
        options: [
          "Computer Science",
          "Software Engineering",
          "Information Technology",
          "Electronics and Communication Engineering",
          "Mechanical Engineering",
          "Civil Engineering",
          "Architecture",
          "Business Administration",
          "Economics",
          "Psychology",
          "Physics",
          "Mathematics",
          "Biotechnology",
          "Medicine",
          "Law",
        ],
      },
      {
        name: "academic_details.university",
        label: "University",
        type: "text",
        placeholder: "Enter your university",
        requiredMessage: "University is required.",
      },
      {
        name: "academic_details.college",
        label: "College",
        type: "text",
        placeholder: "Enter your college",
        requiredMessage: "College is required.",
      },
    ],
  },
];

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserProfileData>({
    defaultValues: {
      full_name: "",
      gender: "",
      date_of_birth: "",
      bio: "",
      contact: { email: "", phone: "" },
      address: { province: "", district: "", municipality: "", ward_no: 0 },
      academic_details: {
        level: "",
        field_of_study: "",
        university: "",
        college: "",
      },
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // This is a mock fetch. In a real app, you'd fetch from an API.
        const existingData: Partial<UserProfileData> = {
          full_name: "Nishan Kumar",
          gender: "Male",
          date_of_birth: "2000-01-25",
          bio: "A passionate developer exploring new technologies.",
          contact: {
            email: "nishan.kumar@example.com",
            phone: "9876543210",
          },
          address: {
            province: "Bagmati",
            district: "Kathmandu",
            municipality: "Kathmandu",
            ward_no: 32,
          },
          academic_details: {
            level: "Undergraduate",
            field_of_study: "Computer Science",
            university: "Tribhuvan University",
            college: "", // User can fill this
          },
        };

        // Reset the form with fetched data
        reset(existingData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, [reset]);

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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
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
                        placeholder={field.placeholder}
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
