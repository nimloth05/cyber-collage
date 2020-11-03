//* **************************************************
// Helper Functions
//* **************************************************

import {Box3} from "three";

export function oneOf(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function findObjectAgent(object) {
    if (!object) return null;
    if (object.agent) { return object.agent; } else { return findObjectAgent(object.parent); }
}

export function centerMeshGeometryOnGround(mesh) {
    // Center the geometry and make it flush on ground (z = 0)
    mesh.traverse(child => {
        if (child.geometry != null) {
            child.geometry.center();
            const box = new Box3();
            box.setFromObject(child);
            /// HACK: somehow the mesh returned by glTF is rotated: to translate the z value in the mesh the y value of the geometry needs to be updated
            child.geometry.translate(0.0, -box.min.y, 0.0);
        }
    });
}

export function normalizeGeometry(mesh, size = 1.0) {
    const box = new Box3();
    box.setFromObject(mesh);
    const scale = size / Math.max(box.max.x - box.min.x, box.max.y - box.min.y);
    mesh.scale.x = scale;
    mesh.scale.y = scale;
    mesh.scale.z = scale;
}
