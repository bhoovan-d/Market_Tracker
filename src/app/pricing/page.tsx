'use client';

import React from 'react';
import Link from 'next/link';
import DashboardHeader from '@/components/dashboard-header';
import DashboardFooter from '@/components/dashboard-footer';
import { Check, ArrowLeft, Zap, Shield, HelpCircle } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Free Terminal',
      price: '₹0',
      description: 'Essential pre-market summaries for active retail traders.',
      cta: 'Current Plan',
      isPopular: false,
      features: [
        'Overnight global indicators grid',
        'AI Morning Note (3 key bullets)',
        '15-minute delayed quotes',
        'Standard sector impact list',
        'Web dashboard access only'
      ]
    },
    {
      name: 'Pro Trader',
      price: '₹299',
      period: '/ month',
      description: 'Advanced data telemetry and WhatsApp delivery before market opens.',
      cta: 'Start Pro Free Trial',
      isPopular: true,
      features: [
        'WhatsApp PDF summary at 8:45 AM IST',
        'Option Chain analysis (PCR & Max Pain)',
        'FII / DII net flows & derivative positioning',
        'Real-time GIFT Nifty & US futures',
        'Intraday sector strength heatmaps',
        'Zero advertisements'
      ]
    },
    {
      name: 'Institutional',
      price: '₹1,499',
      period: '/ month',
      description: 'API access and low-latency integration options for prop desks.',
      cta: 'Contact Sales',
      isPopular: false,
      features: [
        'Everything in Pro Trader plan',
        'JSON REST API endpoints for pre-market data',
        'Webhook delivery for market opening calls',
        'Raw CSV telemetry exports',
        'Dedicated server compute node',
        'Priority technical support'
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-slate-100">
      <DashboardHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 font-mono transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Return to Dashboard
          </Link>
        </div>

        {/* Page Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-violet-400 bg-clip-text text-transparent">
            Choose Your Trading Edge
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Gain market-moving insights before the 9:15 AM IST bell rings. Upgrade to unlock WhatsApp delivery, option chain metrics, and professional API feeds.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col justify-between rounded-2xl border bg-slate-950/40 p-6 sm:p-8 shadow-xl backdrop-blur-sm transition-all hover:scale-[1.01] ${
                tier.isPopular
                  ? 'border-violet-500 ring-2 ring-violet-500/10 shadow-violet-500/5'
                  : 'border-border'
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-violet-600/30">
                  <Zap className="h-3 w-3 fill-current" />
                  Most Popular Choice
                </span>
              )}

              {/* Title & Price */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-200">{tier.name}</h2>
                  <p className="text-xs text-slate-500 mt-1">{tier.description}</p>
                </div>

                <div className="flex items-baseline gap-1 py-2 border-y border-slate-900">
                  <span className="text-4xl font-extrabold tracking-tight font-mono text-slate-100">{tier.price}</span>
                  {tier.period && <span className="text-sm text-slate-500 font-mono">{tier.period}</span>}
                </div>

                {/* Features */}
                <ul className="space-y-3 pt-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-xs text-slate-400">
                      <Check className="h-4 w-4 shrink-0 text-violet-400 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="pt-8">
                {tier.isPopular ? (
                  <button className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 font-semibold text-sm transition-all text-white shadow-md shadow-violet-600/20 hover:shadow-violet-600/35">
                    {tier.cta}
                  </button>
                ) : (
                  <button className="w-full py-3 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-900/30 text-slate-300 hover:text-white font-medium text-sm transition-all">
                    {tier.cta}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="pt-12 border-t border-slate-900 max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-200">How is the morning note compiled?</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Our servers pull closing data from US indices (4:00 PM EST/1:30 AM IST) and Asian live tickers (6:30 AM IST) to feed into a financial intelligence model that generates the analysis by 8:15 AM.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-200">What is the advantage of Pro Trader?</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Active traders get a summary of GIFT Nifty premium trends, volatility spikes, and structural FII options data delivered directly via WhatsApp so you do not even have to log in.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-200">Are Nifty predictions 100% accurate?</h3>
              <p className="text-xs text-slate-400 leading-normal">
                No system can guarantee perfect openings due to sudden pre-open market orders between 9:00 AM and 9:08 AM. However, GIFT Nifty arbitrage and US sentiment yield a 90%+ correlation.
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-200">Can I cancel my subscription anytime?</h3>
              <p className="text-xs text-slate-400 leading-normal">
                Yes, our subscriptions are billed on a month-to-month basis. You can cancel, downgrade, or upgrade your account directly from your dashboard profile at any time.
              </p>
            </div>
          </div>
        </div>

      </main>

      <DashboardFooter />
    </div>
  );
}
