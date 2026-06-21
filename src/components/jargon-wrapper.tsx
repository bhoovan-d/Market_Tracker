'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { jargonDictionary } from '@/lib/educationData';

interface JargonWrapperProps {
  text: string;
}

export default function JargonWrapper({ text }: JargonWrapperProps) {
  const [activeTerm, setActiveTerm] = useState<typeof jargonDictionary[0] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!text) return null;

  // Escape special regex characters in the dictionary terms and sort by length descending.
  // Sorting ensures that compound terms like "FIIs" or "India VIX" are matched before "FII" or "VIX".
  const escapedTerms = jargonDictionary
    .map(d => d.term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
    .sort((a, b) => b.length - a.length)
    .join('|');
  
  const regex = new RegExp(`\\b(${escapedTerms})\\b`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      <span>
        {parts.map((part, idx) => {
          // Find if this split matches a jargon term (case insensitive)
          const matched = jargonDictionary.find(
            item => item.term.toLowerCase() === part.toLowerCase()
          );

          if (matched) {
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTerm(matched);
                }}
                className="underline decoration-violet-450 decoration-dotted hover:decoration-violet-400 hover:text-violet-300 transition-colors font-medium cursor-pointer inline focus:outline-none underline-offset-2"
                title={`Click to explain: ${matched.displayTerm}`}
              >
                {part}
              </button>
            );
          }

          return part;
        })}
      </span>

      {/* Centered Glassmorphic Modal (Rendered at Root level via React Portal) */}
      {activeTerm && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveTerm(null)}
        >
          <div 
            className="w-full max-w-md rounded-2xl border border-violet-500/20 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-md relative space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveTerm(null)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-850">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <BookOpen className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm font-mono tracking-wider uppercase">Jargon Explainer</h3>
                <span className="text-[10px] text-slate-500 font-mono">Nifty Pulse Financial Dictionary</span>
              </div>
            </div>

            {/* Term Title & Definition */}
            <div className="space-y-2">
              <h4 className="text-lg font-extrabold text-violet-400">{activeTerm.displayTerm}</h4>
              <p className="text-xs text-slate-350 leading-relaxed font-sans">
                {activeTerm.definition}
              </p>
            </div>

            {/* Everyday Analogy Box */}
            <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider font-mono">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Simple Cricket / Household Analogy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                "{activeTerm.analogy}"
              </p>
            </div>

            {/* Confirm button */}
            <button
              onClick={() => setActiveTerm(null)}
              className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 active:bg-violet-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors shadow-lg shadow-violet-600/20 cursor-pointer"
            >
              Got it, thanks!
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
