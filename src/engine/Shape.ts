import {Object3D} from "three";


export interface Shape {
  mesh: Object3D;
  id: string;
  iconPath: string;
}

export interface ShapeRef {
  shape: Shape;
}
