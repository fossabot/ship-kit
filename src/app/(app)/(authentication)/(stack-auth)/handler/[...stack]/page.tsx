import { stackServerApp } from "@/lib/stack";
import { StackHandler } from "@stackframe/stack";

export default async function Handler(props: any) {
  /* @next-codemod-resolved 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
  // The following line is a workaround to resolve the issue.
  const resolvedProps = await Promise.all(
    Object.entries(props).map(async ([key, value]) => [key, await value]),
  );
  const awaitedProps = Object.fromEntries(resolvedProps);

  return <StackHandler fullPage app={stackServerApp} {...awaitedProps} />;
}
