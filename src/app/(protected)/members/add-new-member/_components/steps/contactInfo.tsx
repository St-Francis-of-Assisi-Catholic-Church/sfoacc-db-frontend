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

export interface IContactInfo {
  mobileNumber?: string;
  whatsAppNumber?: string;
  emaillAddress?: string;
}

// Define the Zod schema for validation
const contactInfoSchema = z.object({
  mobileNumber: z.string().min(1, "Mobile number is required").optional(),
  whatsAppNumber: z.string().optional(),
  emaillAddress: z.string().email().optional(),
});

// Define the type from the schema
type ContactInfoFormValues = z.infer<typeof contactInfoSchema>;

interface ContactInfoStepProps {
  data: IContactInfo;
  onSubmit: (data: IContactInfo) => void;
  onBack: () => void;
  onSkip: () => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({
  data,
  onSubmit,
  onBack,
  onSkip,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      mobileNumber: data.mobileNumber || "",
      whatsAppNumber: data.whatsAppNumber || "",
      emaillAddress: data.emaillAddress || "",
    },
  });

  // Handle form submission
  const handleSubmit = async (values: ContactInfoFormValues) => {
    setIsSubmitting(true);

    try {
      // Format the data with proper handling of optional fields
      const formattedData: IContactInfo = {
        mobileNumber: values.mobileNumber,
        emaillAddress: values.emaillAddress,
        whatsAppNumber: values.whatsAppNumber?.trim() || undefined,
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
        <div className="flex-1 overflow-y-auto space-y-5 pr-2">
          <FormField
            control={form.control}
            name="mobileNumber"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsAppNumber"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>WhatsApp Number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
                <p className="text-xs text-gray-500">
                  Leave empty if same as mobile number
                </p>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emaillAddress"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
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

export default ContactInfoStep;
