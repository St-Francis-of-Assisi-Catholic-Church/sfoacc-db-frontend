import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { CustomCellRendererProps } from "ag-grid-react";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ErrorAlert } from "@/components/ui/errorAlert";
import { UserStatus } from "@/types";

interface ViewUserModalProps extends CustomCellRendererProps {
  onRefreshData?: () => void;
}

export default function ViewUserModal(props: ViewUserModalProps) {
  const { onRefreshData, ...cellProps } = props;
  const isMobile = useMediaQuery("(min-width: 768px)");
  const user = cellProps.data;
  const { data: session } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    role: user.role,
    status: user.status,
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/v1/user-management/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      console.log("response", response);
      const data = await response.json();
      if (!response.ok) {
        // get proper error message from api
        const errorMessage =
          data.message || data.detail || "Failed to update user";
        throw new Error(errorMessage);
      }

      if (!response.ok) throw new Error("Update failed");

      toast.success("User updated successfully");

      onRefreshData?.();
      if (props.api) {
        props.api.refreshCells({ rowNodes: [props.node] });
      }
      setIsEditing(false);
    } catch (err) {
      const error = err as Error;
      const errorMessage = error.message || "Failed to update user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/v1/user-management/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      console.log("response", response);
      const data = await response.json();
      if (!response.ok) {
        // get proper error message from api
        const errorMessage =
          data.message || data.detail || "Failed to delete user";
        throw new Error(errorMessage);
      }

      toast.success("User deleted successfully");
      onRefreshData?.();
    } catch (err) {
      const error = err as Error;
      const errorMessage = error.message || "Failed to delete user";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeStyles = (status: UserStatus) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      disabled: "bg-red-100 text-red-800",
      reset_required: "bg-yellow-100 text-yellow-800",
    };
    return `inline-block px-2 py-1 rounded text-sm ${styles[status]}`;
  };

  const getStatusLabel = (status: UserStatus) => {
    const labels = {
      active: "Active",
      disabled: "Disabled",
      reset_required: "Reset Required",
    };
    return labels[status];
  };

  return (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild className="w-full">
          <Button variant="outline" size="sm" className="mt-1">
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[22rem] md:max-w-lg p-4 rounded-md">
          <DialogHeader>
            <DialogTitle className="text-left">User Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            {error && (
              <ErrorAlert message={error} onClose={() => setError(null)} />
            )}
            <div>
              <strong>systemID:</strong> {user.id}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>
            <div className="space-y-2">
              {isEditing ? (
                <>
                  <Label>Name</Label>
                  <Input
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        full_name: e.target.value,
                      }))
                    }
                  />
                </>
              ) : (
                <div>
                  <strong>Name:</strong> {user.full_name}
                </div>
              )}
            </div>

            <div className="space-y-2">
              {isEditing ? (
                <>
                  <Label>Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, role: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <div>
                  <strong>Role:</strong> {user.role}
                </div>
              )}
            </div>
            <div className="space-y-2">
              {isEditing ? (
                <>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: UserStatus) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="disabled">Disabled</SelectItem>
                      <SelectItem value="reset_required">
                        Reset Required
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </>
              ) : (
                <div>
                  <strong>Status:</strong>{" "}
                  <span className={getStatusBadgeStyles(user.status)}>
                    {getStatusLabel(user.status)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <strong>Created:</strong>{" "}
              {new Date(user.created_at).toLocaleString()}
            </div>
            <div>
              <strong>Last Updated:</strong>{" "}
              {new Date(user.updated_at).toLocaleString()}
            </div>
          </div>
          <div className="flex justify-between border-t pt-2">
            <Button
              variant="destructive"
              onClick={handleDelete}
              isLoading={!isEditing && isLoading}
            >
              {isMobile ? "Delete" : ""}
              <Trash2 className="h-4 w-4 md:ml-2" />
            </Button>
            {isEditing ? (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Save
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
