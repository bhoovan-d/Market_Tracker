'use client';

import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/dashboard-header';
import DashboardFooter from '@/components/dashboard-footer';
import PredictionCard from '@/components/prediction-card';
import { History, CheckCircle2, AlertCircle, XCircle, BarChart3, Info } from 'lucide-react';
import Link from 'next/link';

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<any[] | null>(null);
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch('/api/predictions-history');
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setHistoryData(json.data);
            setSummary(json.summary);
          }
        }
      } catch (err) {
        console.error('Failed to load predictions history:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const sorted = historyData
    ? [...historyData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const pct = summary ? `${summary.pct}%` : '—%';
  const correct = summary ? summary.correct : 0;
  const partial = summary ? summary.partial : 0;
  const missed = summary ? summary.missed : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-slate-100">
      <DashboardHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* ── Page Title ──────────────────────────────────────── */}
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-350 font-mono transition-colors"
          >
            ← Back to Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                  <History className="h-5 w-5" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-violet-400 bg-clip-text text-transparent">
                  Past Predictions
                </h1>
              </div>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                How our AI-generated pre-market predictions compared against actual Nifty 50 market movements over the last 5 trading days. Each prediction was generated from real overnight global market data — the same methodology used for tomorrow's forecast.
              </p>
            </div>

            {/* Accuracy score pill */}
            <div className="shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              <div>
                <span className="text-2xl font-extrabold font-mono text-emerald-400">{pct}</span>
                <span className="text-xs text-emerald-600 block -mt-0.5 font-mono">Enhanced Model Accuracy</span>
              </div>
            </div>
          </div>

          {/* v2 upgrade note */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] font-mono text-violet-400 font-semibold">
            <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse inline-block" />
            Enhanced Model v2 — Gemini 2.5 Pro · Weighted Signals · Expiry Detection
          </div>
        </div>

        {/* ── Accuracy Summary Bar ─────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 shrink-0" />
            <div>
              <span className="text-3xl font-extrabold font-mono text-emerald-400">{correct}</span>
              <span className="text-xs text-slate-400 block font-mono uppercase tracking-wide mt-0.5">Correct Predictions</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <AlertCircle className="h-8 w-8 text-amber-400 shrink-0" />
            <div>
              <span className="text-3xl font-extrabold font-mono text-amber-400">{partial}</span>
              <span className="text-xs text-slate-400 block font-mono uppercase tracking-wide mt-0.5">Partially Correct</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl border border-rose-500/20 bg-rose-500/5">
            <XCircle className="h-8 w-8 text-rose-400 shrink-0" />
            <div>
              <span className="text-3xl font-extrabold font-mono text-rose-400">{missed}</span>
              <span className="text-xs text-slate-400 block font-mono uppercase tracking-wide mt-0.5">Missed Predictions</span>
            </div>
          </div>
        </div>

        {/* ── Methodology note ────────────────────────────────── */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-slate-800 bg-slate-950/40">
          <Info className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed">
            <strong className="text-slate-400">Enhanced Model v2 Methodology:</strong> Each prediction was re-analyzed using the upgraded model which incorporates: <strong className="text-slate-300">India VIX</strong> (volatility/confidence dampener), <strong className="text-slate-300">US Dollar Index (DXY)</strong> (FII flow proxy), <strong className="text-slate-300">Gold prices</strong> (risk-off signal), <strong className="text-slate-300">Dow Jones</strong> (industrial sentiment), <strong className="text-slate-300">expiry day detection</strong> (Thursdays flagged automatically), and a <strong className="text-slate-300">chain-of-thought signal weighting system</strong> where GIFT Nifty anchors every prediction. <strong className="text-emerald-400">"Correct"</strong> = direction and approximate magnitude matched. <strong className="text-amber-400">"Partial"</strong> = right on not taking a strong position, but couldn't predict exact direction. <strong className="text-rose-400">"Missed"</strong> = directionally wrong.
          </p>
        </div>

        {/* ── Prediction Cards ─────────────────────────────────── */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500 font-mono">
            <span className="h-4 w-4 rounded-full border-2 border-slate-700 border-t-violet-400 animate-spin mr-2" />
            Loading persistent historical records...
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-dashed border-slate-900 rounded-2xl">
            No historical records found in the database.
          </div>
        ) : (
          <div className="space-y-5">
            {sorted.map((record, i) => (
              <PredictionCard key={record.id} record={record} index={i} />
            ))}
          </div>
        )}

      </main>

      <DashboardFooter />
    </div>
  );
}
