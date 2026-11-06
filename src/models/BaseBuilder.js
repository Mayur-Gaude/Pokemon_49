import * as THREE from 'three';

/**
 * Realistic Procedural Construction Utilities & PBR Material Library
 */
export class BaseBuilder {
  static materials = new Map();

  /**
   * Get or create a cached realistic MeshPhysicalMaterial with smooth shading and clearcoat
   */
  static getMaterial(colorHex, roughness = 0.35, metalness = 0.08, emissive = 0x000000, emissiveIntensity = 0.2) {
    const key = `${colorHex}_${roughness}_${metalness}_${emissive}_${emissiveIntensity}`;
    if (!this.materials.has(key)) {
      const mat = new THREE.MeshPhysicalMaterial({
        color: colorHex,
        roughness,
        metalness,
        clearcoat: 0.3,
        clearcoatRoughness: 0.25,
        emissive,
        emissiveIntensity,
        flatShading: false
      });
      this.materials.set(key, mat);
    }
    return this.materials.get(key);
  }

  /**
   * Make any mesh cast and receive soft shadows
   */
  static enableShadows(obj) {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.geometry) {
          child.geometry.computeVertexNormals();
        }
      }
    });
    return obj;
  }

  /**
   * Procedural Eye pair with glossy reflections and lifelike iris
   */
  static createEyes(radius = 0.08, pupilColor = 0x111827, scleraColor = 0xffffff, gleam = true) {
    const group = new THREE.Group();
    const eyeGeo = new THREE.SphereGeometry(radius, 24, 20);
    const scleraMat = this.getMaterial(scleraColor, 0.15, 0.05);
    const pupilMat = this.getMaterial(pupilColor, 0.1, 0.2);

    // Left Eye
    const leftEye = new THREE.Mesh(eyeGeo, scleraMat);
    leftEye.scale.set(1, 1.25, 0.45);
    const leftPupil = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.72, 16, 16), pupilMat);
    leftPupil.position.z = radius * 0.35;
    leftEye.add(leftPupil);

    // Right Eye
    const rightEye = leftEye.clone();

    if (gleam) {
      const gleamGeo = new THREE.SphereGeometry(radius * 0.25, 12, 12);
      const gleamMat = this.getMaterial(0xffffff, 0.05, 0.9, 0xffffff, 0.9);
      const leftGleam = new THREE.Mesh(gleamGeo, gleamMat);
      leftGleam.position.set(-radius * 0.2, radius * 0.25, radius * 0.5);
      leftPupil.add(leftGleam);

      const rightGleam = leftGleam.clone();
      rightEye.children[0].add(rightGleam);
    }

    group.add(leftEye);
    group.add(rightEye);
    return { group, leftEye, rightEye };
  }

  /**
   * Cute Red Cheek Pouches
   */
  static createCheeks(radius = 0.1, color = 0xef4444) {
    const group = new THREE.Group();
    const geo = new THREE.SphereGeometry(radius, 20, 16);
    const mat = this.getMaterial(color, 0.35, 0.05, color, 0.25);

    const left = new THREE.Mesh(geo, mat);
    left.scale.set(1, 1, 0.35);
    const right = left.clone();

    group.add(left);
    group.add(right);
    return { group, left, right };
  }

  /**
   * Procedural Zig-zag Lightning Mesh for Tails
   */
  static createZigzagMesh(segments = 4, width = 0.18, thickness = 0.04, color = 0xeab308, tipColor = null) {
    const group = new THREE.Group();
    let currentY = 0;
    let currentX = 0;
    let dir = 1;

    for (let i = 0; i < segments; i++) {
      const segWidth = width * (0.6 + (i / segments) * 0.8);
      const segHeight = 0.28 + (i * 0.08);
      const isTip = i === segments - 1;
      const mat = isTip && tipColor ? this.getMaterial(tipColor) : this.getMaterial(color, 0.35, 0.08);

      const boxGeo = new THREE.BoxGeometry(segWidth, segHeight, thickness);
      const mesh = new THREE.Mesh(boxGeo, mat);

      mesh.position.set(currentX + (dir * segWidth * 0.4), currentY + segHeight * 0.5, 0);
      mesh.rotation.z = (dir * 0.35);

      group.add(mesh);

      currentX += dir * segWidth * 0.6;
      currentY += segHeight * 0.75;
      dir *= -1;
    }

    return group;
  }
}
