import * as THREE from 'three';
import { createPikachuModel, createPichuModel, createRaichuModel } from './generators/pikachuLine.js';
import { createCharmanderModel, createCharmeleonModel, createCharizardModel } from './generators/charmanderLine.js';
import { createBulbasaurModel, createIvysaurModel, createVenusaurModel } from './generators/bulbasaurLine.js';
import { createSquirtleModel, createWartortleModel, createBlastoiseModel } from './generators/squirtleLine.js';
import { createGastlyModel, createHaunterModel, createGengarModel } from './generators/gastlyLine.js';
import { createEeveeModel, createVaporeonModel, createJolteonModel, createFlareonModel } from './generators/eeveeLine.js';

const GENERATORS = {
  // Pikachu
  pichu: createPichuModel,
  pikachu: createPikachuModel,
  raichu: createRaichuModel,

  // Charmander
  charmander: createCharmanderModel,
  charmeleon: createCharmeleonModel,
  charizard: createCharizardModel,

  // Bulbasaur
  bulbasaur: createBulbasaurModel,
  ivysaur: createIvysaurModel,
  venusaur: createVenusaurModel,

  // Squirtle
  squirtle: createSquirtleModel,
  wartortle: createWartortleModel,
  blastoise: createBlastoiseModel,

  // Gastly
  gastly: createGastlyModel,
  haunter: createHaunterModel,
  gengar: createGengarModel,

  // Eevee
  eevee: createEeveeModel,
  vaporeon: createVaporeonModel,
  jolteon: createJolteonModel,
  flareon: createFlareonModel
};

export class ModelFactory {
  static hasModel(modelKey) {
    if (!modelKey) return false;
    return !!GENERATORS[modelKey.toLowerCase()];
  }

  /**
   * Instantiates the realistic procedural 3D model for the given key
   */
  static create(modelKey) {
    const key = modelKey ? modelKey.toLowerCase() : '';
    const generator = GENERATORS[key];
    if (!generator) {
      console.warn(`No generator found for ${modelKey}`);
      return null;
    }

    const model = generator();

    // Auto-center and rest exactly upon the pedestal platform
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    // Adjust y so lowest point touches pedestal (y = 0)
    model.position.y = -box.min.y;

    return model;
  }

  /**
   * Toggle wireframe / holographic blueprint aesthetic
   */
  static setWireframe(obj, enabled) {
    if (!obj) return;
    obj.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => { m.wireframe = enabled; });
        } else {
          child.material.wireframe = enabled;
        }
      }
    });
  }
}
