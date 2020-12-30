//* **************************************************
// G A L L E R Y
//* **************************************************

import {Dictionary, keyBy} from "lodash";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {LoadingManager, Mesh} from "three";
import {ProgressListener} from "@/engine/promise-util";
import {centerMeshGeometryOnGround, normalizeGeometry} from "@/engine/helperfunctions";
import {Shape} from "@/engine/Shape";

export const shapeNames = ["Sheep", "Rabbit", "Pig", "Penguin", "Panda", "Monkey", "Ostrich", "Lion", "Hippo", "Giraffe", "Elephant", "Dog", "Frog", "Deer", "Cat", "Chicken", "Crocodile", "Cow", "Rooster", "Bear", "cobble_wall"];

export class Gallery {
  shapes: Dictionary<Shape>;

  constructor(shapes: Dictionary<Shape>) {
    this.shapes = shapes;
  }

  findShape(shapeName: string): Shape | null {
    const shape = this.shapes[shapeName.toLocaleLowerCase()];
    if (shape == null) {
      console.error(`cannot find shape "${shapeName}"`);
      return null;
    }
    return shape;
  }

  createShapeForAgent(shapeName: string): Shape {
    const shape = this.findShape(shapeName);
    if (shape == null) {
      throw new Error(`Shape with name ${shapeName} not found`);
    }
    return {
      mesh: shape?.mesh.clone(),
      id: shape.id,
      iconPath: shape.iconPath,
    };
  }

  static async loadShapes(cellSize: number, progressListener: ProgressListener): Promise<Gallery> {
    const loadingManager = new LoadingManager();
    loadingManager.onProgress = (url, loaded, total): void => {
      const value = Math.floor((loaded / total) * 100);
      progressListener(loaded, total, value);
    };

    const loader = new GLTFLoader(loadingManager);

    const shapePath = "shapes/";
    const shapeFile = "scene.gltf";

    function loadShape(shapeName: string): Promise<Shape> {
      return new Promise((resolve) => {
        const path = shapePath + shapeName + "/";
        loader.load(
          path + shapeFile,
          gltf => {
            const shape = gltf.scene;
            centerMeshGeometryOnGround(shape);
            normalizeGeometry(shape, cellSize);

            // shadows
            shape.traverse(child => {
              if (child instanceof Mesh) {
                child.castShadow = true;
                // child.receiveShadow = true;  // good idea but looks crappy
              }
            });

            const id = shapeName.toLowerCase();

            resolve({
              mesh: shape,
              id,
              iconPath: `${path}${id}-image.png`,
            });
          },
          () => ({}), // xhr => console.log("shape " + name + " " + (xhr.loaded / xhr.total * 100) + '% loaded'),
          err => console.error(`Cannot load shape: ${name} e: `, err),
        );
      });
    }

    const shapes = await Promise.all(shapeNames.map(name => loadShape(name)));

    return new Gallery(keyBy(shapes, "id"));
  }
}
