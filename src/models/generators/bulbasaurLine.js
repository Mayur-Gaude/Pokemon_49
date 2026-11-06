import * as THREE from 'three';
import { BaseBuilder } from '../BaseBuilder.js';

export function createBulbasaurModel() {
  const root = new THREE.Group();
  const tealMat = BaseBuilder.getMaterial(0x10b981, 0.5, 0.05);
  const darkTealMat = BaseBuilder.getMaterial(0x047857, 0.5, 0.05);
  const bulbGreenMat = BaseBuilder.getMaterial(0x22c55e, 0.45, 0.05);

  // Quadruped Torso
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 20, 16), tealMat);
  body.scale.set(1.1, 0.85, 1.25);
  body.position.y = 0.55;
  root.add(body);

  // Spots
  for (let i = 0; i < 4; i++) {
    const spot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.18), darkTealMat);
    const ang = (i / 4) * Math.PI * 2;
    spot.position.set(Math.cos(ang) * 0.45, 0.75, Math.sin(ang) * 0.4);
    spot.rotation.y = ang;
    root.add(spot);
  }

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 18), tealMat);
  head.scale.set(1.15, 0.95, 1.1);
  head.position.set(0, 0.8, 0.65);
  root.add(head);

  // Ears
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.35, 6), tealMat);
    ear.position.set(side * 0.45, 1.25, 0.55);
    ear.rotation.z = side * -0.4;
    ear.rotation.x = -0.2;
    root.add(ear);
  }

  // Red Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.08, 0xef4444, 0xffffff);
  leftEye.position.set(0.32, 0.9, 1.0);
  rightEye.position.set(-0.32, 0.9, 1.0);
  root.add(eyes);

  // 4 Stubby Legs with claws
  const legPositions = [
    [0.45, 0.25, 0.45],
    [-0.45, 0.25, 0.45],
    [0.45, 0.25, -0.45],
    [-0.45, 0.25, -0.45]
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.45, 10), tealMat);
    leg.position.set(x, y, z);
    root.add(leg);
  });

  // Green Plant Bulb on Back
  const bulbGroup = new THREE.Group();
  bulbGroup.position.set(0, 0.95, -0.15);

  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), bulbGreenMat);
  bulb.scale.set(0.9, 1.25, 0.9);
  bulbGroup.add(bulb);

  // Bulb Point Tip
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.45, 8), bulbGreenMat);
  tip.position.y = 0.45;
  bulbGroup.add(tip);

  root.add(bulbGroup);

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const breathe = Math.sin(time * 3) * 0.03;
    root.position.y = breathe;
    bulbGroup.scale.set(1 + breathe * 0.5, 1 - breathe * 0.3, 1 + breathe * 0.5);
  };

  return root;
}

export function createIvysaurModel() {
  const root = new THREE.Group();
  const tealMat = BaseBuilder.getMaterial(0x059669, 0.5, 0.05);
  const pinkBudMat = BaseBuilder.getMaterial(0xec4899, 0.4, 0.05);
  const leafMat = BaseBuilder.getMaterial(0x15803d, 0.45, 0.05);

  // Sturdier Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.8, 20, 16), tealMat);
  body.scale.set(1.15, 0.85, 1.3);
  body.position.y = 0.65;
  root.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.65, 20, 18), tealMat);
  head.scale.set(1.15, 0.9, 1.15);
  head.position.set(0, 0.95, 0.75);
  root.add(head);

  // Ears
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 6), tealMat);
    ear.position.set(side * 0.52, 1.45, 0.65);
    ear.rotation.z = side * -0.4;
    root.add(ear);
  }

  // Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.09, 0x3b82f6, 0xffffff);
  leftEye.position.set(0.38, 1.05, 1.2);
  rightEye.position.set(-0.38, 1.05, 1.2);
  root.add(eyes);

  // 4 Legs
  const legPositions = [
    [0.55, 0.3, 0.55],
    [-0.55, 0.3, 0.55],
    [0.55, 0.3, -0.55],
    [-0.55, 0.3, -0.55]
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.55, 10), tealMat);
    leg.position.set(x, y, z);
    root.add(leg);
  });

  // Blooming Flower Bud & 4 Broad Leaves
  const budGroup = new THREE.Group();
  budGroup.position.set(0, 1.15, -0.15);

  // 4 Leaves spreading outwards
  for (let i = 0; i < 4; i++) {
    const leaf = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.3, 0.9, 4), leafMat);
    leaf.rotation.z = Math.PI / 2.5;
    leaf.rotation.y = (i * Math.PI) / 2;
    leaf.position.y = 0.05;
    budGroup.add(leaf);
  }

  // Pink Flower Bud
  const bud = new THREE.Mesh(new THREE.SphereGeometry(0.48, 16, 16), pinkBudMat);
  bud.scale.set(0.9, 1.3, 0.9);
  bud.position.y = 0.4;
  budGroup.add(bud);

  root.add(budGroup);

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const breathe = Math.sin(time * 2.8) * 0.04;
    root.position.y = breathe;
    budGroup.rotation.y = time * 0.2;
  };

  return root;
}

export function createVenusaurModel() {
  const root = new THREE.Group();
  const bodyMat = BaseBuilder.getMaterial(0x047857, 0.55, 0.05);
  const petalMat = BaseBuilder.getMaterial(0xf43f5e, 0.4, 0.05);
  const pollenMat = BaseBuilder.getMaterial(0xfacc15, 0.3, 0.1, 0xfacc15, 0.4);
  const frondMat = BaseBuilder.getMaterial(0x15803d, 0.5, 0.05);
  const trunkMat = BaseBuilder.getMaterial(0x78350f, 0.6, 0.05);

  // Massive Quadruped Torso
  const body = new THREE.Mesh(new THREE.SphereGeometry(1.2, 24, 20), bodyMat);
  body.scale.set(1.25, 0.8, 1.4);
  body.position.y = 0.8;
  root.add(body);

  // Head with Wide Jaws & Fangs
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.9, 22, 18), bodyMat);
  head.scale.set(1.2, 0.8, 1.25);
  head.position.set(0, 1.05, 1.1);
  root.add(head);

  // Wide Red Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.12, 0xdc2626, 0xffffff);
  leftEye.position.set(0.55, 1.2, 1.6);
  rightEye.position.set(-0.55, 1.2, 1.6);
  root.add(eyes);

  // 4 Heavy Columnar Legs
  const legPositions = [
    [0.85, 0.45, 0.8],
    [-0.85, 0.45, 0.8],
    [0.85, 0.45, -0.8],
    [-0.85, 0.45, -0.8]
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.38, 0.85, 12), bodyMat);
    leg.position.set(x, y, z);
    root.add(leg);
  });

  // Giant Blossomed Tropical Palm Flower on Back
  const flowerGroup = new THREE.Group();
  flowerGroup.position.set(0, 1.35, -0.2);

  // Palm Trunk Stem
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.8, 12), trunkMat);
  trunk.position.y = 0.35;
  flowerGroup.add(trunk);

  // 6 Giant Radiating Palm Fronds
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2;
    const frond = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 1.4), frondMat);
    frond.position.set(Math.sin(angle) * 0.75, 0.7, Math.cos(angle) * 0.75);
    frond.rotation.y = angle;
    frond.rotation.x = 0.25;
    flowerGroup.add(frond);
  }

  // Giant 6-Petaled Tropical Flower
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2 + 0.5;
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.48, 12, 8), petalMat);
    petal.scale.set(0.9, 0.15, 1.4);
    petal.position.set(Math.sin(angle) * 0.8, 0.95, Math.cos(angle) * 0.8);
    petal.rotation.y = angle;
    petal.rotation.x = 0.15;
    flowerGroup.add(petal);
  }

  // Giant Glowing Yellow Center Stamen
  const pollen = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.25, 0.28, 16), pollenMat);
  pollen.position.y = 1.0;
  flowerGroup.add(pollen);

  root.add(flowerGroup);

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const breathe = Math.sin(time * 2) * 0.03;
    root.position.y = breathe;
    flowerGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
  };

  return root;
}
