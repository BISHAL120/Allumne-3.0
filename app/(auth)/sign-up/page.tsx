import { SignupForm } from "@/components/auth/signUp/signUp";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const joinAs = params.joinas || null;
  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            ব্যবসা সহায়ক
          </a>
        </div>
        <SignupForm joinAs={joinAs} />
      </div>
    </div>
  );
}
