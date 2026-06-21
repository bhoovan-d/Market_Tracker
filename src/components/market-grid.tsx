import React, { useState } from 'react';
import { mockTickersData, MarketTicker } from '@/lib/mockData';
import { ArrowUpRight, ArrowDownRight, Minus, Globe, Landmark, Coins, Scale, ChevronDown, ChevronUp } from 'lucide-react';
import { useMode } from '@/context/ModeContext';

interface MarketGridProps {
  tickers: MarketTicker[] | null;
  loading?: boolean;
}

export default function MarketGrid({ tickers, loading }: MarketGridProps) {
  const { isSimple } = useMode();
  const [showSupporting, setShowSupporting] = useState(false);

  if (loading) {
    return (
      <section className="space-y-4 animate-pulse">
        <div className="h-4 bg-slate-900 rounded w-1/6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-900 rounded-xl"></div>
          ))}
        </div>
      </section>
    );
  }

  if (!tickers || tickers.length === 0) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 font-mono">Global Market Indicators</h2>
        </div>
        <div className="rounded-xl border border-rose-950/30 bg-rose-950/5 p-8 shadow-xl backdrop-blur-sm text-center">
          <p className="text-sm text-rose-450 font-mono">Failed to load global market indicators. No live telemetry feed available.</p>
        </div>
      </section>
    );
  }

  const getCategoryIcon = (category: MarketTicker['category']) => {
    switch (category) {
      case 'INDEX':
        return <Landmark className="h-3.5 w-3.5 text-violet-400" />;
      case 'COMMODITY':
        return <Scale className="h-3.5 w-3.5 text-amber-500" />;
      case 'FOREX':
        return <Coins className="h-3.5 w-3.5 text-emerald-500" />;
      case 'BOND':
        return <Globe className="h-3.5 w-3.5 text-violet-400" />;
    }
  };

  // Sparkline SVG path helper
  const renderSparkline = (points: number[], direction: 'UP' | 'DOWN' | 'FLAT', tickerId: string) => {
    if (!points || points.length < 2) return null;
    
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min === 0 ? 1 : max - min;
    
    const width = 100;
    const height = 30; // Max height for sparkline inside card
    const padding = 3;
    
    const pointsCoords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      // Invert Y axis because SVG (0,0) is top-left
      const y = (height + padding) - ((val - min) / range) * height;
      return { x, y };
    });

    const pathD = `M ${pointsCoords.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
    const areaD = `${pathD} L ${width},${height + padding + 5} L 0,${height + padding + 5} Z`;
    
    const color = direction === 'UP' ? '#10b981' : direction === 'DOWN' ? '#f43f5e' : '#64748b';
    const gradientId = `grad-${tickerId}`;

    return (
      <svg className="w-24 h-10 overflow-visible" viewBox={`0 0 ${width} ${height + padding + 5}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        
        {/* Shaded Area */}
        <path d={areaD} fill={`url(#${gradientId})`} />
        
        {/* Stroke Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* End glowing point */}
        {pointsCoords.length > 0 && (
          <circle
            cx={pointsCoords[pointsCoords.length - 1].x}
            cy={pointsCoords[pointsCoords.length - 1].y}
            r="2"
            fill={color}
            className="animate-ping"
            style={{ transformOrigin: `${pointsCoords[pointsCoords.length - 1].x}px ${pointsCoords[pointsCoords.length - 1].y}px` }}
          />
        )}
      </svg>
    );
  };

  // Grouping tickers into Core and Supporting categories
  const coreIds = ['gift-nifty', 'nasdaq-100', 'sp-500', 'india-vix'];
  const coreTickers = tickers.filter(t => coreIds.includes(t.id));
  const supportingTickers = tickers.filter(t => !coreIds.includes(t.id));

  // Ticker Card Component Renderer
  const renderTickerCard = (ticker: MarketTicker) => {
    const isUp = ticker.direction === 'UP';
    const isDown = ticker.direction === 'DOWN';
    
    let changeColorClass = 'text-slate-400';
    let TrendIcon = Minus;

    if (isUp) {
      changeColorClass = 'text-emerald-400';
      TrendIcon = ArrowUpRight;
    } else if (isDown) {
      changeColorClass = 'text-rose-400';
      TrendIcon = ArrowDownRight;
    }

    return (
      <div
        key={ticker.id}
        className="group relative rounded-xl border border-border bg-slate-950/40 p-4 transition-all hover:border-slate-800 hover:bg-slate-900/20 shadow-md"
      >
        {/* Highlight bar hover effect */}
        <div className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-r-md transition-all ${
          isUp ? 'bg-emerald-500/0 group-hover:bg-emerald-500/70' :
          isDown ? 'bg-rose-500/0 group-hover:bg-rose-500/70' :
          'bg-slate-500/0 group-hover:bg-slate-500/70'
        }`} />

        <div className="flex flex-col h-full justify-between gap-4">
          
          {/* Header details */}
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-xs font-mono text-slate-500 block">{ticker.symbol}</span>
              {ticker.sourceUrl ? (
                <a
                  href={ticker.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base font-bold text-slate-200 hover:text-violet-400 transition-colors flex items-center gap-0.5 group/link"
                >
                  {ticker.name}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-40 group-hover/link:opacity-100 transition-opacity text-violet-400 shrink-0" />
                </a>
              ) : (
                <span className="text-sm sm:text-base font-bold text-slate-200 group-hover:text-white transition-colors">{ticker.name}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-mono text-slate-400">
              {getCategoryIcon(ticker.category)}
              <span className="uppercase text-[9px]">{ticker.category}</span>
            </div>
          </div>

          {/* Pricing values and change indicator */}
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-bold tracking-tight font-mono text-slate-100">
              {ticker.value}
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 font-mono text-xs sm:text-sm">
                <TrendIcon className={`h-3.5 w-3.5 ${changeColorClass}`} />
                <span className={`${changeColorClass} font-semibold`}>
                  {ticker.change} ({ticker.changePercent})
                </span>
              </div>

              <span className="text-[9px] font-mono text-slate-500">
                {ticker.time}
              </span>
            </div>
          </div>

          {/* Explainer for Common Man Mode */}
          {isSimple && ticker.explainer && (
            <div className="text-xs sm:text-sm leading-relaxed text-slate-350 bg-violet-950/10 border border-violet-500/10 rounded-lg p-2.5 font-sans">
              {ticker.explainer}
            </div>
          )}

          {/* Sparkline chart */}
          <div className="flex items-center justify-between border-t border-slate-900/60 pt-3">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Overnight Trend</span>
            {renderSparkline(ticker.sparkline, ticker.direction, ticker.id)}
          </div>

        </div>
      </div>
    );
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <h2 className="text-base font-bold uppercase tracking-wider text-slate-300 font-mono">Global Market Indicators</h2>
        <span className="text-[10px] font-mono text-slate-550">Quotes delayed up to 15m</span>
      </div>

      {/* Core Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coreTickers.map(renderTickerCard)}
      </div>

      {/* Toggle Button for Supporting Indicators */}
      {supportingTickers.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => setShowSupporting(!showSupporting)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-900 hover:border-slate-800 text-sm font-bold text-slate-200 transition-all cursor-pointer shadow-md hover:shadow-lg focus:outline-none"
          >
            {showSupporting ? (
              <>
                <ChevronUp className="h-4 w-4 text-violet-400" />
                <span>Hide Supporting Market Indicators</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 text-violet-400 animate-bounce" />
                <span>Show All Supporting Indicators (+{supportingTickers.length})</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Supporting Grid */}
      {showSupporting && (
        <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
            <span className="text-[10px] font-mono font-bold text-slate-550 uppercase tracking-wider">Supporting Tickers (Macro, Commodities & Forex)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportingTickers.map(renderTickerCard)}
          </div>
        </div>
      )}
    </section>
  );
}
