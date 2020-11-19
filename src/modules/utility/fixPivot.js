    // kludge to move the pivot point from world centre to
    // to local centre
    // adapted from the solution described here
    // https://forum.babylonjs.com/t/rotate-a-importet-mesh-will-not-work-correctly/3059


// works on the X Z plane only
export function fixPivotPointOffCentre(mesh, y ) {

    // get the centre of the bounding box in world space
    // which gives us a translation vector
    const translation = mesh.getBoundingInfo().boundingBox.centerWorld.clone();

    // use the vector in reverse to translate mesh over centre
    mesh.position.set(-translation.x, -translation.y, -translation.z);

    // bake it so it stays in the local
    mesh.bakeCurrentTransformIntoVertices();
    
    if(!y) { y = translation.y }

    // move the mesh back to its original position
    mesh.position.set(translation.x, y, translation.z);
    
}
