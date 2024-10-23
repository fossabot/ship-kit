import { routes } from "@/config/routes";
import Link from "next/link";

import { SignUpForm } from "@/app/(authentication)/sign-up/_components/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SignUpCard() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <SignUpForm />
          {/* <OAuthButtons /> */}
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href={routes.auth.signIn} className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
