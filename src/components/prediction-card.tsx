'use client';

import React, { useState } from 'react';
import {
  HistoricalPrediction,
  PredictionAccuracy,
  Direction,
} from '@/lib/historyData';
import { useMode } from '@/context/ModeContext';
import JargonWrapper from '@/components/jargon-wrapper';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronDown,
  ChevronUp,
  Globe,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface PredictionCardProps {
  record: HistoricalPrediction;
  index: number;
}

const sentimentMeta: Record<string, { label: string; color: string; bg: string }> = {
  STRONG_GAP_UP:   { label: 'Strong Gap Up',   color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  GAP_UP:          { label: 'Gap Up',           color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  NEUTRAL:         { label: 'Neutral',           color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20' },
  GAP_DOWN:        { label: 'Gap Down',          color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20' },
  STRONG_GAP_DOWN: { label: 'Strong Gap Down',  color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20' },
};

const accuracyMeta: Record<PredictionAccuracy, {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  CORRECT: {
    label: 'Correct',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: CheckCircle2,
  },
  PARTIAL: {
    label: 'Partially Correct',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: AlertCircle,
  },
  MISSED: {
    label: 'Missed',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    icon: XCircle,
  },
  PENDING: {
    label: 'Pending',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    icon: AlertCircle,
  },
};

function DirectionArrow({ direction, className = '' }: { direction: Direction; className?: string }) {
  if (direction === 'UP')   return <TrendingUp  className={`${className} text-emerald-400`} />;
  if (direction === 'DOWN') return <TrendingDown className={`${className} text-rose-400`} />;
  return <Minus className={`${className} text-slate-400`} />;
}

export default function PredictionCard({ record, index }: PredictionCardProps) {
  const [expanded, setExpanded] = useState(index === 0); // first card open by default
  const { isSimple } = useMode();
  const acc = accuracyMeta[record.accuracy];
  const AccIcon = acc.icon;
  const sent = sentimentMeta[record.prediction.sentiment];

  const isPositiveActual = record.actual.direction === 'UP';
  const actualChangeColor = isPositiveActual ? 'text-emerald-400' : 'text-rose-400';
  const actualChangePts   = isPositiveActual
    ? `+${record.actual.niftyChangePoints.toFixed(1)}`
    : record.actual.niftyChangePoints.toFixed(1);

  return (
    <article
      className={`rounded-2xl border ${acc.border} bg-slate-950/40 shadow-xl backdrop-blur-sm overflow-hidden transition-all duration-300`}
    >
      {/* ── Card Header ─────────────────────────────────────── */}
      <button
        id={`prediction-card-${record.id}`}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 hover:bg-slate-900/20 transition-colors text-left group"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Day badge */}
          <div className="flex flex-col items-center justify-center h-12 w-12 shrink-0 rounded-xl bg-slate-900 border border-slate-800 font-mono text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider leading-none">
              {record.date.slice(5, 7)}/{record.date.slice(8)}
            </span>
            <span className="text-base font-bold text-slate-200 leading-tight">
              {record.dayLabel.split(',')[0].slice(0, 3).toUpperCase()}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-extrabold text-slate-100 truncate">{record.dayLabel}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">Target: Nifty 50 Open at 9:15 AM IST</p>
          </div>
        </div>

        {/* Right side: accuracy + sentiment badges */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Predicted sentiment */}
          <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${sent.bg} ${sent.color} text-xs font-mono font-bold uppercase tracking-wide`}>
            Predicted: {sent.label}
          </span>
          {/* Accuracy badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${acc.bg} ${acc.border} ${acc.color} text-xs font-semibold font-mono`}>
            <AccIcon className="h-3.5 w-3.5" />
            {acc.label}
          </span>
          {/* Chevron */}
          <span className="text-slate-600 group-hover:text-slate-400 transition-colors">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </div>
      </button>

      {/* ── Expandable Body ──────────────────────────────────── */}
      {expanded && (
        <div className="border-t border-slate-900 divide-y divide-slate-900/60 px-6 pb-6 space-y-6 pt-5">

          {/* Row 1: Overnight Global Inputs */}
          <section className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">
              <Globe className="h-3.5 w-3.5 text-violet-400" />
              Previous Night Global Cues (Input Data)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {record.overnightInputs.map((inp) => (
                <a
                  key={inp.symbol}
                  href={inp.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1 p-3 rounded-xl border border-slate-900 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/40 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wide">{inp.symbol}</span>
                    <ExternalLink className="h-2.5 w-2.5 text-slate-700 group-hover:text-slate-400 transition-colors" />
                  </div>
                  <span className="text-sm font-semibold text-slate-300 truncate">{inp.name}</span>
                  <span className="text-base font-bold font-mono text-slate-100">{inp.value}</span>
                  <div className={`flex items-center gap-1 text-xs font-mono font-semibold ${inp.direction === 'UP' ? 'text-emerald-400' : inp.direction === 'DOWN' ? 'text-rose-400' : 'text-slate-400'}`}>
                    <DirectionArrow direction={inp.direction} className="h-3 w-3" />
                    <span>{inp.changePercent}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Row 2: Prediction vs Actual split */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">

            {/* Prediction column */}
            <div className="rounded-xl border border-violet-500/15 bg-violet-950/10 p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-violet-400 uppercase tracking-widest font-mono">
                <Target className="h-3.5 w-3.5" />
                Nifty 50 Opening Prediction (9:15 AM IST)
              </div>
              <div className="space-y-2">
                {/* Gauge bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${record.prediction.gaugeValue >= 60 ? 'bg-emerald-500' : record.prediction.gaugeValue >= 45 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${record.prediction.gaugeValue}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold font-mono text-slate-300 shrink-0">
                    {record.prediction.gaugeValue}/100
                  </span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold font-mono ${sent.bg} ${sent.color}`}>
                  <DirectionArrow direction={record.prediction.sentiment.includes('UP') ? 'UP' : record.prediction.sentiment === 'NEUTRAL' ? 'FLAT' : 'DOWN'} className="h-3.5 w-3.5" />
                  {sent.label}
                </div>
                <p className="text-lg font-extrabold font-mono text-slate-200">
                  {record.prediction.predictedOpeningDiff}
                </p>
                <div className="text-sm text-slate-300 leading-relaxed font-sans">
                  <JargonWrapper text={isSimple ? (record.prediction.reasoningSimple || record.prediction.reasoning) : record.prediction.reasoning} />
                </div>
              </div>
            </div>

            {/* Actual result column */}
            <div className={`rounded-xl border p-4 space-y-3 ${
              record.accuracy === 'PENDING'
                ? 'border-slate-800 bg-slate-900/10'
                : isPositiveActual 
                  ? 'border-emerald-500/15 bg-emerald-950/5' 
                  : 'border-rose-500/15 bg-rose-950/5'
            }`}>
              <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest font-mono ${
                record.accuracy === 'PENDING'
                  ? 'text-slate-400'
                  : isPositiveActual 
                    ? 'text-emerald-400' 
                    : 'text-rose-400'
              }`}>
                <DirectionArrow direction={record.accuracy === 'PENDING' ? 'FLAT' : record.actual.direction} className="h-3.5 w-3.5" />
                Actual Nifty 50 Movement
              </div>
              
              {record.accuracy === 'PENDING' ? (
                <div className="space-y-2 py-2">
                  <span className="text-slate-550 block text-xs italic">Awaiting market opening bell...</span>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    Once the market opens at 9:15 AM IST, live Nifty 50 outcomes will align here automatically.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-wide block">Open</span>
                      <span className="text-base font-bold font-mono text-slate-200">{record.actual.niftyOpen.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-mono text-slate-500 uppercase tracking-wide block">Close</span>
                      <span className="text-base font-bold font-mono text-slate-200">{record.actual.niftyClose.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-extrabold font-mono ${actualChangeColor}`}>
                      {actualChangePts} pts
                    </span>
                    <span className={`text-base font-bold font-mono px-2 py-0.5 rounded ${acc.bg} ${actualChangeColor}`}>
                      {record.actual.niftyChangePercent}
                    </span>
                  </div>
                  <div className="text-sm text-slate-300 leading-relaxed font-sans">
                    <JargonWrapper text={isSimple ? (record.actual.summarySimple || record.actual.summary) : record.actual.summary} />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Row 3: Verdict Banner */}
          <section>
            <div className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border ${acc.border} ${acc.bg}`}>
              <AccIcon className={`h-5 w-5 ${acc.color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-extrabold uppercase tracking-wider font-mono ${acc.color} block`}>
                  Verdict: {acc.label}
                </span>
                <div className="text-sm text-slate-300 leading-relaxed mt-0.5 font-sans">
                  <JargonWrapper text={isSimple ? (record.accuracyNoteSimple || record.accuracyNote) : record.accuracyNote} />
                </div>
              </div>
              <span className={`shrink-0 text-xs font-mono text-slate-500`}>
                * Disclaimer: Educational analysis only. Not financial advice.
              </span>
            </div>
          </section>

        </div>
      )}
    </article>
  );
}
