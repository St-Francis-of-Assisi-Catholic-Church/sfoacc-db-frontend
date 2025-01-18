import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SkillsCard() {
  // Simple array of skills
  const skills: string[] = [
    "Teaching",
    "Public Speaking",
    "Choir",
    "Piano",
    "Youth Mentoring",
    "Event Planning",
    "Bible Study",
    "Counseling",
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
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
