import React, { useState } from 'react';
import { mockSentimentData, SectorImpact } from '@/lib/mockData';
import { Brain, ArrowUpRight, ArrowDownRight, Equal, Sparkles, Globe, TrendingUp, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useMode } from '@/context/ModeContext';
import JargonWrapper from '@/components/jargon-wrapper';

interface MorningNoteProps {
  data: any;
  loading?: boolean;
}

export default function MorningNote({ data, loading }: MorningNoteProps) {
  const { isSimple } = useMode();

  // State to track which briefing bullets are expanded (first is open by default)
  const [expandedBullets, setExpandedBullets] = useState<Record<number, boolean>>({ 0: true });

  if (loading) {
    return (
      <article className="rounded-2xl border border-slate-900 bg-slate-950/40 p-6 sm:p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-900 rounded w-1/4"></div>
        <div className="space-y-4">
          <div className="h-20 bg-slate-900 rounded"></div>
          <div className="h-20 bg-slate-900 rounded"></div>
        </div>
      </article>
    );
  }

  if (!data) {
    return (
      <article className="rounded-2xl border border-slate-900 bg-slate-950/40 p-8 shadow-xl backdrop-blur-sm text-center">
        <p className="text-sm text-slate-500">AI Morning Note briefing is currently unavailable.</p>
      </article>
    );
  }

  const toggleBullet = (idx: number) => {
    setExpandedBullets(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <article className="rounded-2xl border border-border bg-slate-950/40 p-6 sm:p-8 shadow-xl backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
              {isSimple ? 'Nifty Pulse Explains' : 'AI Morning Note'}
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              {isSimple ? 'Simple, jargon-free morning guidance' : 'Synthesized Overnight Market Intelligence'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Confidence Score Badge */}
          {data.confidenceScore !== undefined && (() => {
            const score = data.confidenceScore!;
            const confColors = score >= 7
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
              : score >= 5
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
              : 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            const confLabel = score >= 7 ? 'High Confidence' : score >= 5 ? 'Mixed Signals' : 'Low Confidence';
            return (
              <div className={`inline-flex flex-col items-start px-2.5 py-1 rounded-md border ${confColors}`} title={data.confidenceNote}>
                <span className="text-xs font-bold uppercase tracking-wider font-mono opacity-70">AI Confidence</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold font-mono">{score}/10</span>
                  <span className="text-xs font-semibold font-mono">{confLabel}</span>
                </div>
              </div>
            );
          })()}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400 uppercase tracking-wider font-mono">
            <Sparkles className="h-3 w-3" />
            Gemini {isSimple ? '(Simple)' : '(Expert)'}
          </div>
        </div>
      </div>

      {/* Model Reasoning */}
      {data.confidenceNote && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
          <Sparkles className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
          <div className="text-base text-slate-200 leading-relaxed">
            <span className="font-semibold text-slate-100">Pre-market reasoning: </span>
            <JargonWrapper text={data.confidenceNote} />
          </div>
        </div>
      )}

      {/* Quantitative Trading Levels */}
      {data.pivots && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-300 font-mono">
              {isSimple ? "Key Numbers to Watch Today" : "Quantitative Trading Levels"}
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Pivot levels */}
            <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 space-y-3">
              <span className="text-xs font-bold text-slate-405 uppercase tracking-wider font-mono block">
                {isSimple ? "Support & Resistance" : "Classic Pivot Points"}
              </span>
              <div className="space-y-1 font-mono text-xs">
                <div className="flex justify-between items-center text-rose-450">
                  <span>R3 (Resistance 3)</span>
                  <span className="font-bold">{data.pivots.r3}</span>
                </div>
                <div className="flex justify-between items-center text-rose-450">
                  <span>R2 (Resistance 2)</span>
                  <span className="font-bold">{data.pivots.r2}</span>
                </div>
                <div className="flex justify-between items-center text-rose-500">
                  <span>R1 (Resistance 1)</span>
                  <span className="font-bold">{data.pivots.r1}</span>
                </div>
                <div className="flex justify-between items-center text-violet-400 bg-slate-900/50 py-0.5 px-1 rounded">
                  <span>P (Pivot Point)</span>
                  <span className="font-extrabold">{data.pivots.pivot}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-500">
                  <span>S1 (Support 1)</span>
                  <span className="font-bold">{data.pivots.s1}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-455">
                  <span>S2 (Support 2)</span>
                  <span className="font-bold">{data.pivots.s2}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-450">
                  <span>S3 (Support 3)</span>
                  <span className="font-bold">{data.pivots.s3}</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-450 leading-relaxed pt-1 font-sans italic border-t border-slate-900/60">
                {isSimple 
                  ? "Think of Pivot (P) as the balance level. S levels are safety nets where falling shares usually find support and bounce. R levels are ceilings where rising shares face selling pressure."
                  : "Classic Pivot levels computed from yesterday's High, Low, and Close. R1-R3 indicate upward friction levels, while S1-S3 define potential trend reversal supports."}
              </p>
            </div>

            {/* Column 2: Option Chain PCR */}
            <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 flex flex-col justify-between gap-3">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-405 uppercase tracking-wider font-mono block">
                  {isSimple ? "Trader Sentiment (Options)" : "Option Put-Call Ratio (PCR)"}
                </span>
                
                <div className="space-y-1 mt-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold font-mono text-violet-400">{data.pcr}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold border ${
                      data.pcrLabel?.includes('Bearish')
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                        : data.pcrLabel?.includes('Bullish')
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                    }`}>
                      {data.pcrLabel}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-[11px] text-slate-450 leading-relaxed font-sans italic border-t border-slate-900/60 pt-2">
                {isSimple
                  ? `For every 100 people betting on a fall, there are ${Math.round(data.pcr * 100)} people betting on a rise. Current ratio indicates a ${data.pcrLabel?.toLowerCase()} mindset among traders.`
                  : `Measures total put volume relative to call volume. A PCR of ${data.pcr} indicates options traders are building ${data.pcrLabel?.toLowerCase()} sentiment, which impacts derivative expiry ranges.`}
              </p>
            </div>

            {/* Column 3: Institutional Flows */}
            <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 flex flex-col justify-between gap-3">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-405 uppercase tracking-wider font-mono block">
                  {isSimple ? "Big Investor Activity" : "Institutional Net Flows"}
                </span>
                
                <div className="space-y-2.5 mt-2 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Foreign Funds (FII)</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      data.fiiFlow >= 0 
                        ? 'text-emerald-400 bg-emerald-500/10' 
                        : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {data.fiiFlow >= 0 ? '+' : ''}{data.fiiFlow.toLocaleString('en-IN')} Cr
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Domestic Funds (DII)</span>
                    <span className={`font-bold px-2 py-0.5 rounded ${
                      data.diiFlow >= 0 
                        ? 'text-emerald-400 bg-emerald-500/10' 
                        : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {data.diiFlow >= 0 ? '+' : ''}{data.diiFlow.toLocaleString('en-IN')} Cr
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-[11px] text-slate-450 leading-relaxed font-sans italic border-t border-slate-900/60 pt-2">
                {isSimple
                  ? "Foreign investors represent global capital entering or exiting our shares. Domestic funds are Indian mutual funds. When foreign funds sell, domestic funds often step in to support prices."
                  : "Tracks net buying/selling value in cash segment. FII activity mirrors global risk appetite for emerging markets, while DII represents domestic liquidity cushioning."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bullet Points / Global Trends */}
      <div className="space-y-4">
        {data.bullets.map((bullet: any, index: number) => {
          const isExpanded = !!expandedBullets[index];
          return (
            <div 
              key={index} 
              className={`rounded-xl border transition-all duration-200 shadow-md p-5 space-y-3 ${
                isExpanded 
                  ? 'border-violet-500/20 bg-slate-950/40' 
                  : 'border-slate-900 bg-slate-950/20 hover:border-slate-850 hover:bg-slate-950/30'
              }`}
            >
              {/* Collapsible Header row */}
              <button
                onClick={() => toggleBullet(index)}
                className="w-full flex items-center justify-between text-left cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 text-sm font-bold font-mono">
                    {index + 1}
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-100 tracking-tight">{bullet.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {isExpanded ? 'Collapse details' : 'Expand details'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Single-line Preview when collapsed */}
              {!isExpanded && (
                <p className="text-sm text-slate-400 line-clamp-1 font-sans pl-11">
                  <JargonWrapper text={isSimple ? (bullet.indianImpactSimple || bullet.indianImpact) : bullet.indianImpact} />
                </p>
              )}

              {/* Expanded details */}
              {isExpanded && (
                <div className="space-y-4 pt-2 sm:pl-11 animate-in fade-in slide-in-from-top-1 duration-200">
                  {/* Impact Grid (Global vs Indian transmission) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Global Trend */}
                    <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-900/60 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-slate-450 font-mono text-xs font-semibold uppercase tracking-wider">
                        <Globe className="h-3.5 w-3.5 text-violet-400" />
                        <span>{isSimple ? 'What Happened Globally?' : 'Global Trend Cue'}</span>
                      </div>
                      <div className="text-base text-slate-200 leading-relaxed font-sans">
                        <JargonWrapper text={isSimple ? (bullet.globalTrendSimple || bullet.globalTrend) : bullet.globalTrend} />
                      </div>
                    </div>

                    {/* Indian Impact */}
                    <div className="p-4 rounded-lg bg-violet-950/10 border border-violet-500/10 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-violet-400 font-mono text-xs font-semibold uppercase tracking-wider">
                        <TrendingUp className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
                        <span>{isSimple ? 'What it Means for India' : 'Indian Market Transmission'}</span>
                      </div>
                      <div className="text-base text-slate-200 leading-relaxed font-sans">
                        <JargonWrapper text={isSimple ? (bullet.indianImpactSimple || bullet.indianImpact) : bullet.indianImpact} />
                      </div>
                    </div>
                  </div>

                  {/* Companies affected suggestion box */}
                  {bullet.companiesAffected && bullet.companiesAffected.length > 0 && (
                    <div className="pt-1 space-y-3">
                      <span className="text-xs font-bold text-slate-450 uppercase tracking-wider font-mono block">
                        📂 Impacted Companies & Investor Suggestions
                      </span>
                      
                      <div className="space-y-3">
                        {bullet.companiesAffected.map((company: any, cIndex: number) => {
                          const effectBadge = company.effect === 'POSITIVE'
                            ? { label: 'Positive Impact', colors: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
                            : company.effect === 'NEGATIVE'
                            ? { label: 'Negative Impact', colors: 'text-rose-400 bg-rose-500/10 border-rose-500/20' }
                            : { label: 'Neutral / Mixed', colors: 'text-slate-400 bg-slate-500/10 border-slate-500/20' };

                          return (
                            <div 
                              key={cIndex}
                              className="flex flex-col lg:flex-row lg:items-stretch justify-between gap-4 p-4 rounded-lg border border-slate-900/80 bg-slate-950/80 hover:border-slate-800 transition-colors"
                            >
                              {/* Company Detail and Reason */}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                                    {company.symbol}
                                  </span>
                                  <span className="font-bold text-slate-100 text-base">{company.name}</span>
                                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono border ${effectBadge.colors}`}>
                                    {effectBadge.label}
                                  </span>
                                </div>
                                <div className="text-base text-slate-300 leading-relaxed font-sans">
                                  <JargonWrapper text={company.reason} />
                                </div>
                              </div>

                              {/* Investor Suggestion Box */}
                              <div className="lg:w-80 bg-[#0d1117]/80 p-3 rounded-lg border border-slate-900 flex flex-col justify-center space-y-1.5 shrink-0">
                                <div className="flex items-center gap-1.5">
                                  <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                                    Suggestion for Investor
                                  </span>
                                </div>
                                <div className="text-base text-slate-200 leading-normal font-sans italic pl-5">
                                  "<JargonWrapper text={company.actionableGuidance} />"
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggested Action for Today */}
      {data.suggestedAction && (
        <div className="space-y-4 pt-4 border-t border-slate-900">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-450">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider text-slate-300 font-mono">Suggested Action for Today</h3>
          </div>
          
          <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-5 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono block">Opening Strategy</span>
              <div className="text-lg text-slate-100 leading-relaxed font-sans">
                <JargonWrapper text={isSimple ? (data.suggestedAction.strategySimple || data.suggestedAction.strategy) : data.suggestedAction.strategy} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-emerald-500/10">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono block">Focus Sectors</span>
                <p className="text-base text-slate-200 leading-normal">{data.suggestedAction.sectorFocus}</p>
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-rose-450 uppercase tracking-wider font-mono block">Risk Warning</span>
                <div className="text-base text-slate-200 leading-normal font-sans">
                  <JargonWrapper text={isSimple ? (data.suggestedAction.riskWarningSimple || data.suggestedAction.riskWarning) : data.suggestedAction.riskWarning} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

