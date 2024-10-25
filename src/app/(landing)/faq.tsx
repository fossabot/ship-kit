import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="what-is-shipkit">
        <AccordionTrigger>What is ShipKit?</AccordionTrigger>
        <AccordionContent>
          ShipKit is a platform for building and shipping fast, scalable, and
          beautiful web applications, oriented around the developer experience.
          <br />
          <br />
          ShipKit is built on top of Next.js, Shadcn/UI, and TailwindCSS.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="what-exactly-is-shipkit">
        <AccordionTrigger>What exactly is included?</AccordionTrigger>
        <AccordionContent className="prose">
          <ul>
            <li>Next.js v15 (with App Router and Turbopack)</li>
            <li>React v19</li>
            
            <li>NextAuth v5</li>
            <li>Stack Auth</li>
            <li>Clerk Auth</li>

            <li>Nextra (write pages using Markdown/MDX)</li>
            <li>Payload CMS (with file uploads)</li>
            <li>Builder.io CMS (export Figma designs directly to code)</li>

            <li>Postgres + Drizzle ORM</li>
            <li>MongoDB</li>
            <li>Redis</li>

            <li>Stripe</li>
            <li>Lemonsqueezy</li>

            <li>Mollie</li>
            <li>Paddle</li>

            <li>Sendgrid</li>
            <li>Resend</li>

            <li>Shadcn/ui (+CLI)</li>
            <li>Magic UI (animated components)</li>
            <li>Dark mode</li>

            <li>Full Server Action support (works with JavaScript disabled!)</li>
            <li>Type-safe everything: API routes, forms, server actions, etc.</li>
            <li>React Hook Form + Server Actions + Zod Schemas</li>
            <li>Aggressive TS, Prettier, and Eslint rules</li>
            <li>Testing with: Vitest, Jest, React Testing Library</li>
            <li>Github Actions for CI/CD</li>

            <li>Configuration for VSCode and Cursor</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="what-sets-shipkit-apart">
        <AccordionTrigger>What sets ShipKit apart?</AccordionTrigger>
        <AccordionContent>
          The goal of ShipKit is to enable a single developer to build and ship
          an entire SaaS product, without spending months on the underlying
          infrastructure.
          <br />
          <br />
          The vision is to provide solid, production-ready meta-components for
          your product, without the need to worry about the underlying
          infrastructure. As your company scales, you can feel confident
          onboarding new developers to your product.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="why-choose-shipkit-over-shipfast">
        <AccordionTrigger>Why choose ShipKit over ShipFast?</AccordionTrigger>
        <AccordionContent>
          ShipFast does a lot of things well, but ShipKit is focused on the
          <span className="font-bold">fastest possible workflow</span> and the
          <span className="font-bold">best developer experience</span>.
          <br />
          <br />
          What sets ShipKit apart:
          <ul className="list-disc space-y-2">
            <li>Full TypeScript support</li>
            <li>
              <span className="font-bold underline">Battle-tested</span> in
              production, and{" "}
              <span className="font-bold underline">actually tested</span> using
              Vitest in development
            </li>
            <li>No-code workflow for founders</li>
            <li>Figma-to-code workflow for designers</li>
            <li>Secret-sauce workflow for developers</li>
            <li>Tooling, IDE config, CLI tools, and more</li>
            <li>
              A massive library of components: Shadcn/UI, Magic UI, TailwindCSS
            </li>
            <li>Utilizing the latest features of Next.js 15 and React 19</li>
            <li>CMS, Email marketing, Authentication, Database</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
                  <AccordionItem value="what-is-shipkit-not">
        <AccordionTrigger>What is ShipKit not?</AccordionTrigger>
        <AccordionContent>
        ShipKit is not a framework. It's a set of tools and libraries that you can use to build your product.
        </AccordionContent>
      </AccordionItem>
                    <AccordionItem value="who-am-i">
          <AccordionTrigger>Who am I?</AccordionTrigger>
        <AccordionContent>
        </AccordionContent>
      </AccordionItem>
            <AccordionItem value="who-are-you-and-why-should-i-care">
        <AccordionTrigger>Who are you and why should I care?</AccordionTrigger>
        <AccordionContent>
          , a lifelong web developer and entrepreneur with a passion for clean, performant, and maintainable code.
          I <em>love</em> to code, and I yearn for the{" "}
          <em>perfect</em> developer experience.
          <br />
          <br />
          I couldn't find anything that met my standards for production-ready, so I built my own.
        </AccordionContent>
      </AccordionItem>
                  <AccordionItem value="who-are-you-and-why-should-i-care">
        <AccordionTrigger>But why should I care?</AccordionTrigger>
        <AccordionContent>
          More time for you to focus on what makes your product unique.
          <br />
          <br />
          <ul>
            <li>You'll spend less time on the underlying infrastructure</li>
            <li>You'll have more time to focus on your users</li>
            <li>You'll have a more enjoyable developer experience</li>
          </ul>
        </AccordionContent>
      </AccordionItem>
                  <AccordionItem value="but-why">
        <AccordionTrigger>But why?</AccordionTrigger>
        <AccordionContent>
          Chicken thigh.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
