'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard-header';
import SentimentHero from '@/components/sentiment-hero';
import MorningNote from '@/components/morning-note';
import OvernightTracker from '@/components/overnight-tracker';
import MarketGrid from '@/components/market-grid';
import DashboardFooter from '@/components/dashboard-footer';
import { Sparkles, RefreshCw } from 'lucide-react';
import DailyConceptCard from '@/components/daily-concept-card';
import MacroCalendar from '@/components/macro-calendar';
import AccuracyScorecard from '@/components/accuracy-scorecard';

export default function Home() {
  const [tickers, setTickers] = useState<any[] | null>(null);
  const [sentiment, setSentiment] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('intel');

  const loadData = async (type: 'init' | 'poll' | 'force' = 'init') => {
    if (type === 'poll' || type === 'force') setRefreshing(true);
    else setLoading(true);

    try {
      // 1. Fetch live market telemetry
      const marketRes = await fetch('/api/market-data');
      let currentTickers = null;
      
      if (marketRes.ok) {
        const marketJson = await marketRes.json();
        if (marketJson.success && marketJson.data) {
          setTickers(marketJson.data);
          currentTickers = marketJson.data;
        } else {
          setTickers(null);
        }
      } else {
        setTickers(null);
      }

      // 2. Fetch live AI Morning Note passing the fresh telemetry (only on init or force)
      if (type === 'init' || type === 'force') {
        if (!currentTickers) {
          setSentiment(null);
          setLoading(false);
          setRefreshing(false);
          return;
        }

        const aiRes = await fetch('/api/generate-note', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tickers: currentTickers, forceRefresh: type === 'force' })
        });

        if (aiRes.ok) {
          const aiJson = await aiRes.json();
          if (aiJson.success && aiJson.data) {
            setSentiment(aiJson.data);
          } else {
            setSentiment(null);
          }
        } else {
          setSentiment(null);
        }
      }
    } catch (e) {
      console.error('Failed to reload pre-market data:', e);
      if (type === 'init' || type === 'force') {
        setSentiment(null);
        setTickers(null);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData('init');
    // Auto-poll every 2 minutes (fetch market telemetry only to save Gemini API credits)
    const interval = setInterval(() => {
      loadData('poll');
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-slate-100">
      {/* Header */}
      <DashboardHeader />

      {/* Main content body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Live Refresh Status Banner */}
        <div className="flex items-center justify-between text-sm font-mono text-slate-400 bg-slate-950/20 px-4 py-2.5 rounded-lg border border-slate-900">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${refreshing ? 'bg-violet-400 animate-spin' : 'bg-emerald-500 animate-pulse'}`} />
            <span>{refreshing ? 'Syncing active data feeds...' : 'Terminal synchronized with live global exchanges'}</span>
          </div>
          <button
            onClick={() => loadData('force')}
            disabled={loading || refreshing}
            className="flex items-center gap-1.5 text-sm hover:text-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Force Update</span>
          </button>
        </div>

        {/* Hero Section: Gauge & prediction details */}
        <SentimentHero data={sentiment} loading={loading} />

        {/* Notes & Telemetry Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (takes 2 cols on wide screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Custom Tab Selector */}
            <div className="flex border-b border-slate-900 pb-px gap-1 overflow-x-auto shrink-0 font-mono scrollbar-none">
              <button
                onClick={() => setActiveTab('intel')}
                className={`px-4 py-2.5 text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'intel'
                    ? 'border-violet-500 text-violet-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-350'
                }`}
              >
                Pre-Market Intel
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2.5 text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'calendar'
                    ? 'border-violet-500 text-violet-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-350'
                }`}
              >
                Macro Calendar
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">6</span>
              </button>
              <button
                onClick={() => setActiveTab('accuracy')}
                className={`px-4 py-2.5 text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'accuracy'
                    ? 'border-violet-500 text-violet-400 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-350'
                }`}
              >
                Accuracy Scorecard
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">80%</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="space-y-6">
              {activeTab === 'intel' && (
                <>
                  <MorningNote data={sentiment} loading={loading} />
                  <OvernightTracker tickers={tickers} loading={loading} />
                </>
              )}



              {activeTab === 'calendar' && (
                <MacroCalendar />
              )}

              {activeTab === 'accuracy' && (
                <AccuracyScorecard />
              )}
            </div>
          </div>

          {/* Quick-links side-card and education block (takes 1 col) */}
          <div className="space-y-8 h-fit lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-slate-950/40 p-6 shadow-xl backdrop-blur-sm flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-900">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  <h3 className="text-base font-bold tracking-wider uppercase font-mono text-slate-200">Quick Diagnostics</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">Overnight US VIX (Volatility)</span>
                    <span className="font-mono font-semibold text-emerald-400">12.45 (-4.2%)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">India VIX (Prev. Close)</span>
                    <span className="font-mono font-semibold text-slate-300">13.12 (Flat)</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">FII Net Flow (Yesterday)</span>
                    <span className="font-mono font-semibold text-emerald-400">+₹1,432 Cr</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">DII Net Flow (Yesterday)</span>
                    <span className="font-mono font-semibold text-rose-400">-₹512 Cr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Macro Concept check card */}
            <DailyConceptCard />
          </div>

        </div>

        {/* Global Markets Grid */}
        <MarketGrid tickers={tickers} loading={loading} />

      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
