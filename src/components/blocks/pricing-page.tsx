'use client'

import { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

const fadingBorderStyle = `
  relative before:absolute before:inset-0 before:border before:border-gray-700 before:rounded-lg
  before:bg-gradient-to-b before:from-gray-700 before:to-transparent before:opacity-50
  before:pointer-events-none
`;

export function PricingPageComponent() {
  const [logEntries, setLogEntries] = useState(1000000)
  const [isApplicationLogs, setIsApplicationLogs] = useState(true)

  const calculatePrice = (entries: number) => {
    return Math.round(entries / 10000)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center space-x-4 mb-8">
          <Switch
            checked={isApplicationLogs}
            onCheckedChange={() => setIsApplicationLogs(true)}
          />
          <span className={isApplicationLogs ? 'font-bold' : ''}>Application Logs</span>
          <Switch
            checked={!isApplicationLogs}
            onCheckedChange={() => setIsApplicationLogs(false)}
          />
          <span className={!isApplicationLogs ? 'font-bold' : ''}>Infrastructure Logs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className={`p-6 flex flex-col ${fadingBorderStyle}`}>
            <h2 className="text-2xl font-bold mb-4">Free</h2>
            <div className="text-4xl font-bold mb-6">$0 / mo</div>
            <div className="mb-6">
              <div>Up to 50,000 log entries / mo</div>
              <div className="text-sm text-gray-400">1,000 log entries / day</div>
            </div>
            <div className="space-y-2 flex-grow">
              <Feature included>Basic Log Search</Feature>
              <Feature included>1 Team Member</Feature>
              <Feature included>1-day Log Retention</Feature>
              <Feature included>Email Alerts</Feature>
              <Feature>Advanced Analytics</Feature>
              <Feature>Custom Dashboards</Feature>
              <Feature>24/7 Support</Feature>
            </div>
            <Button className="mt-6 w-full">Get started</Button>
          </div>

          {/* Pro Tier */}
          <div className={`p-6 flex flex-col ${fadingBorderStyle}`}>
            <h2 className="text-2xl font-bold mb-4">Pro</h2>
            <div className="text-4xl font-bold mb-6">${calculatePrice(logEntries)} / mo</div>
            <div className="mb-6">
              <Slider
                min={100000}
                max={5000000}
                step={100000}
                value={[logEntries]}
                onValueChange={(value) => setLogEntries(value[0])}
              />
              <div>{logEntries.toLocaleString()} log entries / mo</div>
              <div className="text-sm text-gray-400">No daily sending limit</div>
            </div>
            <div className="space-y-2 flex-grow">
              <Feature included>Advanced Log Search</Feature>
              <Feature included>Unlimited Team Members</Feature>
              <Feature included>30-day Log Retention</Feature>
              <Feature included>Email & Slack Alerts</Feature>
              <Feature included>Advanced Analytics</Feature>
              <Feature included>Custom Dashboards</Feature>
              <Feature>24/7 Support</Feature>
            </div>
            <Button className="mt-6 w-full">Get started</Button>
          </div>

          {/* Enterprise Tier */}
          <div className={`p-6 flex flex-col ${fadingBorderStyle}`}>
            <h2 className="text-2xl font-bold mb-4">Enterprise</h2>
            <div className="text-4xl font-bold mb-6">Custom</div>
            <div className="mb-6">
              <div>A plan based on your specific needs</div>
              <div className="text-sm text-gray-400">No log entry limits</div>
            </div>
            <div className="space-y-2 flex-grow">
              <Feature included>Advanced Log Search</Feature>
              <Feature included>Unlimited Team Members</Feature>
              <Feature included>Customizable Log Retention</Feature>
              <Feature included>Custom Alert Integrations</Feature>
              <Feature included>Advanced Analytics</Feature>
              <Feature included>Custom Dashboards</Feature>
              <Feature included>24/7 Priority Support</Feature>
            </div>
            <Button className="mt-6 w-full">Contact us</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Feature({ children, included = false }) {
  return (
    <div className="flex items-center space-x-2">
      {included ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-gray-500" />
      )}
      <span className={included ? '' : 'text-gray-500'}>{children}</span>
    </div>
  )
}