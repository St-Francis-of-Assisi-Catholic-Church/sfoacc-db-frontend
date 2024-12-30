"use client";

import { TriangleAlert, X } from "lucide-react";
import { Button } from "./button";

interface ErrorAlertProps {
  message: string;
  onClose?: () => void;
}

export function ErrorAlert({ message, onClose }: ErrorAlertProps) {
  return (
    <div className="mb-4 p-2 border bg-red-200 text-sm rounded-sm relative flex justify-start gap-2">
      <TriangleAlert className="text-red-800 h-4 w-4" />
      <p className="text-xs text-red-800">{message}</p>
      {onClose && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute h-5 w-5 border text-red-800 bg-red-200 rounded-full right-[-5px] top-[-6px]"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
