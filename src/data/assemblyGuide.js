// AeroForge 3D - Full Step-by-Step Prototype Making & Assembly Guide
// 10 Comprehensive Stages with Safety Procedures, Pinouts, and Embedded Doubts

export const ASSEMBLY_STAGES = [
  {
    stepNumber: 1,
    id: 'bench-prep',
    title: 'Bench Architecture & Safety Prep',
    subtitle: 'Setting up the clean room workbench, ESD protection, and essential tools.',
    duration: '25 Mins',
    criticalLevel: 'Low',
    summary: '90% of drone electronics failures occur from messy benches, metal debris shorting solder pads, or incorrect iron temperatures. Prepare your workspace properly before opening components.',
    tasks: [
      'Clean work area thoroughly: ensure no stray wire clippings or solder balls exist that can cause short circuits.',
      'Check soldering iron: Set temperature to 370°C - 390°C for lead-free solder (or 350°C for 63/37 leaded solder).',
      'Prepare a Smoke Stopper (current-limiting automotive bulb or electronic fuse like ViFly ShortShield). NEVER plug a battery directly into a fresh build.',
      'Gather Blue Threadlocker (Loctite 242) for all metal-into-metal motor screws.',
      'Calibrate digital multimeter to Continuity Mode (beep test).'
    ],
    proTip: 'Carbon fiber conducts electricity! Always inspect your frame edges for frayed carbon dust, which can create micro-shorts against exposed PCB traces.',
    warnings: [
      'NEVER install propellers during bench assembly or bench testing. A spinning carbon propeller can sever fingers in milliseconds.',
      'Keep lithium batteries in a fireproof LiPo bag far away from open hot soldering irons.'
    ],
    toolsRequired: ['Soldering Iron (65W+)', 'Multimeter with continuity beep', 'Hex drivers (1.5mm, 2.0mm, 2.5mm)', 'Blue Loctite 242', 'Safety glasses'],
    doubts: [
      {
        question: 'What is a Smoke Stopper and do I really need one?',
        answer: 'Yes, 100%! A smoke stopper is a resettable fuse or light bulb connected between your battery and the drone. If you have an accidental solder bridge or reversed polarity, the smoke stopper trips instantly, saving your $80 flight controller stack from catching fire.'
      },
      {
        question: 'What solder wire should I use?',
        answer: 'Use 63/37 Rosin Core tin/lead solder (0.8mm diameter) if available in your region, or high-grade SAC305 lead-free solder with flux paste. Avoid plumbing solder or acid-core solder as it corrodes delicate circuit traces.'
      }
    ]
  },
  {
    stepNumber: 2,
    id: 'frame-assembly',
    title: 'Carbon Chassis & Standoff Rigging',
    subtitle: 'Assembling the structural skeleton, vibration damping, and motor arm locking.',
    duration: '40 Mins',
    criticalLevel: 'Medium',
    summary: 'The frame absorbs all centrifugal and impact forces. Tight, rigid arms prevent gyro resonance oscillations that can overheat your motors during flight.',
    tasks: [
      'Inspect carbon fiber arm edges: lightly sand edges under running water if sharp or splintered.',
      'Fasten bottom plate and arm retention sandwich plates using countersunk high-tensile steel screws.',
      'Apply a small dab of Blue Loctite 242 to all standoff screws. Do not use Red Loctite (it is permanent).',
      'Install silicone vibration-isolation gummies into the 20x20mm or 30.5x30.5mm stack mounting holes.',
      'Verify arm squareness using a caliper or measuring tape across opposite diagonal motor center points.'
    ],
    proTip: 'Torque standoff screws in a criss-cross star pattern to evenly distribute chassis tension and prevent frame twisting.',
    warnings: [
      'Do not overtighten screws into nylon standoffs or rubber gummies as they will strip or compress permanently, ruining gyro resonance dampening.'
    ],
    toolsRequired: ['2.0mm Ball-End Hex Driver', 'Blue Loctite', 'Fine 400-grit sandpaper', 'Ruler / Caliper'],
    doubts: [
      {
        question: 'My carbon arms have slight wobble after tightening screws?',
        answer: 'Check the center interlocking key or sandwich plate. The arms must be clamped firmly between the top and bottom plates. If there is still play, add 0.5mm carbon or brass shims or check if a screw is bottoming out before fully clamping.'
      },
      {
        question: 'Should I install the top plate now?',
        answer: 'No! Keep the top plate off until the very end. You need complete, unrestricted access to solder the ESC, FC, and peripherals.'
      }
    ]
  },
  {
    stepNumber: 3,
    id: 'motor-mounting',
    title: 'Motor Mounting & Wire Pre-Tinning',
    subtitle: 'Securing the brushless outrunners and preventing stator screw puncture.',
    duration: '45 Mins',
    criticalLevel: 'High',
    summary: 'Brushless motors generate immense torque. A motor screw that is just 1mm too long will pierce the copper stator windings, creating an internal short circuit that instantly destroys the ESC.',
    tasks: [
      'Test screw depth: Insert screw through carbon arm and observe how far it protrudes into the motor base. Screw must NOT touch copper coils!',
      'Apply Blue Loctite to all 16 motor screws (4 per motor).',
      'Route motor wires neatly along the arms towards the center ESC pads. Allow 2mm of slack for arm flexing.',
      'Cut motor wires to length, strip 2mm of insulation, twist strands, and pre-tin with fresh solder until shiny silver.',
      'Cover wires with braided wire sleeve or race wire protection plates to guard against prop strikes during crashes.'
    ],
    proTip: 'Order of motor wires: For modern BLHeli_32 and Bluejay ESCs, motor spin direction can be flipped in software with one click. Simply solder the 3 wires straight across to the 3 ESC pads without criss-crossing.',
    warnings: [
      'FATAL TRAP: Looking down through the motor ventilation holes, ensure there is visible air gap between screw tips and copper wire windings!'
    ],
    toolsRequired: ['Wire strippers (20-22 AWG)', '2.0mm Hex Wrench', 'Flush wire cutters', 'Blue Loctite'],
    doubts: [
      {
        question: 'Does it matter which of the 3 motor wires connects to which ESC pad?',
        answer: 'No! Brushless 3-phase motors do not have positive and negative. Soldering any wire to any pad is safe. If the motor spins the wrong direction in testing, you can reverse it via the ESC Configurator or Betaflight Motor tab.'
      },
      {
        question: 'Can I cut the motor wires shorter?',
        answer: 'Yes! Cut them to the exact length reaching the ESC pads with a tiny bit of slack so vibrations do not pull solder joints loose.'
      }
    ]
  },
  {
    stepNumber: 4,
    id: 'esc-soldering',
    title: '4-in-1 ESC Soldering & Capacitor Rigging',
    subtitle: 'Soldering high-current motor joints, battery leads, and low-ESR filtering capacitor.',
    duration: '60 Mins',
    criticalLevel: 'Critical',
    summary: 'The ESC handles up to 200 Amps of instantaneous burst current. Clean, concave, shiny solder joints with thorough heat penetration are essential for reliability.',
    tasks: [
      'Pre-tin all 12 motor solder pads on the ESC with solder balls.',
      'Pre-tin the heavy positive (+) and negative (-) battery pads on the ESC.',
      'Solder the 12 motor wires onto their corresponding ESC pads. The joint must be smooth, mirror-shiny, and convex.',
      'Install the 35V / 50V Low-ESR Electrolytic Capacitor (e.g. 1000uF Rubycon) directly across the main battery pads.',
      'Solder 14AWG or 12AWG silicone battery leads with XT60 connector (observe strict polarity: red to +, black to -).'
    ],
    proTip: 'Use a wide chisel soldering tip (2.4mm or 3.2mm) for the battery pads. The ground plane dissipates heat rapidly; a fine needle tip cannot heat the copper pad enough, creating a brittle cold joint.',
    warnings: [
      'CAPACITOR POLARITY: Electrolytic capacitors will explode if soldered backwards! The side marked with a large grey stripe and minus signs (-) must solder to the negative battery pad.'
    ],
    toolsRequired: ['65W-100W Soldering Station', 'Chisel Tip', 'Rosin Flux Pen', 'Shrink Tube', '14AWG Silicone Wire', 'XT60 Female Plug'],
    doubts: [
      {
        question: 'Why do I need a giant capacitor on my ESC?',
        answer: 'Modern brushless motors act like high-frequency generators when braking (active braking / DShot). This produces lethal 50V+ electrical voltage spikes that fry sensitive gyros and digital FPV transmitters. The low-ESR capacitor absorbs these spikes instantly.'
      },
      {
        question: 'My solder ball won’t stick to the big ground pad?',
        answer: 'The ground plane acts as a massive thermal heat sink. Apply liquid flux paste, turn your soldering iron up to 400°C, and use a wide chisel tip to pump heat directly into the copper pad for 5-8 seconds before feeding solder.'
      }
    ]
  },
  {
    stepNumber: 5,
    id: 'fc-stack',
    title: 'Flight Controller Soft-Mount & Wiring',
    subtitle: 'Vibration dampening, wiring the wiring harness, and verifying orientation.',
    duration: '35 Mins',
    criticalLevel: 'High',
    summary: 'The flight controller houses the MEMS gyroscope measuring angular velocity thousands of times per second. Vibration isolation is critical for crisp PID control.',
    tasks: [
      'Seat the FC onto the M3 nylon standoffs on top of the ESC with silicone O-rings or gummies in between.',
      'Ensure at least 2mm clearance between the FC bottom components and the ESC top components.',
      'Plug in the 8-pin multi-wire JST-SH wiring harness connecting ESC telemetry, current sensor, and motor signals 1-4.',
      'Verify the white printed flight arrow on the FC points forward towards the nose of the frame.',
      'Lightly finger-tighten nylon lock nuts on stack screws. The gummies should bulge slightly without being crushed flat.'
    ],
    proTip: 'If your FC has to be mounted rotated 90° or 180° due to USB port placement, that is completely fine! You can adjust the board alignment in Betaflight Configurator.',
    warnings: [
      'Never allow metal screws or carbon plates to directly touch any circuit component on the FC board.'
    ],
    toolsRequired: ['Nylon M3 socket tool', 'Silicone gummies (4x)', '8-pin JST harness'],
    doubts: [
      {
        question: 'How tight should the flight controller stack nuts be?',
        answer: 'Only snug! Squeeze the silicone dampening gummies until they compress by approximately 20-25%. If you clamp them completely solid, motor vibrations will transmit directly into the gyro, causing hot motors and violent mid-air oscillations.'
      }
    ]
  },
  {
    stepNumber: 6,
    id: 'peripherals-wiring',
    title: 'Peripherals: VTX, Camera & Radio Receiver',
    subtitle: 'UART telemetry matching, RX/TX crossover wiring, and antenna placement.',
    duration: '50 Mins',
    criticalLevel: 'High',
    summary: 'Wiring your digital or analog FPV video system and ExpressLRS/Crossfire radio receiver to dedicated hardware UART serial ports.',
    tasks: [
      'ExpressLRS Receiver: Solder 5V to 5V, GND to GND, Receiver TX to FC RX (e.g. RX1), and Receiver RX to FC TX (e.g. TX1). Notice the TX/RX crossover!',
      'FPV Camera: Connect Video Out to CAM pad on FC (or digital VTX harness), 5V/9V to power, GND to GND.',
      'Video Transmitter (VTX): Connect VTX Video In to VTX pad (for OSD overlay), SmartAudio/IRC Tramp to a free FC TX pad (e.g. TX2).',
      'Mount Antennas: Position 2.4GHz ELRS dipole antenna horizontally or at 90° angle away from carbon fiber arms.',
      'Mount 5.8GHz VTX antenna upright above the battery line of sight.'
    ],
    proTip: 'The Universal UART Rule: Transmit always goes to Receive! FC TX connects to Peripheral RX; FC RX connects to Peripheral TX.',
    warnings: [
      'NEVER power on a Video Transmitter (VTX) without its antenna screwed on! The RF amplifier will overheat and burn out in under 10 seconds without a 50-ohm antenna load.'
    ],
    toolsRequired: ['Fine needle tip soldering iron', '30AWG flexible silicone wire', 'Zip ties / TPU antenna mount'],
    doubts: [
      {
        question: 'Why does my receiver have TX and RX, and which goes where?',
        answer: 'Think of speaking and listening: your receiver talks (TX) and your flight controller listens (RX). Always wire RX to TX, and TX to RX. Power wires (5V to 5V, GND to GND) stay matching.'
      },
      {
        question: 'Can I power my DJI O3 or Walksnail VTX directly from battery VCC?',
        answer: 'Check the voltage rating! DJI O3 accepts up to 6S (26V), but Walksnail Avatar 1S modules only take 3.1V-5V. Always check the voltage input table to avoid blowing up your video unit.'
      }
    ]
  },
  {
    stepNumber: 7,
    id: 'smoke-stopper-test',
    title: 'Smoke Stopper Pre-Flight Safety Test',
    subtitle: 'The moment of truth: testing for short circuits before connecting full raw battery power.',
    duration: '15 Mins',
    criticalLevel: 'Critical',
    summary: 'This single step prevents 99% of dead boards. If there is a microscopic solder bridge between power and ground, the smoke stopper will absorb the current safely.',
    tasks: [
      'Set digital multimeter to continuity mode. Touch probe to positive (+) and negative (-) on the XT60 plug.',
      'Listen to the multimeter: you may hear a brief beep (as capacitors charge), then it should go silent (high resistance). If it beeps continuously, STOP! You have a dead short.',
      'Plug in your Smoke Stopper between a charged LiPo battery and the drone XT60.',
      'Turn on battery: Verify the Smoke Stopper LED stays solid GREEN (or light bulb stays dim).',
      'Listen for the startup beeps from your ESC and flight controller (3 beeps from ESC initialization + 2 beeps from FC handoff).'
    ],
    proTip: 'The 5 Startup Beeps decoded: Beep 1-2-3 means the ESC detected power on all 3 motor phases. Beep 4-5 means the ESC received a valid communication throttle signal from the Flight Controller!',
    warnings: [
      'If the Smoke Stopper LED turns RED or the light bulb glows bright white, UNPLUG IMMEDIATELY! Do not investigate with the battery connected.'
    ],
    toolsRequired: ['ViFly ShortShield / Smoke Stopper', 'Multimeter', 'Charged 2S-6S LiPo'],
    doubts: [
      {
        question: 'My multimeter beeps for half a second when testing the XT60, then stops. Is that normal?',
        answer: 'Yes! That is completely normal. The large electrolytic capacitor draws a split-second pulse of current to charge its internal plates. As long as the beeping stops and displays infinite resistance (OL), your circuit is safe.'
      },
      {
        question: 'Smoke stopper turns red immediately. What should I inspect first?',
        answer: 'First inspect the main battery solder pads on the ESC for a stray solder whisker bridging + and -. Next, inspect motor screws touching copper windings, and check if any standoff screw is gouging a surface trace on the FC.'
      }
    ]
  },
  {
    stepNumber: 8,
    id: 'firmware-config',
    title: 'Firmware Flashing & Betaflight Configuration',
    subtitle: 'Calibrating accelerometers, setting UART ports, and configuring the OSD HUD.',
    duration: '45 Mins',
    criticalLevel: 'Medium',
    summary: 'The flight firmware (Betaflight, INAV, or ArduPilot) controls the PID flight loops, failsafe behavior, and sensor integration.',
    tasks: [
      'Install Betaflight Configurator (or INAV Configurator / Mission Planner for autonomous mapping).',
      'Connect drone via USB-C to computer (NO BATTERY NEEDED FOR CONFIG).',
      'In the Setup tab: place drone flat and click "Calibrate Accelerometer". Rotate the frame in your hands and ensure the 3D model on screen moves identical to your hand.',
      'In the Ports tab: enable "Serial Rx" on the UART where your receiver is wired (e.g. UART1). Enable "VTX (IRC Tramp / SmartAudio)" on UART2.',
      'In the Receiver tab: select CRSF (for ExpressLRS/Crossfire) and verify stick movements match your transmitter (Roll, Pitch, Yaw, Throttle).'
    ],
    proTip: 'Channel mapping standard: AETR1234 (Aileron, Elevator, Throttle, Rudder) is the default for ExpressLRS and OpenTX/EdgeTX radios.',
    warnings: [
      'ALWAYS set up a Failsafe test! If your radio transmitter turns off, the drone must immediately drop to the ground (Drop mode) rather than flying away.'
    ],
    toolsRequired: ['Data USB-C Cable (must support data transfer, not charge-only)', 'Laptop with Betaflight Configurator'],
    doubts: [
      {
        question: 'Computer says "Failed to open serial port" or doesn’t recognize drone?',
        answer: '90% of the time, the user is using a cheap "power-only" charging cable. Use a high-quality data-capable USB cable. On Windows, you may also need to run the ImpulseRC Driver Fixer tool to install the correct STM32 VCP / DFU drivers.'
      },
      {
        question: '3D drone model in Betaflight tilts upside down when my drone is right side up?',
        answer: 'Your board orientation is rotated! Go to the Configuration tab under "Board and Sensor Alignment" and adjust the Yaw angle (e.g. 90, 180, or 270 degrees) until the 3D graphic matches your physical drone movement.'
      }
    ]
  },
  {
    stepNumber: 9,
    id: 'motor-direction',
    title: 'Motor Direction, DShot & Failsafe Check',
    subtitle: 'Configuring bidirectional DShot, RPM filtering, and motor spin calibration.',
    duration: '30 Mins',
    criticalLevel: 'Critical',
    summary: 'Ensuring motors spin in the designated direction (Props In vs Props Out) and that the motors cut immediately upon loss of signal.',
    tasks: [
      'REMOVE ALL PROPELLERS! Never perform motor direction tests with propellers attached.',
      'In Betaflight Motors Tab: check the safety toggle understanding risks.',
      'Plug in battery (through smoke stopper or direct if tested). Enable Bidirectional DShot (DShot300 or DShot600).',
      'Use the Motor Direction Wizard: touch the spinning motor bells lightly with your finger or paper tape to verify spin direction.',
      'If a motor spins backwards, click the motor number in the wizard to reverse it instantly in firmware.'
    ],
    proTip: '"Props Out" configuration (Front motors spinning outward, rear spinning outward) throws grass, moisture, and debris away from your camera lens when flying through bushes!',
    warnings: [
      'If you test motor direction with propellers installed, you run the risk of the quad launching into your face or cutting hands!'
    ],
    toolsRequired: ['Betaflight Configurator', 'Charged LiPo', 'Masking tape to visualize motor spin'],
    doubts: [
      {
        question: 'Why is Bidirectional DShot recommended?',
        answer: 'Bidirectional DShot allows the ESC to send the exact RPM speed of each motor back to the flight controller hundreds of times a second. Betaflight uses this to activate harmonic notch filters, silencing motor electrical noise and giving you silky smooth video without prop wash oscillations.'
      }
    ]
  },
  {
    stepNumber: 10,
    id: 'maiden-flight',
    title: 'Final Hardware Check & Maiden Hover',
    subtitle: 'Propeller mounting, Center of Gravity balance, and initial low-altitude hover test.',
    duration: '20 Mins',
    criticalLevel: 'High',
    summary: 'The culmination of all your hard work! Conduct a systematic pre-flight checklist in an open grassy field for the maiden flight.',
    tasks: [
      'Fasten top plate screws with blue threadlocker. Secure battery with silicone-padded Kevlar strap.',
      'Check Center of Gravity (CG): pick up drone by two fingertips in the exact center of the frame. It should balance level with the battery installed.',
      'Install propellers: Ensure CW (Clockwise) props go on CW spinning motors, and CCW props on CCW motors. Tighten nylon locknuts firmly with a prop wrench.',
      'Take drone to an open outdoor grassy field with no people, trees, or pets within 30 meters.',
      'Arm drone in Angle (stabilized) mode, increase throttle smoothly to 30%, and hover 1 meter off the ground for 30 seconds.',
      'Land, disarm, and touch motor bells with your fingers: motors should be cool or lukewarm. If hot, land immediately and check PID filters!'
    ],
    proTip: 'The 30-Second Motor Temperature Test: If any motor feels too hot to touch with your bare finger for 5 seconds after a gentle hover, stop immediately! This indicates excessive D-term gain or electrical gyro resonance.',
    warnings: [
      'Always have your finger hovering directly over the Disarm switch during the maiden hover so you can cut throttle in 0.1 seconds if anything unexpected happens.'
    ],
    toolsRequired: ['8mm Prop Wrench', 'LiPo Battery Voltage Checker', 'FPV Goggles', 'Radio Transmitter'],
    doubts: [
      {
        question: 'Drone immediately flips upside down and disarms as soon as I give throttle?',
        answer: 'This is the infamous "Flyaway / Flip of Death"! The 4 classic causes are: 1) Propeller installed backwards or wrong spin direction (CW vs CCW), 2) Motor order wrong (e.g. Motor 1 wired to Motor 4 pad), 3) Motor spin reversed, or 4) FC board orientation angle off by 90° or 180° in Betaflight.'
      },
      {
        question: 'Motors make strange grinding or high-pitched squealing sounds?',
        answer: 'Check for motor screws touching copper stator windings, or check if DShot protocol is set incorrectly in Betaflight (switch to DShot300 and disable motor PWM frequency overclocks).'
      }
    ]
  }
];
