import { toast } from "sonner";

/**
 * Creates a reusable handler for saving step data and managing step navigation
 * @param stepId The current step ID
 * @param setState The state setter function for this step's data
 * @param setCurrentStep Function to update the current step
 * @param setCompletedSteps Function to update completed steps
 * @returns A function that handles saving data and navigating to the next step
 */
export function saveStateDataHandler<T>(
  stepId: number,
  setState: (data: T) => void,
  setCurrentStep: (step: number) => void,
  setCompletedSteps: (steps: number[]) => void,
  completedSteps: number[]
) {
  return (data: T) => {
    // Save the data to the corresponding state
    setState(data);

    // Mark the step as completed if not already completed
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }

    // Show success message
    toast.success(`Step ${stepId} information saved.`);

    // Move to the next step
    setCurrentStep(stepId + 1);
  };
}
