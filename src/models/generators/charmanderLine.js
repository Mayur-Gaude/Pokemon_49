import * as THREE from 'three';
import { BaseBuilder } from '../BaseBuilder.js';

/**
 * Creates dynamic procedural flame particles for fire tails
 */
function createTailFlame(scale = 1.0) {
  const flameGroup = new THREE.Group();
  const flameCores = [];
  const count = 7;

  for (let i = 0; i < count; i++) {
    const isInner = i < 3;
    const color = isInner ? 0xffeb3b : (i % 2 === 0 ? 0xff5722 : 0xf44336);
    const radius = (0.08 + Math.random() * 0.08) * scale * (isInner ? 0.7 : 1.0);
    const geo = new THREE.DodecahedronGeometry(radius, 1);
    const mat = BaseBuilder.getMaterial(color, 0.2, 0.1, color, 0.8);
    const mesh = new THREE.Mesh(geo, mat);

    mesh.position.set(
      (Math.random() - 0.5) * 0.1 * scale,
      (i * 0.08) * scale,
      (Math.random() - 0.5) * 0.1 * scale
    );

    flameGroup.add(mesh);
    flameCores.push({
      mesh,
      origY: mesh.position.y,
      speed: 4 + Math.random() * 6,
      offset: Math.random() * Math.PI * 2
    });
  }

  flameGroup.userData.updateFlame = (time) => {
    flameCores.forEach((c) => {
      const s = 0.8 + Math.sin(time * c.speed + c.offset) * 0.35;
      c.mesh.scale.set(s, s * 1.3, s);
      c.mesh.position.y = c.origY + Math.cos(time * c.speed) * 0.03 * scale;
    });
  };

  return flameGroup;
}

export function createCharmanderModel() {
  const root = new THREE.Group();
  const orangeMat = BaseBuilder.getMaterial(0xf97316, 0.5, 0.05);
  const creamMat = BaseBuilder.getMaterial(0xfef3c7, 0.5, 0.05);
  const eyeBlueMat = BaseBuilder.getMaterial(0x0284c7, 0.2, 0.2);

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 20, 18), orangeMat);
  body.scale.set(0.9, 1.2, 0.9);
  body.position.y = 0.8;
  root.add(body);

  // Cream Belly
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 16), creamMat);
  belly.scale.set(0.75, 1.0, 0.25);
  belly.position.set(0, 0.75, 0.45);
  root.add(belly);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 18), orangeMat);
  head.scale.set(1.0, 0.95, 1.15);
  head.position.set(0, 1.45, 0.1);
  root.add(head);

  // Snout
  const snout = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 12), orangeMat);
  snout.scale.set(1.0, 0.7, 1.2);
  snout.position.set(0, 1.32, 0.5);
  root.add(snout);

  // Blue Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.09, 0x0284c7, 0xffffff);
  leftEye.position.set(0.24, 1.5, 0.45);
  rightEye.position.set(-0.24, 1.5, 0.45);
  root.add(eyes);

  // Arms
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.38, 10), orangeMat);
    arm.position.set(side * 0.48, 0.9, 0.25);
    arm.rotation.z = side * -0.5;
    arm.rotation.x = 0.6;
    root.add(arm);
  }

  // Legs & Feet
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), orangeMat);
    leg.scale.set(0.9, 0.6, 1.6);
    leg.position.set(side * 0.35, 0.12, 0.15);
    root.add(leg);
  }

  // Curving Tail with Flame
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.5, -0.45);

  const tailMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.18, 0.9, 10), orangeMat);
  tailMesh.position.set(0, 0.35, -0.3);
  tailMesh.rotation.x = -1.0;
  tailGroup.add(tailMesh);

  const flame = createTailFlame(1.0);
  flame.position.set(0, 0.75, -0.65);
  tailGroup.add(flame);

  root.add(tailGroup);

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const bob = Math.sin(time * 3) * 0.04;
    root.position.y = bob;
    tailGroup.rotation.y = Math.sin(time * 3.5) * 0.25;
    tailGroup.rotation.x = Math.cos(time * 2.8) * 0.1;
    flame.userData.updateFlame(time);
  };

  return root;
}

export function createCharmeleonModel() {
  const root = new THREE.Group();
  const redMat = BaseBuilder.getMaterial(0xdc2626, 0.48, 0.05);
  const creamMat = BaseBuilder.getMaterial(0xfef3c7, 0.5, 0.05);

  // Muscular Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.75, 20, 18), redMat);
  body.scale.set(0.95, 1.3, 0.95);
  body.position.y = 0.95;
  root.add(body);

  // Pale Cream Belly
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.65, 18, 16), creamMat);
  belly.scale.set(0.75, 1.05, 0.25);
  belly.position.set(0, 0.9, 0.55);
  root.add(belly);

  // Head with Back Crest Horn
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 18), redMat);
  head.scale.set(1.0, 0.95, 1.25);
  head.position.set(0, 1.75, 0.15);
  root.add(head);

  // Prominent Horn on rear of head
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.65, 10), redMat);
  horn.position.set(0, 1.95, -0.45);
  horn.rotation.x = -0.9;
  root.add(horn);

  // Snout
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.32, 0.65), redMat);
  snout.position.set(0, 1.62, 0.6);
  root.add(snout);

  // Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.09, 0x0284c7, 0xffffff);
  leftEye.position.set(0.28, 1.8, 0.52);
  rightEye.position.set(-0.28, 1.8, 0.52);
  root.add(eyes);

  // Clawed Feet
  for (const side of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.26, 12, 10), redMat);
    foot.scale.set(0.9, 0.55, 1.6);
    foot.position.set(side * 0.42, 0.14, 0.2);
    root.add(foot);
  }

  // Tail with Larger Flame
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.65, -0.55);

  const tailMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.24, 1.2, 10), redMat);
  tailMesh.position.set(0, 0.45, -0.45);
  tailMesh.rotation.x = -1.1;
  tailGroup.add(tailMesh);

  const flame = createTailFlame(1.3);
  flame.position.set(0, 0.95, -0.95);
  tailGroup.add(flame);
  root.add(tailGroup);

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const bob = Math.sin(time * 2.8) * 0.04;
    root.position.y = bob;
    tailGroup.rotation.y = Math.sin(time * 3.2) * 0.3;
    flame.userData.updateFlame(time);
  };

  return root;
}

export function createCharizardModel() {
  const root = new THREE.Group();
  const orangeMat = BaseBuilder.getMaterial(0xea580c, 0.5, 0.05);
  const creamMat = BaseBuilder.getMaterial(0xfef3c7, 0.5, 0.05);
  const wingMat = BaseBuilder.getMaterial(0x0284c7, 0.4, 0.1);
  const hornMat = BaseBuilder.getMaterial(0xea580c, 0.4, 0.05);

  // Sturdy Dragon Torso
  const torso = new THREE.Mesh(new THREE.SphereGeometry(0.95, 24, 20), orangeMat);
  torso.scale.set(0.95, 1.35, 0.95);
  torso.position.y = 1.15;
  root.add(torso);

  // Cream Belly Plate
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.8, 20, 16), creamMat);
  belly.scale.set(0.8, 1.1, 0.25);
  belly.position.set(0, 1.05, 0.65);
  root.add(belly);

  // Long Draconic Neck & Head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, 0.75, 14), orangeMat);
  neck.position.set(0, 1.95, 0.25);
  neck.rotation.x = 0.2;
  root.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 18), orangeMat);
  head.scale.set(0.9, 0.85, 1.4);
  head.position.set(0, 2.35, 0.45);
  root.add(head);

  // Dual Swept Horns
  for (const side of [-1, 1]) {
    const horn = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.75, 10), hornMat);
    horn.position.set(side * 0.32, 2.7, 0.05);
    horn.rotation.x = -0.9;
    horn.rotation.z = side * -0.3;
    root.add(horn);
  }

  // Snout & Fangs
  const snout = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.7), orangeMat);
  snout.position.set(0, 2.2, 0.95);
  root.add(snout);

  // Teal Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.09, 0x06b6d4, 0xffffff);
  leftEye.position.set(0.28, 2.4, 0.75);
  rightEye.position.set(-0.28, 2.4, 0.75);
  root.add(eyes);

  // Massive Wings with Teal Inner Membrane
  const wings = [];
  for (const side of [-1, 1]) {
    const wingGroup = new THREE.Group();
    wingGroup.position.set(side * 0.4, 1.7, -0.2);

    // Wing Bone
    const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.6, 8), orangeMat);
    bone.position.set(side * 0.7, 0.6, 0);
    bone.rotation.z = side * -1.1;
    bone.rotation.y = side * 0.2;
    wingGroup.add(bone);

    // Membrane (Thin triangular box / plane)
    const membraneGeo = new THREE.CylinderGeometry(0.01, 1.1, 1.3, 3);
    const membrane = new THREE.Mesh(membraneGeo, wingMat);
    membrane.position.set(side * 0.85, 0.25, -0.05);
    membrane.rotation.z = side * -0.7;
    membrane.rotation.x = 0.2;
    wingGroup.add(membrane);

    root.add(wingGroup);
    wings.push({ wingGroup, side });
  }

  // Muscular Legs
  for (const side of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.SphereGeometry(0.35, 14, 12), orangeMat);
    leg.scale.set(0.9, 0.65, 1.8);
    leg.position.set(side * 0.55, 0.2, 0.2);
    root.add(leg);
  }

  // Tail with Majestic Flame
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.8, -0.7);

  const tailMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.32, 1.7, 12), orangeMat);
  tailMesh.position.set(0, 0.6, -0.6);
  tailMesh.rotation.x = -1.2;
  tailGroup.add(tailMesh);

  const flame = createTailFlame(1.8);
  flame.position.set(0, 1.25, -1.35);
  tailGroup.add(flame);
  root.add(tailGroup);

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    // Breathing dragon loop
    const breath = Math.sin(time * 2.2) * 0.05;
    root.position.y = breath;

    // Wing flapping
    const flap = Math.sin(time * 2.8) * 0.25;
    wings.forEach(({ wingGroup, side }) => {
      wingGroup.rotation.y = side * flap;
      wingGroup.rotation.z = Math.cos(time * 2.8) * 0.1 * side;
    });

    // Flame flicker
    tailGroup.rotation.y = Math.sin(time * 2.5) * 0.35;
    flame.userData.updateFlame(time);
  };

  return root;
}
