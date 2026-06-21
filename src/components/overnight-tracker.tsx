'use client';

import React from 'react';
import { MarketTicker } from '@/lib/mockData';
import { Clock, Landmark, Coins, Scale, Info, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useMode } from '@/context/ModeContext';

interface OvernightTrackerProps {
  tickers: MarketTicker[] | null;
  loading?: boolean;
}

interface TimelineEvent {
  time: string;
  title: string;
  status: 'Closed' | 'Live' | 'Active Snapshot';
  tickerIds: string[];
  explanation: string;
  explanationSimple: string;
  retailImpact: string;
  retailImpactSimple: string;
}

export default function OvernightTracker({ tickers, loading }: OvernightTrackerProps) {
  const { isSimple } = useMode();

  if (loading) {
    return (
      <article className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 sm:p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-900 rounded w-1/4"></div>
        <div className="h-48 bg-slate-900 rounded"></div>
      </article>
    );
  }

  if (!tickers || tickers.length === 0) {
    return (
      <article className="rounded-2xl border border-border bg-slate-950/40 p-6 sm:p-8 shadow-xl backdrop-blur-sm space-y-6">
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-900">
          <div className="flex items-center gap-2.5">
            <Clock className="h-5 w-5 text-slate-500" />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-400">Overnight Market Tracker</h2>
            </div>
          </div>
        </div>
        <div className="p-8 text-center text-slate-500 text-sm border border-dashed border-slate-900 rounded-xl">
          Telemetry data unavailable. Could not plot timeline sequence.
        </div>
      </article>
    );
  }

  const events: TimelineEvent[] = [
    {
      time: '01:30 AM IST',
      title: 'US Markets Closing Bell',
      status: 'Closed',
      tickerIds: ['nasdaq-100', 'sp-500'],
      explanation: 'Nasdaq and S&P 500 conclude active trading in New York. This sets the global "risk-on" or "risk-off" baseline sentiment for international investors.',
      explanationSimple: 'American stock markets finish their trading day in New York. This sets the initial positive or negative mood for global investors.',
      retailImpact: 'A strong tech close in the US typically boosts buying in Indian IT stocks (like TCS and Infosys) at the open, while a US sell-off prompts cautious openings.',
      retailImpactSimple: 'If US tech shares rise, Indian IT stocks (like TCS/Infosys) usually open higher. If US tech falls, expect our tech stocks to open lower.'
    },
    {
      time: '05:30 AM IST',
      title: 'East Asian Markets Open',
      status: 'Live',
      tickerIds: ['nikkei-225'],
      explanation: 'Tokyo (Nikkei 225) and Seoul (KOSPI) open for trading. They act as the first morning indicators of how Asian capital reacts to the US closing levels.',
      explanationSimple: 'Tokyo and Seoul markets start their day. They show how Asian investors are reacting to America\'s closing numbers.',
      retailImpact: 'Provides the first early-morning clue on Asian regional stability. If Nikkei rises, Nifty often opens stable or positive.',
      retailImpactSimple: 'Gives us the first morning clue. If Japan\'s market rises, the Indian market usually starts steady or positive.'
    },
    {
      time: '06:30 AM IST',
      title: 'GIFT Nifty Futures Active',
      status: 'Live',
      tickerIds: ['gift-nifty'],
      explanation: 'Indian stock index futures begin trading in GIFT City, Gujarat (formerly SGX Nifty in Singapore). This is the single most correlated indicator of Nifty\'s opening price.',
      explanationSimple: 'Indian stock index futures start trading in Gujarat (GIFT City). This is the single most important pointer of where Nifty will open.',
      retailImpact: 'The points premium or discount of GIFT Nifty directly dictates whether Nifty 50 opens with a "Gap Up", "Neutral", or "Gap Down" at 9:15 AM.',
      retailImpactSimple: 'A positive level here means Nifty will open higher (Gap Up), while a negative level means Nifty will open lower (Gap Down) at 9:15 AM.'
    },
    {
      time: '06:45 AM IST',
      title: 'Hong Kong Market Opens',
      status: 'Live',
      tickerIds: ['hang-seng'],
      explanation: 'The Hang Seng Index begins trading, representing Greater China macro sentiment and massive foreign capital flows.',
      explanationSimple: 'Hong Kong\'s market starts trading, representing China\'s business mood and major foreign fund movements.',
      retailImpact: 'High correlation with Indian banking, metals, and foreign institutional investor (FII) flows. Negative cues here can cap early Nifty gains.',
      retailImpactSimple: 'Highly linked to foreign fund actions. If Hong Kong falls, it might pull down Indian banking and metal stocks.'
    },
    {
      time: '08:30 AM IST',
      title: 'Macro Indicators Check',
      status: 'Active Snapshot',
      tickerIds: ['brent-crude', 'usd-inr', 'us-10y-bond'],
      explanation: 'Commodities and currencies consolidate before Indian trade. Crude oil, the US Dollar, and US Treasury yields settle into morning ranges.',
      explanationSimple: 'Key indicators like oil prices, the US Dollar value, and US government interest rates settle into their morning ranges.',
      retailImpact: 'Cheaper crude oil boosts Indian paints/autos. A falling USD/INR prevents foreign money from leaving Indian shares. Lower US bond yields are bullish for Nifty.',
      retailImpactSimple: 'Cheaper oil is great for paint and car companies. A weaker US Dollar keeps foreign funds from leaving India. Lower yields are bullish for Nifty.'
    }
  ];

  const getTickerData = (id: string) => {
    return tickers?.find(t => t.id === id);
  };

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'Closed':
        return 'text-slate-500 bg-slate-900 border-slate-800';
      case 'Live':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Active Snapshot':
        return 'text-violet-400 bg-violet-500/10 border-violet-500/20';
    }
  };

  return (
    <article className="rounded-2xl border border-border bg-slate-950/40 p-6 sm:p-8 shadow-xl backdrop-blur-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Overnight Market Tracker</h2>
            <p className="text-xs text-slate-500 font-mono">Chronological steps to the Indian opening bell</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <Info className="h-3.5 w-3.5" />
          <span>{isSimple ? 'Toggle Common Man/Expert mode for simplified cues' : 'Hover / click nodes for retail impact explanations'}</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="relative pl-4 sm:pl-6 border-l border-slate-800/80 space-y-10 py-4">
        {events.map((event, idx) => (
          <div key={idx} className="relative group">
            
            {/* Timeline Dot Indicator */}
            <span className={`absolute -left-[25px] sm:-left-[33px] top-1.5 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full border bg-[#09090b] transition-all group-hover:scale-110 ${
              event.status === 'Live' ? 'border-emerald-500 shadow-sm shadow-emerald-500/20' : 'border-slate-800'
            }`}>
              {event.status === 'Live' ? (
                <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
                </span>
              ) : (
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-slate-700" />
              )}
            </span>

            {/* Event Content Wrapper */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
              
              {/* Event Time and Title */}
              <div className="space-y-1.5 lg:col-span-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold font-mono text-violet-400">{event.time}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-mono border uppercase tracking-wider font-semibold ${getStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-100 group-hover:text-white transition-colors">{event.title}</h3>
                <p className="text-base text-slate-300 leading-relaxed pr-2">
                  {isSimple ? event.explanationSimple : event.explanation}
                </p>
              </div>

              {/* Tickers snapshot associated with this time */}
              <div className="flex flex-wrap gap-3 items-center lg:col-span-1 py-1">
                {event.tickerIds.map(tId => {
                  const ticker = getTickerData(tId);
                  if (!ticker) return null;
                  
                  const isUp = ticker.direction === 'UP';
                  const isDown = ticker.direction === 'DOWN';
                  const changeColor = isUp ? 'text-emerald-400' : isDown ? 'text-rose-400' : 'text-slate-400';
                  
                  const tickerContent = (
                    <div 
                      className="bg-slate-900/60 rounded-lg p-2.5 border border-slate-900 hover:border-slate-800 hover:bg-slate-900/40 transition-all font-mono min-w-[120px] flex-grow sm:flex-grow-0 group/tick"
                    >
                      <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center justify-between gap-1">
                        <span>{ticker.name}</span>
                        {ticker.sourceUrl && <ArrowUpRight className="h-2.5 w-2.5 opacity-0 group-hover/tick:opacity-80 transition-opacity text-slate-500 shrink-0" />}
                      </div>
                      <div className="text-xs font-bold text-slate-200 mt-0.5">{ticker.value}</div>
                      <div className={`text-[10px] font-semibold mt-0.5 flex items-center gap-0.5 ${changeColor}`}>
                        {isUp ? <ArrowUpRight className="h-3 w-3" /> : isDown ? <ArrowDownRight className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                        <span>{ticker.changePercent}</span>
                      </div>
                    </div>
                  );

                  return ticker.sourceUrl ? (
                    <a 
                      key={tId}
                      href={ticker.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-initial"
                    >
                      {tickerContent}
                    </a>
                  ) : (
                    <div key={tId} className="flex-1 sm:flex-initial">{tickerContent}</div>
                  );
                })}
              </div>

              {/* Retail Investor Impact Card */}
              <div className="lg:col-span-1 bg-slate-900/30 rounded-xl p-4 border border-slate-900 group-hover:border-slate-800/80 transition-colors space-y-1.5">
                <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase block">
                  💡 Significance for Today's Trade
                </span>
                <p className="text-base text-slate-200 leading-relaxed">
                  {isSimple ? event.retailImpactSimple : event.retailImpact}
                </p>
              </div>

            </div>

          </div>
        ))}
      </div>
    </article>
  );
}
