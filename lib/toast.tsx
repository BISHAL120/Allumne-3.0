import { toast } from "sonner";
import { CheckCircle, TriangleAlert, Info, AlertCircle } from "lucide-react";

export const showLoading = (message: string) => {
  toast.loading(message);
};

export const showError = ({
  message,
  duration = 3000,
}: {
  message: string;
  duration?: number;
}) =>
  toast.error(message, {
    duration,
    icon: <TriangleAlert className="w-4 h-4" />,
    style: {
      backgroundColor: "red",
      color: "white",
      padding: "12px 24px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      fontSize: "14px",
    },
  });

export const showSuccess = ({
  message,
  description,
  duration = 3000,
}: {
  message: string;
  description?: string;
  duration?: number;
}) =>
  toast.success(message, {
    description,
    duration,
    icon: <CheckCircle className="w-4 h-4 " />,
    style: {
      backgroundColor: "green",
      color: "white",
      padding: "12px 24px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      fontSize: "14px",
    },
  });

export const showWarning = ({
  message,
  duration = 3000,
}: {
  message: string;
  duration?: number;
}) =>
  toast.warning(message, {
    duration,
    icon: <AlertCircle className="w-4 h-4 " />,
    style: {
      backgroundColor: "orange",
      color: "white",
      padding: "12px 24px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      fontSize: "14px",
    },
  });

export const showInfo = ({
  message,
  duration = 3000,
}: {
  message: string;
  duration?: number;
}) =>
  toast(message, {
    duration,
    icon: <Info className="w-4 h-4 " />,
    style: {
      backgroundColor: "blue",
      color: "white",
      padding: "12px 24px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      fontSize: "14px",
    },
  });
