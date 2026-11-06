import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class CameraController {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.controls = new OrbitControls(this.camera, this.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05; // Don't flip under ground
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 9.0;
    this.controls.target.set(0, 1.1, 0);

    // Initial Camera Position
    this.defaultPos = new THREE.Vector3(0, 1.8, 4.2);
    this.defaultTarget = new THREE.Vector3(0, 1.1, 0);

    this.camera.position.copy(this.defaultPos);
    this.controls.update();

    // Smooth Lerp Transition State
    this.isTransitioning = false;
    this.transitionDuration = 1.0;
    this.transitionTime = 0;
    this.startPos = new THREE.Vector3();
    this.targetPos = new THREE.Vector3();
    this.startLook = new THREE.Vector3();
    this.targetLook = new THREE.Vector3();
  }

  /**
   * Reset view to default front 3/4 angle
   */
  reset() {
    this.animateTo(this.defaultPos, this.defaultTarget, 0.8);
  }

  /**
   * Cinematic orbit shift during Pokémon selection or evolution
   */
  triggerTransitionEffect(stage = 0) {
    // Stage-based camera framing (e.g. Stage 2 Charizard/Venusaur/Blastoise are larger, so frame slightly further back)
    const distanceOffset = stage * 0.45;
    const destPos = new THREE.Vector3(
      (Math.random() - 0.5) * 1.5,
      1.7 + stage * 0.15,
      4.0 + distanceOffset
    );
    const destTarget = new THREE.Vector3(0, 1.0 + stage * 0.2, 0);
    this.animateTo(destPos, destTarget, 1.0);
  }

  animateTo(position, target, duration = 1.0) {
    this.isTransitioning = true;
    this.transitionDuration = duration;
    this.transitionTime = 0;

    this.startPos.copy(this.camera.position);
    this.targetPos.copy(position);

    this.startLook.copy(this.controls.target);
    this.targetLook.copy(target);

    this.controls.enabled = false;
  }

  update(delta) {
    if (this.isTransitioning) {
      this.transitionTime += delta;
      const progress = Math.min(1, this.transitionTime / this.transitionDuration);

      // Smooth easeInOutCubic
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      this.camera.position.lerpVectors(this.startPos, this.targetPos, ease);
      this.controls.target.lerpVectors(this.startLook, this.targetLook, ease);

      if (progress >= 1) {
        this.isTransitioning = false;
        this.controls.enabled = true;
      }
    }

    this.controls.update();
  }
}
