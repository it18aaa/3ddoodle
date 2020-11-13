// import { setUVScale } from '../utility/setUVScale';
import { RibbonFence } from './ribbonFence';
import { fixPivotPointOffCentre } from '../utility/fixPivot';

  export function createFence2(scene, outline, height, counter) {
      const f = new RibbonFence(outline);
      f.doubledOver = true;
      f.height = height;      
      const mesh = f.getMesh();
      counter.increment();
      mesh.name = `fence${counter.get()}`;

      fixPivotPointOffCentre(mesh)
      return mesh;
  }