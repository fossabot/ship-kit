import { stackServerApp } from "@/stack";
import { StackHandler } from "@stackframe/stack";

export default function Handler(props: any) {
  return (
    <StackHandler fullPage app={stackServerApp} /* @next-codemod-error 'props' is used with spread syntax (...). Any asynchronous properties of 'props' must be awaited when accessed. */
    {...props} />
  );
}
