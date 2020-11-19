//* **************************************************

import {AgentCamera} from "@/engine/AgentCamera";
import {
  AmbientLight, BasicShadowMap,
  BufferGeometry,
  LineBasicMaterial, LineSegments,
  Mesh, MeshPhongMaterial,
  PlaneGeometry, Raycaster,
  Scene,
  SpotLight, Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import {foundationGridColor, foundationSurfaceColor, selectionBoxColor} from "@/engine/globals";
import {app, SandGrain} from "@/engine/app";
import {findObjectAgent} from "@/engine/helperfunctions";

export class AgentCube {
    constructor(gallery, rows = 9, columns = 16, layers = 1, cellSize = 20.0) {
        this.gallery = gallery;
        this.rows = rows;
        this.columns = columns;
        this.layers = layers;
        this.cellSize = cellSize;
        this.shape = null;
        this.grid = new Array(layers);
        for (let layer = 0; layer < layers; layer++) {
            this.grid[layer] = new Array(rows);
            for (let row = 0; row < rows; row++) {
                this.grid[layer][row] = new Array(columns);
                for (let column = 0; column < columns; column++) {
                    this.grid[layer][row][column] = [];
                }
            }
        }
        this.agentHovered = null;
        this.agentSelected = null;
        this.raycaster = new Raycaster();
        this.mouseMove = new Vector2();
        this.mouseMove.x = null; // don't start with valid coordinate
        this.mouseClick = new Vector2();
        this.mouseClick.x = null; // don't start with valid coordinate
        this.initTHREE();
        this.addFoundationGrid();
        this.addFoundationSurface();
        this.addFoundationHover();
    }

    initTHREE() {
        //  scene
        this.container = document.querySelector(".scene");
        this.scene = new Scene();

        //  camera
        const fov = 35;
        const aspect = this.container.clientWidth / this.container.clientHeight;
        const near = 0.01;
        const far = 50000;

        this.camera = new AgentCamera(fov, aspect, near, far);
        this.camera.aim(200, -400, 600, 200, 400, 0);
        // this.camera.position.set(300, 400, 500);
        // this.camera.lookAt(0, 0, 0);

        // lights
        const ambientLight = new AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        const spotLight = new SpotLight(0xffffff, 1.0);
        spotLight.position.set(500, 0, 800);
        spotLight.castShadow = true;
        spotLight.shadow.radius = 8;

        // pointLight.shadow.bias = -0.0001;
        spotLight.shadow.mapSize.width = 1024 * 8;
        spotLight.shadow.mapSize.height = 1024 * 8;

        spotLight.shadow.camera.near = 0.1;
        spotLight.shadow.camera.far = 2500;
        this.scene.add(spotLight);

        // renderer
        this.renderer = new WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        // orbit controls
        // this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // this.controls.update();

        // shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = BasicShadowMap;

        this.container.appendChild(this.renderer.domElement);
    }

    broadcast(methodName) {
        this.grid.forEach(
            layer => layer.forEach(
                row => row.forEach(
                    column => column.forEach(
                        agent => agent[methodName](),
                    ),
                ),
            ),
        );
    }

    addFoundationGrid() {
        const points = [];
        /// ignore layers for the moment
        for (let row = 0; row < this.rows + 1; row++) {
            points.push(new Vector3(0.0, row * this.cellSize, 0.0));
            points.push(new Vector3(this.columns * this.cellSize, row * this.cellSize, 0.0));
        }
        for (let column = 0; column < this.columns + 1; column++) {
            points.push(new Vector3(column * this.cellSize, 0.0, 0.0));
            points.push(new Vector3(column * this.cellSize, this.rows * this.cellSize, 0.0));
        }
        const material = new LineBasicMaterial({color: foundationGridColor});
        const geometry = new BufferGeometry().setFromPoints(points);
        const foundationGrid = new LineSegments(geometry, material);
        this.scene.add(foundationGrid);
    }

    addFoundationSurface() {
        const plane = new Mesh(new PlaneGeometry(this.columns * this.cellSize, this.rows * this.cellSize),
            new MeshPhongMaterial({color: foundationSurfaceColor}));
        plane.position.x = 0.5 * this.columns * this.cellSize;
        plane.position.y = 0.5 * this.rows * this.cellSize;
        plane.position.z = -3.0;
        plane.isFoundation = true;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    /*    addFoundationSurface() {
            const z = -3.0;
            const x1 = 0.0;
            const x2 = this.columns * this.cellSize
            const y1 = 0.0;
            const y2 = this.rows * this.cellSize;
            const geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(x1, y1, z));
            geometry.vertices.push(new THREE.Vector3(x2, y1, z));
            geometry.vertices.push(new THREE.Vector3(x2, y2, z));
            geometry.vertices.push(new THREE.Vector3(x1, y1, z));
            geometry.vertices.push(new THREE.Vector3(x2, y2, z));
            geometry.vertices.push(new THREE.Vector3(x1, y2, z));
            const normal = new THREE.Vector3(0, 0, 1); //optional
            const color = new THREE.Color(foundationSurfaceColor); //optional
            const materialIndex = 0; //optional
            geometry.faces.push(new THREE.Face3(0, 1, 2, normal, color, materialIndex));
            geometry.faces.push(new THREE.Face3(3, 4, 5, normal, color, materialIndex));
            //the face normals and vertex normals can be calculated automatically if not supplied above
            geometry.computeFaceNormals();
            geometry.computeVertexNormals();
            const foundationSurface = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: foundationSurfaceColor, wireframe: false }));
            //foundationSurface.receiveShadow = true;
            foundationSurface.isFoundation = true;
            this.scene.add(foundationSurface);
        } */
    addFoundationHover() {
        const z = 4;
        const points = []; // square with a long vertical antenna
        points.push(new Vector3(0.0, 0.0, z));
        points.push(new Vector3(this.cellSize, 0.0, z));

        points.push(new Vector3(this.cellSize, 0.0, z));
        points.push(new Vector3(this.cellSize, this.cellSize, z));

        points.push(new Vector3(this.cellSize, this.cellSize, z));
        points.push(new Vector3(0.0, this.cellSize, z));

        points.push(new Vector3(0.0, this.cellSize, z));
        points.push(new Vector3(0.0, 0.0, z));

        points.push(new Vector3(0.5 * this.cellSize, 0.5 * this.cellSize, z));
        points.push(new Vector3(0.5 * this.cellSize, 0.5 * this.cellSize, 2 * this.cellSize));

        const material = new LineBasicMaterial({color: selectionBoxColor});
        const geometry = new BufferGeometry().setFromPoints(points);
        this.foundationHoverShape = new LineSegments(geometry, material);
        this.scene.add(this.foundationHoverShape);
    }

    step() {
        this.broadcast("step");
    }

    draw() {
        // no actual drawing happening here. Shapes are in the scene graph
        this.broadcast("draw");
    }

    clickAt(row, column, layer = 0) {
        this.pushAgent(new SandGrain("cobble_wall"), row, column, layer);
    }

    hoverAt(row, column, layer = 0) {
        this.foundationHoverShape.position.x = column * this.cellSize;
        this.foundationHoverShape.position.y = row * this.cellSize;
    }

    pushAgent(agent, row, column, layer = 0) {
        const agents = this.grid[layer][row][column];
        const agentAtTop = agents[agents.length - 1];

        // adjust geometry
        agent.x = column * this.cellSize + 0.5 * this.cellSize;
        agent.y = row * this.cellSize + 0.5 * this.cellSize;

        if (agentAtTop == null) { agent.z = layer * this.cellSize; } else { agent.z = agentAtTop.z + agentAtTop.depth; }

        // adjust topology
        agent.row = row;
        agent.column = column;
        agent.layer = layer;
        // adjust part hierarchy
        agent.agentCube = this;
        // update stack
        agents.push(agent);
    }

    processMouseHover() {
        if (this.mouseMove.x !== null) {
            this.raycaster.setFromCamera(this.mouseMove, this.camera);
            const firstIntersection = this.raycaster.intersectObjects(this.scene.children, true)[0];
            let agent = null;
            if (firstIntersection) {
                if (firstIntersection.object.isFoundation) {
                    this.hoverAt(Math.floor(firstIntersection.point.y / this.cellSize),
                        Math.floor(firstIntersection.point.x / this.cellSize));
                } else {
                    agent = findObjectAgent(firstIntersection.object);
                }
            }
            if (agent !== this.agentHovered) {
                if (this.agentHovered) {
                    this.agentHovered.unhover();
                    this.agentHovered = null;
                }
                if (agent) {
                    agent.hover();
                    this.agentHovered = agent;
                }
            }
            this.mouseMove.x = null;
        }
    }

    processMouseClick() {
        if (this.mouseClick.x != null) {
            this.raycaster.setFromCamera(this.mouseClick, this.camera);
            const firstIntersection = this.raycaster.intersectObjects(this.scene.children, true)[0];
            let agent = null;
            if (firstIntersection) {
                if (firstIntersection.object.isFoundation) {
                    this.clickAt(Math.floor(firstIntersection.point.y / this.cellSize),
                        Math.floor(firstIntersection.point.x / this.cellSize));
                } else {
                    agent = findObjectAgent(firstIntersection.object);
                }
            }
            if (agent !== this.agentSelected) {
                if (this.agentSelected) {
                    this.agentSelected.deselect();
                    this.agentSelected = null;
                }
                if (agent) {
                    agent.select();
                    this.agentSelected = agent;
                }
            }
            this.mouseClick.x = null;
        }
    }

    render() {
        this.processMouseHover();
        this.processMouseClick();
        this.renderer.render(this.scene, this.camera);
    }

    animate() {
        requestAnimationFrame(app.agentCube.animate);
        this.renderer.render(this.scene, this.camera);
    }
}
