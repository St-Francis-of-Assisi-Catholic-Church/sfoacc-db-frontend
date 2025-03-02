"use client";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PersonalInfoStep, { IPersonalInfo } from "./steps/personalInfo";
import { IContactInfo } from "./steps/contactInfo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store";
import { useMediaQuery } from "@/hooks/use-media-query";

import { saveStateDataHandler } from "./utils";
import { IOccupationInfo } from "./steps/occuptionInfo";
import { IEmergencyInfo } from "./steps/emergencyInfo";
import ReviewStep from "./steps/review";

function AddNewMemberView() {
  const { collapsed } = useSidebar();
  const isMobile = useMediaQuery("(min-width: 768px)");
  // Track current step
  const [currentStep, setCurrentStep] = useState(1);

  // Track completed steps
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Refs for scrolling
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Separate state for each data section
  const [personalInfo, setPersonalInfo] = useState<IPersonalInfo>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    country: "",
  });

  const [contactInfo] = useState<IContactInfo>({
    mobileNumber: "",
    emaillAddress: "",
  });

  const [occupationInfo] = useState<IOccupationInfo>({
    role: "",
    employer: "",
  });

  const [emergencyInfo] = useState<IEmergencyInfo>({
    name: "",
    relationship: "",
    primaryPhone: "",
    alternativePhone: "",
  });

  // Step definitions
  const steps = [
    { id: 1, label: "Personal Information", required: true },
    { id: 2, label: "Contact Information", required: false },
    { id: 3, label: "Occupation", required: false },
    { id: 4, label: "Family Background", required: false },
    { id: 5, label: "Emergency Contacts", required: false },
    { id: 6, label: "Medical Condition", required: false },
    { id: 7, label: "Sacrements", required: false },
    { id: 8, label: "Societal Memberships", required: false },
    { id: 9, label: "Skills", required: false },
    { id: 10, label: "Review & Submit", required: false },
  ];

  // Check if a step can be navigated to
  const canNavigateToStep = (stepId: number): boolean => {
    if (stepId === 1) return true;
    if (!personalInfo.dateOfBirth) return false;
    return true;
  };

  // Go to a specific step
  const goToStep = (stepId: number) => {
    if (!canNavigateToStep(stepId)) {
      toast.info("You must submit Personal Information before proceeding.");
      return;
    }
    setCurrentStep(stepId);
  };

  //
  const goBack = () => {
    if (currentStep === 1) return;
    setCurrentStep((currentStep) => currentStep - 1);
  };

  const skip = () => {
    if (currentStep === 10) return;
    setCurrentStep((currentStep) => currentStep + 1);
  };

  // Handle step completion
  // const completeStep = (stepId: number) => {
  //   if (!completedSteps.includes(stepId)) {
  //     setCompletedSteps([...completedSteps, stepId]);
  //   }
  // };

  // Effect to scroll the current step into view whenever it changes
  useEffect(() => {
    if (scrollContainerRef.current && stepRefs.current[currentStep - 1]) {
      const container = scrollContainerRef.current;
      const activeStep = stepRefs.current[currentStep - 1];

      if (activeStep) {
        // Calculate the scroll position to center the step button
        const containerWidth = container.clientWidth;
        const stepLeft = activeStep.offsetLeft;
        const stepWidth = activeStep.clientWidth;

        // Scroll position that centers the step in the container
        const scrollPosition = stepLeft - containerWidth / 2 + stepWidth / 2;

        // Smoothly scroll to the calculated position
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: "smooth",
        });
      }
    }
  }, [currentStep]);

  // Render the current step component
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep
            data={personalInfo}
            onSubmit={saveStateDataHandler<IPersonalInfo>(
              1,
              setPersonalInfo,
              setCurrentStep,
              setCompletedSteps,
              completedSteps
            )}
          />
        );

      // case 2:
      //   return (
      //     <ContactInfoStep
      //       data={contactInfo}
      //       onSubmit={saveStateDataHandler<IContactInfo>(
      //         2,
      //         setContactInfo,
      //         setCurrentStep,
      //         setCompletedSteps,
      //         completedSteps
      //       )}
      //       onBack={goBack}
      //       onSkip={skip}
      //     />
      //   );

      // case 3:
      //   return (
      //     <OccuptionInfoStep
      //       data={occupationInfo}
      //       onSubmit={saveStateDataHandler<IOccupationInfo>(
      //         3,
      //         setOccupationInfo,
      //         setCurrentStep,
      //         setCompletedSteps,
      //         completedSteps
      //       )}
      //       onBack={goBack}
      //       onSkip={skip}
      //     />
      //   );

      // case 5:
      //   return (
      //     <EmergencyInfoStep
      //       data={emergencyInfo}
      //       onSubmit={saveStateDataHandler<IEmergencyInfo>(
      //         5,
      //         setEmergencyInfo,
      //         setCurrentStep,
      //         setCompletedSteps,
      //         completedSteps
      //       )}
      //       onBack={goBack}
      //       onSkip={skip}
      //     />
      //   );

      case 10:
        return (
          <ReviewStep
            personalInfo={personalInfo}
            contactInfo={contactInfo}
            occupationInfo={occupationInfo}
            emergencyInfo={emergencyInfo}
            onBack={goBack}
            completedSteps={completedSteps}
          />
        );

      // Update the default case in renderStepContent function with a more informative UI
      default:
        return (
          <div className="py-12 flex flex-col items-center">
            <div className="text-center mb-8">
              <h3 className="text-lg font-medium mb-2">
                Step Under Development
              </h3>
              <p className="text-muted-foreground">
                This section is not yet available, but you can continue with the
                information you&apos;ve already provided.
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <Button onClick={() => goToStep(10)} className="w-full">
                Skip to Review &amp; Submit
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={goBack} className="flex-1">
                  Back
                </Button>

                <Button variant="outline" onClick={skip} className="flex-1">
                  Next Step
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Steps Navigation at top */}
      <div
        className={cn(
          "sticky top-0 border-b shadow-sm z-10",
          isMobile
            ? collapsed
              ? "w-[calc(100vw-107px)]"
              : "w-[calc(100vw-284px)]"
            : "w-full"
        )}
      >
        <div
          className="overflow-x-auto scrollbar-none"
          ref={scrollContainerRef}
        >
          <div className="flex items-center gap-1 px-4 py-3 min-w-max">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <Button
                  ref={(el) => {
                    stepRefs.current[step.id - 1] = el;
                  }}
                  variant={
                    currentStep === step.id
                      ? "default"
                      : completedSteps.includes(step.id)
                      ? "outline"
                      : "ghost"
                  }
                  className={`h-10 px-4 rounded-full flex-shrink-0 ${
                    currentStep === step.id
                      ? "bg-primary"
                      : completedSteps.includes(step.id)
                      ? "border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => goToStep(step.id)}
                  // disabled={!canNavigateToStep(step.id)}
                >
                  <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full border">
                    {completedSteps.includes(step.id) ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </span>
                  <span className="inline">{step.label}</span>
                </Button>

                {index < steps.length - 1 && (
                  <div className="h-px w-6 bg-gray-200 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content  */}
      <Card className="w-full flex-1">
        <CardContent className="p-2 pt-6 w-full h-[calc(100vh-210px)] max-w-3xl mx-auto  border-purple-400">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewMemberView;
