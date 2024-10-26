import { LinkWithRedirect } from "@/components/buttons/link-with-redirect";
import { Boundary } from "@/components/primitives/boundary";
import { buttonVariants } from "@/components/ui/button";
import { routes } from "@/config/routes"; // Add this line
import Link from "next/link";

export default async function NotFoundPage() {
  return (
    <Boundary title="404: Not Found">
      <div className="flex gap-md">
        <Link
          href={routes.home}
          className={buttonVariants({ variant: "outline" })}
        >
          Go home
        </Link>
        <p>
          <LinkWithRedirect
            href={routes.auth.signIn}
            className={buttonVariants({ variant: "link" })}
          >
            Sign in
          </LinkWithRedirect>
        </p>
      </div>
    </Boundary>
  );
}
