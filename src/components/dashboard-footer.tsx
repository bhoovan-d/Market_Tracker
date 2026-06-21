import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Terminal, Info } from 'lucide-react';

export default function DashboardFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-[#05070a] py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Disclaimer Panel */}
        <div className="rounded-xl border border-rose-500/10 bg-rose-500/5 p-4 flex gap-3 text-xs text-rose-300/80 leading-relaxed max-w-4xl">
          <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold block text-rose-400">Risk Disclosure / Disclaimer</span>
            <p>
              Investment in securities market are subject to market risks. Read all the related documents carefully before investing. 
              The information and predictions displayed on this dashboard are generated based on overnight global market telemetry and 
              AI synthesis models. These predictions (e.g. Gap Up/Down) are for educational purposes only and do not constitute direct trading tips, 
              buy/sell recommendations, or investment advice. Nifty Pulse holds no responsibility for any trading losses incurred.
            </p>
          </div>
        </div>

        {/* Links & Attributions */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pt-4 border-t border-slate-900 text-xs text-slate-500">
          
          {/* Logo & Stack */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Terminal className="h-4 w-4 text-violet-500" />
              <span>Nifty Pulse Terminal v1.0</span>
            </div>
            <p className="max-w-xs leading-normal">
              Aggregating US (Nasdaq, S&P 500), Asian (Nikkei, Hang Seng), and Commodity (Brent Crude) telemetry to decipher the Indian pre-market session.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono">
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Platform</span>
              <ul className="space-y-1">
                <li><Link href="/" className="hover:text-slate-300 transition-colors">Market Intel</Link></li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">APIs & Integrations</span>
              <ul className="space-y-1">
                <li><a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">Finnhub API</a></li>
                <li><a href="https://www.alphavantage.co" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">Alpha Vantage</a></li>
                <li><a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">Supabase Database</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-mono pt-4 border-t border-slate-900/60">
          <span>&copy; {new Date().getFullYear()} Nifty Pulse. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">SEBI Disclosures</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
