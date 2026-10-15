export const DRONE_ARCHETYPES = [
  {
    id: 'esp32-c3-micro-drone',
    name: 'ESP32-C3 RISC-V Micro-Drone (Cheapest Build)',
    category: 'Ultra-Budget Featherweight (No Camera, Wi-Fi Controlled)',
    tagline: 'The absolute cheapest flying drone in India: runs on a ₹190 ESP32-C3 RISC-V SuperMini chip. Zero expensive radio transmitter, zero camera needed — flies directly via your smartphone Wi-Fi!',
    wheelbase: 85, // mm
    frameType: 'cinewhoop',
    armsCount: 4,
    hasDucts: true,
    estimatedCostINR: 1750,
    dgcaCategory: 'Nano Drone (<100g Exempted)',
    difficulty: 'DIY Maker / Student Friendly',
    flightTimeMin: 6.5,
    twr: 2.2,
    auwGrams: 38,
    targetBattery: '1S 3.7V 300mAh 30C LiPo (Micro-JST)',
    realImage: '/assets/real_esp32_c3_drone.jpg',
    components: [
      { category: 'Processor / MCU', name: 'ESP32-C3 SuperMini RISC-V 160MHz Microcontroller', costINR: 190, weightG: 3, store: 'Robu.in', specs: '32-bit single-core RISC-V 160MHz, built-in 2.4GHz Wi-Fi AP + BLE 5, 4MB Flash' },
      { category: '6-Axis IMU Sensor', name: 'MPU6050 3-Axis Gyroscope & Accelerometer Module', costINR: 130, weightG: 3, store: 'Robu.in', specs: 'I2C digital motion processing, connects to GPIO 8 (SDA) & GPIO 9 (SCL)' },
      { category: 'Motors', name: '716 Coreless Brushed High-RPM Micro Motors (4x Set)', costINR: 360, weightG: 14, store: 'FlyRobo', specs: '7mm x 16mm, 55,000 RPM, ultralight 3.5g per motor on 3.7V LiPo' },
      { category: 'Propellers', name: '40mm Micro 2-Blade Propellers (2x CW + 2x CCW Pairs)', costINR: 60, weightG: 2, store: 'Robu.in', specs: '0.8mm shaft press-fit, matched for 716 coreless motors' },
      { category: 'Motor Drivers', name: '4x SI2302 N-Channel Logic MOSFETs + 1N4148 Diodes', costINR: 100, weightG: 2, store: 'Robu.in', specs: 'Tiny SOT-23 MOSFETs switched directly by ESP32 PWM pins with flyback protection' },
      { category: 'Chassis Frame', name: '3D-Printed Ultralight 85mm Ducted Bumper Frame', costINR: 160, weightG: 8, store: 'Robu.in 3D / DIY', specs: 'Integrated circular propeller protection rings & motor clips (PLA/PETG)' },
      { category: 'Battery', name: '1S 3.7V 300mAh 30C LiPo Rechargeable Cell', costINR: 240, weightG: 6, store: 'Robu.in', specs: 'Micro-JST plug, charges with ₹40 TP4056 micro-USB / USB-C module' },
      { category: 'Control Method', name: 'Free Open-Source Smartphone Wi-Fi App / Web Controller', costINR: 0, weightG: 0, store: 'Free Open-Source', specs: 'Zero extra remote! Connects directly to ESP32 Wi-Fi with on-screen virtual joysticks' }
    ],
    recommendedTools: ['Soldering Iron 25W', 'Fine Solder Wire & Flux', 'Hot Glue Gun', 'Smartphone'],
    description: 'The lowest-cost drone architecture possible in India under ₹1,800. Perfect for students and makers to understand embedded flight control, PID loops, and wireless UDP control without buying expensive cameras, goggles, or remotes.'
  },
  {
    id: 'diy-esp32-drone',
    name: 'DIY ESP32 Smartphone-Controlled Drone (Ultra-Budget)',
    category: 'Cheapest DIY Maker Build (No Camera, Wi-Fi Controlled)',
    tagline: 'Dual-core ESP32 drone with larger 8520 motors and 55mm props. High lift capacity, flies smoothly via smartphone Wi-Fi. 100% camera-free.',
    wheelbase: 110, // mm
    frameType: 'true-x',
    armsCount: 4,
    hasDucts: false,
    estimatedCostINR: 2350,
    dgcaCategory: 'Nano Drone (<100g Exempted)',
    difficulty: 'DIY Maker / Student Friendly',
    flightTimeMin: 7.0,
    twr: 2.3,
    auwGrams: 68,
    targetBattery: '1S 3.7V 600mAh 25C LiPo (JST-DS)',
    realImage: '/assets/real_esp32_drone.jpg',
    components: [
      { category: 'Processor / MCU', name: 'ESP32 NodeMCU Wi-Fi + Bluetooth Dual-Core Dev Board', costINR: 320, weightG: 10, store: 'Robu.in', specs: 'Xtensa 32-bit LX6 240MHz, built-in Wi-Fi AP for smartphone connection' },
      { category: '6-Axis IMU Sensor', name: 'MPU6050 3-Axis Gyroscope & Accelerometer Module', costINR: 140, weightG: 3, store: 'Robu.in', specs: 'I2C digital motion processing, 16-bit ADCs, connects to GPIO 21 & 22' },
      { category: 'Motors', name: '8520 Coreless Brushed High-RPM Micro Motors (4x Set)', costINR: 480, weightG: 22, store: 'FlyRobo', specs: '8.5mm x 20mm, 50,000 RPM, high thrust-to-weight ratio on 3.7V' },
      { category: 'Propellers', name: '55mm Micro High-Lift Propellers (2x CW + 2x CCW Pairs)', costINR: 90, weightG: 4, store: 'Robu.in', specs: '0.8mm to 1.0mm shaft fit, aerodynamic high-lift micro blade' },
      { category: 'Motor Drivers', name: 'SI2302 Logic-Level N-Channel MOSFETs + Diodes (4x Circuit)', costINR: 120, weightG: 3, store: 'Robu.in', specs: 'Direct PWM speed control from ESP32 GPIOs with flyback diode protection' },
      { category: 'Chassis Frame', name: '3D-Printed Ultralight Bumper Frame (PLA/PETG)', costINR: 250, weightG: 14, store: 'Robu.in 3D / DIY', specs: 'Integrated motor press-fit holders and orange crash bumper rings' },
      { category: 'Battery', name: 'Orange 1S 3.7V 600mAh 25C LiPo Rechargeable Cell', costINR: 350, weightG: 16, store: 'Robu.in', specs: 'Micro JST connector, charges via ₹50 TP4056 USB charger module' },
      { category: 'Control Method', name: 'Free Smartphone Wi-Fi App (ESP32 Drone Controller)', costINR: 0, weightG: 0, store: 'Free Open-Source', specs: 'Flies using phone on-screen virtual joysticks or phone tilt gyro (No remote needed!)' }
    ],
    recommendedTools: ['Soldering Iron 25W-40W', 'Jumper Wires & Breadboard/Perfboard', 'Hot Glue Gun', 'Smartphone'],
    description: 'The ultimate budget-friendly engineering build. Created specifically for Indian makers, school innovators, and college hobbyists who want to understand flight code without spending money on expensive FPV goggles, cameras, or radio controllers.'
  },
  {
    id: 'f450-college-quad',
    name: 'F450 College Engineering Project Drone',
    category: 'University & Final Year R&D (DGCA Micro)',
    tagline: 'The #1 standard drone for Indian engineering colleges & university projects. Reliable, modular, easy to solder and calibrate.',
    wheelbase: 450, // mm
    frameType: 'true-x',
    armsCount: 4,
    hasDucts: false,
    estimatedCostINR: 9800,
    dgcaCategory: 'Micro Drone (250g - 2kg)',
    difficulty: 'Beginner / Student',
    flightTimeMin: 14.0,
    twr: 2.6,
    auwGrams: 920,
    targetBattery: '3S 11.1V 2200mAh 30C LiPo (XT60)',
    realImage: '/assets/real_f450_drone.jpg',
    components: [
      { category: 'Frame Kit', name: 'DJI / FlameWheel F450 Glass-Fiber Frame with Integrated PDB', costINR: 850, weightG: 280, store: 'Robu.in', specs: 'Integrated PCB power distribution, tough PA66+30% glass fiber arms' },
      { category: 'Motors', name: 'A2212 1000KV Brushless Outrunner Motors (4x Set)', costINR: 2200, weightG: 190, store: 'FlyRobo', specs: '1000KV, 12V 3S compatible, 800g+ max thrust per motor' },
      { category: 'Propellers', name: '1045 Carbon Reinforced 10-inch Props (2x CW + 2x CCW)', costINR: 280, weightG: 38, store: 'Robu.in', specs: '10x4.5 inch pitch, balanced for 1000KV low-RPM high-efficiency lift' },
      { category: 'ESC Modules', name: '30A SimonK / BLHeli OPTO Electronic Speed Controllers (4x)', costINR: 1950, weightG: 110, store: 'QuadKopter.in', specs: '30A continuous, 40A burst, 5V 2A Linear BEC for FC power' },
      { category: 'Autopilot FC', name: 'APM 2.8 / Pixhawk 2.4.8 Autopilot with Anti-Vibration Mount', costINR: 2800, weightG: 48, store: 'Robu.in', specs: '3-axis gyro & accelerometer, barometer, autonomous waypoint support' },
      { category: 'GPS & Compass', name: 'NEO-M8N High Precision GPS with Folding Mast', costINR: 1250, weightG: 32, store: 'FlyRobo', specs: 'u-blox M8N, dual compass, autonomous Loiter & Return To Launch (RTL)' },
      { category: 'Battery', name: 'Orange 3S 2200mAh 30C/60C Lithium Polymer Battery', costINR: 1450, weightG: 195, store: 'Robu.in', specs: '11.1V nominal, XT60 female plug, JST-XH balance lead' }
    ],
    recommendedTools: ['Soldering Iron 60W', 'Multimeter', 'FlySky FS-i6 6CH Radio Controller', 'LiPo Balance Charger (B3/B6AC)', 'Zip Ties'],
    description: 'The golden archetype built by thousands of Indian engineering students for B.Tech/Diploma final year projects, robotics competitions, and autonomous aerial research.'
  },
  {
    id: 'tiny-whoop-nano',
    name: 'Nano Whoop 65mm (No License Required)',
    category: 'DGCA Nano Category (<250g Legal Free)',
    tagline: 'Under 250 grams legal category in India. No UIN or pilot license needed. Collision-proof ducted props for safe indoor learning.',
    wheelbase: 65,
    frameType: 'cinewhoop',
    armsCount: 4,
    hasDucts: true,
    estimatedCostINR: 7400,
    dgcaCategory: 'Nano Drone (<250g Exempted)',
    difficulty: 'Beginner',
    flightTimeMin: 4.5,
    twr: 3.2,
    auwGrams: 28,
    targetBattery: '1S 300mAh LiHV (4.35V)',
    realImage: '/assets/real_micro_whoop.jpg',
    components: [
      { category: 'Frame', name: 'BetaFPV Meteor65 Ducted Polycarbonate Frame', costINR: 550, weightG: 3.2, store: 'QuadKopter.in', specs: '65mm wheelbase, 31mm ducted prop rings, virtually unbreakable' },
      { category: 'Motors', name: '0802SE 19500KV Brushless Micro Motors (4x Set)', costINR: 2400, weightG: 7.2, store: 'Robu.in', specs: '19500KV, 1.0mm shaft, high efficiency 1S power' },
      { category: 'Propellers', name: 'Gemfan 31mm 4-Blade Micro Props (2 Sets)', costINR: 350, weightG: 1.2, store: 'QuadKopter.in', specs: '31mm diameter, 4 blades, smooth indoor flight' },
      { category: 'AIO Board', name: 'F4 1S 5A AIO Flight Controller (SPI ELRS 2.4GHz + VTX)', costINR: 3200, weightG: 3.8, store: 'DroneLabb', specs: 'STM32F411, built-in 5A ESCs, onboard 25-400mW 5.8GHz video transmitter' },
      { category: 'FPV Camera', name: 'C03 Micro 1200TVL CMOS Camera with Canopy', costINR: 1100, weightG: 1.6, store: 'Robu.in', specs: '160° FOV, 1/3" sensor, ultra-lightweight injection-molded canopy' }
    ],
    recommendedTools: ['1.5mm Hex Screwdriver', 'BT2.0 1S USB Charger', 'Curved Tweezers'],
    description: '100% compliant with Indian DGCA Nano category regulations (< 250g). Safe to fly anywhere without government approvals or pilot license.'
  },
  {
    id: 'freestyle-5in-pro',
    name: 'Pro Freestyle 5" Carbon Quad',
    category: 'Competitive Racing & Acro (DGCA Micro)',
    tagline: 'High-performance 6S aerobatic quadcopter. 5mm carbon arms, 140km/h top speed, durable bando crasher.',
    wheelbase: 225,
    frameType: 'true-x',
    armsCount: 4,
    hasDucts: false,
    estimatedCostINR: 22500,
    dgcaCategory: 'Micro Drone (250g - 2kg)',
    difficulty: 'Intermediate / Pro',
    flightTimeMin: 5.5,
    twr: 7.4,
    auwGrams: 640,
    targetBattery: '6S 1100mAh-1300mAh 120C LiPo (XT60)',
    realImage: '/assets/real_freestyle_drone.jpg',
    components: [
      { category: 'Frame', name: 'Apex 5" Toray 3K Full Carbon Fiber Frame (5mm Arms)', costINR: 3400, weightG: 125, store: 'QuadKopter.in', specs: '5mm quick-swap arms, CNC aluminum camera mounts, 2mm top plate' },
      { category: 'Motors', name: 'Emax ECO II 2207 1900KV 6S Motors (4x Set)', costINR: 5800, weightG: 132, store: 'Robu.in', specs: 'N52SH curved arc magnets, hollow steel shaft, 1900KV for 6S LiPo' },
      { category: 'Propellers', name: 'HQProp / Ethix S5 5.1x4.0x3 Tricblade Props (4 Sets)', costINR: 650, weightG: 16.5, store: 'QuadKopter.in', specs: '5.1 inch diameter, polycarbonate crash-resistant material' },
      { category: 'Stack (FC + ESC)', name: 'SpeedyBee F405 V4 55A 8-Layer BLHeli_S 30x30 Stack', costINR: 6900, weightG: 34, store: 'Robu.in', specs: 'F405 MCU, Bluetooth wireless Betaflight tuning, 55A continuous ESC' },
      { category: 'FPV System', name: 'Caddx Ratel 2 Starlight Cam + Rush Solo 1W VTX', costINR: 4200, weightG: 22, store: 'QuadKopter.in', specs: '1200TVL night sensor, 1000mW adjustable RF output, MMCX antenna' },
      { category: 'Radio Link', name: 'RadioMaster RP1 ELRS 2.4GHz Nano Receiver', costINR: 1550, weightG: 2.2, store: 'DroneLabb', specs: 'T-antenna, -105dBm sensitivity, full telemetry return' }
    ],
    recommendedTools: ['M3 Hex Driver', 'TS101 / Pinecil Soldering Iron (65W+)', 'Blue Loctite 242', 'Smoke Stopper'],
    description: 'The standard competitive FPV quad built by pilots and cinematographers in India. Unmatched power, durability, and agility.'
  },
  {
    id: 'kisan-agri-hexacopter',
    name: 'Kisan Agricultural Spraying & Survey Hexacopter',
    category: 'Commercial Agro & Industrial Payload (DGCA Small)',
    tagline: 'Heavy payload hexacopter with 6-rotor redundancy, 10L-16L spray tank mount, Pixhawk Cube Orange autopilot, RTK centimeter precision.',
    wheelbase: 950,
    frameType: 'hexacopter',
    armsCount: 6,
    hasDucts: false,
    estimatedCostINR: 145000,
    dgcaCategory: 'Small Drone (2kg - 25kg)',
    difficulty: 'Professional / Enterprise',
    flightTimeMin: 26.0,
    twr: 3.4,
    auwGrams: 8800,
    targetBattery: '12S 22000mAh Semi-Solid High Density LiPo Pack',
    realImage: '/assets/real_hexacopter_drone.jpg',
    components: [
      { category: 'Frame & Tank Kit', name: 'EFT G610 10-Litre Agricultural Hexacopter Frame + Quick Tank', costINR: 32000, weightG: 3100, store: 'DroneLabb', specs: '30mm carbon tubes, integrated centrifugal pump nozzles, folding arms' },
      { category: 'Motors & ESCs', name: 'Hobbywing X6 Plus Integrated Propulsion System (6x Power Combos)', costINR: 58000, weightG: 3600, store: 'Robu.in', specs: 'Weatherproof IPX7 seal, 23-inch folding carbon props, 80A FOC ESC' },
      { category: 'Autopilot Controller', name: 'Cube Orange+ Autopilot with ADS-B Receiver & Carrier Board', costINR: 28000, weightG: 95, store: 'Robu.in', specs: 'Triple redundant heated IMUs, ArduPilot / PX4 autonomy, radar collision avoidance' },
      { category: 'RTK GNSS Navigation', name: 'Here4 High-Precision Dual-Band RTK GNSS Antenna', costINR: 14500, weightG: 55, store: 'Robu.in', specs: 'Centimeter-level spray path accuracy, dual CAN bus integration' },
      { category: 'Telemetry & RC', name: 'Skydroid H12 1080P Digital Video & 20km Telemetry RC', costINR: 12500, weightG: 480, store: 'QuadKopter.in', specs: 'Handheld touchscreen ground station, 20km digital video link' }
    ],
    recommendedTools: ['Torque Wrench Set', 'Digital Flowmeter Calibrator', 'LiPo Balance Charger 12S 2000W'],
    description: 'Designed for Indian farmers and drone service providers for pesticide spraying, crop health NDVI mapping, and large-scale industrial surveying.'
  }
];

// Calculation helper for custom drones (in INR)
export function calculateCustomDroneMetricsINR({
  wheelbase,
  frameType,
  batteryCells,
  targetPayloadGrams,
  customBudgetINR
}) {
  let propSizeInches = 5;
  if (wheelbase <= 75) propSizeInches = 1.2;
  else if (wheelbase <= 110) propSizeInches = 2.0;
  else if (wheelbase <= 150) propSizeInches = 3.0;
  else if (wheelbase <= 180) propSizeInches = 4.0;
  else if (wheelbase <= 260) propSizeInches = 5.1;
  else if (wheelbase <= 350) propSizeInches = 7.0;
  else if (wheelbase <= 500) propSizeInches = 10.0;
  else propSizeInches = 15.0;

  let motorRecommendation = '';
  let escAmps = 45;
  let estimatedBaseWeight = 320;
  let motorCostINR = 5500;
  let frameCostINR = 3200;

  if (batteryCells <= 1) {
    motorRecommendation = '0802 - 1102 (18000KV - 22000KV)';
    escAmps = 5;
    estimatedBaseWeight = 25;
    motorCostINR = 2400;
    frameCostINR = 600;
  } else if (batteryCells <= 3) {
    if (wheelbase >= 400) {
      motorRecommendation = '2212 - 2216 (920KV - 1000KV)';
      escAmps = 30;
      estimatedBaseWeight = 750;
      motorCostINR = 2400;
      frameCostINR = 950;
    } else {
      motorRecommendation = '1202.5 - 1404 (3800KV - 8000KV)';
      escAmps = 15;
      estimatedBaseWeight = 95;
      motorCostINR = 3200;
      frameCostINR = 1200;
    }
  } else if (batteryCells <= 4) {
    motorRecommendation = '2207 - 2306 (2400KV - 2750KV)';
    escAmps = 45;
    estimatedBaseWeight = 420;
    motorCostINR = 4800;
    frameCostINR = 2800;
  } else if (batteryCells <= 6) {
    if (propSizeInches >= 7) {
      motorRecommendation = '2806.5 - 2808 (1300KV)';
      escAmps = 55;
      estimatedBaseWeight = 680;
      motorCostINR = 7800;
      frameCostINR = 4500;
    } else {
      motorRecommendation = '2207 - 2306 (1850KV - 1950KV)';
      escAmps = 50;
      estimatedBaseWeight = 460;
      motorCostINR = 5800;
      frameCostINR = 3400;
    }
  } else {
    motorRecommendation = 'X6 / 4114 (180KV - 350KV Industrial)';
    escAmps = 80;
    estimatedBaseWeight = 3200;
    motorCostINR = 45000;
    frameCostINR = 24000;
  }

  const armMultiplier = (frameType === 'hexacopter' ? 1.5 : frameType === 'octocopter' ? 2.0 : 1.0);
  const totalWeight = Math.round((estimatedBaseWeight * armMultiplier) + targetPayloadGrams);

  // Thrust calculation
  const thrustPerMotorGrams = Math.round(propSizeInches * propSizeInches * 55 * (batteryCells * 0.45));
  const totalThrust = Math.round(thrustPerMotorGrams * (frameType === 'hexacopter' ? 6 : frameType === 'octocopter' ? 8 : 4));
  const twr = parseFloat((totalThrust / Math.max(1, totalWeight)).toFixed(2));

  // Estimated hover throttle & flight time
  const hoverThrottle = Math.min(85, Math.max(15, Math.round((1 / twr) * 100)));
  const flightTime = parseFloat((Math.max(3.5, 22 - (hoverThrottle * 0.2) + (propSizeInches > 6 ? 6 : 0))).toFixed(1));

  // DGCA Classification in India
  let dgcaClass = 'Nano Drone (<250g Exempted)';
  if (totalWeight > 25000) dgcaClass = 'Medium Drone (25kg - 150kg)';
  else if (totalWeight > 2000) dgcaClass = 'Small Drone (2kg - 25kg)';
  else if (totalWeight > 250) dgcaClass = 'Micro Drone (250g - 2kg)';

  // Estimated Total Cost in INR
  const totalCostINR = Math.round(
    (frameCostINR * armMultiplier) + 
    (motorCostINR * armMultiplier) + 
    (escAmps > 40 ? 6500 : 2800) + // FC + ESC
    2800 + // FPV / Cam
    1500 + // Receiver
    1800   // Hardware & battery strap
  );

  return {
    propSizeInches,
    motorRecommendation,
    escAmps,
    totalWeight,
    totalThrust,
    twr,
    hoverThrottle,
    flightTime,
    totalCostINR,
    dgcaClass
  };
}
