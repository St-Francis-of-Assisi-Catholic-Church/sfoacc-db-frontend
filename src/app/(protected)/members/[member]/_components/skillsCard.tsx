import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BaseModal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, X } from "lucide-react";

export function SkillsCard() {
  const [skills, setSkills] = useState<string[]>([
    "Teaching",
    "Public Speaking",
    "Choir",
    "Piano",
    "Youth Mentoring",
    "Event Planning",
    "Bible Study",
    "Counseling",
  ]);

  const handleUpdateSkills = (newSkills: string[]) => {
    setSkills(newSkills);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between">
        <CardTitle>Skills</CardTitle>
        <UpdateSkillsModal
          currentSkills={skills}
          onUpdate={handleUpdateSkills}
        />
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm
              bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface UpdateSkillsModalProps {
  currentSkills: string[];
  onUpdate: (skills: string[]) => void;
}

function UpdateSkillsModal({
  currentSkills,
  onUpdate,
}: UpdateSkillsModalProps) {
  const [localSkills, setLocalSkills] = useState<string[]>(currentSkills);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill();
    }
  };

  const addSkill = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !localSkills.includes(trimmedValue)) {
      setLocalSkills([...localSkills, trimmedValue]);
      setInputValue("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setLocalSkills(localSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // TODO: Add API call here
      // const response = await fetch('/api/member/skills', {
      //   method: 'PUT',
      //   body: JSON.stringify({ skills: localSkills })
      // });

      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onUpdate(localSkills);
    } catch (error) {
      console.error("Failed to save skills:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setLocalSkills(currentSkills);
    setInputValue("");
  };

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
      isCtaDisabled={isLoading}
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
            {localSkills.map((skill) => (
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
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>

          {localSkills.length === 0 && (
            <p className="text-sm text-muted-foreground text-center">
              No skills added yet. Start typing to add skills.
            </p>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
