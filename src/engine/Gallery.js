//* **************************************************
// G A L L E R Y
//* **************************************************

import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

export class Gallery {
    constructor(shapeNames) {
        const shapePath = "shapes/";
        const shapeFile = "scene.gltf";

        this.shapeNames = shapeNames.map(name => name.toLowerCase());
        this.shapes = [];
        const loader = new GLTFLoader();

        this.promises = shapeNames.map(name => {
          return new Promise((resolve, reject) => {
              loader.load(
                shapePath + name + "/" + shapeFile,
                shape => resolve(shape),
                null, // xhr => console.log("shape " + name + " " + (xhr.loaded / xhr.total * 100) + '% loaded'),
                err => console.error("Cannot load shape: " + name + "e: ", err),
              );
            });
        });
    }

    ifShapesReadyThen(callBack) {
        Promise.all(this.promises).then(callBack);
    }

    findShape(shapeName) {
        const index = this.shapeNames.indexOf(shapeName.toLowerCase());
        if (index === -1) { console.error(`cannot find shape "${shapeName}"`); } else { return this.shapes[index].scene; }
    }
}
