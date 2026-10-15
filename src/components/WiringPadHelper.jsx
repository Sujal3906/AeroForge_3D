import React, { useState } from 'react';
import { 
  Cpu, 
  Zap, 
  Radio, 
  Video, 
  HelpCircle, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function WiringPadHelper() {
  const [selectedSubsystem, setSelectedSubsystem] = useState('esp32'); // Default to ESP32 budget build

  const subsystemGuides = {
    esp32: {
      name: 'DIY ESP32 Wi-Fi Micro-Drone & MPU6050 (Cheapest No-Camera Build)',
      icon: <Cpu className="w-5 h-5 text-volt" />,
      pins: [
        { padName: 'ESP32 GPIO 21 / GPIO 8', fcPad: 'MPU-6050 SDA Pad', wireColor: 'Blue Wire', note: 'I2C Serial Data line for pitch & roll gyro reading at 1000Hz' },
        { padName: 'ESP32 GPIO 22 / GPIO 9', fcPad: 'MPU-6050 SCL Pad', wireColor: 'Yellow Wire', note: 'I2C Serial Clock line (Pullup resistors included on MPU module)' },
        { padName: 'ESP32 3V3 / VIN', fcPad: 'MPU-6050 VCC (+3.3V / +5V)', wireColor: 'Red Wire', note: 'Clean filtered power rail for sensor IC' },
        { padName: 'ESP32 GND', fcPad: 'Sensor GND & MOSFET Sources', wireColor: 'Black Wire', note: 'Common system ground reference' },
        { padName: 'ESP32 GPIO 16, 17, 18, 19', fcPad: 'Gate of 4x SI2302 MOSFETs', wireColor: 'Green Wires', note: 'High-frequency 32kHz PWM speed control signal from ESP32 core' },
        { padName: '4x 1N4148 Diodes', fcPad: 'Across Motor + & - Leads', wireColor: 'Glass Bead', note: 'CRITICAL: Flyback protection! Black stripe goes to battery positive' }
      ],
      goldenRule: 'FLYBACK PROTECTION IS MANDATORY! When brushed motors spin at 55,000 RPM, stopping them generates 30V+ inductive kickback. The 1N4148 diodes absorb this spike so your ₹190 ESP32 does not burn! Zero camera needed.',
      betaflightTip: 'No Betaflight needed! Flash the open-source ESP-Drone firmware or custom Arduino IDE sketch. Connect phone Wi-Fi to SSID "ESP32-DRONE" and fly via browser or app!'
    },
    receiver: {
      name: 'ExpressLRS / Crossfire Radio Receiver',
      icon: <Radio className="w-5 h-5 text-[var(--cyan-core)]" />,
      pins: [
        { padName: '5V (Power)', fcPad: '5V Rail', wireColor: 'Red', note: 'Provides steady 5V to receiver MCU' },
        { padName: 'GND (Ground)', fcPad: 'GND (Ground)', wireColor: 'Black', note: 'Common ground reference' },
        { padName: 'TX (Transmit)', fcPad: 'RX (Receive, e.g. R1 or R2)', wireColor: 'White / Yellow', note: 'CRITICAL: Crossover rule! Receiver TX goes to FC RX' },
        { padName: 'RX (Receive)', fcPad: 'TX (Transmit, e.g. T1 or T2)', wireColor: 'Green', note: 'CRITICAL: Receiver RX goes to FC TX for telemetry' }
      ],
      goldenRule: 'UART Crossover Rule: Always solder TX -> RX, and RX -> TX. Never connect TX to TX!',
      betaflightTip: 'In Betaflight Ports tab, enable "Serial Rx" toggle on the UART port you soldered to (e.g. UART1).'
    },
    vtx: {
      name: 'Video Transmitter (Analog or Digital HD)',
      icon: <Video className="w-5 h-5 text-[var(--amber-core)]" />,
      pins: [
        { padName: 'VCC / 9V (Power)', fcPad: '9V or VCC Pad', wireColor: 'Red', note: 'Check VTX input voltage (Walksnail 1S is 5V, DJI O3 is 9V-26V)' },
        { padName: 'GND (Ground)', fcPad: 'GND', wireColor: 'Black', note: 'Ensure clean ground to prevent motor electrical noise in video' },
        { padName: 'Video In (Analog)', fcPad: 'VTX Pad on FC', wireColor: 'Yellow', note: 'Carries video with Betaflight OSD overlay inserted' },
        { padName: 'SmartAudio / IRC Tramp', fcPad: 'Free FC TX (e.g. TX2)', wireColor: 'Blue / Green', note: 'Enables changing VTX power and channels from your radio or OSD' }
      ],
      goldenRule: 'NEVER power on a VTX without its antenna firmly attached, or the RF power amplifier will burn out in seconds.',
      betaflightTip: 'In Betaflight Ports tab, set Peripherals to "VTX (IRC Tramp)" or "VTX (TBS SmartAudio)" on the chosen UART.'
    },
    camera: {
      name: 'FPV Camera (Analog)',
      icon: <Video className="w-5 h-5 text-[var(--volt-core)]" />,
      pins: [
        { padName: '5V / 9V Power', fcPad: 'CAM 5V / 9V', wireColor: 'Red', note: 'Clean filtered BEC voltage' },
        { padName: 'GND (Ground)', fcPad: 'CAM GND', wireColor: 'Black', note: 'Ground next to CAM video pad' },
        { padName: 'Video Out', fcPad: 'CAM / VIN Pad', wireColor: 'Yellow', note: 'Raw camera video into FC OSD chip' }
      ],
      goldenRule: 'Twist the 3 camera wires together into a tight braid before soldering; this acts as RF shielding against motor EMI spikes.',
      betaflightTip: 'If video is clear but OSD text is missing, verify PAL vs NTSC format matches your camera sensor in the OSD tab.'
    },
    power: {
      name: 'Main Battery Lead & Filtering Capacitor',
      icon: <Zap className="w-5 h-5 text-[var(--volt-core)]" />,
      pins: [
        { padName: 'BAT+ (Positive)', fcPad: 'ESC BAT+ Pad', wireColor: 'Red 14AWG', note: 'High current main battery terminal' },
        { padName: 'BAT- (Negative)', fcPad: 'ESC BAT- Pad', wireColor: 'Black 14AWG', note: 'Main battery ground plane' },
        { padName: 'Capacitor Long Leg (+)', fcPad: 'ESC BAT+ Pad', wireColor: 'Silver lead', note: 'Positive leg of 1000uF Low-ESR capacitor' },
        { padName: 'Capacitor Stripe Leg (-)', fcPad: 'ESC BAT- Pad', wireColor: 'Negative stripe', note: 'CRITICAL: Grey stripe with minus signs MUST go to BAT-' }
      ],
      goldenRule: 'Capacitor Polarity is Life-or-Death! Reversed capacitor = explosive rupture when battery is connected.',
      betaflightTip: 'Always calibrate the voltage meter scale in the Power & Battery tab using a multimeter reading.'
    },
    motors: {
      name: 'Brushless Motors (3-Phase AC)',
      icon: <Cpu className="w-5 h-5 text-[var(--cyan-core)]" />,
      pins: [
        { padName: 'Phase Wire 1', fcPad: 'ESC Motor Pad 1', wireColor: 'Black', note: 'Solder straight across' },
        { padName: 'Phase Wire 2', fcPad: 'ESC Motor Pad 2', wireColor: 'Black', note: 'Solder straight across' },
        { padName: 'Phase Wire 3', fcPad: 'ESC Motor Pad 3', wireColor: 'Black', note: 'Solder straight across' }
      ],
      goldenRule: 'Brushless motors have no polarity! Any wire can go to any pad. Swap motor rotation with 1-click in Betaflight Motors tab.',
      betaflightTip: 'Enable Bidirectional DShot in Betaflight to unlock motor RPM telemetry and digital notch filtering.'
    }
  };

  const active = subsystemGuides[selectedSubsystem];

  return (
    <div className="aero-glass rounded-2xl p-6 space-y-5" style={{ borderRadius: '24px' }}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[var(--amber-core)]" />
            <h3 className="font-display font-bold text-xl text-white">
              Interactive Wiring &amp; Solder Pad Guide
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Select a subsystem to see the exact solder pads, wiring pinout, and golden rules:
          </p>
        </div>

        {/* Subsystem Select Buttons - Rounded Capsules */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { id: 'esp32', label: '⚡ ESP32 & MPU6050 (Budget No-Cam)' },
            { id: 'receiver', label: 'Radio Receiver (ELRS)' },
            { id: 'vtx', label: 'VTX (Video TX)' },
            { id: 'camera', label: 'FPV Camera' },
            { id: 'power', label: 'Battery & Cap' },
            { id: 'motors', label: 'Motors to ESC' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedSubsystem(tab.id)}
              className={`px-3.5 py-1.5 text-xs font-mono transition-all ${
                selectedSubsystem === tab.id 
                  ? 'btn-aero-primary' 
                  : 'btn-aero-glass'
              }`}
              style={{ borderRadius: '9999px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Card */}
      <div className="aero-glass-heavy chamfered border border-[var(--border-active)] p-5 space-y-4">
        <div className="flex items-center gap-2">
          {active.icon}
          <h4 className="font-['Rajdhani'] font-bold text-lg text-white">
            {active.name} — Pinout Table
          </h4>
        </div>

        {/* Pinout Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                <th className="py-2 px-3">Peripheral Pin</th>
                <th className="py-2 px-3">Connects To FC Pad</th>
                <th className="py-2 px-3">Recommended Wire</th>
                <th className="py-2 px-3">Engineering Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {active.pins.map((pin, pIdx) => (
                <tr key={pIdx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-bold text-white">
                    {pin.padName}
                  </td>
                  <td className="py-2.5 px-3 text-[var(--cyan-core)] font-bold">
                    {pin.fcPad}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {pin.wireColor}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 font-sans text-xs">
                    {pin.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Golden Rule Callout */}
        <div className="p-3.5 bg-[rgba(245,158,11,0.08)] border border-[var(--amber-core)] rounded-lg space-y-1">
          <span className="text-xs font-mono text-[var(--amber-core)] font-bold flex items-center gap-1.5 uppercase">
            <AlertCircle className="w-4 h-4" />
            GOLDEN HARDWARE RULE:
          </span>
          <p className="text-xs text-slate-200">
            {active.goldenRule}
          </p>
        </div>

        {/* Betaflight Configuration Tip */}
        <div className="stat-box cyan space-y-1">
          <span className="text-xs font-mono text-[var(--cyan-core)] font-bold uppercase">
            SOFTWARE CONFIGURATION (BETAFLIGHT):
          </span>
          <p className="text-xs text-slate-300">
            {active.betaflightTip}
          </p>
        </div>
      </div>
    </div>
  );
}
