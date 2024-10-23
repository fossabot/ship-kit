import Image from "next/image";

import { SignInOptions } from "@/app/(authentication)/sign-in/_components/sign-in-options";
import { Card } from "@/components/ui/card";

export const SignIn = () => {
  return (
    <Card className="overflow-hidden">
      <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[80vh]">
        <SignInOptions />

        <div className="hidden bg-muted lg:block">
          <Image
            src="https://picsum.photos/id/25/1920/1080"
            alt="Image"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            draggable={false}
          />
        </div>
      </div>
    </Card>
  );
};
