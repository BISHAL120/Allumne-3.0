"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const IdInactive = () => {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <div className=" p-8 shadow text-center max-w-md w-full  border-2 border-primary rounded-2xl">
          <h1 className="text-2xl font-semibold  mb-4">
            Account Activation Required
          </h1>
          <p className=" mb-6">
            Please complete your profile information in the settings page Then Request for Activation.
            Filling out all required details is necessary to access full functionality.
          </p>
          <Button 
            onClick={() => router.push("/manager/settings/general")}
            className="w-full"
          >
            Go to Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IdInactive;
