'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Clock, ShieldAlert, CreditCard, LogIn, Menu, X, History } from 'lucide-react';
import { useMode } from '@/context/ModeContext';

export default function DashboardHeader() {
  const pathname = usePathname();
  const { mode, toggleMode, isSimple } = useMode();
  const [timeStr, setTimeStr] = useState<string>('');
  const [dateTooltip, setDateTooltip] = useState<string>('');
  const [marketStatus, setMarketStatus] = useState<{ status: string; color: string }>({
    status: 'Pre-Market Session',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      // Calculate IST time (UTC + 5:30)
      const now = new Date();
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istTime = new Date(utc + 3600000 * 5.5);
      
      const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      
      const dateOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      };

      const timeFormatted = istTime.toLocaleTimeString('en-US', timeOptions);
      const dateFormatted = istTime.toLocaleDateString('en-US', dateOptions);
      setTimeStr(`${timeFormatted} IST`);
      setDateTooltip(dateFormatted);

      // Determine Indian market status based on IST clock
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const day = istTime.getDay(); // 0 is Sunday, 6 is Saturday

      if (day === 0 || day === 6) {
        setMarketStatus({
          status: 'Market Closed (Weekend)',
          color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
        });
      } else if (hours < 9) {
        setMarketStatus({
          status: 'Pre-Market Analysis Active',
          color: 'text-violet-400 bg-violet-500/10 border-violet-500/20 animate-pulse'
        });
      } else if (hours === 9 && minutes < 8) {
        setMarketStatus({
          status: 'Pre-Open Order Entry',
          color: 'text-amber-400 bg-amber-400/10 border-amber-400/20 animate-pulse-glow'
        });
      } else if (hours === 9 && minutes >= 8 && minutes < 15) {
        setMarketStatus({
          status: 'Pre-Open Price Matching',
          color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
        });
      } else if ((hours === 9 && minutes >= 15) || (hours > 9 && hours < 15) || (hours === 15 && minutes < 30)) {
        setMarketStatus({
          status: 'NSE / BSE Market Live',
          color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20 animate-pulse-glow'
        });
      } else {
        setMarketStatus({
          status: 'Market Closed (Post-Session)',
          color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { label: 'Market Intel', href: '/', icon: TrendingUp },
    { label: 'Past Predictions', href: '/history', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[#09090b]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-500 to-violet-600 font-bold text-white transition-transform group-hover:scale-105 shadow-lg shadow-violet-600/30">
                🤝
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-violet-400 bg-clip-text text-transparent">
                  Nifty
                </span>
                <span className="text-xs font-semibold text-violet-400 block -mt-1 tracking-wider uppercase font-mono">
                  Pulse
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mode Toggle sliding pill - Desktop */}
          <div className="hidden lg:flex items-center">
            <button
              onClick={toggleMode}
              className="relative flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-full p-1 cursor-pointer w-[150px] h-9 select-none overflow-hidden transition-all hover:border-violet-500/50"
              title="Toggle between Expert Mode (technical details) and Simple Mode (plain-language explanations)"
            >
              {/* Sliding backdrop */}
              <div 
                className={`absolute top-0.5 bottom-0.5 w-[71px] rounded-full bg-gradient-to-r from-violet-500 to-violet-600 shadow-md transition-all duration-300 ${
                  isSimple ? 'left-1' : 'left-[75px]'
                }`}
              />
              <span className={`relative z-10 w-[71px] text-center text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                isSimple ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}>
                Simple
              </span>
              <span className={`relative z-10 w-[71px] text-center text-xs font-extrabold uppercase tracking-wider transition-colors duration-300 ${
                !isSimple ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}>
                Expert
              </span>
            </button>
          </div>

          {/* Market Status & Clock */}
          <div className="flex items-center gap-3 text-sm font-mono whitespace-nowrap">
            {/* Clock */}
            <div 
              className="hidden sm:flex items-center gap-1.5 text-sm font-mono text-slate-400 bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800/60 whitespace-nowrap"
              title={`Today: ${dateTooltip}`}
            >
              <Clock className="h-3.5 w-3.5 text-violet-400" />
              <span>{timeStr || 'Loading IST...'}</span>
            </div>

            {/* Status dot */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border whitespace-nowrap ${marketStatus.color}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
              </span>
              <span className="font-semibold">{marketStatus.status}</span>
            </div>
          </div>

          {/* Mobile Menu Toggle (only if links grow) */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-900/60 border border-slate-800"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-900 bg-[#09090b] px-4 py-4 space-y-3 animate-in fade-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold transition-all ${
                    isActive
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Mode Toggle */}
          <div className="border-t border-slate-900 pt-3">
            <div className="flex items-center justify-between px-3">
              <span className="text-xs text-slate-400 font-medium">Reading Mode:</span>
              <button
                onClick={toggleMode}
                className="relative flex items-center justify-between bg-slate-900 border border-slate-800 rounded-full p-1 cursor-pointer w-[180px] h-8 select-none overflow-hidden transition-all"
              >
                <div 
                  className={`absolute top-0.5 bottom-0.5 w-[86px] rounded-full bg-gradient-to-r from-violet-500 to-violet-600 shadow-md transition-all duration-300 ${
                    isSimple ? 'left-0.5' : 'left-[90px]'
                  }`}
                />
                <span className={`relative z-10 w-[86px] text-center text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  isSimple ? 'text-white' : 'text-slate-500'
                }`}>
                  Simple
                </span>
                <span className={`relative z-10 w-[86px] text-center text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                  !isSimple ? 'text-white' : 'text-slate-500'
                }`}>
                  Expert
                </span>
              </button>
            </div>
          </div>

          {/* Clock */}
          <div className="border-t border-slate-900 pt-3">
            <div className="flex items-center gap-2 text-sm font-mono text-slate-400 px-3">
              <Clock className="h-3.5 w-3.5 text-violet-400" />
              <span>{timeStr || 'Loading IST...'}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
