import React, { useState } from 'react';
import { 
  Cpu, 
  Battery, 
  Sliders, 
  Scale, 
  Gauge, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Save, 
  Box,
  Eye,
  Info,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { DRONE_ARCHETYPES, calculateCustomDroneMetricsINR } from '../data/droneArchetypes';

export default function DroneConfigurator({ 
  currentConfig, 
  onConfigChange, 
  onSaveBuild, 
  onSwitchTo3D 
}) {
  const [activeTab, setActiveTab] = useState('presets'); // 'presets' or 'custom'

  // Custom drone state in INR
  const [wheelbase, setWheelbase] = useState(currentConfig.wheelbase || 450);
  const [frameType, setFrameType] = useState(currentConfig.frameType || 'true-x');
  const [batteryCells, setBatteryCells] = useState(3);
  const [targetPayload, setTargetPayload] = useState(150);
  const [cameraTilt, setCameraTilt] = useState(25);
  const [budgetLimitINR, setBudgetLimitINR] = useState(25000);

  // Calculate live engineering metrics for custom config in INR
  const customMetrics = calculateCustomDroneMetricsINR({
    wheelbase,
    frameType,
    batteryCells,
    targetPayloadGrams: targetPayload,
    customBudgetINR: budgetLimitINR
  });

  // Handle Preset Selection
  const handleSelectPreset = (preset) => {
    onConfigChange(preset);
  };

  // Apply Custom Drone Configuration
  const handleApplyCustom = () => {
    const updated = {
      id: `custom-${Date.now()}`,
      name: `Custom ${wheelbase}mm ${frameType.toUpperCase()}`,
      category: `Custom Build (${customMetrics.dgcaClass})`,
      tagline: `Engineered ${wheelbase}mm chassis with ${batteryCells}S battery power and ${customMetrics.propSizeInches}" propellers.`,
      wheelbase,
      frameType,
      armsCount: frameType === 'hexacopter' ? 6 : frameType === 'octocopter' ? 8 : 4,
      hasDucts: frameType === 'cinewhoop',
      cameraTiltDeg: cameraTilt,
      estimatedCostINR: customMetrics.totalCostINR,
      flightTimeMin: customMetrics.flightTime,
      twr: customMetrics.twr,
      auwGrams: customMetrics.totalWeight,
      dgcaCategory: customMetrics.dgcaClass,
      realImage: wheelbase <= 100 ? '/assets/real_micro_whoop.jpg' : frameType === 'hexacopter' ? '/assets/real_hexacopter_drone.jpg' : wheelbase >= 400 ? '/assets/real_f450_drone.jpg' : '/assets/real_freestyle_drone.jpg',
      targetBattery: `${batteryCells}S LiPo (${(batteryCells * 3.7).toFixed(1)}V Nominal)`,
      components: [
        { 
          category: 'Chassis Frame', 
          name: `${wheelbase}mm Drone Frame Kit (${frameType.toUpperCase()})`, 
          costINR: Math.round(customMetrics.totalCostINR * 0.18), 
          weightG: Math.round(customMetrics.totalWeight * 0.22), 
          store: 'Robu.in',
          specs: `Durable carbon composite / glass-fiber unibody with M3 hardware` 
        },
        { 
          category: 'Brushless Motors', 
          name: `${customMetrics.motorRecommendation} (${frameType === 'hexacopter' ? '6x Set' : '4x Set'})`, 
          costINR: Math.round(customMetrics.totalCostINR * 0.35), 
          weightG: Math.round(customMetrics.totalWeight * 0.28), 
          store: 'FlyRobo',
          specs: `High-torque windings optimized for ${batteryCells}S LiPo` 
        },
        { 
          category: 'Propellers', 
          name: `${customMetrics.propSizeInches}" Matched Aerodynamic Propellers`, 
          costINR: 450, 
          weightG: 22, 
          store: 'QuadKopter.in',
          specs: `Balanced CW/CCW propeller pairs` 
        },
        { 
          category: 'Flight Controller & ESC', 
          name: `SpeedyFlight F4/F7 Stack with ${customMetrics.escAmps}A ESC`, 
          costINR: Math.round(customMetrics.totalCostINR * 0.28), 
          weightG: 34, 
          store: 'DroneLabb',
          specs: `STM32 MCU, 6-axis gyro, ${customMetrics.escAmps}A DShot ESC` 
        },
        { 
          category: 'Radio Link', 
          name: 'ExpressLRS 2.4GHz Receiver / FlySky i6 Compatible', 
          costINR: 1450, 
          weightG: 4, 
          store: 'Robu.in',
          specs: `WPC compliant 2.4GHz ISM frequency, long range telemetry` 
        }
      ]
    };

    onConfigChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Configurator Mode Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sliders className="icon-md text-amber" />
          <div>
            <h2 className="font-display font-bold text-2xl uppercase tracking-wider text-white" style={{ margin: 0 }}>
              Drone Architecture &amp; Component Generator
            </h2>
            <p className="text-xs text-slate-400" style={{ margin: 0 }}>
              Standardized for Indian Developers &amp; Engineering Students (Currency in ₹ INR, DGCA Standards)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', background: 'rgba(14,20,30,0.8)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '3px' }}>
          <button
            onClick={() => setActiveTab('presets')}
            className={`btn-aero-glass ${activeTab === 'presets' ? 'active' : ''}`}
            style={{ border: 'none', padding: '6px 14px' }}
          >
            Verified Indian Archetypes
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`btn-aero-glass ${activeTab === 'custom' ? 'active' : ''}`}
            style={{ border: 'none', padding: '6px 14px' }}
          >
            Custom Scratch Builder
          </button>
        </div>
      </div>

      {activeTab === 'presets' ? (
        /* Presets Grid - Non-boxy 3D Glass Cards with Hover Tilt */
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="icon-sm text-volt" />
              <span className="font-display font-bold text-sm text-white uppercase tracking-wider">
                Select Hardware Architecture
              </span>
            </div>
            <span className="telemetry-badge volt">
              6 Verified Indian DIY Platforms (₹1,750 - ₹78,000)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DRONE_ARCHETYPES.map(drone => {
              const isSelected = currentConfig.id === drone.id;
              const isESP32 = drone.id.includes('esp32');

              return (
                <div
                  key={drone.id}
                  onClick={() => handleSelectPreset(drone)}
                  className={`aero-glass glass-card-interactive ${isSelected ? 'border-amber' : ''}`}
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    borderRadius: '26px',
                    border: isSelected ? '2px solid var(--amber-core)' : isESP32 ? '1px solid rgba(0, 255, 170, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(13, 19, 32, 0.8) 100%)' 
                      : isESP32 
                      ? 'linear-gradient(135deg, rgba(0, 255, 170, 0.08) 0%, rgba(13, 19, 32, 0.7) 100%)'
                      : 'var(--bg-glass-card)',
                    boxShadow: isSelected 
                      ? '0 24px 50px rgba(245, 158, 11, 0.25), inset 0 1px 2px rgba(255,255,255,0.4)' 
                      : '0 18px 40px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255,255,255,0.2)'
                  }}
                >
                  <div className="space-y-3">
                    {/* Real Drone Thumbnail Preview with Rounded Bezels */}
                    <div style={{ width: '100%', height: '170px', borderRadius: '18px', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
                      <img 
                        src={drone.realImage} 
                        alt={drone.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        className="hover:scale-105"
                      />
                      
                      {/* Top Badges */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <span 
                          className="telemetry-badge amber" 
                          style={{ fontSize: '10px', padding: '3px 8px' }}
                        >
                          {drone.wheelbase}mm
                        </span>
                        {isESP32 && (
                          <span 
                            className="telemetry-badge volt" 
                            style={{ fontSize: '9px', padding: '3px 8px', background: 'rgba(0, 255, 170, 0.85)', color: '#000' }}
                          >
                            NO CAMERA • CHEAP MCU
                          </span>
                        )}
                      </div>

                      {/* Flight Time Badge Bottom Right */}
                      <span 
                        className="telemetry-badge cyan" 
                        style={{ position: 'absolute', bottom: '10px', right: '10px', fontSize: '10px', padding: '3px 8px' }}
                      >
                        ⏱ {drone.flightTimeMin}m Flight
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span className="telemetry-badge cyan" style={{ fontSize: '10px' }}>
                        {drone.dgcaCategory?.split('(')[0] || 'DGCA'}
                      </span>
                      <strong className="font-display font-bold text-2xl text-volt" style={{ textShadow: '0 0 16px rgba(0,255,170,0.4)' }}>
                        ₹{drone.estimatedCostINR.toLocaleString('en-IN')}
                      </strong>
                    </div>

                    <h3 className="font-display font-bold text-xl text-white" style={{ margin: '4px 0 0 0', lineHeight: 1.25 }}>
                      {drone.name}
                    </h3>
                    <p className="text-xs text-slate-300" style={{ margin: 0, fontSize: '12px', lineHeight: 1.45 }}>
                      {drone.tagline}
                    </p>
                  </div>

                  {/* Specs Pill Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-mono text-slate-400" style={{ fontSize: '9px', display: 'block' }}>THRUST</span>
                      <strong className="text-xs text-white">{drone.twr}:1 TWR</strong>
                    </div>
                    <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-mono text-slate-400" style={{ fontSize: '9px', display: 'block' }}>WEIGHT</span>
                      <strong className="text-xs text-white">{drone.auwGrams}g AUW</strong>
                    </div>
                    <div style={{ padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span className="font-mono text-slate-400" style={{ fontSize: '9px', display: 'block' }}>CATEGORY</span>
                      <strong className="text-xs text-volt">{isESP32 ? '₹ Budget' : 'Brushless'}</strong>
                    </div>
                  </div>

                  <button
                    className={`btn-aero-primary w-full ${isSelected ? '' : 'btn-aero-glass'}`}
                    style={{ padding: '9px', fontSize: '11px', letterSpacing: '0.06em' }}
                  >
                    {isSelected ? '✓ ACTIVE 3D BLUEPRINT' : 'LOAD SPEC & 3D MODEL'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Custom Scratch Builder Mode */
        <div className="aero-glass p-6 space-y-6">
          <div>
            <h3 className="font-display font-bold text-xl text-white" style={{ margin: '0 0 4px 0' }}>
              Parametric Custom Drone Engineering Matrix (Indian Standard)
            </h3>
            <p className="text-xs text-slate-400" style={{ margin: 0 }}>
              Adjust target size, payload weight, and battery voltage. Our system calculates motor KV ratings, ESC amperage safety limits, and estimated costs in ₹ INR.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Wheelbase */}
            <div className="space-y-1">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                <span className="text-slate-300 font-bold">WHEELBASE (MM):</span>
                <span className="text-amber font-bold">{wheelbase} mm</span>
              </div>
              <input 
                type="range" 
                min="65" 
                max="950" 
                step="5"
                value={wheelbase}
                onChange={(e) => setWheelbase(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
                <span>65mm (Nano)</span>
                <span>450mm (F450 College)</span>
                <span>950mm (Agri Hex)</span>
              </div>
            </div>

            {/* Frame Type */}
            <div className="space-y-1">
              <label className="font-mono text-slate-300 text-xs font-bold" style={{ display: 'block' }}>
                FRAME GEOMETRY:
              </label>
              <select 
                value={frameType} 
                onChange={(e) => setFrameType(e.target.value)}
                className="aero-select"
              >
                <option value="true-x">True-X (College Standard / Freestyle)</option>
                <option value="deadcat">DeadCat (Wide Clean Camera View)</option>
                <option value="cinewhoop">Cinewhoop Ducted (Indoor Safe)</option>
                <option value="hexacopter">Hexacopter 6-Arms (High Redundancy)</option>
              </select>
            </div>

            {/* Battery Cells */}
            <div className="space-y-1">
              <label className="font-mono text-slate-300 text-xs font-bold" style={{ display: 'block' }}>
                BATTERY POWER (CELL COUNT):
              </label>
              <select 
                value={batteryCells} 
                onChange={(e) => setBatteryCells(parseInt(e.target.value))}
                className="aero-select"
              >
                <option value={1}>1S (3.7V - 4.35V) - Nano Whoop</option>
                <option value={3}>3S (11.1V) - Standard F450 College Drone</option>
                <option value={4}>4S (14.8V) - High Efficiency FPV</option>
                <option value={6}>6S (22.2V) - Professional High Speed</option>
                <option value={12}>12S (44.4V) - Heavy Kisan Agri Sprayer</option>
              </select>
            </div>
          </div>

          {/* Real-time Calculated Metrics Output */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px' }}>
            <div className="stat-box amber">
              <span className="font-mono text-slate-400" style={{ fontSize: '10px' }}>DGCA CLASSIFICATION</span>
              <strong className="text-white font-display text-sm block">{customMetrics.dgcaClass}</strong>
            </div>
            <div className="stat-box cyan">
              <span className="font-mono text-slate-400" style={{ fontSize: '10px' }}>RECOMMENDED PROPELLER</span>
              <strong className="text-cyan font-display text-base block">{customMetrics.propSizeInches}" Propeller</strong>
            </div>
            <div className="stat-box volt">
              <span className="font-mono text-slate-400" style={{ fontSize: '10px' }}>THRUST-TO-WEIGHT</span>
              <strong className="text-volt font-display text-base block">{customMetrics.twr} : 1 RATIO</strong>
            </div>
            <div className="stat-box">
              <span className="font-mono text-slate-400" style={{ fontSize: '10px' }}>ESTIMATED TOTAL COST</span>
              <strong className="text-white font-display text-lg block">₹{customMetrics.totalCostINR.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <button
            onClick={handleApplyCustom}
            className="btn-aero-primary w-full"
            style={{ padding: '12px' }}
          >
            <Sparkles className="icon-sm" />
            <span>Apply Custom Architecture &amp; Update Live Visualizer</span>
          </button>
        </div>
      )}

      {/* Itemized Bill of Materials (BOM) Table in Indian Rupees (₹) */}
      <div className="aero-glass p-6 space-y-4">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box className="icon-sm text-cyan" />
              <h3 className="font-display font-bold text-xl text-white" style={{ margin: 0 }}>
                Itemized Bill of Materials (BOM) — Indian Market Pricing
              </h3>
            </div>
            <p className="text-xs text-slate-400" style={{ margin: '2px 0 0 0' }}>
              Required components &amp; verified stores in India for: <strong className="text-white">{currentConfig.name}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={onSaveBuild}
              className="btn-aero-glass"
              title="Save this build spec"
            >
              <Save className="icon-xs text-amber" />
              <span>Save Spec</span>
            </button>
          </div>
        </div>

        {/* Component Table with Indian Retailers */}
        <div className="overflow-x-auto">
          <table style={{ width: '100%', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: '#94a3b8', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Subsystem</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Component Description</th>
                <th style={{ textAlign: 'left', padding: '8px 12px' }}>Specs</th>
                <th style={{ textAlign: 'center', padding: '8px 12px' }}>Indian Retailer</th>
                <th style={{ textAlign: 'right', padding: '8px 12px' }}>Est. Cost (INR)</th>
              </tr>
            </thead>
            <tbody>
              {currentConfig.components.map((comp, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="font-mono text-amber font-bold" style={{ padding: '10px 12px' }}>
                    {comp.category}
                  </td>
                  <td className="text-white font-medium" style={{ padding: '10px 12px' }}>
                    {comp.name}
                  </td>
                  <td className="text-slate-400" style={{ padding: '10px 12px', fontSize: '11px' }}>
                    {comp.specs}
                  </td>
                  <td style={{ textAlign: 'center', padding: '10px 12px' }}>
                    <span className="telemetry-badge" style={{ fontSize: '10px' }}>
                      {comp.store || 'Robu.in'}
                    </span>
                  </td>
                  <td className="font-mono text-volt font-bold" style={{ textAlign: 'right', padding: '10px 12px' }}>
                    ₹{comp.costINR?.toLocaleString('en-IN') || (comp.cost * 83).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: '2px solid rgba(255,255,255,0.15)', background: 'rgba(0,0,0,0.3)', fontFamily: 'var(--font-mono)' }}>
                <td colSpan={3} style={{ padding: '12px', color: '#fff', fontWeight: 700 }}>
                  TOTAL ESTIMATED PROTOTYPE ARCHITECTURE
                </td>
                <td style={{ textAlign: 'center', padding: '12px', color: '#cbd5e1' }}>
                  {currentConfig.auwGrams}g AUW
                </td>
                <td style={{ textAlign: 'right', padding: '12px', color: 'var(--volt-core)', fontWeight: 700, fontSize: '16px' }}>
                  ₹{(currentConfig.estimatedCostINR || currentConfig.estimatedCost * 83).toLocaleString('en-IN')} INR
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Indian Drone Regulations Compliance Callout */}
        <div className="stat-box cyan" style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <ShieldCheck className="icon-sm text-cyan" />
            <strong className="font-mono text-cyan text-xs">
              INDIAN DGCA &amp; DIGITAL SKY COMPLIANCE NOTE:
            </strong>
          </div>
          <p className="text-xs text-slate-300" style={{ margin: 0, lineHeight: 1.5 }}>
            {currentConfig.auwGrams < 250 
              ? 'This drone is under 250g (DGCA Nano Category). No Remote Pilot Certificate or UIN required for recreational flights in Green Zones!' 
              : `This drone is in the ${currentConfig.dgcaCategory || 'DGCA Micro Category'}. Requires DigitalSky UIN generation and compliance with Indian Drone Rules 2021 before outdoor commercial flight.`}
          </p>
        </div>
      </div>
    </div>
  );
}
