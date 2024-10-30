import { OAuthButtons } from "@/app/(app)/(authentication)/_components/oauth-buttons";
import { SignInForm } from "@/app/(app)/(authentication)/sign-in/_components/sign-in-form";
import { Separator } from "@/components/ui/separator";
import { providerMap } from "@/server/auth.config";

export const SignInOptions = () => {
  return (
    <main className="flex items-center justify-center py-lg">
      <div className="mx-auto grid w-[350px] gap-lg">
        <div className="grid gap-sm text-center">
          <h1 className="text-2xl font-bold">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login to your account.
          </p>
        </div>
        <div className="grid gap-md">
          <SignInForm />
          {Object.keys(providerMap).length > 1 && (
            <>
              <Separator />
              <OAuthButtons />
            </>
          )}
        </div>
        {/* <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href={routes.auth.signUp} className="underline">
            Sign up
          </Link>
        </div> */}
      </div>
    </main>
  );
};
