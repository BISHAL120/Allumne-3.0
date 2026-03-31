"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { showError, showSuccess } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    name: z
      .string()
      .min(5, { message: "Name must be at least 5 characters" })
      .max(50, { message: "Name must be at most 50 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(50, { message: "Password must be at most 50 characters" }),
    confirmPassword: z
      .string({ message: "Confirm password is required" })
      .min(6, { message: "Confirm password must be at least 6 characters" })
      .max(50, { message: "Confirm password must be at most 50 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });

export function SignupForm({joinAs}: {joinAs: string | null}) {
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
/*   const searchParams = useSearchParams();
  const joinAs = searchParams.get("joinas"); */
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    toast.loading("Creating account...");
    const { error } = await authClient.signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
      callbackURL: "/email-verified",
    });
    if (error) {
      toast.dismiss();
      setLoading(false);
      showError({
        message: error.message || "An error occurred",
        duration: 5000,
      });
      console.log("SignUp Error:", error);
      return;
    }
    setLoading(false);
    toast.dismiss();
    showSuccess({ message: "Account created successfully", duration: 5000 });
    router.push("/manager/products");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to create your account
            </p>
          </div>
          <Field>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="John Doe" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>
          <Field>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="m@example.com" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>
          <Field>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={loading}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>
          <Field>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        disabled={loading}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <EyeOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>
          <Field>
            <Button disabled={loading} type="submit">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </Field>

          <Field>
            <FieldDescription className="px-6 text-center">
              Already have an account?{" "}
              <Link
                href={`${joinAs ? `/sign-in?joinas=${joinAs}` : "/sign-in"} `}
                className="text-primary hover:underline"
              >
                Sign in
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
