import React from 'react';
import { 
  X, 
  FolderCheck, 
  Trash2, 
  Download, 
  ArrowRight, 
  Box, 
  Calendar,
  Layers
} from 'lucide-react';

export default function SavedBuildsModal({ 
  isOpen, 
  onClose, 
  savedBuilds, 
  onLoadBuild, 
  onDeleteBuild 
}) {
  if (!isOpen) return null;

  const handleExportAll = () => {
    const dataStr = JSON.stringify(savedBuilds, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AeroForge_My_Drone_Projects.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-dialog"
        style={{ maxWidth: '680px', borderRadius: '26px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <FolderCheck className="w-6 h-6 text-amber" />
            <h3 className="font-display font-bold text-2xl uppercase tracking-wide text-white">
              My Saved Drone Projects ({savedBuilds.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {savedBuilds.length > 0 && (
              <button 
                onClick={handleExportAll}
                className="btn-aero-glass"
                title="Download all saved projects"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export All</span>
              </button>
            )}
            <button 
              onClick={onClose}
              className="modal-close-btn"
              style={{ position: 'static' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {savedBuilds.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Box className="w-12 h-12 mx-auto text-slate-600" />
              <p className="text-slate-400 text-sm">
                No saved drone projects yet.
              </p>
              <p className="text-xs text-slate-500">
                Customize a drone in the Configurator or 3D Studio and click "Save Build Spec" to store it here.
              </p>
            </div>
          ) : (
            savedBuilds.map((build) => (
              <div 
                key={build.id}
                className="aero-glass p-4 rounded-lg border border-[var(--border-subtle)] hover:border-[var(--amber-core)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="telemetry-badge amber">
                      {build.wheelbase}mm
                    </span>
                    <span className="telemetry-badge cyan">
                      {build.frameType.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {build.savedAt || 'Recently saved'}
                    </span>
                  </div>

                  <h4 className="font-['Rajdhani'] font-bold text-lg text-white group-hover:text-[var(--cyan-core)] transition-colors">
                    {build.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    Est. Cost: <strong className="text-[var(--volt-core)]">₹{(build.estimatedCostINR || build.estimatedCost * 83).toLocaleString('en-IN')}</strong> | AUW: {build.auwGrams}g | TWR: {build.twr}:1
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onLoadBuild(build);
                      onClose();
                    }}
                    className="btn-aero-primary py-1.5 px-3.5 text-xs"
                  >
                    <span>Load Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteBuild(build.id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Delete saved project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[var(--border-subtle)] text-right">
          <button onClick={onClose} className="btn-aero-glass">
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
