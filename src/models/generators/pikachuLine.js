import * as THREE from 'three';
import { BaseBuilder } from '../BaseBuilder.js';

export function createPikachuModel() {
  const root = new THREE.Group();

  // Yellow Body & Head (stylized unified proportions)
  const bodyGeo = new THREE.SphereGeometry(0.7, 24, 20);
  bodyGeo.scale(0.85, 1.1, 0.85);
  const yellowMat = BaseBuilder.getMaterial(0xfacc15, 0.45, 0.05);
  const body = new THREE.Mesh(bodyGeo, yellowMat);
  body.position.y = 0.85;
  root.add(body);

  // Brown stripes on the back
  const stripeMat = BaseBuilder.getMaterial(0x78350f, 0.5, 0.05);
  for (let i = 0; i < 2; i++) {
    const stripeGeo = new THREE.BoxGeometry(0.5, 0.09, 0.15);
    const stripe = new THREE.Mesh(stripeGeo, stripeMat);
    stripe.position.set(0, 0.85 + (i * 0.22), -0.55);
    root.add(stripe);
  }

  // Head Ears (Cylinders with angled black tips)
  const earMat = BaseBuilder.getMaterial(0xfacc15, 0.45, 0.05);
  const tipMat = BaseBuilder.getMaterial(0x18181b, 0.4, 0.1);

  const earL = new THREE.Group();
  const earGeo = new THREE.CylinderGeometry(0.06, 0.12, 0.65, 12);
  const earMeshL = new THREE.Mesh(earGeo, earMat);
  const tipGeo = new THREE.ConeGeometry(0.09, 0.35, 12);
  const tipMeshL = new THREE.Mesh(tipGeo, tipMat);
  tipMeshL.position.y = 0.42;
  earL.add(earMeshL, tipMeshL);
  earL.position.set(0.38, 1.55, 0);
  earL.rotation.z = -0.55;
  earL.rotation.x = -0.1;
  root.add(earL);

  const earR = new THREE.Group();
  const earMeshR = new THREE.Mesh(earGeo, earMat);
  const tipMeshR = new THREE.Mesh(tipGeo, tipMat);
  tipMeshR.position.y = 0.42;
  earR.add(earMeshR, tipMeshR);
  earR.position.set(-0.38, 1.55, 0);
  earR.rotation.z = 0.55;
  earR.rotation.x = -0.1;
  root.add(earR);

  // Red Sphere Cheeks
  const { group: cheeks, left: cheekL, right: cheekR } = BaseBuilder.createCheeks(0.14, 0xef4444);
  cheekL.position.set(0.42, 0.95, 0.48);
  cheekR.position.set(-0.42, 0.95, 0.48);
  root.add(cheeks);

  // Eyes & Nose & Mouth
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.08, 0x18181b, 0xffffff, true);
  leftEye.position.set(0.24, 1.15, 0.54);
  rightEye.position.set(-0.24, 1.15, 0.54);
  root.add(eyes);

  const noseGeo = new THREE.SphereGeometry(0.03, 8, 8);
  const nose = new THREE.Mesh(noseGeo, tipMat);
  nose.position.set(0, 1.05, 0.59);
  root.add(nose);

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.38, 10);
  const armL = new THREE.Mesh(armGeo, yellowMat);
  armL.position.set(0.45, 0.75, 0.3);
  armL.rotation.z = -0.4;
  armL.rotation.x = 0.5;

  const armR = new THREE.Mesh(armGeo, yellowMat);
  armR.position.set(-0.45, 0.75, 0.3);
  armR.rotation.z = 0.4;
  armR.rotation.x = 0.5;
  root.add(armL, armR);

  // Feet
  const footGeo = new THREE.SphereGeometry(0.16, 12, 10);
  footGeo.scale(0.8, 0.5, 1.6);
  const footL = new THREE.Mesh(footGeo, yellowMat);
  footL.position.set(0.28, 0.1, 0.1);
  const footR = footL.clone();
  footR.position.set(-0.28, 0.1, 0.1);
  root.add(footL, footR);

  // Flat Zigzag Tail Mesh (Iconic Lightning Shape)
  const tailBase = new THREE.Group();
  tailBase.position.set(0, 0.45, -0.55);

  const brownBase = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.04), BaseBuilder.getMaterial(0x78350f));
  brownBase.rotation.x = -0.6;
  tailBase.add(brownBase);

  const zigzag = BaseBuilder.createZigzagMesh(4, 0.22, 0.04, 0xfacc15);
  zigzag.position.set(0, 0.15, -0.05);
  zigzag.rotation.x = 0.25;
  tailBase.add(zigzag);
  root.add(tailBase);

  BaseBuilder.enableShadows(root);

  // Animation Update
  root.userData.update = (delta, time) => {
    // Subtle breathing / bouncing idle loop
    const bounce = Math.sin(time * 3.5) * 0.05;
    root.position.y = bounce;

    // Subtle squash & stretch
    body.scale.set(0.85 + bounce * 0.3, 1.1 - bounce * 0.4, 0.85 + bounce * 0.3);

    // Tail wagging
    tailBase.rotation.y = Math.sin(time * 4) * 0.28;
    tailBase.rotation.z = Math.cos(time * 3) * 0.1;

    // Ear twitches
    earL.rotation.z = -0.55 + Math.sin(time * 3) * 0.08;
    earR.rotation.z = 0.55 + Math.cos(time * 3.2) * 0.08;
  };

  return root;
}

export function createPichuModel() {
  const root = new THREE.Group();
  const paleYellowMat = BaseBuilder.getMaterial(0xfef08a, 0.5, 0.05);
  const blackMat = BaseBuilder.getMaterial(0x18181b, 0.4, 0.1);

  // Petite Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 16), paleYellowMat);
  body.position.y = 0.55;
  root.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 18), paleYellowMat);
  head.position.y = 1.05;
  root.add(head);

  // Black Neck Collar
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.35, 0.05, 8, 16), blackMat);
  collar.position.y = 0.78;
  collar.rotation.x = Math.PI / 2;
  root.add(collar);

  // Huge Diamond/Cone Ears with Black Borders
  for (const side of [-1, 1]) {
    const ear = new THREE.Group();
    const earInner = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.75, 5), paleYellowMat);
    const earEdge = new THREE.Mesh(new THREE.ConeGeometry(0.23, 0.8, 5), blackMat);
    earEdge.position.y = -0.02;
    earInner.position.y = 0;
    ear.add(earEdge, earInner);
    ear.position.set(side * 0.45, 1.55, 0);
    ear.rotation.z = side * -0.65;
    root.add(ear);
  }

  // Pink Cheeks
  const { group: cheeks, left: cheekL, right: cheekR } = BaseBuilder.createCheeks(0.1, 0xf43f5e);
  cheekL.position.set(0.32, 0.98, 0.35);
  cheekR.position.set(-0.32, 0.98, 0.35);
  root.add(cheeks);

  // Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.075, 0x18181b, 0xffffff);
  leftEye.position.set(0.18, 1.1, 0.42);
  rightEye.position.set(-0.18, 1.1, 0.42);
  root.add(eyes);

  // Tiny Tail
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.18, 0.04), blackMat);
  tail.position.set(0, 0.45, -0.4);
  root.add(tail);

  // Tiny Feet
  const footL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), paleYellowMat);
  footL.scale.set(0.8, 0.4, 1.3);
  footL.position.set(0.18, 0.08, 0.05);
  const footR = footL.clone();
  footR.position.set(-0.18, 0.08, 0.05);
  root.add(footL, footR);

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const hop = Math.abs(Math.sin(time * 5)) * 0.08;
    root.position.y = hop;
    head.rotation.y = Math.sin(time * 2) * 0.15;
  };

  return root;
}

export function createRaichuModel() {
  const root = new THREE.Group();
  const orangeMat = BaseBuilder.getMaterial(0xd97706, 0.45, 0.05);
  const whiteMat = BaseBuilder.getMaterial(0xfef9c3, 0.45, 0.05);
  const brownMat = BaseBuilder.getMaterial(0x78350f, 0.45, 0.05);
  const goldMat = BaseBuilder.getMaterial(0xf59e0b, 0.3, 0.2, 0xf59e0b, 0.4);

  // Stouter Torso
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 20), orangeMat);
  body.scale.set(1, 1.25, 0.95);
  body.position.y = 1.0;
  root.add(body);

  // White Belly
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.68, 20, 16), whiteMat);
  belly.scale.set(0.85, 1.05, 0.3);
  belly.position.set(0, 0.95, 0.65);
  root.add(belly);

  // Spiral Curl Ears
  for (const side of [-1, 1]) {
    const earGroup = new THREE.Group();
    const earBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.16, 0.6, 12), brownMat);
    const curl = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 8, 16, Math.PI * 1.3), goldMat);
    curl.position.set(side * 0.18, 0.35, 0);
    curl.rotation.z = side * 0.4;
    earGroup.add(earBase, curl);
    earGroup.position.set(side * 0.6, 1.85, 0);
    earGroup.rotation.z = side * -0.5;
    root.add(earGroup);
  }

  // Yellow Cheeks
  const { group: cheeks, left: cheekL, right: cheekR } = BaseBuilder.createCheeks(0.16, 0xfacc15);
  cheekL.position.set(0.48, 1.25, 0.58);
  cheekR.position.set(-0.48, 1.25, 0.58);
  root.add(cheeks);

  // Eyes
  const { group: eyes, leftEye, rightEye } = BaseBuilder.createEyes(0.09, 0x18181b, 0xffffff);
  leftEye.position.set(0.28, 1.4, 0.65);
  rightEye.position.set(-0.28, 1.4, 0.65);
  root.add(eyes);

  // Feet (brown & white paws)
  for (const side of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 10), orangeMat);
    foot.scale.set(0.8, 0.5, 1.8);
    foot.position.set(side * 0.42, 0.15, 0.2);
    root.add(foot);
  }

  // Long whip tail with giant lightning bolt
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.5, -0.7);

  // Thin whip cord
  const whipGeo = new THREE.CylinderGeometry(0.025, 0.03, 1.8, 8);
  const whip = new THREE.Mesh(whipGeo, brownMat);
  whip.position.set(0, 0.9, -0.2);
  whip.rotation.x = -0.5;
  whip.rotation.z = 0.2;
  tailGroup.add(whip);

  // Giant Lightning Blade Tip
  const boltTip = new THREE.Group();
  const blade1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.5, 0.04), goldMat);
  const blade2 = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.6, 4), goldMat);
  blade2.position.set(0.12, 0.35, 0);
  blade2.rotation.z = -0.4;
  boltTip.add(blade1, blade2);
  boltTip.position.set(0.2, 1.8, -0.6);
  boltTip.rotation.z = 0.3;
  tailGroup.add(boltTip);

  root.add(tailGroup);

  BaseBuilder.enableShadows(root);

  root.userData.update = (delta, time) => {
    const bob = Math.sin(time * 3) * 0.04;
    root.position.y = bob;
    tailGroup.rotation.y = Math.sin(time * 2.5) * 0.3;
    tailGroup.rotation.z = Math.cos(time * 2.5) * 0.15;
  };

  return root;
}
