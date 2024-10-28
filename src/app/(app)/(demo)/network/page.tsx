import { NetworkRequestLogger } from "@/app/(app)/(demo)/network/network-request-logger";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-indigo-900 p-4">
      <NetworkRequestLogger />
    </div>
  );
}
