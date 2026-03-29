import { TriangleAlert } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface ErrorToastProps {
  message: string;
  duration?: number;
}

const ErrorToast: React.FC<ErrorToastProps> = ({
  message,
  duration = 3000,
}) => {
  return toast.error(message, {
    duration,
    icon: <TriangleAlert className="w-4 h-4" />,
  });
};

export default ErrorToast;
