import React, { useState } from 'react';
import { 
  Search, 
  HelpCircle, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Cpu, 
  Zap, 
  Radio, 
  Layers, 
  Video, 
  Wind,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DOUBT_CATEGORIES, DOUBT_ITEMS, solveDoubtQuery } from '../data/doubtDatabase';

export default function DoubtSolver({ initialQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDoubtItem, setActiveDoubtItem] = useState(null);
  const [customAnalysis, setCustomAnalysis] = useState(null);

  // Filter doubt items based on category and search query
  const filteredDoubts = DOUBT_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = searchQuery.trim() === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  // Handle custom query search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const result = solveDoubtQuery(searchQuery);
    setCustomAnalysis(result);
    setActiveDoubtItem(result);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="aero-glass p-6 rounded-2xl space-y-4" style={{ borderRadius: '24px' }}>
        <div className="flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-cyan" />
          <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white">
            Avionics &amp; Hardware Doubt Solver Assistant
          </h2>
        </div>
        <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
          Stuck on soldering, wiring, ESP32 brownouts, Betaflight configuration, or troubleshooting maiden flight glitches? 
          Enter your symptom below to get instant root cause diagnostics and step-by-step verified engineering solutions.
        </p>

        {/* Search Query Bar - Smooth Pill Input */}
        <form onSubmit={handleSearchSubmit} className="pt-1">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Describe your doubt (e.g. 'ESP32 reboots on throttle', 'fly without camera', 'smoke stopper red', 'drone flips on takeoff')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="aero-input pl-12 pr-32 py-3 text-sm rounded-full"
              style={{ borderRadius: '9999px' }}
            />
            <button 
              type="submit"
              className="btn-aero-primary absolute right-1.5 py-2 px-5 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnose</span>
            </button>
          </div>
        </form>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
          <span className="font-mono text-slate-400">INSTANT FIXES:</span>
          {[
            'ESP32 reboots on throttle',
            'Fly without camera',
            'Smoke stopper red',
            'Drone flips on throttle',
            'Betaflight USB failed',
            'ELRS won’t bind'
          ].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setSearchQuery(tag);
                const res = solveDoubtQuery(tag);
                setCustomAnalysis(res);
                setActiveDoubtItem(res);
              }}
              className="text-[11px] font-mono text-cyan bg-cyan/10 hover:bg-cyan/20 border border-cyan/30 px-3 py-1 rounded-full transition-all"
              style={{ borderRadius: '9999px' }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`btn-aero-glass ${selectedCategory === 'all' ? 'active' : ''}`}
        >
          <span>All Subsystems ({DOUBT_ITEMS.length})</span>
        </button>
        {DOUBT_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`btn-aero-glass ${selectedCategory === cat.id ? 'active' : ''}`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Active Diagnostic Detail Modal/Card if an item is selected */}
      {activeDoubtItem && (
        <div className="aero-glass-heavy chamfered border-2 border-[var(--amber-core)] p-6 space-y-5 animate-in fade-in duration-150 relative">
          <button 
            onClick={() => setActiveDoubtItem(null)}
            className="absolute top-4 right-4 text-xs font-mono text-slate-400 hover:text-white"
          >
            [CLOSE DIAGNOSIS]
          </button>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`telemetry-badge ${activeDoubtItem.severity === 'Critical Hazard' ? 'crimson' : 'amber'}`}>
                {activeDoubtItem.severity}
              </span>
              <span className="telemetry-badge cyan">
                SUBSYSTEM: {activeDoubtItem.category.toUpperCase()}
              </span>
            </div>
            <h3 className="font-['Rajdhani'] font-bold text-2xl text-white">
              {activeDoubtItem.title}
            </h3>
            <p className="text-sm text-[var(--amber-core)] font-mono">
              Summary: {activeDoubtItem.quickSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Probable Causes */}
            <div className="p-4 bg-[rgba(255,51,85,0.06)] border border-red-500/30 rounded-lg space-y-2">
              <span className="text-xs font-mono text-red-400 font-bold flex items-center gap-1.5 uppercase">
                <AlertTriangle className="w-4 h-4" />
                PROBABLE ROOT CAUSES:
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {activeDoubtItem.probableCauses.map((cause, cIdx) => (
                  <li key={cIdx} className="leading-relaxed">{cause}</li>
                ))}
              </ul>
            </div>

            {/* Diagnostic Steps */}
            <div className="p-4 bg-[rgba(0,240,255,0.06)] border border-cyan-500/30 rounded-lg space-y-2">
              <span className="text-xs font-mono text-[var(--cyan-core)] font-bold flex items-center gap-1.5 uppercase">
                <Terminal className="w-4 h-4" />
                SYSTEMATIC TEST PROCEDURE:
              </span>
              <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                {activeDoubtItem.diagnosticSteps.map((step, sIdx) => (
                  <li key={sIdx} className="leading-relaxed">{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Definitive Solution */}
          <div className="stat-box volt space-y-1">
            <span className="text-xs font-mono text-[var(--volt-core)] font-bold flex items-center gap-1.5 uppercase">
              <CheckCircle2 className="w-4 h-4" />
              VERIFIED ENGINEERING RESOLUTION:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {activeDoubtItem.solution}
            </p>
          </div>
        </div>
      )}

      {/* Grid of Doubt Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoubts.map(item => (
          <div
            key={item.id}
            onClick={() => setActiveDoubtItem(item)}
            className="aero-glass p-5 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--amber-core)] transition-all cursor-pointer space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className={`telemetry-badge ${item.severity === 'Critical Hazard' ? 'crimson' : 'amber'}`}>
                {item.severity}
              </span>
              <span className="text-[10px] font-mono text-slate-400 group-hover:text-[var(--amber-core)] transition-colors flex items-center gap-1">
                View Solution <ArrowRight className="w-3 h-3" />
              </span>
            </div>

            <h4 className="font-['Rajdhani'] font-bold text-lg text-white group-hover:text-[var(--cyan-core)] transition-colors">
              {item.title}
            </h4>

            <p className="text-xs text-slate-300 line-clamp-2">
              {item.quickSummary}
            </p>

            <div className="flex flex-wrap gap-1 pt-1">
              {item.keywords.slice(0, 4).map((kw, idx) => (
                <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
