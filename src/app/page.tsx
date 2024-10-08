import { buttonVariants } from "@/components/ui/button";
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <main className="container mx-auto flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Welcome to <span className="text-[hsl(280,100%,70%)]">LogFlare</span>
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className={buttonVariants({ size: "lg" })}
            href="/dashboard"
          >
            Get Started
          </Link>
          <Link
            className={buttonVariants({ size: "lg", variant: "outline" })}
            href="https://github.com/your-repo/logflare"
            target="_blank"
          >
            GitHub
          </Link>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            LogFlare: Illuminate your logs, ignite your insights
          </p>
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="text-lg">
              🔥 Blazing Fast | 📊 Real-time Monitoring | 🔒 Secure & Scalable
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;