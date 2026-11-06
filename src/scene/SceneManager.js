import * as THREE from 'three';
import { CameraController } from './CameraController.js';
import { ParticleSystem } from './ParticleSystem.js';
import { ModelFactory } from '../models/ModelFactory.js';
import { soundManager } from '../audio/SoundManager.js';

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.width = container.clientWidth || 800;
    this.height = container.clientHeight || 600;

    // Core Three.js components
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060914);
    this.scene.fog = new THREE.FogExp2(0x060914, 0.05);

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Systems
    this.cameraController = new CameraController(this.camera, this.renderer.domElement);
    this.particleSystem = new ParticleSystem(this.scene);

    // Active Model & Settings
    this.activeModel = null;
    this.activePokemon = null;
    this.isWireframe = false;
    this.autoRotate = true;
    this.autoRotateSpeed = 0.8;
    this.isActive = true;

    // Clock
    this.clock = new THREE.Clock();

    // Lighting & Pedestal Setup
    this.initLighting();
    this.initPedestal();

    // Resize Handler
    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    // Render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initLighting() {
    // 1. Balanced Ambient Fill
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(this.ambientLight);

    // 2. Primary Key Light (Soft Shadows & PBR Highlights)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    this.keyLight.position.set(5, 9, 5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.camera.left = -3;
    this.keyLight.shadow.camera.right = 3;
    this.keyLight.shadow.camera.top = 3;
    this.keyLight.shadow.camera.bottom = -3;
    this.keyLight.shadow.bias = -0.0004;
    this.scene.add(this.keyLight);

    // 3. Rim/Back Light
    this.rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    this.rimLight.position.set(-5, 6, -5);
    this.scene.add(this.rimLight);

    // 4. Dynamic Colored Point Light reflecting off the model
    this.pointLight = new THREE.PointLight(0x38bdf8, 3.0, 7, 1.2);
    this.pointLight.position.set(0, 1.6, 1.6);
    this.scene.add(this.pointLight);
  }

  initPedestal() {
    this.pedestalGroup = new THREE.Group();

    // Dark Metallic Base Cylinder
    const baseGeo = new THREE.CylinderGeometry(2.2, 2.4, 0.2, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.85
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.1;
    base.receiveShadow = true;
    this.pedestalGroup.add(base);

    // Concentric Glowing Energy Rings
    const ringGeo1 = new THREE.RingGeometry(1.8, 1.9, 64);
    this.ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    this.ring1 = new THREE.Mesh(ringGeo1, this.ringMat1);
    this.ring1.rotation.x = -Math.PI / 2;
    this.ring1.position.y = 0.01;
    this.pedestalGroup.add(this.ring1);

    const ringGeo2 = new THREE.RingGeometry(1.2, 1.25, 48);
    this.ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    this.ring2 = new THREE.Mesh(ringGeo2, this.ringMat2);
    this.ring2.rotation.x = -Math.PI / 2;
    this.ring2.position.y = 0.015;
    this.pedestalGroup.add(this.ring2);

    // Floor Cyber Grid
    const grid = new THREE.GridHelper(16, 24, 0x0284c7, 0x1e293b);
    grid.position.y = -0.15;
    this.pedestalGroup.add(grid);

    this.scene.add(this.pedestalGroup);
  }

  /**
   * Load and smoothly switch active Pokémon 3D model
   */
  loadPokemon(pokemon, isEvolution = false) {
    this.activePokemon = pokemon;
    const modelKey = pokemon.modelKey || pokemon.name.toLowerCase();

    // Update elemental colors
    const themeColor = new THREE.Color(pokemon.glowColor || pokemon.primaryColor || 0x38bdf8);
    this.pointLight.color.copy(themeColor);
    this.ringMat1.color.copy(themeColor);
    this.ringMat2.color.copy(themeColor);
    this.particleSystem.setThemeColor(themeColor);

    // Evolution sound & camera framing
    if (isEvolution) {
      soundManager.playEvolutionSequence();
      this.particleSystem.triggerEvolutionBurst(new THREE.Vector3(0, 1.2, 0), themeColor.getHex());
      this.cameraController.triggerTransitionEffect(pokemon.evolutionStage || 0);
    } else {
      soundManager.playPokemonCry(pokemon);
      this.cameraController.triggerTransitionEffect(pokemon.evolutionStage || 0);
    }

    // Check if 3D model exists
    if (!ModelFactory.hasModel(modelKey)) {
      if (this.activeModel) {
        this.scene.remove(this.activeModel);
        this.activeModel = null;
      }
      return false;
    }

    // Smooth model transition
    if (this.activeModel) {
      const oldModel = this.activeModel;
      this.animateModelOut(oldModel, () => {
        this.scene.remove(oldModel);
        this.spawnNewModel(modelKey, isEvolution);
      });
    } else {
      this.spawnNewModel(modelKey, isEvolution);
    }

    return true;
  }

  spawnNewModel(modelKey, isEvolution = false) {
    const newModel = ModelFactory.create(modelKey);
    if (!newModel) return;

    ModelFactory.setWireframe(newModel, this.isWireframe);

    newModel.scale.set(0.001, 0.001, 0.001);
    this.scene.add(newModel);
    this.activeModel = newModel;

    // Spawn animation scale-up
    let scaleProg = 0;
    const targetScale = 1.0;
    const duration = isEvolution ? 0.7 : 0.45;
    const startTime = performance.now();

    const animIn = (now) => {
      const elapsed = (now - startTime) / 1000;
      scaleProg = Math.min(1, elapsed / duration);
      // Elastic overshoot ease
      const s = scaleProg >= 1 ? 1 : Math.sin(scaleProg * Math.PI * 0.5) * targetScale * (1 + (1 - scaleProg) * 0.3);
      if (this.activeModel === newModel) {
        newModel.scale.set(s, s, s);
      }
      if (scaleProg < 1) {
        requestAnimationFrame(animIn);
      }
    };
    requestAnimationFrame(animIn);
  }

  animateModelOut(model, callback) {
    let scaleProg = 1;
    const startTime = performance.now();
    const duration = 0.35;

    const animOut = (now) => {
      const elapsed = (now - startTime) / 1000;
      scaleProg = Math.max(0, 1 - elapsed / duration);
      model.scale.set(scaleProg, scaleProg, scaleProg);
      model.rotation.y += 0.08;

      if (scaleProg > 0) {
        requestAnimationFrame(animOut);
      } else {
        callback();
      }
    };
    requestAnimationFrame(animOut);
  }

  toggleWireframe() {
    this.isWireframe = !this.isWireframe;
    if (this.activeModel) {
      ModelFactory.setWireframe(this.activeModel, this.isWireframe);
    }
    return this.isWireframe;
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    return this.autoRotate;
  }

  setTheme(theme) {
    if (theme === 'light') {
      this.scene.background.set(0xf8fafc);
      this.scene.fog.color.set(0xf8fafc);
      this.ambientLight.intensity = 1.2;
      this.renderer.toneMappingExposure = 1.05;
    } else {
      this.scene.background.set(0x060914);
      this.scene.fog.color.set(0x060914);
      this.ambientLight.intensity = 0.85;
      this.renderer.toneMappingExposure = 1.2;
    }
  }

  setLightingPreset(preset) {
    switch (preset) {
      case 'cyberpunk':
        this.keyLight.color.set(0x06b6d4);
        this.rimLight.color.set(0xec4899);
        this.ambientLight.intensity = 0.6;
        this.renderer.toneMappingExposure = 1.3;
        break;
      case 'studio':
        this.keyLight.color.set(0xffffff);
        this.rimLight.color.set(0xf1f5f9);
        this.ambientLight.intensity = 1.0;
        this.renderer.toneMappingExposure = 1.2;
        break;
      case 'solar':
        this.keyLight.color.set(0xf59e0b);
        this.rimLight.color.set(0xef4444);
        this.ambientLight.intensity = 0.7;
        this.renderer.toneMappingExposure = 1.35;
        break;
      case 'void':
        this.keyLight.color.set(0xa855f7);
        this.rimLight.color.set(0x3b82f6);
        this.ambientLight.intensity = 0.4;
        this.renderer.toneMappingExposure = 1.1;
        break;
    }
  }

  onResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Auto rotate model when enabled
    if (this.activeModel && this.autoRotate) {
      this.activeModel.rotation.y += delta * this.autoRotateSpeed;
    }

    // Realistic Model idle animation
    if (this.activeModel && this.activeModel.userData.update) {
      this.activeModel.userData.update(delta, time);
    }

    // Pedestal holographic rings rotation
    if (this.ring1) this.ring1.rotation.z = time * 0.3;
    if (this.ring2) this.ring2.rotation.z = -time * 0.45;

    // Subsystems
    this.cameraController.update(delta);
    this.particleSystem.update(delta, time);

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
