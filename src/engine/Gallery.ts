//* **************************************************
// G A L L E R Y
//* **************************************************

import {Dictionary, keyBy} from "lodash";
import {LoadingManager, Mesh} from "three";
import {ProgressListener} from "@/engine/promise-util";
import {centerAndNormalizeShape, normalizeGeometry} from "@/engine/helperfunctions";
import {Shape} from "@/engine/Shape";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";

export const SHAPE_DIR = "shapes-mmmm";

export const alexShapes = [
  "Sheep",
  "Rabbit",
  "Pig",
  "Penguin",
  "Panda",
  "Monkey",
  "Ostrich",
  "Lion",
  "Hippo",
  "Giraffe",
  "Elephant",
  "Dog",
  "Frog",
  "Deer",
  "Cat",
  "Chicken",
  "Crocodile",
  "Cow",
  "Rooster",
  "Bear"];

export const mmmmShapes = [
  "bear",
  "cat",
  "dog2",
  "dog",
  "girl",
  "house4",
  "house6",
  "mike",
  "penguin",
  "robot",
  "store",
  "taxi",
  "tree2",
  "tree3",
  "tree",
  "truck",
];

export const shapeNames = mmmmShapes;

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

  static getShapePath(shapeId: string): string {
    if (shapeId == null) {
      return "";
    }
    const name = shapeId.charAt(0).toUpperCase() + shapeId.substr(1);
    return `${SHAPE_DIR}/${name}/${shapeId}-image.png`;
  }

  static async loadShapes(cellSize: number, progressListener: ProgressListener): Promise<Gallery> {
    const loadingManager = new LoadingManager();
    loadingManager.onProgress = (url, loaded, total): void => {
      const value = Math.floor((loaded / total) * 100);
      progressListener(loaded, total, value);
    };

    const objLoader = new OBJLoader(loadingManager);
    const mtlLoader = new MTLLoader(loadingManager);

    const shapePath = SHAPE_DIR;

    function loadShape(shapeName: string): Promise<Shape> {
      return new Promise((resolve) => {
        const path = shapePath + "/" + shapeName + "/";
        console.log("path", path);
        console.log("obj path", path + shapeName + ".obj");

        mtlLoader
          .setPath(path)
          .load(shapeName + ".mtl", (materials) => {
              materials.preload();
              objLoader.setMaterials(materials);

              objLoader.load(
                path + shapeName + ".obj",
                result => {
                  const shape = result;
                  centerAndNormalizeShape(shape);
                  // centerMeshGeometryOnGround(shape);
                  normalizeGeometry(shape, cellSize, shapeName);

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
                    iconPath: `${path}preview.png`,
                  });
                });
            },
            () => ({}), // xhr => console.log("shape " + name + " " + (xhr.loaded / xhr.total * 100) + '% loaded'),
            err => console.error(`Cannot load shape: ${shapeName} error: `, err),
          );
      });
    }

    const shapes = await Promise.all(shapeNames.map(name => loadShape(name)));

    return new Gallery(keyBy(shapes, "id"));
  }
}
