import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiStar } from "react-icons/fi";

function Pricing() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      name: "Free Trial",
      price: "$0",
      period: "for 3 months",
      description: "Perfect for exploring the platform",
      buttonText: "Get Started",
      popular: false,
      features: [
        "Access to core tools",
        "Limited daily usage",
        "Basic explanations",
        "Community support",
        "Personal use only",
      ],
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? "$19.99" : "$14.99",
      period:
        billingCycle === "monthly" ? "per month" : "per month (billed yearly)",
      description: "Best for individual developers",
      buttonText: "Choose Pro",
      popular: true,
      features: [
        "Unlimited usage",
        "Advanced explanations",
        "Priority support",
        "Commercial usage",
        "Early feature access",
      ],
    },
    {
      name: "Enterprise",
      price: billingCycle === "monthly" ? "$179.99" : "$149.99",
      period: billingCycle === "monthly" ? "per year" : "per year (save 30%)",
      description: "For teams & long-term usage",
      buttonText: "Contact Sales",
      popular: false,
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Dedicated support",
        "API access",
        "Custom integrations",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-20">
      <div className="container mx-auto px-6">
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold mb-6">
            Simple & Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600">
            Choose a plan that fits your needs. Upgrade, downgrade, or cancel
            anytime.
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <span
              className={`text-sm font-medium ${
                billingCycle === "monthly" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Monthly
            </span>

            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly"
                )
              }
              className="relative w-12 h-6 rounded-full bg-gray-500"
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <span
              className={`text-sm font-medium ${
                billingCycle === "yearly" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              Yearly <span className="text-green-600">(Save 30%)</span>
            </span>
          </div>
        </div>

        {/* ================= PRICING CARDS ================= */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`group relative p-8 rounded-xl border bg-white flex flex-col
    transition-all duration-300 ease-out
    hover:-translate-y-2 hover:shadow-lg hover:cursor-pointer ${
      plan.popular ? "border-blue-600 shadow-md scale-105" : "border-gray-400"
    }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full flex items-center gap-1 ">
                  <FiStar /> Most Popular
                </div>
              )}

              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500 ml-2">{plan.period}</span>
              </div>

              <Link
                to="/sign-up"
                className={`mb-8 px-6 py-3 rounded-lg text-center font-semibold transition ${
                  plan.popular
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {plan.buttonText}
              </Link>

              <ul className="space-y-3 text-sm text-gray-600">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <FiCheck className="text-green-600 mt-1" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ================= FAQ ================= */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes, you can cancel anytime. Your access continues until the end of the billing period.",
              },
              {
                q: "Is there a free trial?",
                a: "Yes, we offer a 3-month free trial without requiring a credit card.",
              },
              {
                q: "Can I change plans later?",
                a: "Absolutely. You can upgrade or downgrade anytime.",
              },
            ].map((item, i) => (
              <div key={i} className="border-b pb-4">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center bg-gray-200 py-10 rounded-3xl">
            <h3 className="text-2xl font-semibold mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is happy to help you choose the right plan.
            </p>
            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
