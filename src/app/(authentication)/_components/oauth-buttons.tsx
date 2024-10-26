import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { redirectWithCode } from "@/lib/utils/redirect-with-code";
import { signIn } from "@/server/auth";
import { providerMap } from "@/server/auth.config";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { AuthError } from "next-auth";

export const OAuthButtons = () => {
  return (
    <div className="flex flex-col gap-2">
      {Object.values(providerMap).map((provider) => {
        if (!provider?.name) {
          return null;
        }
        const { name } = provider;

        if (!name || String(name).toLowerCase() === "credentials") {
          return null;
        }

        return (
          <form
            key={provider.id}
            action={() => {
              "use server";
              try {
                void signIn(provider.id, { redirectTo: routes.home });
              } catch (error) {
                if (error instanceof AuthError) {
                  return redirectWithCode(routes.auth.signIn, {
                    code: error.type,
                  });
                }
                throw error;
              }
            }}
          >
            <Button
              variant={"outline"}
              type="submit"
              className="flex w-full items-center justify-center gap-sm"
            >
              <span>Sign in with {provider.name}</span>
              {provider.name === "GitHub" && <GitHubLogoIcon />}
            </Button>
          </form>
        );
      })}
    </div>
  );
};
