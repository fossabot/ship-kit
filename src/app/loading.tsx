import { SuspenseFallback } from "@/components/primitives/suspense-fallback";

export default function Loading() {
  // Stack uses React Suspense, which will render this page while user data is being fetched.
  // See: https://nextjs.org/docs/app/api-reference/file-conventions/loading
  return (
    <div className="grid h-screen place-items-center">
      <SuspenseFallback />
    </div>
  );
}
