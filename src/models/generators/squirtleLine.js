import * as THREE from 'three';
import { BaseBuilder } from '../BaseBuilder.js';

export function createSquirtleModel() {
  const root = new THREE.Group();
  const blueMat = BaseBuilder.getMaterial(0x38bdf8, 0.48, 0.05);
  const shellMat = BaseBuilder.getMaterial(0x92400e, 0.45, 0.05);
  const bellyMat = BaseBuilder.getMaterial(0xfef3c7, 0.45, 0.05);
  const rimMat = BaseBuilder.getMaterial(0xf8fafc, 0.4, 0.05);

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 16), blueMat);
  body.scale.set(0.9, 1.15, 0.85);
  body.position.y = 0.75;
  root.add(body);

  // Carapace Back Shell
  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.68, 18, 16), shellMat);
  shell.scale.set(0.9, 1.2, 0.5);
  shell.position.set(0, 0.8, -0.3);
  root.add(shell);

  // Shell Rim
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.08, 8, 20), rimMat);
  rim.position.set(0, 0.8, -0.05);
  rim.scale.set(0.9, 1.15, 1);
  root.add(rim);

  // Front Cream Plastron Belly
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.55, 16, 14), bellyMat);
  belly.scale.set(0.85, 1.1, 0.2);
  belly.position.set(0, 0.75, 0.45);
  root.add(belly);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.52, 20, 18), blueMat);
  head.position.set(0, 1.45, 0.1);
  root.add(head);

  // Reddish Brown Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.08, 0x991b1b, 0xffffff);
  leftEye.position.set(0.24, 1.5, 0.45);
  rightEye.position.set(-0.24, 1.5, 0.45);
  root.add(eyes);

  // Arms & Feet
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.35, 8), blueMat);
    arm.position.set(side * 0.48, 0.85, 0.2);
    arm.rotation.z = side * -0.5;
    root.add(arm);

    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), blueMat);
    foot.scale.set(0.8, 0.5, 1.4);
    foot.position.set(side * 0.3, 0.12, 0.1);
    root.add(foot);
  }

  // Curled Tail
  const tail = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.08, 8, 16, Math.PI * 1.4), blueMat);
  tail.position.set(0, 0.4, -0.6);
  tail.rotation.y = Math.PI / 2;
  root.add(tail);

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const bob = Math.sin(time * 3) * 0.04;
    root.position.y = bob;
    tail.rotation.x = Math.sin(time * 3.5) * 0.2;
  };

  return root;
}

export function createWartortleModel() {
  const root = new THREE.Group();
  const indigoMat = BaseBuilder.getMaterial(0x0284c7, 0.48, 0.05);
  const shellMat = BaseBuilder.getMaterial(0x78350f, 0.45, 0.05);
  const bellyMat = BaseBuilder.getMaterial(0xfef3c7, 0.45, 0.05);
  const earMat = BaseBuilder.getMaterial(0xe0f2fe, 0.4, 0.05);

  // Torso & Shell
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 16), indigoMat);
  body.scale.set(0.9, 1.2, 0.85);
  body.position.y = 0.9;
  root.add(body);

  const shell = new THREE.Mesh(new THREE.SphereGeometry(0.78, 18, 16), shellMat);
  shell.scale.set(0.95, 1.25, 0.5);
  shell.position.set(0, 0.95, -0.35);
  root.add(shell);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 14), bellyMat);
  belly.scale.set(0.85, 1.15, 0.2);
  belly.position.set(0, 0.9, 0.55);
  root.add(belly);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.58, 20, 18), indigoMat);
  head.position.set(0, 1.7, 0.15);
  root.add(head);

  // Feathered Wing Ears
  for (const side of [-1, 1]) {
    const earGroup = new THREE.Group();
    for (let f = 0; f < 3; f++) {
      const feather = new THREE.Mesh(new THREE.ConeGeometry(0.12 - f * 0.02, 0.65 - f * 0.1, 6), earMat);
      feather.position.set(side * (f * 0.08), f * 0.12, -f * 0.08);
      feather.rotation.z = side * -0.7 - f * 0.15;
      earGroup.add(feather);
    }
    earGroup.position.set(side * 0.45, 1.95, 0.05);
    root.add(earGroup);
  }

  // Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.085, 0x7f1d1d, 0xffffff);
  leftEye.position.set(0.26, 1.75, 0.55);
  rightEye.position.set(-0.26, 1.75, 0.55);
  root.add(eyes);

  // Swirling Fluffy Wave Cloud Tail
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.65, -0.6);
  for (let c = 0; c < 5; c++) {
    const cloud = new THREE.Mesh(new THREE.SphereGeometry(0.22 - c * 0.02, 12, 10), earMat);
    cloud.position.set(0, c * 0.18, -c * 0.18);
    tailGroup.add(cloud);
  }
  root.add(tailGroup);

  // Feet
  for (const side of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), indigoMat);
    foot.scale.set(0.85, 0.5, 1.5);
    foot.position.set(side * 0.35, 0.14, 0.15);
    root.add(foot);
  }

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const bob = Math.sin(time * 2.8) * 0.04;
    root.position.y = bob;
    tailGroup.rotation.y = Math.sin(time * 3) * 0.3;
  };

  return root;
}

export function createBlastoiseModel() {
  const root = new THREE.Group();
  const indigoMat = BaseBuilder.getMaterial(0x0369a1, 0.5, 0.05);
  const shellMat = BaseBuilder.getMaterial(0x573412, 0.45, 0.05);
  const bellyMat = BaseBuilder.getMaterial(0xfef3c7, 0.45, 0.05);
  const cannonMat = BaseBuilder.getMaterial(0x94a3b8, 0.2, 0.7); // Metallic steel
  const rimMat = BaseBuilder.getMaterial(0xf8fafc, 0.4, 0.05);

  // Heavyweight Torso
  const body = new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 20), indigoMat);
  body.scale.set(1.1, 1.25, 0.95);
  body.position.y = 1.15;
  root.add(body);

  // Huge Shell
  const shell = new THREE.Mesh(new THREE.SphereGeometry(1.2, 22, 18), shellMat);
  shell.scale.set(1.1, 1.25, 0.55);
  shell.position.set(0, 1.2, -0.45);
  root.add(shell);

  // White Shell Rim
  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.12, 8, 24), rimMat);
  rim.position.set(0, 1.2, -0.1);
  rim.scale.set(1.05, 1.2, 1);
  root.add(rim);

  // Cream Belly
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.9, 18, 16), bellyMat);
  belly.scale.set(0.9, 1.15, 0.22);
  belly.position.set(0, 1.15, 0.75);
  root.add(belly);

  // Head with determined brow
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 20, 18), indigoMat);
  head.scale.set(1.05, 0.95, 1.1);
  head.position.set(0, 2.15, 0.35);
  root.add(head);

  // Triangular Shell Ears
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 6), shellMat);
    ear.position.set(side * 0.55, 2.5, 0.2);
    ear.rotation.z = side * -0.5;
    root.add(ear);
  }

  // Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.1, 0x854d0e, 0xffffff);
  leftEye.position.set(0.32, 2.2, 0.85);
  rightEye.position.set(-0.32, 2.2, 0.85);
  root.add(eyes);

  // Twin Shoulder Water Cannons (Metallic Hydraulics)
  const cannons = [];
  for (const side of [-1, 1]) {
    const cannonGroup = new THREE.Group();
    cannonGroup.position.set(side * 0.9, 2.25, -0.3);

    // Swivel Base
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.25, 12), cannonMat);
    base.rotation.z = Math.PI / 2;
    cannonGroup.add(base);

    // Long Barrel
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.1, 14), cannonMat);
    barrel.position.set(0, 0.4, 0.2);
    barrel.rotation.x = 0.55;
    barrel.rotation.z = side * -0.2;
    cannonGroup.add(barrel);

    // Muzzle Rim
    const muzzle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.04, 8, 16), cannonMat);
    muzzle.position.set(0, 0.9, 0.55);
    muzzle.rotation.x = 0.55;
    cannonGroup.add(muzzle);

    root.add(cannonGroup);
    cannons.push(cannonGroup);
  }

  // Thick Columnar Feet
  for (const side of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.5, 12), indigoMat);
    foot.position.set(side * 0.65, 0.25, 0.25);
    root.add(foot);
  }

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const breathe = Math.sin(time * 2.5) * 0.03;
    root.position.y = breathe;

    // Cannon slight recoil / idle aiming
    cannons.forEach((c, idx) => {
      c.rotation.x = Math.sin(time * 2 + idx) * 0.06;
    });
  };

  return root;
}
