import * as THREE from 'three';

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.ambientParticles = null;
    this.burstParticles = [];
    this.initAmbientParticles();
  }

  /**
   * Continuous floating elemental motes in the 3D viewport
   */
  initAmbientParticles() {
    const count = 250;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = Math.random() * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      scales[i] = 0.5 + Math.random() * 1.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    const material = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });

    this.ambientParticles = new THREE.Points(geometry, material);
    this.scene.add(this.ambientParticles);
  }

  /**
   * Update particle tint to match active Pokémon's elemental glow
   */
  setThemeColor(hexColor) {
    if (this.ambientParticles && this.ambientParticles.material) {
      this.ambientParticles.material.color.set(hexColor);
    }
  }

  /**
   * Triggers an explosive cosmic evolution particle burst
   */
  triggerEvolutionBurst(origin = new THREE.Vector3(0, 1.2, 0), colorHex = 0x38bdf8) {
    const count = 300;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = origin.x;
      positions[i * 3 + 1] = origin.y;
      positions[i * 3 + 2] = origin.z;

      // Spherical explosion velocities
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.acos((Math.random() * 2) - 1);
      const speed = 2.5 + Math.random() * 4.5;

      velocities.push(new THREE.Vector3(
        speed * Math.sin(theta) * Math.cos(phi),
        speed * Math.cos(theta),
        speed * Math.sin(theta) * Math.sin(phi)
      ));
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.16,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    this.burstParticles.push({
      points,
      velocities,
      age: 0,
      maxAge: 1.3
    });
  }

  update(delta, time) {
    // Ambient floating motes
    if (this.ambientParticles) {
      const positions = this.ambientParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += delta * 0.25;
        if (positions[i] > 6) {
          positions[i] = 0;
        }
      }
      this.ambientParticles.geometry.attributes.position.needsUpdate = true;
      this.ambientParticles.rotation.y = time * 0.04;
    }

    // Active bursts
    for (let b = this.burstParticles.length - 1; b >= 0; b--) {
      const burst = this.burstParticles[b];
      burst.age += delta;
      const progress = burst.age / burst.maxAge;

      const pos = burst.points.geometry.attributes.position.array;
      for (let i = 0; i < burst.velocities.length; i++) {
        const vel = burst.velocities[i];
        pos[i * 3] += vel.x * delta;
        pos[i * 3 + 1] += vel.y * delta;
        pos[i * 3 + 2] += vel.z * delta;
        vel.y -= delta * 3.5; // gravity pull
      }
      burst.points.geometry.attributes.position.needsUpdate = true;
      burst.points.material.opacity = Math.max(0, 1 - progress);

      if (burst.age >= burst.maxAge) {
        this.scene.remove(burst.points);
        burst.points.geometry.dispose();
        burst.points.material.dispose();
        this.burstParticles.splice(b, 1);
      }
    }
  }
}
