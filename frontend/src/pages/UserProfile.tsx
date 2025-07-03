import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfileData } from "@/models/User";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { useData } from "@/hooks/userInfoContext";

const FOS_list = {
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
        "Others"
    ],
};

const UserProfile = () => {
    const { getInfo, updateProfile } = useData();
    // const location = useLocation();
    const [userInformation, setUserInformation] = useState<UserProfileData>();
    const [formVisible, setFormVisible] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UserProfileData>({
        defaultValues: userInformation || {},
    });

    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const data = await getInfo();
                if (data) {
                    setUserInformation(data);
                    reset(data);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const changeVisibility = () => {
        setFormVisible(!formVisible);
        if (formVisible && userInformation) {
            reset(userInformation);
        }
    };

    const onSubmit = async (data: UserProfileData) => {
        setIsSubmitting(true);
        try {
            await updateProfile(data);
            setFormVisible(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full p-4 md:p-6 text-center text-lg text-gray-700 dark:text-gray-300">
                <div className="flex flex-col space-y-3">
                 <Skeleton className="h-full w-full rounded-xl" />
                 <div className="space-y-2">
                     <Skeleton className="h-4 w-[250px]" />
                     <Skeleton className="h-4 w-[200px]" />
                 </div>
                 </div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 md:p-6 space-y-6  ">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader className="flex justify-between">
                        <CardTitle className="font-bold text-xl">Personal Information</CardTitle>
                        <CardDescription>
                            <Button onClick={changeVisibility} className="bg-green-600 hover:bg-green-600/90 px-4 sm:px-8 cursor-pointer" type="button">
                                {formVisible ? "Cancel" : "Edit"}
                            </Button>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row justify-between gap-2">
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id={'username'}
                                    {...register('username')}
                                    type="text"
                                    defaultValue={userInformation?.username}
                                    disabled
                                    className="select-none cursor-none caret-transparent"
                                />
                                {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id={'fullName'}
                                    {...register('fullName')}
                                    type="text"
                                    defaultValue={userInformation?.fullName}
                                    disabled={!formVisible}
                                />
                                {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
                            </div>
                        </div>
                        <hr className="my-5" />
                        <CardTitle className="font-bold text-xl ">Contact Information</CardTitle>
                        <div className="flex flex-col md:flex-row justify-between gap-2 mt-6">
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id={'email'}
                                    {...register('email')}
                                    type="text"
                                    defaultValue={userInformation?.email}
                                    disabled
                                />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id={'phone'}
                                    {...register('phone')}
                                    type="text"
                                    defaultValue={userInformation?.phone}
                                    disabled={!formVisible}
                                />
                                {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                            </div>
                        </div>
                        <hr className="my-5" />
                        <CardTitle className="font-bold text-xl ">Address Information</CardTitle>
                        <div className="flex flex-col md:flex-row justify-between gap-2 mt-6">
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="address.province">Province</Label>
                                <Input
                                    id={'address.province'}
                                    {...register('address.province')}
                                    type="text"
                                    defaultValue={userInformation?.address?.province}
                                    disabled={!formVisible}
                                />
                                {errors.address?.province && <span className="text-red-500 text-sm">{errors.address.province.message}</span>}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="address.municipality">Municipality</Label>
                                <Input
                                    id={'address.municipality'}
                                    {...register('address.municipality')}
                                    type="text"
                                    defaultValue={userInformation?.address?.municipality}
                                    disabled={!formVisible}
                                />
                                {errors.address?.municipality && <span className="text-red-500 text-sm">{errors.address.municipality.message}</span>}
                            </div>
                        </div>
                        <div className="flex justify-between gap-2 mt-6">
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="address.district">District</Label>
                                <Input
                                    id={'address.district'}
                                    {...register('address.district')}
                                    type="text"
                                    defaultValue={userInformation?.address?.district}
                                    disabled={!formVisible}
                                />
                                {errors.address?.district && <span className="text-red-500 text-sm">{errors.address.district.message}</span>}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="address.wordNo">Postal  Code</Label>
                                <Input
                                    id={'address.wordNo'}
                                    {...register('address.wordNo')}
                                    type="text"
                                    defaultValue={userInformation?.address?.wordNo}
                                    disabled={!formVisible}
                                />
                                {errors.address?.wordNo && <span className="text-red-500 text-sm">{errors.address.wordNo.message}</span>}
                            </div>
                        </div>

                        <hr className="my-5" />
                        <CardTitle className="font-bold text-xl ">Education</CardTitle>
                        <div className="flex justify-between gap-2 mt-6">
                            <div className="w-full ">
                                <Label htmlFor="education.level">Level</Label>
                                <select
                                    className="w-full border-1 mt-2 h-9 rounded-md px-2"
                                    id="education.level"
                                    {...register("education.level")}
                                    defaultValue={userInformation?.education?.level || ""}
                                    disabled={!formVisible}
                                >
                                    <option value="" disabled>Select the level</option>
                                    <option value={'School'}>School</option>
                                    <option value={'Undergraduate'}>Undergraduate</option>
                                    <option value={'Graduate'}>Graduate</option>
                                </select>
                                {errors.education?.level && <span className="text-red-500 text-sm">{errors.education.level.message}</span>}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="education.FOS">Field of Study</Label>
                                <select
                                    className="w-full border-1 h-9 rounded-md px-2"
                                    id="education.FOS"
                                    {...register("education.FOS")}
                                    defaultValue={userInformation?.education?.FOS || ""}
                                    disabled={!formVisible}
                                >
                                    <option value="" disabled>Select the Field of study</option>
                                    {FOS_list.options?.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                {errors.education?.FOS && <span className="text-red-500 text-sm">{errors.education.FOS.message}</span>}
                            </div>
                        </div>
                        <div className="flex justify-between gap-2 mt-6">
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="education.university">University</Label>
                                <Input
                                    id={'education.university'}
                                    {...register('education.university')}
                                    type="text"
                                    defaultValue={userInformation?.education?.university}
                                    disabled={!formVisible}
                                />
                                {errors.education?.university && <span className="text-red-500 text-sm">{errors.education.university.message}</span>}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="education.college">College</Label>
                                <Input
                                    id={'education.college'}
                                    {...register('education.college')}
                                    type="text"
                                    defaultValue={userInformation?.education?.college}
                                    disabled={!formVisible}
                                />
                                {errors.education?.college && <span className="text-red-500 text-sm">{errors.education.college.message}</span>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {formVisible && (
                    <div className="flex justify-end">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-600/90 cursor-pointer" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default UserProfile;