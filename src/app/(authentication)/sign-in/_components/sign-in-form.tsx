"use client";

import { routes } from "@/config/routes";
import { signInSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SEARCH_PARAM_KEYS } from "@/constants/search-param-keys";

import { logger } from "@/lib/logger";
import { getSchemaDefaults } from "@/lib/utils/get-schema-defaults";
import { signInAction } from "@/server/actions/auth";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { type z } from "zod";

export const SignInForm = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get(SEARCH_PARAM_KEYS.nextUrl) ?? routes.home;

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: getSchemaDefaults(signInSchema),
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    try {
      await signInAction({
        email: values.email,
        password: values.password,
        redirectTo,
      });
    } catch (error) {
      logger.error(error);
      const errorMessage =
        error instanceof Error ? error.message : String(error); // TODO: Handle this better
      toast.error(errorMessage);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="me@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href={routes.auth.forgotPassword}
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </Form>
  );
};
