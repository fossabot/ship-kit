import { stackServerApp } from "@/lib/stack";
import { StackProvider, StackTheme } from "@stackframe/stack";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>{children}</StackTheme>
    </StackProvider>
  );
}
