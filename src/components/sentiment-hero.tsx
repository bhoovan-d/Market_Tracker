import React from 'react';
import { mockSentimentData, SentimentType } from '@/lib/mockData';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { useMode } from '@/context/ModeContext';

interface SentimentHeroProps {
  data?: any;
  loading?: boolean;
  actualResult?: any;
}

const sentimentConfigs: Record<SentimentType, {
  label: string;
  colorClass: string;
  bgColorClass: string;
  borderColorClass: string;
  description: string;
  descriptionSimple: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  STRONG_GAP_DOWN: {
    label: 'Strong Gap Down',
    colorClass: 'text-rose-500',
    bgColorClass: 'bg-rose-500/10',
    borderColorClass: 'border-rose-500/20',
    description: 'Indicating significant overnight global sell-off. Heavy downside opening expected.',
    descriptionSimple: 'World stock markets fell heavily last night. The Indian market is expected to open with a big drop.',
    icon: TrendingDown,
  },
  GAP_DOWN: {
    label: 'Gap Down',
    colorClass: 'text-rose-400',
    bgColorClass: 'bg-rose-500/5',
    borderColorClass: 'border-rose-500/15',
    description: 'Overnight cues are leaning negative. Expect a soft opening below yesterday\'s close.',
    descriptionSimple: 'World stock markets were slightly down last night. The Indian market is likely to open a bit lower than yesterday.',
    icon: TrendingDown,
  },
  NEUTRAL: {
    label: 'Neutral',
    colorClass: 'text-slate-400',
    bgColorClass: 'bg-slate-500/10',
    borderColorClass: 'border-slate-500/20',
    description: 'Mixed global inputs. Market expected to open flat near yesterday\'s closing levels.',
    descriptionSimple: 'Mixed signals from global markets. The Indian market is expected to open flat, with little to no change.',
    icon: Minus,
  },
  GAP_UP: {
    label: 'Gap Up',
    colorClass: 'text-emerald-400',
    bgColorClass: 'bg-emerald-500/5',
    borderColorClass: 'border-emerald-500/15',
    description: 'Favorable overnight cues. Expect a solid opening above yesterday\'s close.',
    descriptionSimple: 'World stock markets rose last night. The Indian market is likely to open higher than yesterday.',
    icon: TrendingUp,
  },
  STRONG_GAP_UP: {
    label: 'Strong Gap Up',
    colorClass: 'text-emerald-500',
    bgColorClass: 'bg-emerald-500/10',
    borderColorClass: 'border-emerald-500/20',
    description: 'Strong bullish tailwinds globally. Heavy upside momentum anticipated at the open.',
    descriptionSimple: 'World stock markets saw a massive rally last night. The Indian market is expected to open with big gains.',
    icon: TrendingUp,
  },
};

export default function SentimentHero({ data, loading, actualResult }: SentimentHeroProps) {
  const { isSimple } = useMode();

  if (loading) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-slate-900 bg-slate-950/40 p-6 sm:p-8 animate-pulse">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-grow space-y-4">
            <div className="h-4 bg-slate-900 rounded w-1/3"></div>
            <div className="h-10 bg-slate-900 rounded w-1/2"></div>
            <div className="h-4 bg-slate-900 rounded w-3/4"></div>
          </div>
          <div className="w-64 h-32 bg-slate-900 rounded-xl"></div>
        </div>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-rose-950/30 bg-rose-950/5 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div className="h-10 w-10 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-450">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">Unable to Predict Market Mood</h3>
            <p className="text-xs text-slate-400 max-w-md mt-1">
              Could not retrieve live macroeconomic data or generate the market sentiment forecast. Check your connection or Gemini API key configuration.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const config = sentimentConfigs[data.sentiment as SentimentType] || sentimentConfigs.NEUTRAL;
  const IconComponent = config.icon;

  // Gauge angle calculation (0 is -90deg, 100 is 90deg)
  const needleRotation = (data.gaugeValue / 100) * 180 - 90;

  const isResolved = actualResult && actualResult.accuracy !== 'PENDING';

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-slate-950/40 p-6 sm:p-8 shadow-xl backdrop-blur-sm">
      {/* Background radial highlight */}
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />
      <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-slate-500/5 blur-3xl" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        
        {/* Left Content Column */}
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/60 text-xs font-mono text-slate-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
            </span>
            <span>
              Target: Nifty 50 Index opening price at 9:15 AM IST on {isResolved ? actualResult.dayLabel : (data.dayLabel || 'Next Session')}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {isSimple ? 'Predicted Mood: ' : 'Predicted Sentiment: '}<span className={config.colorClass}>{config.label}</span>
            </h1>
            <p className="text-xl sm:text-2xl font-mono text-slate-300 font-medium">
              Predicted Opening Gap: <span className={data.gaugeValue >= 50 ? 'text-emerald-400' : 'text-rose-400'}>{data.predictedOpeningDiff}</span>
            </p>
          </div>

          <p className="text-base text-slate-300 leading-relaxed max-w-lg mx-auto lg:mx-0">
            {isSimple ? config.descriptionSimple : config.description} {isSimple ? 'Checked against international market indicators, oil prices, and dollar trends before the Indian market opens.' : 'Checked against GIFT Nifty premium, global index closings, futures trading, bond yields, and commodity trends.'}
          </p>

          {/* Actual Open Result Section */}
          {actualResult && actualResult.accuracy !== 'PENDING' && (
            <div className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 max-w-lg mx-auto lg:mx-0 text-left ${
              actualResult.accuracy === 'CORRECT'
                ? 'bg-emerald-500/5 border-emerald-500/15'
                : actualResult.accuracy === 'PARTIAL'
                  ? 'bg-amber-500/5 border-amber-500/15'
                  : 'bg-rose-500/5 border-rose-500/15'
            }`}>
              <div className="flex items-center justify-between mb-3 border-b border-slate-900 pb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border ${
                    actualResult.accuracy === 'CORRECT'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : actualResult.accuracy === 'PARTIAL'
                        ? 'bg-amber-500/10 text-amber-450 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-450 border-rose-500/20'
                  }`}>
                    Forecast {actualResult.accuracy}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Market Outcome</span>
                </div>
                {actualResult.actual.niftyChangePoints !== undefined && (
                  <span className={`text-[11px] font-mono font-bold flex items-center gap-0.5 ${
                    actualResult.actual.direction === 'UP' 
                      ? 'text-emerald-400' 
                      : actualResult.actual.direction === 'DOWN' 
                        ? 'text-rose-400' 
                        : 'text-slate-400'
                  }`}>
                    Nifty {actualResult.actual.direction === 'UP' ? 'Closed Up' : actualResult.actual.direction === 'DOWN' ? 'Closed Down' : 'Flat'}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs mb-3">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Actual Open</span>
                  <span className="font-extrabold text-slate-100 text-sm">
                    {actualResult.actual.niftyOpen ? actualResult.actual.niftyOpen.toLocaleString('en-IN') : 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Opening Gap</span>
                  {(() => {
                    const prevClose = actualResult.actual.niftyClose - actualResult.actual.niftyChangePoints;
                    const gap = actualResult.actual.niftyOpen - prevClose;
                    return (
                      <span className={`font-extrabold text-sm ${
                        gap > 0 ? 'text-emerald-400' : gap < 0 ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {gap > 0 ? '+' : ''}{gap.toFixed(2)}
                      </span>
                    );
                  })()}
                </div>
                {actualResult.actual.niftyClose > 0 && (
                  <>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Actual Close</span>
                      <span className="font-extrabold text-slate-100 text-sm">
                        {actualResult.actual.niftyClose.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Daily Change</span>
                      <span className={`font-extrabold text-sm ${
                        actualResult.actual.niftyChangePoints > 0 ? 'text-emerald-400' : actualResult.actual.niftyChangePoints < 0 ? 'text-rose-400' : 'text-slate-400'
                      }`}>
                        {actualResult.actual.niftyChangePoints > 0 ? '+' : ''}{actualResult.actual.niftyChangePoints.toFixed(1)} ({actualResult.actual.niftyChangePercent})
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="bg-slate-950/30 p-3 rounded-lg border border-slate-900/60 space-y-1.5 font-sans">
                <span className="text-[10px] font-mono font-bold text-violet-400 uppercase tracking-wider block">
                  {isSimple ? "Why did this happen?" : "Transmission & Alignment Analysis"}
                </span>
                <p className="text-xs text-slate-355 leading-relaxed italic">
                  {isSimple ? actualResult.accuracyNoteSimple : actualResult.accuracyNote}
                </p>
              </div>
            </div>
          )}

          {/* Actual Open Pending Section */}
          {actualResult && actualResult.accuracy === 'PENDING' && (
            <div className="p-4 rounded-xl border border-slate-900 bg-slate-950/20 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-violet-400">
                  Awaiting Opening Bell
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic font-sans">
                {isSimple 
                  ? 'Waiting for Nifty 50 to open at 9:15 AM IST to compute the actual outcome and compare it with our prediction.'
                  : 'Awaiting regular market opening bell to cross-reference Nifty 50 opening print with pre-market predictions.'}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center lg:justify-start gap-1.5 text-sm text-slate-400">
            <Info className="h-3.5 w-3.5" />
            <span>Updated {data.lastUpdated}</span>
          </div>
        </div>

        {/* Right Gauge Column */}
        <div className="flex flex-col items-center justify-center bg-slate-900/30 p-6 rounded-xl border border-slate-900/70 min-w-[280px]">
          <div className="relative w-64 h-32 flex items-center justify-center overflow-hidden">
            {/* SVG Arc Gauge */}
            <svg viewBox="0 0 100 50" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" /> {/* Bearish Rose */}
                  <stop offset="25%" stopColor="#fb923c" /> {/* Orange */}
                  <stop offset="50%" stopColor="#64748b" /> {/* Slate Neutral */}
                  <stop offset="75%" stopColor="#34d399" /> {/* Emerald-400 */}
                  <stop offset="100%" stopColor="#10b981" /> {/* Emerald-500 */}
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              {/* Outer gauge track */}
              <path
                d="M 10 46 A 40 40 0 0 1 90 46"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Colored active gradient arc */}
              <path
                d="M 10 46 A 40 40 0 0 1 90 46"
                fill="none"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                className="opacity-90"
              />

              {/* Central base node */}
              <circle cx="50" cy="46" r="5" fill="#f8fafc" />
              <circle cx="50" cy="46" r="2.5" fill="#0f172a" />

              {/* Indicator Needle */}
              <g transform={`rotate(${needleRotation} 50 46)`} className="transition-transform duration-1000 ease-out">
                <line
                  x1="50"
                  y1="46"
                  x2="50"
                  y2="10"
                  stroke="#f8fafc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                <polygon
                  points="48,46 52,46 50,8"
                  fill="#f8fafc"
                />
              </g>
            </svg>

            {/* Gauge overlay text */}
            <div className="absolute bottom-1 text-center">
              <span className="text-2xl font-bold tracking-tight font-mono">{data.gaugeValue}%</span>
              <span className="block text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                {isSimple ? 'Market Mood Score' : 'Sentiment Score'}
              </span>
            </div>
          </div>

          {/* Sub-gauge scale labels */}
          <div className="flex w-64 justify-between text-xs font-mono text-slate-400 mt-2 px-1">
            <span>BEARISH</span>
            <span>NEUTRAL</span>
            <span>BULLISH</span>
          </div>
        </div>

      </div>
    </section>
  );
}
