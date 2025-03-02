"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Define the interface with optional fields properly typed
export interface IPersonalInfo {
  id?: string; // Will be filled after step 1 submission
  firstName: string;
  otherNames?: string;
  lastName: string;
  maidenName?: string;
  gender?: string;
  dateOfBirth: string;
  placeOfBirth?: string;
  hometown?: string;
  region?: string;
  country?: string;
  maritalStatus?: string;
}

// Define the Zod schema for validation
const personalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  otherNames: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  maidenName: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  placeOfBirth: z.string().optional(),
  hometown: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  maritalStatus: z.string().optional(),
});

// Define the type from the schema
type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
  data: IPersonalInfo;
  onSubmit: (data: IPersonalInfo) => void;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: data.firstName || "",
      otherNames: data.otherNames || "",
      lastName: data.lastName || "",
      maidenName: data.maidenName || "",
      gender: data.gender || "",
      dateOfBirth: data.dateOfBirth || "",
      placeOfBirth: data.placeOfBirth || "",
      hometown: data.hometown || "",
      region: data.region || "",
      country: data.country || "",
      maritalStatus: data.maritalStatus || "",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: PersonalInfoFormValues) => {
    setIsSubmitting(true);

    try {
      // Convert empty strings to undefined for optional fields
      const formattedData: IPersonalInfo = {
        id: data.id,
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth,
        country: values.country,
        // Optional fields - convert empty strings to undefined
        otherNames: values.otherNames?.trim() || undefined,
        maidenName: values.maidenName?.trim() || undefined,
        gender: values.gender || undefined,
        placeOfBirth: values.placeOfBirth?.trim() || undefined,
        hometown: values.hometown?.trim() || undefined,
        region: values.region?.trim() || undefined,
        maritalStatus: values.maritalStatus || undefined,
      };

      onSubmit(formattedData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className=" h-full flex flex-col overflow-hidden"
      >
        <div className="flex-1 overflow-y-auto  pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>
                    First Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="otherNames"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Other Names</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>
                    Last Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maidenName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Maiden Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Gender</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>
                    Date of Birth <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="placeOfBirth"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Place of Birth</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hometown"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Hometown</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="border-t mt-4 p-1 bg-white sticky bottom-0 flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInfoStep;
