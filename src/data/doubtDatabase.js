// AeroForge 3D - Engineering Troubleshooting & Doubt Solver Knowledge Base
// Diagnostic trees for hardware, electrical, firmware, RF, and aerodynamics

export const DOUBT_CATEGORIES = [
  { id: 'electrical', name: 'Electrical & Power', icon: 'zap' },
  { id: 'motors-esc', name: 'Motors & ESC', icon: 'cpu' },
  { id: 'flight-controller', name: 'Flight Controller & Betaflight', icon: 'layers' },
  { id: 'radio-link', name: 'ExpressLRS & Radio RC', icon: 'radio' },
  { id: 'fpv-video', name: 'Camera & FPV Video', icon: 'video' },
  { id: 'flight-dynamics', name: 'Flight Dynamics & Maiden Crashes', icon: 'wind' }
];

export const DOUBT_ITEMS = [
  {
    id: 'smoke-stopper-red',
    category: 'electrical',
    title: 'Smoke Stopper LED turns bright red immediately when plugging in battery',
    keywords: ['smoke stopper', 'red light', 'short circuit', 'continuity', 'multimeter', 'beep', 'spark'],
    severity: 'Critical Hazard',
    quickSummary: 'A direct electrical short circuit exists between the positive (VCC) and ground (GND) rails.',
    probableCauses: [
      'Solder bridge across ESC main battery pads or motor pads.',
      'Motor screw length is too long, piercing the stator windings inside the motor.',
      'Damaged silicone wire insulation pinched between carbon fiber frame plates.',
      'Low-ESR capacitor soldered backwards with reversed polarity.'
    ],
    diagnosticSteps: [
      'Unplug battery immediately! Do NOT attempt to override or bypass the smoke stopper.',
      'Disconnect the 8-pin FC-to-ESC wiring harness. Plug in smoke stopper again: if it still trips, the short is on the ESC/motor side.',
      'Inspect motor screws under bright light. Ensure at least 1mm gap exists between screw tips and motor copper coils.',
      'Check the capacitor: verify the grey stripe with minus (-) signs is on the negative battery pad.'
    ],
    solution: 'Desolder the bridge or replace the oversized motor screws with 6mm/7mm screws. Clean all solder joints with 99% Isopropyl alcohol and toothbrush before re-testing.'
  },
  {
    id: 'flip-on-takeoff',
    category: 'flight-dynamics',
    title: 'Drone violently flips upside down / disarms as soon as throttle is raised ("Flip of Death")',
    keywords: ['flip', 'takeoff', 'spins out', 'turtle', 'disarm', 'runaway', 'flyaway', 'crash on arm'],
    severity: 'High',
    quickSummary: 'The flight controller thinks it is tilting one direction and commands motors to compensate, but the motors respond in the wrong orientation, creating a runaway feedback loop.',
    probableCauses: [
      'Propeller mounted on the wrong motor (e.g. Clockwise prop on Counter-Clockwise spinning motor).',
      'Motor spin direction reversed compared to Betaflight Motors tab (Props In vs Props Out).',
      'Motor ordering swapped (e.g. Motor 1 signal wire routed to Motor 4 pad).',
      'Flight controller board orientation angle incorrect in Betaflight.'
    ],
    diagnosticSteps: [
      'Take propellers OFF.',
      'Connect to Betaflight Setup tab: place drone flat, tilt nose up by hand. Does the 3D model on screen tilt its nose up? If it rolls left or pitches down, board orientation is incorrect.',
      'Go to Motors tab: spin motor #1 individually. Verify the physical rear-right motor spins. Check motor #2, #3, and #4 matching the diagram.',
      'Verify propeller leading edges match motor rotation direction.'
    ],
    solution: 'Adjust Board and Sensor Alignment in Betaflight Configuration tab, reverse any swapped motor in the Motors Wizard, and mount props with lettering facing upward in the correct rotation.'
  },
  {
    id: 'betaflight-no-connection',
    category: 'flight-controller',
    title: 'Computer says "Failed to open serial port" or does not detect Flight Controller',
    keywords: ['betaflight', 'serial port', 'driver', 'usb', 'stm32', 'dfu', 'connection failed', 'com port'],
    severity: 'Medium',
    quickSummary: 'The operating system cannot establish a virtual COM port handshake with the STM32 microcontroller.',
    probableCauses: [
      'Using a cheap "charge-only" USB cable that lacks D+ / D- data wires.',
      'Missing STM32 Virtual COM Port (VCP) drivers on Windows.',
      'USB-C port on FC physically damaged or clogged with carbon dust.',
      'FC is stuck in DFU bootloader mode.'
    ],
    diagnosticSteps: [
      'Test the USB cable with another device or your phone: can it transfer files? If not, replace the cable.',
      'Open Windows Device Manager: plug and unplug the FC. Look under "Ports (COM & LPT)" for STM32 Virtual COM Port.',
      'If you see an exclamation mark or driver error, download and run the free "ImpulseRC Driver Fixer" tool with the drone plugged in.'
    ],
    solution: 'Use a verified data-sync USB cable and run ImpulseRC Driver Fixer to automatically install the CP210x or STM32 VCP drivers.'
  },
  {
    id: 'elrs-binding-failed',
    category: 'radio-link',
    title: 'ExpressLRS (ELRS) receiver will not bind or shows solid / slow blinking LED',
    keywords: ['elrs', 'expresslrs', 'binding', 'bind', 'rx', 'receiver', 'led blink', 'no signal', 'telemetry lost'],
    severity: 'Medium',
    quickSummary: 'Mismatch in ELRS major firmware version (v2.x vs v3.x), mismatched binding phrase, or UART TX/RX inverted wiring.',
    probableCauses: [
      'Transmitter is running ELRS 3.x while Receiver is on factory ELRS 2.x firmware (they cannot communicate across major versions).',
      'Receiver TX is wired to FC TX instead of FC RX (missing crossover).',
      'Serial RX toggle is enabled on the wrong UART in Betaflight Ports tab.'
    ],
    diagnosticSteps: [
      'Check receiver LED code: 1 fast flash per second = Waiting for WiFi connection; 2 slow flashes = Binding mode; Solid LED = Successfully bound to transmitter.',
      'Verify wiring: Receiver TX -> FC RX (e.g. R1); Receiver RX -> FC TX (e.g. T1).',
      'In Betaflight Ports tab, ensure "Serial Rx" is checked ON ONLY for the specific UART your receiver is soldered to.'
    ],
    solution: 'Power cycle the drone 3 times consecutively (plug battery in, count to 1, unplug, repeat 3 times) to force the receiver into WiFi mode, connect your phone to "ExpressLRS RX" WiFi (password: expresslrs), and set your custom Binding Phrase in the web UI.'
  },
  {
    id: 'fpv-black-screen',
    category: 'fpv-video',
    title: 'FPV Goggles show completely black screen with Betaflight OSD text visible',
    keywords: ['fpv', 'black screen', 'osd', 'camera', 'vtx', 'lens cap', 'no video', 'video signal'],
    severity: 'Medium',
    quickSummary: 'The VTX and OSD generator chip are working perfectly, but the camera sensor is not outputting a video signal to the FC.',
    probableCauses: [
      'Camera lens cap is still installed (very common rookie mistake!).',
      'Camera 5V/9V power wire is disconnected or soldered to a unpowered pad.',
      'Camera Video Out wire is disconnected from the "CAM" pad on the FC.',
      'Camera sensor damaged or stuck in PAL/NTSC mismatch.'
    ],
    diagnosticSteps: [
      'Check if Betaflight OSD battery voltage and timer show up on screen. If YES, your VTX is 100% fine!',
      'Check camera lens cap.',
      'Measure voltage with multimeter between Camera 5V pad and GND: is it delivering steady 5.0V?',
      'Check the yellow/white video wire from camera to CAM pad for a cold solder joint.'
    ],
    solution: 'Re-solder the camera power and CAM video signal wires. If camera was powered from a 5V BEC that died, rewire it to the 9V or VCC pad if the camera supports higher voltage.'
  },
  {
    id: 'hot-motors-desync',
    category: 'motors-esc',
    title: 'Motors get burning hot after 30 seconds of gentle hover, or high-throttle desync',
    keywords: ['hot motors', 'desync', 'motor hot', 'burning smell', 'pid oscillation', 'prop wash', 'd-term'],
    severity: 'High',
    quickSummary: 'High-frequency vibration noise is leaking into the gyroscope, causing the PID loop to violently modulate motor speed thousands of times per second.',
    probableCauses: [
      'Vibration: FC stack screws over-tightened, compressing silicone gummies solid.',
      'Bent or chipped propeller blade causing severe mechanical vibration.',
      'Motor screw touching motor stator wire.',
      'D-term gain set too high, or gyro low-pass filters disabled without RPM filtering.'
    ],
    diagnosticSteps: [
      'Check stack gummies: ensure they are springy and not crushed flat.',
      'Check propeller tips: replace any bent or damaged props.',
      'In Betaflight PID Tuning tab: restore default PID sliders. Do not increase Master D-Gain until filters are dialed in.',
      'Enable Bidirectional DShot and set Gyro RPM Notch filters.'
    ],
    solution: 'Loosen stack screws so gummies absorb vibration, balance or replace props, and ensure Bidirectional DShot is active in ESC settings.'
  },
  {
    id: 'esp32-brownout-throttle',
    category: 'electrical',
    title: 'ESP32 drone reboots / disconnects Wi-Fi as soon as throttle is raised ("Brownout")',
    keywords: ['esp32', 'brownout', 'reboot', 'restart', 'throttle', 'disconnect', 'wifi drop', 'c3', 'nodemcu'],
    severity: 'High',
    quickSummary: 'When 4 coreless motors draw 4-6A peak current simultaneously, the 1S battery voltage temporarily dips below 2.7V, tripping the ESP32 hardware Brownout Detector (BOD).',
    probableCauses: [
      'Weak or low-C rating 1S LiPo battery (requires minimum 25C-30C discharge).',
      'Missing decoupling capacitor across ESP32 VIN/3V3 and GND rails.',
      'Thin gauge power wires (use 20AWG or thicker between battery and motor MOSFETs).',
      'Battery leads too long, causing high resistive voltage drop.'
    ],
    diagnosticSteps: [
      'Observe the ESP32 onboard red/blue LED: does it flash off and on when throttle passes 40%? If yes, it is 100% a brownout reset.',
      'Solder a 470uF or 1000uF 6.3V/10V low-ESR electrolytic capacitor across the ESP32 VIN/3V3 and GND pins to buffer peak surge current.',
      'Measure battery voltage under load: if battery drops below 3.0V immediately, replace the worn 1S cell with a fresh 25C-30C cell.'
    ],
    solution: 'Install a 470uF capacitor directly on the ESP32 power pins, solder short 20AWG battery leads, and use a fresh 1S 300mAh-600mAh 30C LiPo battery.'
  },
  {
    id: 'esp32-no-camera-explanation',
    category: 'flight-dynamics',
    title: 'Why does the cheapest ESP32 drone have NO camera, and how does it fly?',
    keywords: ['no camera', 'camera', 'esp32 camera', 'without camera', 'cheapest', 'cheap processor', 'phone controller', 'wifi'],
    severity: 'Guidance',
    quickSummary: 'Omitting the camera and video transmitter saves ₹1,500 - ₹3,000, saves 12 grams of critical payload, and eliminates Wi-Fi video streaming latency lag.',
    probableCauses: [
      'FPV cameras and 5.8GHz VTX modules require 500mA - 1A of extra current, which drains a tiny 1S battery in under 2 minutes.',
      'Streaming live video over 2.4GHz Wi-Fi creates 150ms+ latency, making micro-drone steering sluggish and prone to crashes.'
    ],
    diagnosticSteps: [
      'Line of Sight (LOS) Flying: The ESP32 drone is designed for indoor and backyard line-of-sight flying and STEM robotics education.',
      'Wi-Fi Flight Controls: The ESP32 hosts its own Wi-Fi Access Point (SSID: "ESP32_DRONE"). Your phone connects directly to it.',
      'Low Latency UDP Packets: Joystick position packets take less than 5ms over local UDP, providing instant crisp throttle, pitch, roll, and yaw response.'
    ],
    solution: 'Fly directly using your smartphone screen with free open-source virtual joysticks or phone accelerometer tilt steering. This allows you to build a fully working drone for under ₹2,000!'
  }
];

// Smart Natural Language Doubt Solver
export function solveDoubtQuery(userQuery) {
  if (!userQuery || userQuery.trim().length === 0) return null;
  const query = userQuery.toLowerCase();

  // Score each doubt item
  const scored = DOUBT_ITEMS.map(item => {
    let score = 0;
    // Check keywords
    item.keywords.forEach(kw => {
      if (query.includes(kw)) score += 3;
    });
    // Check title words
    const titleWords = item.title.toLowerCase().split(/\s+/);
    titleWords.forEach(w => {
      if (w.length > 3 && query.includes(w)) score += 2;
    });
    // Category bonus
    if (query.includes(item.category)) score += 2;
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);

  if (scored[0] && scored[0].score > 0) {
    return scored[0].item;
  }

  // Fallback generic intelligent advice
  return {
    id: 'custom-query-ai',
    category: 'custom-analysis',
    title: `Engineering Analysis for: "${userQuery}"`,
    severity: 'Guidance',
    quickSummary: 'Here is an aerospace engineer troubleshooting checklist tailored to your question.',
    probableCauses: [
      'Signal or protocol mismatch between firmware configuration and hardware capability.',
      'Electrical grounding loop or insufficient low-ESR capacitance on the DC power rail.',
      'Mechanical resonance from frame rigidity or improper flight controller soft-mounting.'
    ],
    diagnosticSteps: [
      'Isolate the subsystem: test USB only, then battery only, then radio link.',
      'Inspect physical solder joints under magnification for micro-bridges or dry joints.',
      'Verify firmware parameters in Betaflight or your ground control station.',
      'Use the 3D viewer and step-by-step assembly tab above to compare your wiring against standard engineering architecture.'
    ],
    solution: 'Check the specific component tabs or try searching keywords like "motor", "smoke stopper", "flip", "betaflight", "elrs", or "camera" for instant schematic solutions.'
  };
}
