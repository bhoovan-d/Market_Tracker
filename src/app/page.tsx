'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard-header';
import SentimentHero from '@/components/sentiment-hero';
import MorningNote from '@/components/morning-note';
import OvernightTracker from '@/components/overnight-tracker';
import MarketGrid from '@/components/market-grid';
import DashboardFooter from '@/components/dashboard-footer';
import { Sparkles, RefreshCw } from 'lucide-react';
import MacroCalendar from '@/components/macro-calendar';
import AccuracyScorecard from '@/components/accuracy-scorecard';
import MarketNews from '@/components/market-news';


export default function Home() {
  const [tickers, setTickers] = useState<any[] | null>(null);
  const [sentiment, setSentiment] = useState<any | null>(null);
  const [historyData, setHistoryData] = useState<any[] | null>(null);
  const [historySummary, setHistorySummary] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('calendar');

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

      // 3. Fetch predictions history (both static and today's dynamic alignment)
      const historyRes = await fetch('/api/predictions-history');
      if (historyRes.ok) {
        const historyJson = await historyRes.json();
        if (historyJson.success) {
          setHistoryData(historyJson.data);
          setHistorySummary(historyJson.summary);
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
        {(() => {
          const getLatestOutcomeRecord = () => {
            if (!historyData || historyData.length === 0) return null;
            
            const now = new Date();
            const istTime = new Date(now.getTime() + (5.5 * 60 - now.getTimezoneOffset()) * 60000);
            const hours = istTime.getHours();
            const minutes = istTime.getMinutes();
            const timeInMinutes = hours * 60 + minutes;
            const marketOpenTime = 9 * 60 + 15; // 9:15 AM
            
            const formatter = new Intl.DateTimeFormat('en-CA', {
              timeZone: 'Asia/Kolkata',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
            const todayStr = formatter.format(istTime);

            // If past 9:15 AM IST, show today's active prediction vs. live outcome
            if (timeInMinutes >= marketOpenTime) {
              const todayRecord = historyData.find(item => item.date === todayStr);
              if (todayRecord) return todayRecord;
            }
            
            // Otherwise, show the most recent completed trading session (yesterday's prediction vs. outcome)
            const pastRecords = historyData.filter(item => item.date !== todayStr);
            const resolvedRecord = pastRecords.find(item => item.accuracy !== 'PENDING');
            if (resolvedRecord) return resolvedRecord;
            
            return historyData[0];
          };

          const latestOutcomeRecord = getLatestOutcomeRecord();
          
          const heroData = latestOutcomeRecord ? {
            sentiment: latestOutcomeRecord.prediction.sentiment,
            gaugeValue: latestOutcomeRecord.prediction.gaugeValue,
            predictedOpeningDiff: latestOutcomeRecord.prediction.predictedOpeningDiff,
            lastUpdated: latestOutcomeRecord.dayLabel,
          } : null;

          return (
            <div className="space-y-4">
              <div className="border-b border-slate-900 pb-2">
                <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-slate-400">
                  Latest Session Performance & Review
                </h3>
              </div>
              <SentimentHero 
                data={heroData} 
                actualResult={latestOutcomeRecord} 
                loading={loading} 
              />
            </div>
          );
        })()}

        {/* Section B: Pre-Market Intelligence Title */}
        <div className="border-b border-slate-900 pb-2 pt-4">
          <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-slate-400">
            Pre-Market Intelligence for {sentiment?.dayLabel || 'Upcoming Session'}
          </h3>
        </div>

        {/* Notes & Telemetry Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (takes 2 cols on wide screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Primary Pre-Market Intel Section (Core Focus) */}
            <MorningNote data={sentiment} loading={loading} />
            <OvernightTracker tickers={tickers} loading={loading} />

            {/* Supporting Tools and Scorecards Tabs Section */}
            <div className="pt-6 border-t border-slate-900 space-y-6">
              <div className="flex border-b border-slate-900 pb-px gap-1 overflow-x-auto shrink-0 font-mono scrollbar-none">
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
                  <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                    {historySummary ? `${historySummary.pct}%` : '80%'}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('news')}
                  className={`px-4 py-2.5 text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === 'news'
                      ? 'border-violet-500 text-violet-400 font-semibold'
                      : 'border-transparent text-slate-500 hover:text-slate-350'
                  }`}
                >
                  Market News
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold">LIVE</span>
                </button>
              </div>

              <div className="space-y-6">
                {activeTab === 'calendar' && (
                  <MacroCalendar />
                )}

                {activeTab === 'accuracy' && (
                  <AccuracyScorecard data={historyData} summary={historySummary} />
                )}

                {activeTab === 'news' && (
                  <MarketNews />
                )}
              </div>
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
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-slate-400">GIFT Nifty Futures</span>
                    {(() => {
                      const ticker = tickers?.find(t => t.id === 'gift-nifty');
                      if (!ticker) return <span className="text-slate-650">Loading...</span>;
                      const isUp = ticker.direction === 'UP';
                      return (
                        <span className={`font-semibold ${isUp ? 'text-emerald-400' : ticker.direction === 'DOWN' ? 'text-rose-400' : 'text-slate-400'}`}>
                          {ticker.value} ({ticker.changePercent})
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-slate-400">India VIX (Fear Gauge)</span>
                    {(() => {
                      const ticker = tickers?.find(t => t.id === 'india-vix');
                      if (!ticker) return <span className="text-slate-650">Loading...</span>;
                      const val = parseFloat(ticker.value) || 0;
                      const isHigh = val > 16;
                      return (
                        <span className={`font-semibold ${isHigh ? 'text-rose-450' : 'text-emerald-400'}`}>
                          {ticker.value} ({ticker.changePercent})
                        </span>
                      );
                    })()}
                  </div>
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-slate-400">Option Put-Call Ratio</span>
                    {sentiment?.pcr !== undefined ? (
                      <span className="font-semibold text-violet-400">
                        {sentiment.pcr} ({sentiment.pcrLabel?.split(' ')[0]})
                      </span>
                    ) : (
                      <span className="text-slate-650">Loading...</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-slate-400">FII Net Flow</span>
                    {sentiment?.fiiFlow !== undefined ? (
                      <span className={`font-semibold ${sentiment.fiiFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {sentiment.fiiFlow >= 0 ? '+' : ''}{sentiment.fiiFlow.toLocaleString('en-IN')} Cr
                      </span>
                    ) : (
                      <span className="text-slate-650">Loading...</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm font-mono">
                    <span className="text-slate-400">DII Net Flow</span>
                    {sentiment?.diiFlow !== undefined ? (
                      <span className={`font-semibold ${sentiment.diiFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {sentiment.diiFlow >= 0 ? '+' : ''}{sentiment.diiFlow.toLocaleString('en-IN')} Cr
                      </span>
                    ) : (
                      <span className="text-slate-650">Loading...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>


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
