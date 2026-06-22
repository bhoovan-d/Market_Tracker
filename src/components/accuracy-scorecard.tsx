'use client';

import React from 'react';
import { historicalPredictions, getAccuracySummary } from '@/lib/historyData';
import { CheckCircle2, AlertCircle, XCircle, TrendingUp, BarChart3, HelpCircle, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { useMode } from '@/context/ModeContext';

interface AccuracyScorecardProps {
  data?: any[] | null;
  summary?: any | null;
}

export default function AccuracyScorecard({ data, summary }: AccuracyScorecardProps) {
  const { isSimple } = useMode();
  
  const sourcePredictions = data || historicalPredictions;
  const activeSummary = summary || getAccuracySummary(historicalPredictions);

  // Sort newest first
  const sorted = [...sourcePredictions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-2xl border border-border bg-slate-950/40 p-6 shadow-xl backdrop-blur-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-450">
            <BarChart3 className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-slate-200">Pulse Accuracy Scorecard</h3>
            <span className="text-[10px] text-slate-500 font-mono">100% Transparent Weekly Performance</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-[9px] font-mono text-emerald-450 font-bold">
          <span>{activeSummary.pct}% Accuracy</span>
        </div>
      </div>

      {/* Speedometer Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
          <CheckCircle2 className="h-7 w-7 text-emerald-400 shrink-0" />
          <div>
            <span className="text-2xl font-extrabold text-emerald-400">{activeSummary.correct}</span>
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-semibold">Correct Cues</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
          <AlertCircle className="h-7 w-7 text-amber-400 shrink-0" />
          <div>
            <span className="text-2xl font-extrabold text-amber-400">{activeSummary.partial}</span>
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-semibold">Partial (Cautious)</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
          <XCircle className="h-7 w-7 text-rose-400 shrink-0" />
          <div>
            <span className="text-2xl font-extrabold text-rose-400">{activeSummary.missed}</span>
            <span className="text-[9px] text-slate-500 block uppercase tracking-wider font-semibold">Missed Cues</span>
          </div>
        </div>
      </div>

      {/* Past 5 Days Checklist Summary */}
      <div className="space-y-3 font-sans">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
          Past 5 Predictions vs Outcomes
        </span>

        <div className="space-y-2 text-xs">
          {sorted.map((record) => {
            const isCorrect = record.accuracy === 'CORRECT';
            const isPartial = record.accuracy === 'PARTIAL';
            const isPending = record.accuracy === 'PENDING';
            const predictionLabel = record.prediction.predictedOpeningDiff.split('(')[0].trim();
            const direction = record.actual.direction;
            
            return (
              <div 
                key={record.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-900 bg-slate-950/20 gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-slate-400 text-[11px] font-medium w-28 shrink-0">
                    {record.dayLabel}
                  </span>
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[9px] font-bold ${
                    isPending
                      ? 'bg-violet-500/10 text-violet-400 border border-violet-500/15'
                      : isCorrect 
                        ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/15'
                        : isPartial 
                          ? 'bg-amber-500/10 text-amber-450 border border-amber-500/15'
                          : 'bg-rose-500/10 text-rose-450 border border-rose-500/15'
                  }`}>
                    {record.accuracy}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] flex-1 sm:justify-end text-slate-350">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Predicted:</span>
                    <span className="font-semibold text-slate-305">{predictionLabel}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">Actual:</span>
                    {isPending ? (
                      <span className="text-slate-500 italic">Awaiting Open</span>
                    ) : (
                      <span className={`font-semibold flex items-center gap-0.5 ${
                        direction === 'UP' 
                          ? 'text-emerald-405' 
                          : direction === 'DOWN' 
                            ? 'text-rose-405' 
                            : 'text-slate-400'
                      }`}>
                        {direction === 'UP' && <ArrowUpRight className="h-3 w-3" />}
                        {direction === 'DOWN' && <ArrowDownRight className="h-3 w-3" />}
                        {direction === 'FLAT' && <Minus className="h-3 w-3" />}
                        {record.actual.niftyChangePoints > 0 ? `+${record.actual.niftyChangePoints}` : record.actual.niftyChangePoints} pts
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why Macro analysis is a compass, not a crystal ball (ELI5 Education) */}
      <div className="rounded-xl border border-violet-500/15 bg-violet-500/5 p-4 space-y-3 font-sans">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-violet-400 uppercase tracking-wider font-mono">
          <HelpCircle className="h-4 w-4 shrink-0" />
          <span>Pulse Classroom: Why Predictions Aren't 100% Perfect</span>
        </div>
        
        <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
          <p>
            {isSimple 
              ? "Imagine pre-market cues as a weather forecast. If the wind speed and clouds point to rain, the forecaster predicts a storm. But if a local water canal suddenly breaks or domestic tankers spray water on fields, the ground gets wet regardless. In the stock market, global overnight cues (US indexes, oil) are the broad weather signs. But local Indian buyers (like mutual funds and retail SIP flows) can decide to step in and buy shares, pushing prices up even on a rainy global day."
              : "Global macroeconomic cues act as the primary directional compass at the opening bell. However, once the trading session starts, internal domestic flows (DII buying support, domestic index option dynamics, or company earnings announcements) take control. Because domestic institutional buying cannot be predicted before market hours, a market might open flat but decouple later in the day. Pre-market cues tell you the structural setup; they do not dictate the final closing scorecard."
            }
          </p>
          <div className="text-[10px] text-slate-500 border-t border-slate-900/60 pt-2 font-mono flex items-center justify-between">
            <span>Core Concept: Global Decoupling</span>
            <span>Compass vs Crystal Ball</span>
          </div>
        </div>
      </div>

    </div>
  );
}
