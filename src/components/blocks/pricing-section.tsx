"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Link from "next/link";

interface Tier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  disabled?: boolean;
  href?: string;
}

export function PricingSection() {
  const tiers: Tier[] = [
    {
      name: "Bones",
      price: "$29",
      description:
        "Perfect for individuals and small teams who just want to get started.",
      features: [
        "Up to 5 projects",
        "1GB storage",
        "Basic support",
        "48-hour response time",
      ],
      cta: "Get ShipKit Bones",
      href: "/signup?plan=bones",
    },
    {
      name: "Muscles",
      price: "$99",
      description: "Ideal for growing businesses and larger teams.",
      features: [
        "Unlimited projects",
        "10GB storage",
        "Priority support",
        "24-hour response time",
        "Advanced analytics",
      ],
      cta: "Get ShipKit Muscles",
      highlighted: true,
      href: "/signup?plan=muscles",
      disabled: true,
    },
    {
      name: "Brains",
      price: "$249",
      description:
        "Fully-featured, tailored solutions with pre-built integrations and building blocks for large-scale organizations. AI-workflows, etc.",
      features: [
        "Unlimited everything",
        "Dedicated support team",
        "1-hour response time",
        "Custom integrations",
        "On-premise options",
      ],
      cta: "Coming Soon",
      disabled: true,
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-3xl font-bold">
          Simple, Transparent Pricing
        </h2>
        <p className="mb-12 text-center text-xl text-gray-600">
          Choose the plan that's right for you
        </p>
        <div className="grid gap-8 md:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn("flex flex-col", {
                "scale-105 border-primary shadow-lg": tier.highlighted,
              })}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-sm">
                  {tier.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-4 text-4xl font-bold">
                  {tier.price}
                  <span className="text-lg font-normal text-gray-600">
                    {tier.price !== "Custom" ? "/mo" : ""}
                  </span>
                </p>
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {tier.href ? (
                  <Link
                    href={tier.href}
                    className={cn(
                      buttonVariants({ variant: tier.highlighted ? "default" : "outline" }),
                      "w-full",
                      { "bg-primary hover:bg-primary/90": tier.highlighted }
                    )}
                    aria-disabled={tier.disabled}
                    tabIndex={tier.disabled ? -1 : undefined}
                  >
                    {tier.cta}
                  </Link>
                ) : (
                  <Button
                    variant={tier.highlighted ? "default" : "outline"}
                    className={cn("w-full", {
                      "bg-primary hover:bg-primary/90": tier.highlighted,
                    })}
                    disabled={tier.disabled}
                  >
                    {tier.cta}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
