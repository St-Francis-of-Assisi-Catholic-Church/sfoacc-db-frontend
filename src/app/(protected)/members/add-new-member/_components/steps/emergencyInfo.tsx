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

export interface IEmergencyInfo {
  name: string;
  relationship: string;
  primaryPhone: string;
  alternativePhone?: string;
}

// Define the Zod schema for validation
const EmergencyInfoSchema = z.object({
  name: z.string().min(1, "Mobile number is required"),
  relationship: z.string(),
  primaryPhone: z.string().email(),
  alternativePhone: z.string().optional(),
});

// Define the type from the schema
type EmergencyInfoFormValues = z.infer<typeof EmergencyInfoSchema>;

interface EmergencyInfoStepProps {
  data: IEmergencyInfo;
  onSubmit: (data: IEmergencyInfo) => void;
  onBack: () => void;
  onSkip: () => void;
}

const EmergencyInfoStep: React.FC<EmergencyInfoStepProps> = ({
  data,
  onSkip,
  onSubmit,
  onBack,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<EmergencyInfoFormValues>({
    resolver: zodResolver(EmergencyInfoSchema),
    defaultValues: {
      name: data.name || "",
      relationship: data.relationship || "",
      primaryPhone: data.primaryPhone || "",
      alternativePhone: data.alternativePhone || "",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: EmergencyInfoFormValues) => {
    setIsSubmitting(true);

    try {
      onSubmit(values);
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
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>
                  {" "}
                  Name
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="relationship"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>
                  Relationship
                  <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  Relationship to member, eg: Mother, sister, etc
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primaryPhone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>
                  Primary Phone Number <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="alternativePhone"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Alternative Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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

export default EmergencyInfoStep;
