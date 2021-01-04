//* **************************************************
// Helper Functions
//* **************************************************

import {Box3, Object3D, Vector3} from "three";
import {Agent} from "@/engine/Agent";

export function oneOf<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

// FIXME: Use Type Agent
export function findObjectAgent(object: Object3D): Agent | null {
  if (!object) return null;
  if (object.userData != null && object.userData instanceof Agent) {
    // FIXME: object.agent
    return object.userData as Agent;
  } else {
    if (object.parent != null) {
      return findObjectAgent(object.parent);
    }
    return null;
  }
}

function depthOfNesting(child: Object3D, parent: Object3D): number {
  if (child.parent === parent) return 0;
  if (child.parent) return 1 + depthOfNesting(child.parent, parent);
  return -1;
}

export function centerMeshGeometryOnGround(mesh: Object3D) {
  // Center the geometry and make it flush on ground (z = 0)
  // FIXME: Use better type here
  console.log("BEGIN mesh processing");
  mesh.traverse((child: any) => {
    console.log("-- mesh considering at level", depthOfNesting(child, mesh), child);
    if (child.geometry != null) {
      console.log("-- mesh processing at level", depthOfNesting(child, mesh), child);
      // child.geometry.rotateZ(-Math.PI / 2);
      child.geometry.center();
      const box = new Box3();
      box.setFromObject(child);
      /// HACK: somehow the mesh returned by glTF is rotated: to translate the z value in the mesh the y value of the geometry needs to be updated
      // child.geometry.translate(-box.min.y, 0, 0);
      child.geometry.translate(0.0, -box.min.y, 0.0);
      // child.geometry.translate(0.0, 0.0, +box.min.z);
    }
  });
  console.log("END mesh processing");
}

export function normalizeGeometry(mesh: Object3D, size = 1.0) {
  const box = new Box3();
  box.setFromObject(mesh);
  const scale = size / Math.max(box.max.x - box.min.x, box.max.y - box.min.y);
  mesh.scale.x = scale;
  mesh.scale.y = scale;
  mesh.scale.z = scale;
}

export function rotateX(x: number, y: number, z: number, angle: number): Vector3 {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  return new Vector3(x, y * cos - z * sin, y * sin + z * cos);
}

export function rotateY(x: number, y: number, z: number, angle: number): Vector3 {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  return new Vector3(x * cos + z * sin, y, z * cos - x * sin);
}

export function rotateZ(x: number, y: number, z: number, angle: number): Vector3 {
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  return new Vector3(x * cos - y * sin, x * sin + y * cos, z);
}
