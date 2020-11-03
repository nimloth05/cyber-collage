//***************************************************
// Helper Functions 
//***************************************************

function oneOf(array) {
    return array[Math.floor(Math.random() * array.length)]
}

function findObjectAgent(object) {
    if (!object) return null;
    if (object.agent)
        return object.agent;
    else
        return findObjectAgent(object.parent);
}


function centerMeshGeometryOnGround(mesh) {
    // Center the geometry and make it flush on ground (z = 0)
    mesh.traverse(child => {
        if (child.geometry) {
            child.geometry.center();
            const box = new THREE.Box3();
            box.setFromObject(child);
            /// HACK: somehow the mesh returned by glTF is rotated: to translate the z value in the mesh the y value of the geometry needs to be updated
            child.geometry.translate(0.0, -box.min.y, 0.0);
        }
    })
}

function normalizeGeometry(mesh, size = 1.0) {
    const box = new THREE.Box3();
    box.setFromObject(mesh);
    let scale = size / Math.max(box.max.x - box.min.x, box.max.y - box.min.y);
    mesh.scale.x = scale;
    mesh.scale.y = scale;
    mesh.scale.z = scale;
}