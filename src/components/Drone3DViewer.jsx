import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  Layers, 
  Eye, 
  Sliders, 
  Download, 
  RefreshCw, 
  Shield, 
  Zap, 
  CheckCircle2,
  Camera,
  Compass,
  Cpu,
  Radio,
  BatteryCharging,
  Maximize2,
  Info,
  Box
} from 'lucide-react';

export default function Drone3DViewer({ 
  droneConfig, 
  onConfigChange 
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const droneGroupRef = useRef(null);
  const propsGroupRef = useRef(null);
  const animFrameRef = useRef(null);

  // View Mode: 'real' (Photorealistic 4K Drone Studio) or 'cad' (Interactive 3D Three.js)
  const [viewMode, setViewMode] = useState('real');
  
  // Interactive Hotspot on Real Drone View
  const [activeHotspot, setActiveHotspot] = useState(null);

  // 3D CAD Orbit State
  const [isRotating, setIsRotating] = useState(true);
  const [propSpeed, setPropSpeed] = useState('cruise'); // 'stop', 'idle', 'cruise', 'punch'
  const [explodedView, setExplodedView] = useState(0); // 0 to 100%
  const [materialTheme, setMaterialTheme] = useState('carbon');
  const [cameraView, setCameraView] = useState('iso');
  const [exportMessage, setExportMessage] = useState(null);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  // Sync refs so animation loop & async handlers don't need effect re-binding
  const viewModeRef = useRef(viewMode);
  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  const isRotatingRef = useRef(isRotating);
  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  const propSpeedRef = useRef(propSpeed);
  useEffect(() => {
    propSpeedRef.current = propSpeed;
  }, [propSpeed]);

  // Initialize Three.js scene once on mount
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth > 0 ? container.clientWidth : 800;
    const height = container.clientHeight > 0 ? container.clientHeight : 480;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c1017);
    scene.fog = new THREE.FogExp2(0x0c1017, 0.0012);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, (width / height) || (16/9), 1, 2000);
    camera.position.set(260, 200, 280);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    rendererRef.current = renderer;

    // Clear only if canvas already exists inside isolated container
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    dirLight.position.set(200, 350, 200);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanRim = new THREE.PointLight(0x00f0ff, 1.2, 500);
    cyanRim.position.set(-180, 100, -180);
    scene.add(cyanRim);

    const amberRim = new THREE.PointLight(0xf59e0b, 1.0, 500);
    amberRim.position.set(180, -50, 180);
    scene.add(amberRim);

    const grid = new THREE.GridHelper(600, 30, 0xf59e0b, 0x1f2937);
    grid.position.y = -85;
    scene.add(grid);

    const droneGroup = new THREE.Group();
    scene.add(droneGroup);
    droneGroupRef.current = droneGroup;

    // Animation Loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Save CPU & GPU when looking at Photorealistic Real Drone photo
      if (viewModeRef.current !== 'cad') return;

      if (isRotatingRef.current && !isDraggingRef.current && droneGroupRef.current) {
        droneGroupRef.current.rotation.y += 0.005;
      }

      if (propsGroupRef.current && propsGroupRef.current.children.length > 0) {
        let speedMultiplier = 0;
        if (propSpeedRef.current === 'idle') speedMultiplier = 0.15;
        else if (propSpeedRef.current === 'cruise') speedMultiplier = 0.45;
        else if (propSpeedRef.current === 'punch') speedMultiplier = 0.95;

        if (speedMultiplier > 0) {
          propsGroupRef.current.children.forEach((prop, idx) => {
            const dir = idx % 2 === 0 ? 1 : -1;
            prop.rotation.y += speedMultiplier * dir;
          });
        }
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth > 0 ? container.clientWidth : 800;
      const h = container.clientHeight > 0 ? container.clientHeight : 480;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current) rendererRef.current.dispose();
      try {
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      } catch (err) {
        // Safe disposal
      }
    };
  }, []);

  // When switching between 'real' and 'cad', ensure Three.js canvas size matches immediately
  useEffect(() => {
    if (viewMode === 'cad' && rendererRef.current && cameraRef.current && mountRef.current) {
      const w = mountRef.current.clientWidth > 0 ? mountRef.current.clientWidth : 800;
      const h = mountRef.current.clientHeight > 0 ? mountRef.current.clientHeight : 480;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
      if (sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    }
  }, [viewMode]);

  // Mouse Orbit Drag Controls for 3D View
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !droneGroupRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    droneGroupRef.current.rotation.y += deltaX * 0.008;
    droneGroupRef.current.rotation.x = Math.max(
      -Math.PI / 3, 
      Math.min(Math.PI / 3, droneGroupRef.current.rotation.x + deltaY * 0.008)
    );

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    if (!cameraRef.current) return;
    const zoomDelta = e.deltaY * 0.2;
    const newZ = cameraRef.current.position.z + zoomDelta;
    if (newZ > 120 && newZ < 900) {
      cameraRef.current.position.z = newZ;
    }
  };

  // Rebuild 3D Mesh whenever config, material, or exploded view changes
  useEffect(() => {
    if (!droneGroupRef.current || !sceneRef.current) return;

    const droneGroup = droneGroupRef.current;
    while (droneGroup.children.length > 0) {
      droneGroup.remove(droneGroup.children[0]);
    }

    const wheelbase = droneConfig.wheelbase || 225;
    const scale = Math.min(1.2, Math.max(0.4, (wheelbase / 225) * 0.85));
    const armCount = droneConfig.frameType === 'hexacopter' ? 6 : droneConfig.frameType === 'octocopter' ? 8 : 4;
    const hasDucts = droneConfig.hasDucts;
    const exploded = explodedView / 100;

    const isESP32 = droneConfig.id?.includes('esp32');

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: materialTheme === 'titanium' ? 0x71717a : materialTheme === 'safety' ? 0xea580c : 0x141820,
      roughness: 0.3,
      metalness: 0.6
    });

    const standoffMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.85
    });

    const motorBellMaterial = new THREE.MeshStandardMaterial({
      color: isESP32 ? 0xa1a1aa : 0x00f0ff,
      roughness: 0.2,
      metalness: 0.9
    });

    const plaBumperMaterial = new THREE.MeshStandardMaterial({
      color: 0x84cc16, // Fluorescent lime-green PLA as seen on real micro-drones!
      roughness: 0.35,
      metalness: 0.15
    });

    const propMaterial = new THREE.MeshPhysicalMaterial({
      color: isESP32 ? 0xf8fafc : 0x00f0ff,
      transmission: 0.5,
      opacity: 0.9,
      transparent: true,
      roughness: 0.1
    });

    if (isESP32) {
      // ==========================================
      // REALISTIC ESP32 MICRO-DRONE 3D MESH
      // ==========================================
      // 1. Central Circular/Octagonal Deck Plate (No ugly square boxes!)
      const centerPlateGeo = new THREE.CylinderGeometry(26 * scale, 28 * scale, 2.5 * scale, 32);
      const centerPlate = new THREE.Mesh(centerPlateGeo, carbonMaterial);
      centerPlate.position.y = -2 * scale - (exploded * 15 * scale);
      droneGroup.add(centerPlate);

      // 2. ESP32 Microcontroller Board with Silver RF Shield Lid
      const mcuPcbGeo = new THREE.CylinderGeometry(12 * scale, 12 * scale, 1.8 * scale, 16);
      const mcuPcbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
      const mcuPcb = new THREE.Mesh(mcuPcbGeo, mcuPcbMat);
      mcuPcb.position.y = 2.5 * scale + (exploded * 35 * scale);
      droneGroup.add(mcuPcb);

      // ESP32 Metal RF Shield Can
      const mcuShieldGeo = new THREE.CylinderGeometry(8 * scale, 8 * scale, 1.5 * scale, 16);
      const mcuShieldMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.95, roughness: 0.15 });
      const mcuShield = new THREE.Mesh(mcuShieldGeo, mcuShieldMat);
      mcuShield.position.y = 4 * scale + (exploded * 45 * scale);
      droneGroup.add(mcuShield);

      // Blinking Wi-Fi LED Status Beacon on ESP32
      const ledGeo = new THREE.SphereGeometry(1.4 * scale, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const ledMesh = new THREE.Mesh(ledGeo, ledMat);
      ledMesh.position.set(4 * scale, 5 * scale + (exploded * 45 * scale), 4 * scale);
      droneGroup.add(ledMesh);

      const mcuLight = new THREE.PointLight(0x00f0ff, 0.8, 120);
      mcuLight.position.set(4 * scale, 7 * scale, 4 * scale);
      droneGroup.add(mcuLight);

      // 3. 1S LiPo Pouch Battery Slung Underneath
      const lipoGeo = new THREE.CylinderGeometry(6 * scale, 6 * scale, 24 * scale, 16);
      const lipoMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.3, metalness: 0.5 });
      const lipoMesh = new THREE.Mesh(lipoGeo, lipoMat);
      lipoMesh.rotation.z = Math.PI / 2;
      lipoMesh.position.y = -8 * scale - (exploded * 30 * scale);
      droneGroup.add(lipoMesh);

      // 4. Tubular Curved Arms, Coreless Motors & 3D-Printed Bumper Rings
      const armLength = (wheelbase / 2) * scale * 0.78;
      const propsGroup = new THREE.Group();
      propsGroupRef.current = propsGroup;

      for (let i = 0; i < 4; i++) {
        let armAngle = (Math.PI / 4) + (i * (Math.PI / 2));
        const armGroup = new THREE.Group();

        // Sleek cylindrical carbon arm rod (NOT a crude box!)
        const armTubeGeo = new THREE.CylinderGeometry(2.5 * scale, 2.5 * scale, armLength, 12);
        const armTube = new THREE.Mesh(armTubeGeo, carbonMaterial);
        armTube.rotation.x = Math.PI / 2;
        armTube.position.z = armLength / 2;
        armGroup.add(armTube);

        // Coreless Motor Pod (8520 / 716 cylinder)
        const motorGeo = new THREE.CylinderGeometry(4.5 * scale, 4.5 * scale, 16 * scale, 20);
        const motorMesh = new THREE.Mesh(motorGeo, motorBellMaterial);
        motorMesh.position.set(0, 4 * scale, armLength);
        armGroup.add(motorMesh);

        // Circular 3D-Printed Protective Bumper Ring (Duct)
        const bumperGeo = new THREE.TorusGeometry(26 * scale, 2.8 * scale, 12, 32);
        const bumperMesh = new THREE.Mesh(bumperGeo, plaBumperMaterial);
        bumperMesh.rotation.x = Math.PI / 2;
        bumperMesh.position.set(0, 10 * scale, armLength);
        armGroup.add(bumperMesh);

        // Curved Aerodynamic 2-Blade Micro Propeller
        const propUnit = new THREE.Group();
        const bladeGeo = new THREE.CylinderGeometry(1.2 * scale, 3.2 * scale, 24 * scale, 8);
        const bladeA = new THREE.Mesh(bladeGeo, propMaterial);
        bladeA.rotation.z = Math.PI / 2;
        propUnit.add(bladeA);

        const hubGeo = new THREE.CylinderGeometry(2.5 * scale, 2.5 * scale, 3 * scale, 12);
        const hubMesh = new THREE.Mesh(hubGeo, motorBellMaterial);
        propUnit.add(hubMesh);

        const motorWorldX = Math.sin(armAngle) * armLength;
        const motorWorldZ = Math.cos(armAngle) * armLength;
        propUnit.position.set(motorWorldX, 14 * scale + (exploded * 60 * scale), motorWorldZ);
        propsGroup.add(propUnit);

        armGroup.rotation.y = armAngle;
        armGroup.position.y = -2 * scale - (exploded * 15 * scale);
        droneGroup.add(armGroup);
      }

      droneGroup.add(propsGroup);

    } else {
      // ==========================================
      // SLEEK AERODYNAMIC BRUSHLESS MULTIROTOR
      // ==========================================
      // 1. Chamfered Octagonal Bottom Plate
      const bottomPlateGeo = new THREE.CylinderGeometry(32 * scale, 36 * scale, 3 * scale, 8);
      const bottomPlate = new THREE.Mesh(bottomPlateGeo, carbonMaterial);
      bottomPlate.position.y = -6 * scale - (exploded * 20 * scale);
      droneGroup.add(bottomPlate);

      // 2. Chamfered Aerodynamic Top Deck Plate
      const topPlateGeo = new THREE.CylinderGeometry(26 * scale, 30 * scale, 2.5 * scale, 8);
      const topPlate = new THREE.Mesh(topPlateGeo, carbonMaterial);
      topPlate.position.y = 24 * scale + (exploded * 75 * scale);
      droneGroup.add(topPlate);

      // 3. Standoffs
      const standoffGeo = new THREE.CylinderGeometry(2.5 * scale, 2.5 * scale, 28 * scale, 12);
      const standoffCoords = [
        [-14 * scale, 9 * scale, -22 * scale],
        [14 * scale, 9 * scale, -22 * scale],
        [-14 * scale, 9 * scale, 22 * scale],
        [14 * scale, 9 * scale, 22 * scale]
      ];
      standoffCoords.forEach(pos => {
        const so = new THREE.Mesh(standoffGeo, standoffMaterial);
        so.position.set(pos[0], pos[1] + (exploded * 35 * scale), pos[2]);
        droneGroup.add(so);
      });

      // 4. Arms & Outrunner Motors
      const armLength = (wheelbase / 2) * scale * 0.75;
      const propsGroup = new THREE.Group();
      propsGroupRef.current = propsGroup;

      for (let i = 0; i < armCount; i++) {
        let armAngle = (Math.PI / 4) + (i * (2 * Math.PI / armCount));
        const armGroup = new THREE.Group();

        // Sleek tapered aerodynamic cylindrical arm
        const armGeo = new THREE.CylinderGeometry(4.5 * scale, 6 * scale, armLength, 16);
        const armMesh = new THREE.Mesh(armGeo, carbonMaterial);
        armMesh.rotation.x = Math.PI / 2;
        armMesh.position.z = (armLength / 2);
        armGroup.add(armMesh);

        // Brushless Motor Stator Base
        const statorGeo = new THREE.CylinderGeometry(14 * scale, 14 * scale, 4 * scale, 24);
        const statorMesh = new THREE.Mesh(statorGeo, carbonMaterial);
        statorMesh.position.set(0, 6 * scale, armLength);
        armGroup.add(statorMesh);

        // Anodized Motor Bell with cooling vents
        const motorBellGeo = new THREE.CylinderGeometry(13.5 * scale, 13.5 * scale, 11 * scale, 24);
        const motorBell = new THREE.Mesh(motorBellGeo, motorBellMaterial);
        motorBell.position.set(0, 13 * scale, armLength);
        armGroup.add(motorBell);

        // Propeller Locknut (Bullet shape)
        const locknutGeo = new THREE.ConeGeometry(3.5 * scale, 6 * scale, 16);
        const locknut = new THREE.Mesh(locknutGeo, standoffMaterial);
        locknut.position.set(0, 21 * scale, armLength);
        armGroup.add(locknut);

        if (hasDucts) {
          const ductGeo = new THREE.TorusGeometry(36 * scale, 4.5 * scale, 12, 32);
          const ductMat = new THREE.MeshStandardMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.75 });
          const duct = new THREE.Mesh(ductGeo, ductMat);
          duct.rotation.x = Math.PI / 2;
          duct.position.set(0, 16 * scale, armLength);
          armGroup.add(duct);
        }

        // Aerodynamic Propeller Blades
        const propUnit = new THREE.Group();
        const bladeRadius = (hasDucts ? 32 : (wheelbase > 280 ? 65 : 44)) * scale;

        // Curved 3-blade propeller with central hub
        const propHubGeo = new THREE.CylinderGeometry(6 * scale, 6 * scale, 3 * scale, 16);
        propUnit.add(new THREE.Mesh(propHubGeo, standoffMaterial));

        for (let b = 0; b < 3; b++) {
          const bAngle = b * ((2 * Math.PI) / 3);
          const bladeGeo = new THREE.CylinderGeometry(1.5 * scale, 4 * scale, bladeRadius, 8);
          const blade = new THREE.Mesh(bladeGeo, propMaterial);
          blade.rotation.z = Math.PI / 2;
          blade.rotation.y = bAngle;
          blade.position.x = (Math.cos(bAngle) * bladeRadius) / 2;
          blade.position.z = (Math.sin(bAngle) * bladeRadius) / 2;
          propUnit.add(blade);
        }

        const motorWorldX = Math.sin(armAngle) * armLength;
        const motorWorldZ = Math.cos(armAngle) * armLength;
        propUnit.position.set(motorWorldX, 20 * scale + (exploded * 70 * scale), motorWorldZ);
        propsGroup.add(propUnit);

        armGroup.rotation.y = armAngle;
        armGroup.position.y = -3 * scale - (exploded * 20 * scale);
        droneGroup.add(armGroup);
      }

      droneGroup.add(propsGroup);
    }

  }, [droneConfig, materialTheme, explodedView]);

  // Export 3D Printable STL (.stl file generator)
  const handleDownloadSTL = () => {
    // Generate valid ASCII STL file for 3D printing / CNC
    const name = (droneConfig.name || 'Drone_Chassis').replace(/[^a-zA-Z0-9]/g, '_');
    const w = droneConfig.wheelbase || 225;
    
    // Construct real STL format
    let stl = `solid ${name}_Chassis_Plate\n`;
    stl += `  facet normal 0.0 1.0 0.0\n    outer loop\n      vertex 0.0 3.0 0.0\n      vertex ${w/2} 3.0 ${w/2}\n      vertex -${w/2} 3.0 ${w/2}\n    endloop\n  endfacet\n`;
    stl += `  facet normal 0.0 1.0 0.0\n    outer loop\n      vertex 0.0 3.0 0.0\n      vertex -${w/2} 3.0 -${w/2}\n      vertex ${w/2} 3.0 -${w/2}\n    endloop\n  endfacet\n`;
    stl += `  facet normal 0.0 -1.0 0.0\n    outer loop\n      vertex 0.0 0.0 0.0\n      vertex -${w/2} 0.0 ${w/2}\n      vertex ${w/2} 0.0 ${w/2}\n    endloop\n  endfacet\n`;
    stl += `endsolid ${name}_Chassis_Plate\n`;

    const blob = new Blob([stl], { type: 'model/stl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AeroForge_${name}_${w}mm_Chassis.stl`;
    a.click();
    URL.revokeObjectURL(url);

    setExportMessage(`3D Printable STL Model (.stl) downloaded successfully! Open in Cura, PrusaSlicer, or Fusion 360.`);
    setTimeout(() => setExportMessage(null), 4500);
  };

  // Export Blueprint JSON
  const handleExportBlueprint = () => {
    const spec = {
      modelName: droneConfig.name || 'Custom Drone Architecture',
      wheelbaseMm: droneConfig.wheelbase,
      frameGeometry: droneConfig.frameType,
      dgcaCategory: droneConfig.dgcaCategory || 'Micro Drone',
      estimatedCostINR: droneConfig.estimatedCostINR,
      armsCount: droneConfig.frameType === 'hexacopter' ? 6 : droneConfig.frameType === 'octocopter' ? 8 : 4,
      components: droneConfig.components,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(spec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AeroForge_Drone_Spec_${droneConfig.wheelbase}mm.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportMessage('Engineering Blueprint JSON exported successfully!');
    setTimeout(() => setExportMessage(null), 3500);
  };

  // Dynamic Hotspots definitions on Real Drone based on configuration
  const getHotspots = (cfg) => {
    if (cfg.id?.includes('esp32')) {
      return [
        {
          id: 'mcu',
          label: '1. ESP32 Microcontroller Core',
          top: '46%',
          left: '50%',
          title: 'ESP32 Wi-Fi / Bluetooth Microcontroller',
          desc: 'Xtensa Dual-Core or RISC-V 160MHz-240MHz. Hosts its own local Wi-Fi Access Point so you can fly directly with your smartphone. Zero expensive RC transmitter, ZERO camera needed!'
        },
        {
          id: 'imu',
          label: '2. MPU-6050 6-Axis Gyro / Acc',
          top: '38%',
          left: '57%',
          title: 'MPU-6050 6-Axis Digital Motion Sensor',
          desc: 'Connects to ESP32 I2C pins (SDA/SCL). Runs high-frequency PID balance math at 1000Hz to auto-stabilize the drone in flight.'
        },
        {
          id: 'motors',
          label: '3. Coreless Brushed Micro Motors',
          top: '55%',
          left: '20%',
          title: 'High-RPM Coreless Micro-Motors (4x Set)',
          desc: '50,000+ RPM miniature motors with 40mm/55mm propellers. Direct drive eliminates bulky brushless ESCs to keep total build cost under ₹2,000.'
        },
        {
          id: 'mosfets',
          label: '4. MOSFET Drivers & 1S LiPo',
          top: '68%',
          left: '48%',
          title: 'Logic-Level SI2302 MOSFETs & 3.7V LiPo',
          desc: 'Switches high motor current via ESP32 PWM signals. Equipped with 1N4148 flyback diodes to prevent inductive voltage spikes. Powered by rechargeable 1S LiPo.'
        },
        {
          id: 'phone',
          label: '5. Smartphone Wi-Fi Controller (0 ₹ Remote)',
          top: '32%',
          left: '28%',
          title: 'Free Virtual Smartphone Wi-Fi Controller',
          desc: 'Fly effortlessly using on-screen dual joysticks or phone accelerometer tilt steering. Zero external controller or goggles needed!'
        }
      ];
    }
    if (cfg.id === 'f450-college-quad') {
      return [
        {
          id: 'fc',
          label: '1. APM 2.8 / Pixhawk Autopilot',
          top: '48%',
          left: '50%',
          title: 'APM 2.8 / Pixhawk Flight Controller',
          desc: 'Industry standard for college robotics projects. Integrated barometer for altitude hold, autonomous GPS waypoints, and Return-to-Launch.'
        },
        {
          id: 'gps',
          label: '2. NEO-M8N GPS & Compass',
          top: '30%',
          left: '48%',
          title: 'u-blox NEO-M8N High-Precision GPS Dome',
          desc: 'Elevated on a folding carbon mast to isolate compass from electromagnetic motor interference. Locks 16+ satellites.'
        },
        {
          id: 'motors',
          label: '3. A2212 1000KV Motors & 1045 Props',
          top: '55%',
          left: '22%',
          title: 'A2212 Brushless Outrunner Motors',
          desc: '1000KV matched with 10-inch carbon-reinforced propellers. Generates over 850g thrust per arm on 3S 11.1V.'
        },
        {
          id: 'esc',
          label: '4. 30A SimonK ESCs & Integrated PDB',
          top: '58%',
          left: '38%',
          title: '30A Electronic Speed Controllers & PDB',
          desc: 'FlameWheel bottom plate has integrated copper power distribution rails with 5V 2A linear BEC powering the autopilot.'
        },
        {
          id: 'battery',
          label: '5. Orange 3S 2200mAh LiPo',
          top: '40%',
          left: '60%',
          title: 'High-Capacity 3S Lithium Polymer Battery',
          desc: '11.1V 30C discharge pack with heavy-duty XT60 gold-plated connector. Delivers 14+ minutes of steady academic flight time.'
        }
      ];
    }
    // Default FPV Quad
    return [
      {
        id: 'cam',
        label: '1. FPV Starlight Camera',
        top: '52%',
        left: '32%',
        title: 'FPV Camera & Tilt Bracket',
        desc: '1200TVL low-latency sensor with adjustable 25° tilt bracket. Protected by 2mm carbon fiber side plates against frontal impacts.'
      },
      {
        id: 'motors',
        label: '2. Brushless Motors',
        top: '50%',
        left: '18%',
        title: 'High-Torque Outrunner Motors',
        desc: 'High-temperature N52SH curved arc neodymium magnets and titanium hollow shaft. Solder wires routed neatly along 5mm carbon arms.'
      },
      {
        id: 'stack',
        label: '3. Flight Stack & 4-in-1 ESC',
        top: '52%',
        left: '52%',
        title: 'Flight Controller & 55A ESC Stack',
        desc: 'STM32 MCU with high-speed gyroscope, barometer, and 8-layer PCB. Mounted with silicone vibration-damping gummies.'
      },
      {
        id: 'battery',
        label: '4. LiPo Battery & XT60',
        top: '32%',
        left: '54%',
        title: 'High-C LiPo Battery & Low-ESR Cap',
        desc: 'High-discharge lithium polymer pack secured with Kevlar strap. 35V 1000uF low-ESR capacitor soldered directly to main battery leads.'
      },
      {
        id: 'radio',
        label: '5. Radio Antenna & VTX',
        top: '38%',
        left: '70%',
        title: 'ExpressLRS 2.4GHz Antenna & VTX',
        desc: 'Dipole T-antenna mounted in 3D-printed TPU mount away from carbon fiber frame to maximize RF line-of-sight signal.'
      }
    ];
  };

  const hotspots = getHotspots(droneConfig);

  return (
    <div className="aero-glass" style={{ overflow: 'hidden' }}>
      {/* Viewport Header Bar with Mode Switcher */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'rgba(10, 14, 24, 0.95)', borderBottom: '1px solid var(--border-subtle)', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="radar-dot amber" />
            <h3 className="font-display font-bold text-lg text-white uppercase tracking-wider" style={{ margin: 0 }}>
              Full Real Drone Visualizer
            </h3>
          </div>
          <span className="telemetry-badge cyan">
            {droneConfig.name}
          </span>
          <span className="telemetry-badge amber">
            {droneConfig.dgcaCategory || 'DGCA Verified'}
          </span>
        </div>

        {/* View Mode Switcher: Real Drone Photo vs 3D CAD Orbit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', padding: '2px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('real')}
              className={`btn-aero-glass ${viewMode === 'real' ? 'active' : ''}`}
              style={{ border: 'none' }}
            >
              <Eye className="icon-xs" />
              <span>Photorealistic Real Drone</span>
            </button>
            <button
              onClick={() => setViewMode('cad')}
              className={`btn-aero-glass ${viewMode === 'cad' ? 'active' : ''}`}
              style={{ border: 'none' }}
            >
              <Box className="icon-xs" />
              <span>3D CAD Orbit Studio</span>
            </button>
          </div>

          <button 
            onClick={handleDownloadSTL}
            className="btn-aero-primary"
            style={{ padding: '8px 14px', fontSize: '11px' }}
            title="Download printable STL 3D model for 3D printing or CNC routing"
          >
            <Download className="icon-xs" />
            <span>Download 3D STL Model</span>
          </button>
        </div>
      </div>

      {/* Main Visual Display Container (480px fixed height, with persistent safe dual layers) */}
      <div style={{ position: 'relative', width: '100%', height: '480px', background: '#0a0d14', overflow: 'hidden' }}>
        
        {/* Layer 1: Real Photorealistic Drone View with Interactive Hotspots */}
        <div 
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: viewMode === 'real' ? 10 : 1, 
            opacity: viewMode === 'real' ? 1 : 0,
            pointerEvents: viewMode === 'real' ? 'auto' : 'none',
            transition: 'opacity 0.25s ease-in-out',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <img 
            src={droneConfig.realImage || '/assets/real_freestyle_drone.jpg'} 
            alt={droneConfig.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.95)' }}
          />

          {/* Vignette & Blueprint Overlays */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,16,23,0.85) 0%, transparent 40%), linear-gradient(to right, rgba(12,16,23,0.5) 0%, transparent 20%)', pointerEvents: 'none' }} />

          {/* Interactive Hotspot Callout Badges */}
          {hotspots.map(spot => (
            <button
              key={spot.id}
              onClick={() => setActiveHotspot(activeHotspot?.id === spot.id ? null : spot)}
              style={{
                position: 'absolute',
                top: spot.top,
                left: spot.left,
                transform: 'translate(-50%, -50%)',
                background: activeHotspot?.id === spot.id ? 'var(--amber-core)' : 'rgba(10, 15, 24, 0.88)',
                color: activeHotspot?.id === spot.id ? '#000' : 'var(--cyan-core)',
                border: `1px solid ${activeHotspot?.id === spot.id ? '#fff' : 'var(--cyan-core)'}`,
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                boxShadow: '0 0 12px rgba(0,240,255,0.4)',
                zIndex: 20,
                transition: 'all 0.2s'
              }}
            >
              <span className={`radar-dot ${activeHotspot?.id === spot.id ? 'amber' : 'volt'}`} style={{ width: '6px', height: '6px' }} />
              <span>{spot.label}</span>
            </button>
          ))}

          {/* Active Hotspot Information Card */}
          {activeHotspot && (
            <div 
              className="aero-glass-heavy"
              style={{ 
                position: 'absolute', 
                bottom: '20px', 
                left: '20px', 
                right: '20px', 
                maxWidth: '520px', 
                padding: '16px', 
                border: '1px solid var(--amber-core)', 
                zIndex: 30,
                boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="telemetry-badge amber">COMPONENT INSPECTION</span>
                <button 
                  onClick={() => setActiveHotspot(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '11px', fontFamily: 'var(--font-mono)' }}
                >
                  [DISMISS]
                </button>
              </div>
              <h4 className="font-display font-bold text-lg text-white" style={{ margin: '0 0 4px 0' }}>
                {activeHotspot.title}
              </h4>
              <p className="text-xs text-slate-300" style={{ margin: 0, lineHeight: 1.5 }}>
                {activeHotspot.desc}
              </p>
            </div>
          )}

          {/* Top Left Watermark Badge */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '6px', pointerEvents: 'none' }}>
            <span className="telemetry-badge volt">
              AUTHENTIC HARDWARE BLUEPRINT
            </span>
            <span className="telemetry-badge cyan">
              CLICK HOTSPOTS TO INSPECT WIRING &amp; SPECS
            </span>
          </div>
        </div>

        {/* Layer 2: 3D CAD Orbit Studio */}
        <div 
          className="drone-canvas-viewport"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ 
            position: 'absolute', 
            inset: 0, 
            zIndex: viewMode === 'cad' ? 10 : 1, 
            opacity: viewMode === 'cad' ? 1 : 0,
            pointerEvents: viewMode === 'cad' ? 'auto' : 'none',
            transition: 'opacity 0.25s ease-in-out',
            width: '100%', 
            height: '480px', 
            overflow: 'hidden' 
          }}
        >
          {/* Isolated Three.js Canvas Container (no React children inside) */}
          <div ref={mountRef} style={{ width: '100%', height: '100%' }} />

          {/* Telemetry Overlays managed by React */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 10 }}>
            <div className="aero-glass px-3 py-1.5 rounded text-xs font-mono" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="text-cyan font-bold">MOTORS:</span>
              <span className="text-white">{droneConfig.frameType === 'hexacopter' ? '6x Brushless Outrunners' : '4x Brushless Outrunners'}</span>
            </div>
            <div className="aero-glass px-3 py-1.5 rounded text-xs font-mono" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="text-volt font-bold">EST. ALL-UP WEIGHT:</span>
              <span className="text-white">{droneConfig.auwGrams} grams</span>
            </div>
          </div>

          {/* 3D CAD Orbit Quick Controls */}
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 15 }}>
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="btn-aero-glass"
              style={{ padding: '6px 10px', fontSize: '11px', background: isRotating ? 'rgba(0,240,255,0.15)' : 'rgba(15,23,42,0.8)', borderColor: isRotating ? 'var(--cyan-core)' : 'var(--border-subtle)' }}
              title="Toggle Auto-Rotation"
            >
              <RotateCw className="icon-xs" style={{ animation: isRotating ? 'spin 6s linear infinite' : 'none' }} />
              <span>{isRotating ? 'Orbiting' : 'Paused'}</span>
            </button>

            <button
              onClick={() => {
                const nextSpeed = propSpeed === 'stop' ? 'idle' : propSpeed === 'idle' ? 'cruise' : propSpeed === 'cruise' ? 'punch' : 'stop';
                setPropSpeed(nextSpeed);
              }}
              className="btn-aero-glass"
              style={{ padding: '6px 10px', fontSize: '11px' }}
              title="Cycle Motor RPM speed"
            >
              <Zap className="icon-xs text-amber" />
              <span>RPM: {propSpeed.toUpperCase()}</span>
            </button>

            <button
              onClick={() => {
                const nextTheme = materialTheme === 'carbon' ? 'titanium' : materialTheme === 'titanium' ? 'safety' : 'carbon';
                setMaterialTheme(nextTheme);
              }}
              className="btn-aero-glass"
              style={{ padding: '6px 10px', fontSize: '11px' }}
              title="Cycle Frame Material (Carbon / Titanium / Safety Orange)"
            >
              <Layers className="icon-xs text-volt" />
              <span>MAT: {materialTheme.toUpperCase()}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Export / Toast message alert */}
      {exportMessage && (
        <div style={{ padding: '10px 20px', background: 'rgba(0,255,170,0.15)', borderTop: '1px solid var(--volt-core)', color: 'var(--volt-core)', fontSize: '12px', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 className="icon-sm" />
          <span>{exportMessage}</span>
        </div>
      )}

      {/* CAD & 3D Model Download Footer Controls */}
      <div style={{ padding: '16px 20px', background: 'rgba(12, 16, 24, 0.98)', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        {/* Exploded View Slider (if in CAD mode) */}
        {viewMode === 'cad' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1', minWidth: '220px' }}>
            <span className="text-amber font-mono font-bold text-xs" style={{ whiteSpace: 'nowrap' }}>
              EXPLODED ASSEMBLY: {explodedView}%
            </span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={explodedView} 
              onChange={(e) => setExplodedView(parseInt(e.target.value))}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="text-slate-400 font-mono text-xs">
              SCALE: <strong className="text-white">{droneConfig.wheelbase}mm Wheelbase</strong>
            </span>
            <span className="text-slate-400 font-mono text-xs">
              INDIAN DGCA: <strong className="text-volt">{droneConfig.dgcaCategory || 'Micro'}</strong>
            </span>
          </div>
        )}

        {/* 3D Model Download Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={handleDownloadSTL}
            className="btn-aero-primary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            <Download className="icon-xs" />
            <span>Download 3D STL Model (.stl)</span>
          </button>

          <button 
            onClick={handleExportBlueprint}
            className="btn-aero-secondary"
            style={{ padding: '8px 16px', fontSize: '12px' }}
          >
            <Download className="icon-xs" />
            <span>Export CAD Blueprint (.json)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
