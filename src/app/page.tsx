import { buttonVariants } from "@/components/ui/button";
import { LandingPageComponent } from "@/components/views/landing-page";
import { routes } from "@/lib/routes";
import Link from 'next/link';

const LandingPage = () => {
  return (
    <>

<LandingPageComponent />
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0a001f] to-[#15162c] ">

      <main className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
         
<Link
  className={buttonVariants({ size: "lg" })}
  href={routes.app.dashboard}
>
  Get Started
</Link>
<Link
  className={buttonVariants({ size: "lg", variant: "outline" })}
  href={routes.external.github}
  target="_blank"
>
  GitHub
</Link>
        </div>
        <div className="flex flex-col items-center gap-2  text-white">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-lg">
              🔥 Blazing Fast | 📊 Real-time Monitoring | 🔒 Secure & Scalable
            </div>
          </div>
        </div>
      </main>
      </div>
    </>
  );
};

export default LandingPage;