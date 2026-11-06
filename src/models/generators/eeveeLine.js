import * as THREE from 'three';
import { BaseBuilder } from '../BaseBuilder.js';

export function createEeveeModel() {
  const root = new THREE.Group();
  const brownMat = BaseBuilder.getMaterial(0x9a3412, 0.5, 0.05);
  const creamMat = BaseBuilder.getMaterial(0xfef3c7, 0.5, 0.05);

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 16), brownMat);
  body.scale.set(0.95, 0.85, 1.25);
  body.position.y = 0.55;
  root.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 18), brownMat);
  head.position.set(0, 0.95, 0.5);
  root.add(head);

  // Big Fox Ears with Dark Inners
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.75, 6), brownMat);
    ear.position.set(side * 0.42, 1.55, 0.35);
    ear.rotation.z = side * -0.55;
    ear.rotation.x = -0.2;
    root.add(ear);
  }

  // Large Warm Brown Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.09, 0x451a03, 0xffffff);
  leftEye.position.set(0.24, 1.05, 0.9);
  rightEye.position.set(-0.24, 1.05, 0.9);
  root.add(eyes);

  // Fluffy Cream Fur Collar Mane
  const collarGroup = new THREE.Group();
  collarGroup.position.set(0, 0.75, 0.4);
  for (let c = 0; c < 7; c++) {
    const ruff = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), creamMat);
    const ang = (c / 7) * Math.PI * 2;
    ruff.position.set(Math.cos(ang) * 0.45, (Math.random() - 0.5) * 0.08, Math.sin(ang) * 0.45);
    collarGroup.add(ruff);
  }
  root.add(collarGroup);

  // Bushy Cream & Brown Tail
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.6, -0.6);

  const tailBase = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 10), brownMat);
  tailBase.scale.set(0.8, 1.6, 0.8);
  tailBase.rotation.x = -0.9;
  tailGroup.add(tailBase);

  const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.55, 10), creamMat);
  tailTip.position.set(0, 0.45, -0.45);
  tailTip.rotation.x = -0.9;
  tailGroup.add(tailTip);

  root.add(tailGroup);

  // 4 Legs
  const legPositions = [
    [0.3, 0.22, 0.38],
    [-0.3, 0.22, 0.38],
    [0.3, 0.22, -0.38],
    [-0.3, 0.22, -0.38]
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.45, 8), brownMat);
    leg.position.set(x, y, z);
    root.add(leg);
  });

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const bob = Math.sin(time * 3.2) * 0.03;
    root.position.y = bob;
    tailGroup.rotation.y = Math.sin(time * 3.5) * 0.3;
  };

  return root;
}

export function createVaporeonModel() {
  const root = new THREE.Group();
  const cyanMat = BaseBuilder.getMaterial(0x0284c7, 0.45, 0.1);
  const finMat = BaseBuilder.getMaterial(0x38bdf8, 0.35, 0.1);
  const whiteMat = BaseBuilder.getMaterial(0xf0f9ff, 0.4, 0.05);

  // Sleek Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 16), cyanMat);
  body.scale.set(0.9, 0.85, 1.3);
  body.position.y = 0.55;
  root.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 18), cyanMat);
  head.position.set(0, 0.95, 0.5);
  root.add(head);

  // Fin Ears (Webbed)
  for (const side of [-1, 1]) {
    const fin = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.35, 0.75, 4), finMat);
    fin.position.set(side * 0.5, 1.25, 0.35);
    fin.rotation.z = side * -1.2;
    root.add(fin);
  }

  // White Webbed Neck Ruff
  const ruff = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.08, 8, 20), whiteMat);
  ruff.position.set(0, 0.75, 0.4);
  ruff.rotation.x = Math.PI / 2;
  root.add(ruff);

  // Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.09, 0x082f49, 0xffffff);
  leftEye.position.set(0.24, 1.05, 0.9);
  rightEye.position.set(-0.24, 1.05, 0.9);
  root.add(eyes);

  // Mermaid Fish Tail with Dual Fins
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.5, -0.6);

  const tailStem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 1.1, 10), cyanMat);
  tailStem.position.set(0, 0.15, -0.45);
  tailStem.rotation.x = -1.2;
  tailGroup.add(tailStem);

  // Fin Flukes
  for (const side of [-1, 1]) {
    const fluke = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.5), finMat);
    fluke.position.set(side * 0.25, 0.35, -1.0);
    fluke.rotation.y = side * 0.4;
    tailGroup.add(fluke);
  }

  root.add(tailGroup);

  // 4 Legs
  const legPositions = [
    [0.3, 0.22, 0.38],
    [-0.3, 0.22, 0.38],
    [0.3, 0.22, -0.38],
    [-0.3, 0.22, -0.38]
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.45, 8), cyanMat);
    leg.position.set(x, y, z);
    root.add(leg);
  });

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const wave = Math.sin(time * 2.8) * 0.04;
    root.position.y = wave;
    tailGroup.rotation.y = Math.sin(time * 3.5) * 0.4;
  };

  return root;
}

export function createJolteonModel() {
  const root = new THREE.Group();
  const yellowMat = BaseBuilder.getMaterial(0xca8a04, 0.45, 0.05);
  const whiteMat = BaseBuilder.getMaterial(0xf8fafc, 0.4, 0.05);

  // Slender Spiky Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 14), yellowMat);
  body.scale.set(0.9, 0.85, 1.25);
  body.position.y = 0.55;
  root.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 18, 16), yellowMat);
  head.position.set(0, 0.95, 0.5);
  root.add(head);

  // Spiky White Ruff Collar
  const collar = new THREE.Group();
  collar.position.set(0, 0.75, 0.4);
  for (let i = 0; i < 10; i++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 4), whiteMat);
    const ang = (i / 10) * Math.PI * 2;
    spike.position.set(Math.cos(ang) * 0.42, 0, Math.sin(ang) * 0.42);
    spike.rotation.z = Math.PI / 2;
    spike.rotation.y = -ang;
    collar.add(spike);
  }
  root.add(collar);

  // Tall Sharp Spiky Ears
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.8, 4), yellowMat);
    ear.position.set(side * 0.4, 1.6, 0.35);
    ear.rotation.z = side * -0.45;
    root.add(ear);
  }

  // Spikes on Rear Back & Rump
  for (let s = 0; s < 7; s++) {
    const rumpSpike = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.45, 4), whiteMat);
    const ang = (s / 7) * Math.PI;
    rumpSpike.position.set(Math.cos(ang) * 0.35, 0.75, -0.55 + Math.sin(ang) * 0.2);
    rumpSpike.rotation.x = -1.2;
    root.add(rumpSpike);
  }

  // Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.085, 0x1e1b4b, 0xffffff);
  leftEye.position.set(0.24, 1.05, 0.88);
  rightEye.position.set(-0.24, 1.05, 0.88);
  root.add(eyes);

  // 4 Slender Legs
  const legPositions = [
    [0.32, 0.24, 0.38],
    [-0.32, 0.24, 0.38],
    [0.32, 0.24, -0.38],
    [-0.32, 0.24, -0.38]
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.48, 8), yellowMat);
    leg.position.set(x, y, z);
    root.add(leg);
  });

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const twitch = Math.sin(time * 6) * 0.02;
    root.position.y = twitch;
  };

  return root;
}

export function createFlareonModel() {
  const root = new THREE.Group();
  const flameOrangeMat = BaseBuilder.getMaterial(0xc2410c, 0.48, 0.05);
  const fluffyYellowMat = BaseBuilder.getMaterial(0xfde047, 0.45, 0.05);

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 16), flameOrangeMat);
  body.scale.set(0.95, 0.85, 1.25);
  body.position.y = 0.55;
  root.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 18), flameOrangeMat);
  head.position.set(0, 0.95, 0.5);
  root.add(head);

  // Giant Billowing Cloud Mane
  const mane = new THREE.Group();
  mane.position.set(0, 0.78, 0.35);
  for (let i = 0; i < 9; i++) {
    const cloudBall = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), fluffyYellowMat);
    const ang = (i / 9) * Math.PI * 2;
    cloudBall.position.set(Math.cos(ang) * 0.45, (i % 2 === 0 ? 0.08 : -0.08), Math.sin(ang) * 0.45);
    mane.add(cloudBall);
  }
  root.add(mane);

  // Giant Billowing Cloud Tail
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.75, -0.65);
  for (let t = 0; t < 5; t++) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.28 + t * 0.04, 12, 10), fluffyYellowMat);
    puff.position.set(0, t * 0.16, -t * 0.14);
    tailGroup.add(puff);
  }
  root.add(tailGroup);

  // Ears
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.7, 6), flameOrangeMat);
    ear.position.set(side * 0.4, 1.5, 0.35);
    ear.rotation.z = side * -0.5;
    root.add(ear);
  }

  // Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.085, 0x451a03, 0xffffff);
  leftEye.position.set(0.24, 1.05, 0.88);
  rightEye.position.set(-0.24, 1.05, 0.88);
  root.add(eyes);

  // 4 Legs
  const legPositions = [
    [0.3, 0.22, 0.38],
    [-0.3, 0.22, 0.38],
    [0.3, 0.22, -0.38],
    [-0.3, 0.22, -0.38]
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.45, 8), flameOrangeMat);
    leg.position.set(x, y, z);
    root.add(leg);
  });

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const bob = Math.sin(time * 2.8) * 0.03;
    root.position.y = bob;
    tailGroup.rotation.y = Math.sin(time * 3) * 0.25;
  };

  return root;
}
