"use client";

import { authClient } from "@/lib/auth-client";
import { showError, showLoading } from "@/lib/toast";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UnAuthorizedPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  async function handleLogout() {
    const { error } = await authClient.signOut();
    if (error) {
      console.error("Logout error:", error);
      showError({
        message: "Logout failed. Please try again.",
        duration: 5000,
      });
    }
    redirect("/sign-in");
  }

  return (
    <>
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Animated SVG Lock Icon */}
          <div className="flex justify-center mb-6 animate-sway">
            <svg
              className="w-24 h-24 text-destructive"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                className="animate-draw"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-2 animate-fade-in">
            Unauthorized Access
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-center mb-8 animate-fade-in-delay">
            Sorry, you don’t have permission to view this page.
          </p>

          {/* Interactive Button */}
          <button
            onClick={handleGoHome}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5 animate-bounce-x"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Go to Home
            </span>
          </button>
          {/* Logout Button */}
          <button
            onClick={() => handleLogout()}
            className="w-full mt-4 bg-destructive hover:bg-destructive/90 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(5deg);
          }
          75% {
            transform: rotate(-5deg);
          }
        }

        @keyframes draw {
          0% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
          }
          100% {
            stroke-dasharray: 1000;
            stroke-dashoffset: 0;
          }
        }

        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes fade-in-delay {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes bounce-x {
          0%,
          100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-sway {
          animation: sway 4s ease-in-out infinite;
        }

        .animate-draw {
          animation: draw 1.5s ease-in-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animate-fade-in-delay {
          animation: fade-in-delay 0.6s ease-out forwards;
          animation-delay: 0.6s;
          opacity: 0;
        }

        .animate-bounce-x {
          animation: bounce-x 1.2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
