'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  const tiers = [
    {
      name: "Bones",
      price: "$29",
      description: "Perfect for individuals and small teams who just want to get started.",
      features: ["Up to 5 projects", "1GB storage", "Basic support", "48-hour response time"],
      cta: "Get ShipKit Bones",
    },
    {
      name: "Muscles",
      price: "$99",
      description: "Ideal for growing businesses and larger teams.",
      features: ["Unlimited projects", "10GB storage", "Priority support", "24-hour response time", "Advanced analytics"],
      cta: "Get ShipKit Muscles",
      highlighted: true,
    },
    {
      name: "Brains",
      price: "$249",
      description: "Fully-featured, tailored solutions with pre-built integrations and building blocks for large-scale organizations. AI-workflows, etc.",
      features: ["Unlimited everything", "Dedicated support team", "1-hour response time", "Custom integrations", "On-premise options"],
      cta: "Get the entire ShipKit",
    },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-2">Simple, Transparent Pricing</h2>
        <p className="text-xl text-center text-gray-600 mb-12">Choose the plan that's right for you</p>
        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`flex flex-col ${tier.highlighted ? 'border-primary shadow-lg scale-105' : ''}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-sm">{tier.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-4xl font-bold mb-4">{tier.price}<span className="text-lg font-normal text-gray-600">{tier.price !== "Custom" ? "/mo" : ""}</span></p>
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className={`w-full ${tier.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}>
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}