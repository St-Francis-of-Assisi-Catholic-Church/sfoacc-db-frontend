"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  // FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { toast } from "sonner";
import { ErrorAlert } from "@/components/ui/errorAlert";
import { useSession } from "next-auth/react";
import { UserRole, UserStatus } from "@/types";
// import { RefreshCw } from "lucide-react";

interface AddUserModalProps {
  onUserAdded: () => void;
}

interface UserFormData {
  email: string;
  full_name: string;
  role?: UserRole;
  status?: UserStatus;
  password?: string;
}

function generateRandomPassword(length: number = 12) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export default function AddUserModal({ onUserAdded }: AddUserModalProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);

  const { data: session } = useSession();

  const form = useForm<UserFormData>({
    defaultValues: {
      full_name: "",
      email: "",
      role: "user",
      status: "reset_required",
      password: generateRandomPassword(),
    },
  });

  // const regeneratePassword = () => {
  //   form.setValue("password", generateRandomPassword());
  // };

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      const validationErrors = form.formState.errors;
      if (Object.keys(validationErrors).length > 0) {
        const firstError = Object.values(validationErrors)[0];
        setError(firstError.message || "Please check the form for errors");
        return;
      }

      // Prepare the request payload
      const requestData = {
        email: data.email,
        full_name: data.full_name,
        role: data.role || "user",
        status: data.status || "reset_required",
        // password: data.password || generateRandomPassword(),
      };

      const response = await fetch(`/api/v1/user-management/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.message || responseData.detail || "Failed to add user"
        );
      }

      onUserAdded();
      setOpen(false);
      form.reset();
      toast.success("User added successfully");
    } catch (err) {
      console.error("Error adding user:", err);
      const error = err as Error;
      const errorMessage = error.message || "Failed to add user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[22rem] md:max-w-lg p-4 rounded-md">
        <DialogHeader>
          <DialogTitle className="text-left">Add User</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <ErrorAlert message={error} onClose={() => setError(null)} />
            )}

            <FormField
              control={form.control}
              name="full_name"
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role (Optional)</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FormDescription>
                    Defaults to User if not selected
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temporary Password (Optional)</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        placeholder="Auto-generated if empty"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={regeneratePassword}
                      className="h-8"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <FormDescription>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs text-muted-foreground hover:text-primary"
                    >
                      {showPassword ? "Hide" : "Show"} password
                    </button>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add User"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
