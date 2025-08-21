import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiZap, FiStar } from 'react-icons/fi';

function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  const plans = [
    {
      name: 'Free Trial',
      price: '$0',
      period: 'for 3 months',
      description: 'Perfect for trying out all features',
      buttonText: 'Get Started',
      popular: false,
      features: [
        'Access to all AI coding tools',
        'Up to 100 code generations per day',
        'Basic code explanations',
        'Community support',
        'Limited to personal projects'
      ]
    },
    {
      name: 'Monthly',
      price: billingCycle === 'monthly' ? '$19.99' : '$14.99',
      period: billingCycle === 'monthly' ? 'per month' : 'per month (billed yearly)',
      description: 'For individual developers',
      buttonText: 'Choose Monthly',
      popular: true,
      features: [
        'Everything in Free, plus:',
        'Unlimited code generations',
        'Advanced code explanations',
        'Priority support',
        'Commercial use',
        'Early access to new features'
      ]
    },
    {
      name: 'Yearly',
      price: billingCycle === 'monthly' ? '$179.99' : '$149.99',
      period: billingCycle === 'monthly' ? 'per year' : 'per year (save 30%)',
      description: 'Best value for long-term use',
      buttonText: 'Choose Yearly',
      popular: false,
      features: [
        'Everything in Monthly, plus:',
        'Save 30% compared to monthly',
        'Dedicated account manager',
        'Team collaboration features',
        'Custom model training',
        'API access (1000 requests/month)'
      ]
    }
  ];

  const toggleBillingCycle = () => {
    setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly');
  };

  return (
    <div className="min-h-screen bg-black text-white py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that works best for your development needs. Cancel or switch plans anytime.
          </p>
          
          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center space-x-4">
            <span className={`font-medium ${billingCycle === 'monthly' ? 'text-white' : 'text-gray-500'}`}>
              Monthly Billing
            </span>
            <button 
              onClick={toggleBillingCycle}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            >
              <span 
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'monthly' ? 'translate-x-1' : 'translate-x-6'
                }`}
              />
            </button>
            <span className={`font-medium ${billingCycle === 'yearly' ? 'text-white' : 'text-gray-500'}`}>
              Yearly Billing <span className="text-purple-400">(Save 30%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={plan.name}
              className={`relative rounded-2xl border ${
                plan.popular 
                  ? 'border-purple-500 bg-gradient-to-b from-gray-900 to-gray-900/80 shadow-lg shadow-purple-500/20 transform scale-105 z-10' 
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 transition-all duration-300'
              } p-8 flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <h2 className="text-2xl font-bold">{plan.name}</h2>
                  {plan.popular && (
                    <FiStar className="ml-2 text-yellow-400" />
                  )}
                </div>
                <p className="text-gray-400 mb-4">{plan.description}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400 ml-2">{plan.period}</span>
                </div>
              </div>
              
              <Link
                to="/sign-up"
                className={`mt-4 px-6 py-3 rounded-lg text-center font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90'
                    : 'bg-gray-800 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {plan.buttonText}
              </Link>
              
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-lg">Includes:</h3>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <FiCheck className="text-green-400 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
              },
              {
                question: 'Is there a free trial?',
                answer: 'Yes! We offer a 3-month free trial with access to all features. No credit card required to start your trial.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
              },
              {
                question: 'Can I upgrade or downgrade my plan?',
                answer: 'Absolutely! You can upgrade or downgrade your plan at any time. The changes will be reflected in your next billing cycle.'
              }
            ].map((item, index) => (
              <div key={index} className="border-b border-gray-800 pb-4">
                <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
                <p className="text-gray-400">{item.answer}</p>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-gray-400 mb-6">Our support team is here to help you choose the right plan.</p>
            <Link 
              to="/contact" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:opacity-90 transition-all duration-300 font-semibold"
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