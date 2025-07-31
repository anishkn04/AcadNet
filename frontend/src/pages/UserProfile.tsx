import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfileData } from "@/models/User";
import { useForm } from "react-hook-form";
import countryList from "@/data/country.json";
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
                    console.log("user Data: ",data)
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
        <div className="space-y-8">
            {/* Header */}
            <header className="mb-8">
                <div className="flex flex-wrap justify-between items-center gap-3 pb-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-slate-900 text-4xl font-bold leading-tight">Profile</h1>
                        <p className="text-slate-600 text-lg">Manage your personal information and preferences</p>
                    </div>
                    <Button 
                        onClick={changeVisibility}
                        type="button"
                        className={`flex items-center gap-2 ${
                            formVisible 
                                ? "bg-slate-600 hover:bg-slate-700" 
                                : "bg-blue-600 hover:bg-blue-700"
                        } text-white px-6`}
                    >
                        {formVisible ? "Cancel" : "Edit Profile"}
                    </Button>
                </div>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <section>
                    <h3 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight mb-4">Personal Information</h3>
                    <div className="bg-white shadow rounded-xl border border-slate-200 p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username" className="text-slate-600 text-sm font-medium">Username</Label>
                                <Input
                                    id="username"
                                    {...register('username')}
                                    type="text"
                                    defaultValue={userInformation?.username}
                                    disabled
                                    className="bg-slate-50 cursor-not-allowed"
                                />
                                {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullName" className="text-slate-600 text-sm font-medium">Full Name</Label>
                                <Input
                                    id="fullName"
                                    {...register('fullName')}
                                    type="text"
                                    defaultValue={userInformation?.fullName}
                                    disabled={!formVisible}
                                    className={!formVisible ? "bg-slate-50" : ""}
                                />
                                {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age" className="text-slate-600 text-sm font-medium">Age</Label>
                                <Input
                                    id="age"
                                    {...register('age')}
                                    type="text"
                                    defaultValue={userInformation?.age}
                                    disabled={!formVisible}
                                    className={!formVisible ? "bg-slate-50" : ""}
                                />
                                {errors.age && <span className="text-red-500 text-sm">{errors.age.message}</span>}
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <Label htmlFor="nationality">Country</Label>
                                <select
                                    id="nationality"
                                    {...register('nationality')}
                                    defaultValue={userInformation?.nationality || ""}
                                    disabled={!formVisible}
                                    className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!formVisible ? "bg-slate-50 cursor-not-allowed" : ""}`}
                                >
                                    <option value="" disabled>Select Nationality</option>
                                    {countryList.map((country: string) => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                                {errors.nationality && <span className="text-red-500 text-sm">{errors.nationality.message}</span>}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section>
                    <h3 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight mb-4">Contact Information</h3>
                    <div className="bg-white shadow rounded-xl border border-slate-200 p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-600 text-sm font-medium">Email</Label>
                                <Input
                                    id="email"
                                    {...register('email')}
                                    type="text"
                                    defaultValue={userInformation?.email}
                                    disabled
                                    className="bg-slate-50 cursor-not-allowed"
                                />
                                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-slate-600 text-sm font-medium">Phone</Label>
                                <Input
                                    id="phone"
                                    {...register('phone')}
                                    type="text"
                                    defaultValue={userInformation?.phone}
                                    disabled={!formVisible}
                                    maxLength={10}
                                    minLength={10}
                                    pattern="\d{10}"
                                    inputMode="numeric"
                                    autoComplete="tel"
                                    placeholder="Enter 10-digit phone number"
                                    className={!formVisible ? "bg-slate-50" : ""}
                                />
                                {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Address Information */}
                <section>
                    <h3 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight mb-4">Address Information</h3>
                    <div className="bg-white shadow rounded-xl border border-slate-200 p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="address.province" className="text-slate-600 text-sm font-medium">Province</Label>
                                <Input
                                    id="address.province"
                                    {...register('address.province')}
                                    type="text"
                                    defaultValue={userInformation?.address?.province}
                                    disabled={!formVisible}
                                    className={!formVisible ? "bg-slate-50" : ""}
                                />
                                {errors.address?.province && <span className="text-red-500 text-sm">{errors.address.province.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address.municipality" className="text-slate-600 text-sm font-medium">Municipality</Label>
                                <Input
                                    id="address.municipality"
                                    {...register('address.municipality')}
                                    type="text"
                                    defaultValue={userInformation?.address?.municipality}
                                    disabled={!formVisible}
                                    className={!formVisible ? "bg-slate-50" : ""}
                                />
                                {errors.address?.municipality && <span className="text-red-500 text-sm">{errors.address.municipality.message}</span>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="address.district" className="text-slate-600 text-sm font-medium">District</Label>
                                <Input
                                    id="address.district"
                                    {...register('address.district')}
                                    type="text"
                                    defaultValue={userInformation?.address?.district}
                                    disabled={!formVisible}
                                    className={!formVisible ? "bg-slate-50" : ""}
                                />
                                {errors.address?.district && <span className="text-red-500 text-sm">{errors.address.district.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address.wordNo" className="text-slate-600 text-sm font-medium">Postal Code</Label>
                                <Input
                                    id="address.wordNo"
                                    {...register('address.wordNo')}
                                    type="text"
                                    defaultValue={userInformation?.address?.wordNo}
                                    disabled={!formVisible}
                                    className={!formVisible ? "bg-slate-50" : ""}
                                />
                                {errors.address?.wordNo && <span className="text-red-500 text-sm">{errors.address.wordNo.message}</span>}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Education */}
                <section>
                    <h3 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight mb-4">Education</h3>
                    <div className="bg-white shadow rounded-xl border border-slate-200 p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="education.level" className="text-slate-600 text-sm font-medium">Level</Label>
                                <select
                                    id="education.level"
                                    {...register("education.level")}
                                    defaultValue={userInformation?.education?.level || ""}
                                    disabled={!formVisible}
                                    className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!formVisible ? "bg-slate-50 cursor-not-allowed" : ""}`}
                                >
                                    <option value="" disabled>Select the level</option>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Graduate">Graduate</option>
                                </select>
                                {errors.education?.level && <span className="text-red-500 text-sm">{errors.education.level.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="education.FOS" className="text-slate-600 text-sm font-medium">Field of Study</Label>
                                <select
                                    id="education.FOS"
                                    {...register("education.FOS")}
                                    defaultValue={userInformation?.education?.FOS || ""}
                                    disabled={!formVisible}
                                    className={`w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${!formVisible ? "bg-slate-50 cursor-not-allowed" : ""}`}
                                >
                                    <option value="" disabled>Select the Field of study</option>
                                    {FOS_list.options?.map((option) => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>
                                {errors.education?.FOS && <span className="text-red-500 text-sm">{errors.education.FOS.message}</span>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="education.university" className="text-slate-600 text-sm font-medium">University</Label>
                                <Input
                                    id="education.university"
                                    {...register('education.university')}
                                    type="text"
                                    defaultValue={userInformation?.education?.university}
                                    disabled={!formVisible}
                                    className={!formVisible ? "bg-slate-50" : ""}
                                />
                                {errors.education?.university && <span className="text-red-500 text-sm">{errors.education.university.message}</span>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="education.college" className="text-slate-600 text-sm font-medium">College</Label>
                                <Input
                                    id="education.college"
                                    {...register('education.college')}
                                    type="text"
                                    defaultValue={userInformation?.education?.college}
                                    disabled={!formVisible}
                                    className={!formVisible ? "bg-slate-50" : ""}
                                />
                                {errors.education?.college && <span className="text-red-500 text-sm">{errors.education.college.message}</span>}
                            </div>
                        </div>
                    </div>
                </section>

                {formVisible && (
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={changeVisibility}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    );
};

export default UserProfile;