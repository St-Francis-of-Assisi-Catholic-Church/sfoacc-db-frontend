import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getInitials(name: string = "") {
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

export function ApiSimulator(value: boolean, delay = 1500) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value) {
        resolve(value);
      } else {
        reject(new Error("Simulated error: value is false"));
      }
    }, delay);
  });
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const generateInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export const generateNewChurchId = (
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  oldChurchId: string
): string => {
  // Get initials
  const firstNameInitials = generateInitials(firstName);
  const lastNameInitials = generateInitials(lastName);

  // Parse date of birth (assuming format YYYY-MM-DD)
  const dob = new Date(dateOfBirth);
  const day = dob.getDate().toString().padStart(2, "0");
  const month = (dob.getMonth() + 1).toString().padStart(2, "0");

  // Ensure old church ID is 3 digits
  const formattedOldId = oldChurchId.padStart(3, "0");

  // Combine all parts
  return `${firstNameInitials}${lastNameInitials}${day}${month}-${formattedOldId}`;
};
