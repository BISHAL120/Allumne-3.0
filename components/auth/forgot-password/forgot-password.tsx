"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { showError, showLoading, showSuccess } from "@/lib/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      showLoading("Sending reset email...");

      const { data, error } = await authClient.requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });

      console.log("Email Response :", data)

      toast.dismiss();
      if (error) {
        showError({
          message: error.message || "Failed to send reset email",
          duration: 5000,
        });
      } else {
        showSuccess({
          message: data.message || "Reset email sent",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.dismiss();
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to send reset email");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Forgot Password
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email to receive a password reset link
            </p>
          </div>

          <Field>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Field>

          <Field>
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Sending reset email...
                </>
              ) : (
                "Send Reset Email"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
