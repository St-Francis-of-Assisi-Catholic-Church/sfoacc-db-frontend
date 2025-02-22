"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export interface IOccupationInfo {
  role?: string;
  employer?: string;
}

// Define the Zod schema for validation
const occupationInfoSchema = z.object({
  role: z.string().min(1, "role is required").optional(),
  employer: z.string().optional(),
});

// Define the type from the schema
type OccupationInfoFormValues = z.infer<typeof occupationInfoSchema>;

interface OcuptionInfoProps {
  data: IOccupationInfo;
  onSubmit: (data: IOccupationInfo) => void;
  onBack: () => void;
  onSkip: () => void;
}

const OccuptionInfoStep: React.FC<OcuptionInfoProps> = ({
  data,
  onSubmit,
  onBack,
  onSkip,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Initialize form with React Hook Form and Zod validation
  const form = useForm<OccupationInfoFormValues>({
    resolver: zodResolver(occupationInfoSchema),
    defaultValues: {
      role: data.role || "",
      employer: data.employer || "",
    },
  });

  const handleSubmit = async (values: OccupationInfoFormValues) => {
    setIsSubmitting(true);
    const formattedData: IOccupationInfo = {
      role: values.role,
      employer: values.employer,
    };

    onSubmit(formattedData);
    try {
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
        <div className="flex-1 overflow-y-auto space-y-5 pr-2">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel> Role</FormLabel>
                <FormControl>
                  <Input type={"text"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employer"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Employer/Institution</FormLabel>
                <FormControl>
                  <Input type={"text"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Fixed Submit Button */}
        <div className="border-t p-1 mt-4 bg-white sticky bottom-0 flex justify-between">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onSkip}
              size={"default"}
            >
              Skip
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save & Continue"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default OccuptionInfoStep;
