"use client"
import { motion as Motion } from "framer-motion"
import { Check } from "lucide-react"
import { useState } from "react"

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false)

  const plans = [
    {
      name: "Free",
      price: isYearly ? "$0" : "$0",
      features: ["Basic task management", "5 team members", "2 projects", "Basic analytics"],
    },
    {
      name: "Enterprise",
      price: isYearly ? "$15" : "$19",
      features: [
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Custom workflows",
        "Team collaboration",
      ],
      highlighted: true,
    },
    {
      name: "Business",
      price: isYearly ? "$9" : "$12",
      features: ["Advanced task management", "15 team members", "10 projects", "Advanced analytics"],
    },
  ]

  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-4">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose your plan</h2>
          <div className="flex items-center justify-center gap-4">
            <span className={!isYearly ? "text-gray-900" : "text-gray-500"}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isYearly ? "bg-emerald-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isYearly ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className={isYearly ? "text-gray-900" : "text-gray-500"}>Yearly</span>
          </div>
        </Motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-lg p-8 ${
                plan.highlighted ? "bg-[#002b3d] text-white" : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
              <div className="text-3xl font-bold mb-6">
                {plan.price}
                <span className="text-sm font-normal">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 px-4 rounded-md transition-colors ${
                  plan.highlighted
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Get Started
              </button>
            </Motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
