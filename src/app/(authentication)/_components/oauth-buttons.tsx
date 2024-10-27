import { Button } from "@/components/ui/button";
import { signInWithOAuthAction } from "@/server/actions/auth";
import { providerMap } from "@/server/auth.config";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export function OAuthButtons() {
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
            action={signInWithOAuthAction({ providerId: provider.id })}
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
}
