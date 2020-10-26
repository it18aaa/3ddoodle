import { setUVScale } from '../utility/setUVScale';
import { RibbonFence } from './ribbonFence';
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

export function createFence(scene, shadowGenerator, outline, data, counter, colour, material) {
    const f = new RibbonFence(outline);
    
    // f.doubledOver = material ? false: true;
    f.doubledOver = true;
  
    if (data.height && data.height > 0.01 && data.height < 10) {
      f.height = data.height;
    }
    const mesh = f.getMesh();
  
    counter.increment();
    mesh.name = `fence${counter.get()}`;
    mesh.receiveShadows = true;
    shadowGenerator.addShadowCaster(mesh);
  
    if (material) {
      setUVScale(mesh, outline.totalLength, 2);
  
      mesh.material = scene.getMaterialByName(material);
    } else {
      const mat = new StandardMaterial("new mat", scene);
      mat.diffuseColor = colour;
      mesh.material = mat;
    }
    return mesh;
  }