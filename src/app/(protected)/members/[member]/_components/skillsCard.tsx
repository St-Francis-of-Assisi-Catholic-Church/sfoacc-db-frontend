import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, X } from "lucide-react";
import {
  IDetailedParishioner,
  IParSkill,
} from "../../_components/member-columns";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface Props {
  parishioner: IDetailedParishioner;
  refetch: () => void;
}

export function SkillsCard({ parishioner, refetch }: Props) {
  const [skills, setSkills] = useState<IParSkill[]>(parishioner.skills || []);

  useEffect(() => {
    setSkills(parishioner.skills || []);
  }, [parishioner]);

  const handleUpdateSkills = (newSkills: IParSkill[]) => {
    setSkills(newSkills);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Skills</CardTitle>
        <UpdateSkillsModal
          currentSkills={skills}
          onUpdate={handleUpdateSkills}
          parishionerId={parishioner.id}
          refetch={refetch}
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm
                bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {skill.name}
              </span>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No skills added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface UpdateSkillsModalProps {
  currentSkills: IParSkill[];
  onUpdate: (skills: IParSkill[]) => void;
  parishionerId: number;
  refetch: () => void;
}

function UpdateSkillsModal({
  currentSkills,
  onUpdate,
  parishionerId,
  refetch,
}: UpdateSkillsModalProps) {
  // Extract just the skill names for easier manipulation in the UI
  const initialSkillNames = currentSkills.map((skill) => skill.name);
  const [localSkillNames, setLocalSkillNames] =
    useState<string[]>(initialSkillNames);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !localSkillNames.includes(trimmedValue)) {
      setLocalSkillNames([...localSkillNames, trimmedValue]);
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setLocalSkillNames(
      localSkillNames.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Get access token from next-auth session
      const accessToken = session?.accessToken;

      // Format skills for API - array of objects with name property
      const skillsPayload = localSkillNames.map((name) => ({ name }));

      // API call to update skills using the endpoint provided
      const response = await fetch(
        `/api/v1/parishioners/${parishionerId}/skills/batch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(skillsPayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update skills");
      }

      // Get the updated skills from the response
      const updatedSkills = await response.json();

      // Success message
      toast.success("Skills updated successfully");

      // Update local state with the response from server
      onUpdate(updatedSkills.data);

      // Refresh the parent component
      refetch();
    } catch (error) {
      console.error("Failed to save skills:", error);
      toast.error("Failed to update skills");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalSkillNames(initialSkillNames);
    setInputValue("");
  };

  // Check if there are any changes
  const hasChanges =
    JSON.stringify(initialSkillNames.sort()) !==
    JSON.stringify(localSkillNames.sort());

  return (
    <BaseModal
      title="Update Skills"
      buttonComponent={
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      }
      ctaOnClicked={handleSave}
      ctaTitle="Save"
      isCtaDisabled={isLoading || !hasChanges}
      isLoading={isLoading}
      cancelOnClicked={handleCancel}
      onCloseModal={handleCancel}
    >
      <div className="px-6 py-4 overflow-auto h-[40vh]">
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Input
              placeholder="Type a skill and press Enter"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={addSkill}
              className="w-full"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Press Enter or comma to add a skill
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {localSkillNames.map((skill) => (
              <span
                key={skill}
                className="group inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm
                bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isLoading}
                  aria-label={`Remove ${skill}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {localSkillNames.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No skills added yet. Start typing to add skills.
            </p>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
