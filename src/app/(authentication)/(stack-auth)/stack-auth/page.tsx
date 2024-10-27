import { UserGreeting } from "@/app/(authentication)/(stack-auth)/stack-auth/UserGreeting";
import { stackServerApp } from "@/lib/stack";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser({ or: "redirect" });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">
        Welcome to your dashboard, {user.displayName}!
      </h1>
      <UserGreeting />
    </div>
  );
}
