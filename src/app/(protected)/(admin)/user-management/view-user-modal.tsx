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
import { Switch } from "@/components/ui/switch";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ErrorAlert } from "@/components/ui/errorAlert";

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
    is_active: user.is_active,
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

      if (!response.ok) throw new Error("Update failed");

      toast.success("User updated successfully");

      onRefreshData?.();
      // Refresh the grid or update local state
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

      if (!response.ok) throw new Error("Delete failed");

      console.log("response", response);

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
          <div className="grid gap-4 py-4">
            {error && (
              <ErrorAlert message={error} onClose={() => setError(null)} />
            )}
            <div>
              <strong>systemID:</strong> {user.id}
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
            <div>
              <strong>Email:</strong> {user.email}
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, is_active: checked }))
                      }
                    />
                    <span>{formData.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </>
              ) : (
                <div>
                  <strong>Status:</strong>{" "}
                  {user.is_active ? "Active" : "Inactive"}
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
                  {"Save"}
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
