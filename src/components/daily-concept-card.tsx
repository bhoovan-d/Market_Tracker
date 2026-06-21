'use client';

import React, { useState, useEffect } from 'react';
import { getConceptForDay, MacroConcept } from '@/lib/educationData';
import { BookOpen, HelpCircle, CheckCircle2, AlertTriangle, Sparkles, Lightbulb, RefreshCw } from 'lucide-react';
import { useMode } from '@/context/ModeContext';

export default function DailyConceptCard() {
  const { isSimple } = useMode();
  const [concept, setConcept] = useState<MacroConcept | null>(null);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  useEffect(() => {
    // Retrieve the concept for today
    const activeConcept = getConceptForDay();
    setConcept(activeConcept);
    
    // Reset states if day changes
    setShowQuiz(false);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  }, []);

  if (!concept) return null;

  const handleOptionClick = (idx: number) => {
    if (isAnswered && isCorrect) return; // Prevent clicking after correct answer
    
    setSelectedOption(idx);
    setIsAnswered(true);
    const correct = idx === concept.quiz.correctIndex;
    setIsCorrect(correct);
  };

  const resetQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-slate-950/40 p-6 shadow-xl backdrop-blur-sm space-y-5 relative overflow-hidden">
      {/* Background soft glow */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-amber-500/5 blur-2xl" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-900">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <BookOpen className="h-4.5 w-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase font-mono text-amber-400">Daily Learning</h3>
            <span className="text-xs text-slate-400 font-mono">Understand Global Macroeconomics</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-[9px] font-mono text-slate-400">
          <Sparkles className="h-2.5 w-2.5 text-amber-400" />
          <span>Pulse Academy</span>
        </div>
      </div>

      {/* Concept Details */}
      <div className="space-y-3">
        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-slate-450 uppercase tracking-wide">Topic for Today</span>
          <h4 className="text-xl font-extrabold text-slate-100 leading-tight">
            {concept.title}
          </h4>
          <p className="text-sm text-violet-400 font-semibold font-mono">{concept.subtitle}</p>
        </div>

        <p className="text-base text-slate-200 leading-relaxed font-sans">
          {concept.conceptText}
        </p>

        {/* Analogy Box */}
        <div className="rounded-xl border border-slate-900 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span>Cricket / Everyday Analogy</span>
          </div>
          <p className="text-base text-slate-200 leading-relaxed font-sans italic">
            "{concept.analogyText}"
          </p>
        </div>

        {/* Actionable tip */}
        <div className="text-base leading-relaxed text-slate-200 bg-slate-900/30 p-3 rounded-lg border border-slate-900 border-dashed">
          <strong className="text-slate-100 font-semibold block mb-0.5">💡 Real World Impact:</strong>
          {concept.whatToLookFor}
        </div>
      </div>

      {/* Interactive Quiz Toggle */}
      <div className="pt-2 border-t border-slate-900">
        {!showQuiz ? (
          <button
            onClick={() => setShowQuiz(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 text-sm font-bold text-amber-400 transition-all cursor-pointer shadow-md"
          >
            <HelpCircle className="h-4.5 w-4.5" />
            <span>Take Today's Concept Check Quiz</span>
          </button>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quiz Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-mono font-bold text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="h-4.5 w-4.5" />
                Concept Check
              </span>
              <button
                onClick={() => {
                  setShowQuiz(false);
                  resetQuiz();
                }}
                className="text-xs text-slate-400 hover:text-slate-200 font-mono transition-colors cursor-pointer"
              >
                Hide Quiz
              </button>
            </div>

            {/* Question */}
            <h5 className="text-base font-bold text-slate-100 leading-normal">
              {concept.quiz.question}
            </h5>

            {/* Options */}
            <div className="space-y-2">
              {concept.quiz.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                let optionStyle = 'border-slate-900 bg-slate-950/40 text-slate-300 hover:border-slate-800 hover:bg-slate-900/20';
                
                if (isAnswered) {
                  if (oIdx === concept.quiz.correctIndex) {
                    optionStyle = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
                  } else if (isSelected) {
                    optionStyle = 'border-rose-500/40 bg-rose-500/10 text-rose-300';
                  }
                } else if (isSelected) {
                  optionStyle = 'border-amber-500/50 bg-amber-500/5 text-amber-400';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleOptionClick(oIdx)}
                    disabled={isAnswered && isCorrect}
                    className={`w-full text-left p-3 rounded-xl border text-base leading-relaxed font-medium transition-all duration-150 cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="h-5 w-5 shrink-0 rounded-full border border-current flex items-center justify-center text-xs font-mono font-bold mt-0.5">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Feedback message */}
            {isAnswered && (
              <div className={`p-4 rounded-xl border animate-in slide-in-from-top-2 duration-200 space-y-1.5 ${
                isCorrect 
                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-450' 
                  : 'border-rose-500/20 bg-rose-500/5 text-rose-450'
              }`}>
                <div className="flex items-center gap-1.5">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                      <span className="text-sm font-bold text-emerald-400">Correct Answer!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-4.5 w-4.5 text-rose-400 shrink-0" />
                      <span className="text-sm font-bold text-rose-400">That's not correct.</span>
                    </>
                  )}
                </div>
                <p className="text-base text-slate-200 leading-relaxed font-sans">
                  {isCorrect ? concept.quiz.explanation : "Hint: Read today's Concept Text and Analogy above, then try another choice!"}
                </p>
                {!isCorrect && (
                  <button
                    onClick={resetQuiz}
                    className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-mono mt-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Try Again</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
