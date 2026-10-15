import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Wrench, 
  HelpCircle, 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft, 
  ShieldAlert, 
  Cpu, 
  Zap, 
  Terminal,
  BookmarkCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ASSEMBLY_STAGES } from '../data/assemblyGuide';

export default function AssemblyLab({ onOpenDoubtSolver }) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [expandedDoubts, setExpandedDoubts] = useState({});

  const stage = ASSEMBLY_STAGES[currentStepIdx];

  const toggleStepCompleted = (stepNum) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepNum]: !prev[stepNum]
    }));
  };

  const toggleDoubtExpanded = (idx) => {
    setExpandedDoubts(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const progressPercent = Math.round(
    (Object.values(completedSteps).filter(Boolean).length / ASSEMBLY_STAGES.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header & Overall Progress Telemetry */}
      <div className="aero-glass p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4" style={{ borderRadius: '24px' }}>
        <div>
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber" />
            <h2 className="font-display font-bold text-2xl uppercase tracking-wide text-white">
              End-to-End Drone Prototyping Lab
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Follow our 10-stage verified aerospace assembly protocol from bare carbon to maiden flight.
          </p>
        </div>

        {/* Progress Metric */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="text-right">
            <span className="text-[11px] font-mono text-slate-400">BUILD COMPLETION:</span>
            <div className="font-display font-bold text-2xl text-volt">
              {progressPercent}% COMPLETE
            </div>
          </div>
          <div className="w-36 bg-slate-900/80 h-3 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
            <div 
              className="bg-gradient-to-r from-amber to-volt h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(0,255,170,0.5)]"
              style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #f59e0b, #00ffaa)' }}
            />
          </div>
        </div>
      </div>

      {/* Step Navigation Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {ASSEMBLY_STAGES.map((s, idx) => {
          const isDone = completedSteps[s.stepNumber];
          const isCurrent = idx === currentStepIdx;

          return (
            <button
              key={s.id}
              onClick={() => setCurrentStepIdx(idx)}
              className={`p-3 text-left transition-all relative flex flex-col justify-between h-20 ${
                isCurrent 
                  ? 'bg-amber-soft border-amber shadow-[0_0_16px_rgba(245,158,11,0.3)]' 
                  : isDone
                  ? 'bg-[rgba(0,255,170,0.08)] border-[rgba(0,255,170,0.4)] text-slate-200'
                  : 'bg-[rgba(16,22,32,0.5)] border-[rgba(255,255,255,0.08)] text-slate-400 hover:border-slate-500'
              }`}
              style={{
                borderRadius: '16px',
                borderWidth: '1px',
                borderStyle: 'solid',
                backdropFilter: 'blur(16px)'
              }}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-[10px] font-bold text-amber">
                  STEP {s.stepNumber}
                </span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-volt" />}
              </div>
              <span className="text-[11px] font-semibold leading-tight truncate text-slate-100">
                {s.title.split('&')[0]}
              </span>
              <span className="text-[9px] font-mono text-slate-400">
                {s.duration}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Stage Detail Panel */}
      <div className="aero-glass-heavy p-6 space-y-6 relative" style={{ borderRadius: '26px' }}>
        {/* Stage Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="telemetry-badge amber">STAGE {stage.stepNumber} OF 10</span>
              <span className={`telemetry-badge ${stage.criticalLevel === 'Critical' ? 'crimson' : stage.criticalLevel === 'High' ? 'amber' : 'cyan'}`}>
                HAZARD: {stage.criticalLevel.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-400">⏱ {stage.duration}</span>
            </div>
            <h3 className="font-['Rajdhani'] font-bold text-2xl text-white tracking-wide">
              {stage.title}
            </h3>
            <p className="text-sm text-[var(--cyan-core)]">
              {stage.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStepCompleted(stage.stepNumber)}
              className={`btn-aero-glass ${completedSteps[stage.stepNumber] ? 'active' : ''}`}
            >
              <CheckCircle2 className="w-4 h-4 text-[var(--volt-core)]" />
              <span>{completedSteps[stage.stepNumber] ? 'Marked as Done' : 'Mark Step Complete'}</span>
            </button>
          </div>
        </div>

        {/* Stage Summary */}
        <p className="text-sm text-slate-300 leading-relaxed bg-[rgba(0,0,0,0.3)] p-3.5 rounded border border-[var(--border-subtle)]">
          {stage.summary}
        </p>

        {/* Two-Column Layout: Tasks Checklist & Warnings/Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Action Tasks (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--amber-core)] flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              EXACT ASSEMBLY EXECUTION CHECKLIST:
            </h4>

            <div className="space-y-2.5">
              {stage.tasks.map((task, tIdx) => (
                <div 
                  key={tIdx} 
                  className="flex items-start gap-3 p-3 bg-[rgba(255,255,255,0.02)] border border-[var(--border-subtle)] rounded hover:border-slate-600 transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-[var(--amber-soft)] border border-[var(--amber-core)] text-[var(--amber-core)] text-[11px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                    {tIdx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {task}
                  </p>
                </div>
              ))}
            </div>

            {/* Pro Tip Callout */}
            <div className="stat-box cyan mt-4 space-y-1">
              <span className="text-xs font-mono text-[var(--cyan-core)] font-bold flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                AEROSPACE PRO TIP:
              </span>
              <p className="text-xs text-slate-300">
                {stage.proTip}
              </p>
            </div>
          </div>

          {/* Right Column: Safety Warnings & Tools Required */}
          <div className="space-y-4">
            {/* Critical Warnings */}
            <div className="p-4 bg-[rgba(255,51,85,0.08)] border border-[var(--crimson-core)] rounded-lg space-y-2">
              <span className="text-xs font-mono text-[var(--crimson-core)] font-bold flex items-center gap-1.5 uppercase">
                <ShieldAlert className="w-4 h-4" />
                CRITICAL SAFETY WARNING:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {stage.warnings.map((w, wIdx) => (
                  <li key={wIdx} className="leading-relaxed">{w}</li>
                ))}
              </ul>
            </div>

            {/* Tools Required */}
            <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[var(--border-subtle)] rounded-lg space-y-2">
              <span className="text-xs font-mono text-slate-400 font-bold flex items-center gap-1.5 uppercase">
                <Wrench className="w-3.5 h-3.5 text-[var(--amber-core)]" />
                BENCH TOOLS REQUIRED:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {stage.toolsRequired.map((tool, idx) => (
                  <span key={idx} className="telemetry-badge">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Ask Doubt Button */}
            <button
              onClick={() => onOpenDoubtSolver(stage.title)}
              className="btn-aero-secondary w-full py-2.5 text-xs"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ask a Doubt for Step {stage.stepNumber}</span>
            </button>
          </div>
        </div>

        {/* Embedded Step-Specific Doubts & FAQs */}
        <div className="pt-4 border-t border-[var(--border-subtle)] space-y-3">
          <h4 className="font-mono text-xs font-bold text-[var(--cyan-core)] uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            FREQUENT DOUBTS AT THIS STEP (CLICK TO EXPAND):
          </h4>

          <div className="space-y-2">
            {stage.doubts.map((doubt, dIdx) => {
              const isExpanded = expandedDoubts[dIdx];
              return (
                <div 
                  key={dIdx}
                  className="border border-[var(--border-subtle)] rounded bg-[rgba(0,0,0,0.25)] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleDoubtExpanded(dIdx)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between text-xs font-medium text-slate-200 hover:text-[var(--amber-core)]"
                  >
                    <span>Q: {doubt.question}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-3 pt-1 text-xs text-slate-300 leading-relaxed border-t border-[var(--border-subtle)] bg-[rgba(0,0,0,0.15)]">
                      <p className="text-[var(--volt-core)] font-mono text-[11px] mb-1">ENGINEER SOLUTION:</p>
                      {doubt.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Next/Prev Stage */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
          <button
            disabled={currentStepIdx === 0}
            onClick={() => setCurrentStepIdx(prev => Math.max(0, prev - 1))}
            className="btn-aero-glass disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <span className="text-xs font-mono text-slate-400">
            Step {currentStepIdx + 1} of {ASSEMBLY_STAGES.length}
          </span>

          <button
            disabled={currentStepIdx === ASSEMBLY_STAGES.length - 1}
            onClick={() => setCurrentStepIdx(prev => Math.min(ASSEMBLY_STAGES.length - 1, prev + 1))}
            className="btn-aero-primary disabled:opacity-40"
          >
            <span>Next Step: {ASSEMBLY_STAGES[currentStepIdx + 1]?.title.split('&')[0] || 'Maiden Flight'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
