import * as THREE from 'three';
import { BaseBuilder } from '../BaseBuilder.js';

export function createGastlyModel() {
  const root = new THREE.Group();
  const blackMat = BaseBuilder.getMaterial(0x18181b, 0.4, 0.2);
  const purpleGasMat = BaseBuilder.getMaterial(0xa855f7, 0.1, 0.1, 0x9333ea, 0.7);
  purpleGasMat.transparent = true;
  purpleGasMat.opacity = 0.65;

  // Solid dark core
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.7, 24, 20), blackMat);
  core.position.y = 1.0;
  root.add(core);

  // Large White Fanged Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.18, 0x18181b, 0xffffff);
  leftEye.position.set(0.28, 1.15, 0.55);
  leftEye.scale.set(1.2, 1.2, 0.4);
  rightEye.position.set(-0.28, 1.15, 0.55);
  rightEye.scale.set(1.2, 1.2, 0.4);
  root.add(eyes);

  // Pink Open Mouth with two fangs
  const mouthMat = BaseBuilder.getMaterial(0xec4899, 0.3, 0.1);
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), mouthMat);
  mouth.scale.set(1.2, 0.6, 0.3);
  mouth.position.set(0, 0.85, 0.65);
  root.add(mouth);

  // Swirling Ethereal Purple Gas Spheres
  const gasOrbs = [];
  const gasCount = 14;
  for (let i = 0; i < gasCount; i++) {
    const r = 0.2 + Math.random() * 0.25;
    const orb = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), purpleGasMat);
    const orbitRadius = 0.9 + Math.random() * 0.4;
    const speed = 1.5 + Math.random() * 2;
    const phase = Math.random() * Math.PI * 2;
    const yOffset = (Math.random() - 0.5) * 0.9;

    root.add(orb);
    gasOrbs.push({ orb, orbitRadius, speed, phase, yOffset });
  }

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    // Ethereal floating levitation
    root.position.y = Math.sin(time * 2) * 0.12;

    gasOrbs.forEach(({ orb, orbitRadius, speed, phase, yOffset }) => {
      const angle = time * speed + phase;
      orb.position.set(
        Math.cos(angle) * orbitRadius,
        1.0 + yOffset + Math.sin(time * 3 + phase) * 0.15,
        Math.sin(angle) * orbitRadius
      );
    });
  };

  return root;
}

export function createHaunterModel() {
  const root = new THREE.Group();
  const purpleMat = BaseBuilder.getMaterial(0x581c87, 0.45, 0.05);

  // Jagged Spiky Head/Torso
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.75, 20, 18), purpleMat);
  head.scale.set(1.1, 1.0, 0.9);
  head.position.y = 1.2;
  root.add(head);

  // Spikes on head sides
  for (const side of [-1, 1]) {
    for (let s = 0; s < 3; s++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.6, 6), purpleMat);
      spike.position.set(side * (0.65 + s * 0.15), 1.4 - s * 0.25, -s * 0.1);
      spike.rotation.z = side * (-1.0 - s * 0.2);
      root.add(spike);
    }
  }

  // Menacing Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.15, 0x18181b, 0xffffff);
  leftEye.position.set(0.3, 1.3, 0.6);
  leftEye.rotation.z = -0.3;
  rightEye.position.set(-0.3, 1.3, 0.6);
  rightEye.rotation.z = 0.3;
  root.add(eyes);

  // Wide Devilish Grin
  const mouthMat = BaseBuilder.getMaterial(0xec4899, 0.3, 0.1);
  const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.18, 0.1), mouthMat);
  mouth.position.set(0, 0.95, 0.7);
  root.add(mouth);

  // Floating Disembodied Claw Hands
  const hands = [];
  for (const side of [-1, 1]) {
    const handGroup = new THREE.Group();
    handGroup.position.set(side * 1.25, 1.0, 0.4);

    // Palm
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), purpleMat);
    palm.scale.set(1, 0.7, 1);
    handGroup.add(palm);

    // 3 Sharp Claws
    for (let c = -1; c <= 1; c++) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.25, 6), purpleMat);
      claw.position.set(c * 0.1, 0.05, 0.2);
      claw.rotation.x = Math.PI / 2.2;
      claw.rotation.z = -c * 0.2;
      handGroup.add(claw);
    }

    root.add(handGroup);
    hands.push({ handGroup, side });
  }

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    // Floating levitation
    root.position.y = Math.sin(time * 2.2) * 0.1;

    // Disembodied hands independent floating
    hands.forEach(({ handGroup, side }, idx) => {
      handGroup.position.y = 1.0 + Math.sin(time * 3 + idx * 1.5) * 0.15;
      handGroup.position.x = side * (1.25 + Math.cos(time * 2 + idx) * 0.1);
      handGroup.rotation.z = Math.sin(time * 2.5 + idx) * 0.2 * side;
    });
  };

  return root;
}

export function createGengarModel() {
  const root = new THREE.Group();
  const purpleMat = BaseBuilder.getMaterial(0x3b0764, 0.48, 0.05);
  const redEyeMat = BaseBuilder.getMaterial(0xdc2626, 0.2, 0.2, 0xdc2626, 0.6);
  const toothMat = BaseBuilder.getMaterial(0xffffff, 0.2, 0.1);

  // Chubby Torso & Head
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.95, 24, 20), purpleMat);
  body.scale.set(1.05, 1.15, 0.95);
  body.position.y = 1.0;
  root.add(body);

  // Spikes on back & head crest
  for (let r = 0; r < 5; r++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 6), purpleMat);
    spike.position.set((r - 2) * 0.25, 1.8 - Math.abs(r - 2) * 0.12, -0.3);
    spike.rotation.x = -0.5;
    root.add(spike);
  }

  // Pointed Ears
  for (const side of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.6, 6), purpleMat);
    ear.position.set(side * 0.65, 1.9, -0.1);
    ear.rotation.z = side * -0.5;
    ear.rotation.x = -0.3;
    root.add(ear);
  }

  // Sinister Red Eyes
  for (const side of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), redEyeMat);
    eye.scale.set(1.1, 0.8, 0.3);
    eye.position.set(side * 0.38, 1.25, 0.85);
    eye.rotation.z = side * -0.3;
    root.add(eye);
  }

  // Huge Toothy Grin
  const smileGroup = new THREE.Group();
  smileGroup.position.set(0, 0.85, 0.92);

  // Mouth base
  const mouthBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.28, 0.08), BaseBuilder.getMaterial(0x18181b));
  smileGroup.add(mouthBase);

  // Individual White Teeth
  for (let t = -3; t <= 3; t++) {
    const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.04), toothMat);
    tooth.position.set(t * 0.11, 0.06, 0.04);
    smileGroup.add(tooth);

    const bTooth = tooth.clone();
    bTooth.position.y = -0.06;
    smileGroup.add(bTooth);
  }
  root.add(smileGroup);

  // Stubby Arms & Legs
  for (const side of [-1, 1]) {
    const arm = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.5, 8), purpleMat);
    arm.position.set(side * 0.95, 0.95, 0.2);
    arm.rotation.z = side * -1.2;
    root.add(arm);

    const leg = new THREE.Mesh(new THREE.SphereGeometry(0.25, 10, 8), purpleMat);
    leg.scale.set(0.8, 0.6, 1.4);
    leg.position.set(side * 0.45, 0.15, 0.15);
    root.add(leg);
  }

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const bounce = Math.sin(time * 3) * 0.04;
    root.position.y = bounce;
    smileGroup.scale.set(1 + Math.sin(time * 2) * 0.05, 1, 1);
  };

  return root;
}
