import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Box, 
  Wrench, 
  HelpCircle, 
  Layers, 
  FolderCheck, 
  User, 
  Save, 
  ShieldCheck, 
  Sparkles, 
  RotateCw, 
  Download, 
  CheckCircle2,
  Eye,
  Maximize2
} from 'lucide-react';

import Drone3DViewer from './components/Drone3DViewer';
import DroneConfigurator from './components/DroneConfigurator';
import AssemblyLab from './components/AssemblyLab';
import DoubtSolver from './components/DoubtSolver';
import WiringPadHelper from './components/WiringPadHelper';
import AuthModal from './components/AuthModal';
import SavedBuildsModal from './components/SavedBuildsModal';

import { DRONE_ARCHETYPES } from './data/droneArchetypes';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('AeroForge Crash caught by ErrorBoundary:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#07090e', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
          <div style={{ padding: '24px', background: 'rgba(255,51,85,0.1)', border: '1px solid var(--crimson-core)', borderRadius: '12px', maxWidth: '500px' }}>
            <h2 style={{ color: 'var(--crimson-core)', fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '8px' }}>
              Avionics Telemetry Reset Needed
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '13px', marginBottom: '16px' }}>
              A rendering exception occurred: {this.state.error?.message || 'Unknown error'}
            </p>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="btn-aero-primary"
              style={{ cursor: 'pointer' }}
            >
              Reset Session &amp; Reload Workspace
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}

function MainApp() {
  // Navigation State - Default to 'studio' so 3D Drone is visible immediately!
  const [activeTab, setActiveTab] = useState('studio'); // 'studio', 'assembly-lab', 'wiring', 'doubt-solver'
  
  // Active Drone Model State - Default to the Cheapest ESP32 Micro Drone (₹1,750, No Camera)
  const [currentConfig, setCurrentConfig] = useState(DRONE_ARCHETYPES[0]);

  // Auth & Profile State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('aeroforge_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Saved Builds / Projects State
  const [savedBuilds, setSavedBuilds] = useState(() => {
    const local = localStorage.getItem('aeroforge_saved_builds');
    return local ? JSON.parse(local) : [
      {
        ...DRONE_ARCHETYPES[0],
        id: 'saved-esp32-default',
        savedAt: '2026-10-15'
      }
    ];
  });
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Doubt solver pre-fill query
  const [doubtQuery, setDoubtQuery] = useState('');

  // Persist user and saved builds to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('aeroforge_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aeroforge_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aeroforge_saved_builds', JSON.stringify(savedBuilds));
  }, [savedBuilds]);

  // Show temporary toast message
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle saving the current drone build
  const handleSaveCurrentBuild = () => {
    const newBuild = {
      ...currentConfig,
      id: `project-${Date.now()}`,
      savedAt: new Date().toLocaleDateString()
    };
    setSavedBuilds(prev => [newBuild, ...prev]);
    triggerToast(`Project "${currentConfig.name}" saved to your blueprint archive!`);
  };

  // Handle loading a saved build
  const handleLoadBuild = (build) => {
    setCurrentConfig(build);
    triggerToast(`Loaded project: "${build.name}" into 3D Studio!`);
    setActiveTab('studio');
  };

  // Handle deleting a saved build
  const handleDeleteBuild = (id) => {
    setSavedBuilds(prev => prev.filter(b => b.id !== id));
    triggerToast('Project removed from archive.');
  };

  // Handle opening doubt solver from a specific step
  const handleOpenDoubtForStep = (stepTitle) => {
    setDoubtQuery(stepTitle);
    setActiveTab('doubt-solver');
  };

  return (
    <div className="app-container">
      {/* Floating Ambient Glowing Light Orbs (Refract dynamically through frosted glass) */}
      <div className="ambient-background-mesh">
        <div className="floating-orb orb-cyan" />
        <div className="floating-orb orb-amber" />
        <div className="floating-orb orb-volt" />
        <div className="floating-orb orb-purple" />
      </div>

      {/* Top Avionics Telemetry Navigation Header */}
      <header className="aero-glass-heavy" style={{ position: 'sticky', top: 0, zIndex: 40, borderBottom: '1px solid rgba(255,255,255,0.12)', padding: '12px 24px' }}>
        <div className="max-w-7xl flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Telemetry Pulse */}
          <div className="flex items-center gap-3">
            <div className="brand-icon-wrapper">
              <svg className="brand-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 19 21 12 17 5 21 12 2" />
              </svg>
              <span className="radar-dot amber" style={{ position: 'absolute', top: '-2px', right: '-2px' }} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-bold text-2xl tracking-wider text-white uppercase" style={{ margin: 0, lineHeight: 1 }}>
                  AEROFORGE <span className="text-amber">3D</span>
                </h1>
                <span className="telemetry-badge cyan">
                  AVIONICS LAB
                </span>
              </div>
              <p className="font-mono text-slate-400" style={{ fontSize: '10px', margin: 0, marginTop: '2px', letterSpacing: '0.05em' }}>
                END-TO-END DRONE PROTOTYPING &amp; 3D BODY CAD STUDIO
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1" style={{ maxWidth: '100%' }}>
            <button
              onClick={() => setActiveTab('studio')}
              className={`aero-tab-btn ${activeTab === 'studio' ? 'active' : ''}`}
            >
              <Box className="icon-sm" />
              <span>3D CAD Studio &amp; Builder</span>
            </button>

            <button
              onClick={() => setActiveTab('assembly-lab')}
              className={`aero-tab-btn ${activeTab === 'assembly-lab' ? 'active' : ''}`}
            >
              <Wrench className="icon-sm" />
              <span>Making Guide (10 Steps)</span>
            </button>

            <button
              onClick={() => setActiveTab('wiring')}
              className={`aero-tab-btn ${activeTab === 'wiring' ? 'active' : ''}`}
            >
              <Layers className="icon-sm" />
              <span>Wiring Schematics</span>
            </button>

            <button
              onClick={() => setActiveTab('doubt-solver')}
              className={`aero-tab-btn ${activeTab === 'doubt-solver' ? 'active' : ''}`}
            >
              <HelpCircle className="icon-sm" />
              <span>Doubt Solver</span>
            </button>
          </nav>

          {/* Action Buttons: Saved Builds & Login / Gmail */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsSavedModalOpen(true)}
              className="btn-aero-glass"
              title="View your saved drone designs"
            >
              <FolderCheck className="icon-sm text-amber" />
              <span>My Builds</span>
              <span className="telemetry-badge amber" style={{ padding: '1px 5px', fontSize: '10px' }}>
                {savedBuilds.length}
              </span>
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="btn-aero-primary"
            >
              <User className="icon-sm" />
              <span>{user ? user.name.split(' ')[0] : 'Sign In / Gmail'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div 
          className="aero-glass-heavy border-volt" 
          style={{ 
            position: 'fixed', 
            bottom: '24px', 
            right: '24px', 
            zIndex: 50, 
            background: 'rgba(0, 255, 170, 0.14)', 
            border: '1px solid var(--volt-core)',
            color: 'var(--volt-core)', 
            padding: '10px 18px', 
            borderRadius: '6px', 
            fontSize: '12px', 
            fontFamily: 'var(--font-mono)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 className="icon-sm" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Active Drone Quick Telemetry Ribbon */}
      <div style={{ background: 'rgba(10, 14, 24, 0.95)', borderBottom: '1px solid var(--border-subtle)', padding: '8px 24px' }}>
        <div className="max-w-7xl flex flex-wrap items-center justify-between text-xs gap-3 font-mono">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-slate-400">ACTIVE ARCHITECTURE:</span>
            <strong className="text-white font-display text-sm uppercase tracking-wide">
              {currentConfig.name}
            </strong>
            <span className="telemetry-badge amber">
              {currentConfig.wheelbase}mm WHEELBASE
            </span>
            <span className="telemetry-badge cyan">
              {currentConfig.frameType.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span>AUW: <strong className="text-white">{currentConfig.auwGrams}g</strong></span>
            <span>TWR: <strong className="text-volt">{currentConfig.twr}:1</strong></span>
            <span>EST. COST: <strong className="text-volt">₹{(currentConfig.estimatedCostINR || currentConfig.estimatedCost * 83).toLocaleString('en-IN')} INR</strong></span>
            <button
              onClick={handleSaveCurrentBuild}
              className="text-amber hover:underline flex items-center gap-1 font-bold"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <Save className="icon-xs" />
              <span>Save Spec</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dynamic Viewport */}
      <main className="main-content">
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* 3D Model Hero Section (Prominently Front and Center!) */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display font-bold text-2xl text-white uppercase tracking-wider" style={{ margin: 0 }}>
                    Live 3D CAD Drone Chassis Studio
                  </h2>
                  <p className="text-xs text-slate-400" style={{ marginTop: '3px' }}>
                    Real-time 3D parametric visualization. Rotate, zoom, test spinning propellers, inspect internal layers with exploded assembly view, and customize chassis materials.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="telemetry-badge volt">
                    3D ENGINE: THREE.JS LIVE
                  </span>
                </div>
              </div>

              {/* The 3D Drone Viewport */}
              <Drone3DViewer 
                droneConfig={currentConfig}
                onConfigChange={(newCfg) => setCurrentConfig(newCfg)}
              />
            </div>

            {/* Architecture Configurator & Component BOM directly below the 3D Model */}
            <div className="mt-6">
              <DroneConfigurator 
                currentConfig={currentConfig}
                onConfigChange={(newCfg) => setCurrentConfig(newCfg)}
                onSaveBuild={handleSaveCurrentBuild}
                onSwitchTo3D={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'assembly-lab' && (
          <AssemblyLab 
            onOpenDoubtSolver={handleOpenDoubtForStep}
          />
        )}

        {activeTab === 'wiring' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-white uppercase tracking-wider">
                Avionics Schematics &amp; Solder Pad Reference
              </h2>
              <p className="text-xs text-slate-400">
                Detailed pinouts for UART serial connections, digital/analog FPV cameras, power filtering, and motor phases.
              </p>
            </div>
            <WiringPadHelper />
          </div>
        )}

        {activeTab === 'doubt-solver' && (
          <DoubtSolver 
            initialQuery={doubtQuery}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="aero-glass-heavy" style={{ borderTop: '1px solid var(--border-subtle)', padding: '24px', marginTop: '48px' }}>
        <div className="max-w-7xl flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="radar-dot amber" />
              <strong className="text-white font-display text-base tracking-wide">AEROFORGE 3D PROTOTYPING SUITE</strong>
            </div>
            <p className="text-slate-500 font-mono" style={{ fontSize: '11px', margin: 0 }}>
              Built to help developers, students, and engineers create custom drones from initial concept to maiden flight.
            </p>
          </div>

          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="text-slate-500">SYSTEM STATUS: 100% OPERATIONAL</span>
            <span className="telemetry-badge volt">BETAFLIGHT READY</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
        onLogin={(newUser) => setUser(newUser)}
        onLogout={() => setUser(null)}
      />

      <SavedBuildsModal 
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedBuilds={savedBuilds}
        onLoadBuild={handleLoadBuild}
        onDeleteBuild={handleDeleteBuild}
      />
    </div>
  );
}
