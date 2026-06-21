'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Clock, Info, ShieldAlert, BadgeInfo } from 'lucide-react';

interface CalendarEvent {
  id: string;
  name: string;
  category: string;
  schedule: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  analogy: string;
  pocketImpact: string;
  affectedSectors: string[];
}

const MACRO_EVENTS: CalendarEvent[] = [
  {
    id: 'us-fed',
    name: 'US Federal Reserve Rate Decision',
    category: 'Central Bank Policy',
    schedule: 'Scheduled 8 times a year (Next: July 29th)',
    importance: 'HIGH',
    analogy: 'Think of US interest rates like a massive financial gravity elevator. When the US Federal Reserve raises rates, the elevator ascends, pulling global dollars back to the US because safe US bonds are now paying higher interest. When US rates drop, the gravity weakens, and dollars flow back down to high-growth markets like India.',
    pocketImpact: 'If the US Fed hikes rates, expect foreign institutional investors (FIIs) to sell Indian shares and pull capital back to safe US assets. This usually weakens the Indian Rupee and causes short-term falls in your mutual funds/stocks.',
    affectedSectors: ['IT Services (large US clients)', 'Banking & Financials', 'Exporters']
  },
  {
    id: 'rbi-mpc',
    name: 'RBI Repo Rate Decision (MPC)',
    category: 'Central Bank Policy',
    schedule: 'Bi-monthly policy meetings (Next: August 6th)',
    importance: 'HIGH',
    analogy: 'Like the head of a joint family adjusting the home loan credit limit. If family members are spending too aggressively and prices of groceries (inflation) are rising, the head increases the lending interest rate to discourage borrowing, slowing down overall spending to cool prices down.',
    pocketImpact: 'If RBI hikes the Repo Rate, banks will increase interest rates on home, car, and personal loans, increasing your EMIs. On the flip side, bank fixed deposit (FD) interest rates will also rise.',
    affectedSectors: ['Real Estate & Housing', 'Automobiles (loan-dependent buying)', 'Banking (net interest margins)']
  },
  {
    id: 'cpi-inflation',
    name: 'India CPI Inflation Release',
    category: 'Economic Indicator',
    schedule: '12th of every month at 5:30 PM IST',
    importance: 'HIGH',
    analogy: 'The monthly grocery and energy bill of the nation. If this bill rises too high, the family has less money left over to spend on dining out, multiplexes, new clothes, or electronic gadgets.',
    pocketImpact: 'High inflation eats into corporate profit margins and forces the RBI to keep interest rates high (which keeps loan EMIs high). Lower inflation means RBI might cut interest rates in the future, boosting stock markets.',
    affectedSectors: ['FMCG & Consumer Goods', 'Retail & Entertainment', 'Automobiles']
  },
  {
    id: 'gdp-data',
    name: 'India GDP Growth Data',
    category: 'Economic Indicator',
    schedule: 'Quarterly (End of May, Aug, Nov, Feb)',
    importance: 'MEDIUM',
    analogy: 'The school report card of the Indian economy. If the growth score is high (above 7%), it proves the country is growing fast, which attracts foreign investors who want to invest in high-performing markets.',
    pocketImpact: 'A strong GDP report confirms that businesses are growing, leading to higher corporate earnings, potential salary hikes, and general optimism, which drives stock prices upward over the long term.',
    affectedSectors: ['Infrastructure & Cement', 'Banking & Finance', 'All Growth Sectors']
  },
  {
    id: 'weekly-expiry',
    name: 'Weekly Options Expiry (Nifty/Bank Nifty)',
    category: 'Market Settlement',
    schedule: 'Every Thursday before 3:30 PM IST',
    importance: 'MEDIUM',
    analogy: 'The final high-pressure overs of a T20 cricket match. Institutional buyers and sellers battle to settle their options contract bets. Expect quick boundary shots (large index swings) and sudden shifts in direction as the clock ticks down.',
    pocketImpact: 'You will notice high price volatility and quick swings on Thursdays. Retail investors should avoid buying weekly options on this day, as "theta decay" (timer penalty) burns premium values extremely fast.',
    affectedSectors: ['Index Funds', 'Broking Companies', 'High Beta Stocks']
  },
  {
    id: 'union-budget',
    name: 'The Union Budget of India',
    category: 'Government Policy',
    schedule: 'Annually on February 1st',
    importance: 'HIGH',
    analogy: 'The annual family planning budget sheet. The government lists exactly how much money it will earn (taxes) and where it will spend it (roads, railways, defense, welfare schemes). It determines which sectors get incentives and which ones get taxed.',
    pocketImpact: 'If the budget changes income tax slabs, it directly affects how much salary you take home. It also determines if capital gains tax on your stocks/mutual funds goes up or down.',
    affectedSectors: ['Infrastructure & Railways', 'Defense Manufacturing', 'Capital Goods']
  }
];

export default function MacroCalendar() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="rounded-2xl border border-border bg-slate-950/40 p-6 shadow-xl backdrop-blur-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Calendar className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-slate-200">Macro Economic Calendar</h3>
            <span className="text-[10px] text-slate-500 font-mono">Plain-English Guides to Major Market Shifters</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-[9px] font-mono text-slate-400">
          <span>6 Active Calendars</span>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed font-sans">
        Global and local economic events act as triggers for stock market movements. Click any event below to see why it happens and how it impacts your investments.
      </p>

      {/* Events List */}
      <div className="space-y-3 font-sans">
        {MACRO_EVENTS.map((event) => {
          const isExpanded = expandedId === event.id;
          return (
            <div 
              key={event.id}
              className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                isExpanded 
                  ? 'border-violet-500/30 bg-slate-900/60' 
                  : 'border-slate-850 bg-slate-900/10 hover:bg-slate-900/30'
              }`}
            >
              {/* Event Header row */}
              <button
                onClick={() => toggleExpand(event.id)}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer focus:outline-none"
              >
                <div className="space-y-1.5 flex-1 pr-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-100">{event.name}</span>
                    <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      event.importance === 'HIGH' 
                        ? 'bg-rose-500/10 border border-rose-500/20 text-rose-450'
                        : 'bg-amber-500/10 border border-amber-500/20 text-amber-450'
                    }`}>
                      {event.importance} IMPACT
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono">
                    <span>{event.category}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.schedule}
                    </span>
                  </div>
                </div>
                <div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-850/60 space-y-4 animate-in fade-in duration-200">
                  
                  {/* Analogy explanation */}
                  <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                      <Info className="h-3.5 w-3.5 shrink-0" />
                      <span>Everyday Analogy</span>
                    </div>
                    <p className="text-xs text-slate-350 leading-relaxed font-sans italic">
                      "{event.analogy}"
                    </p>
                  </div>

                  {/* Wallet impact */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-slate-450 uppercase tracking-wider block">
                      Wallet Impact (What it means for you):
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {event.pocketImpact}
                    </p>
                  </div>

                  {/* Sectors affected */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-mono font-bold text-slate-450 uppercase tracking-wider block">
                      Highly Affected Sectors:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {event.affectedSectors.map((sector, sIdx) => (
                        <span 
                          key={sIdx}
                          className="text-[10px] px-2.5 py-1 rounded bg-violet-500/10 border border-violet-500/20 text-violet-400 font-medium"
                        >
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
