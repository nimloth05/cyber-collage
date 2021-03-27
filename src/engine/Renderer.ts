import {
  AmbientLight,
  AxesHelper,
  BasicShadowMap,
  Color,
  DirectionalLight, Intersection,
  Raycaster,
  Scene, Vector2,
  WebGLRenderer,
} from "three";
import {AgentCamera} from "@/engine/AgentCamera";

export class Renderer {
  renderer!: WebGLRenderer;
  container!: HTMLElement;
  scene!: Scene;
  camera!: AgentCamera;
  raycaster: Raycaster;

  constructor() {
    this.raycaster = new Raycaster();
  }

  /**
   *
   * @param {number} rows number of rows in render space
   * @param {number} columns number of columns in render space
   */
  initTHREE(rows: number, columns: number) {
    //  scene
    const container: HTMLElement | null = document.querySelector(".scene");
    if (container == null) {
      throw new Error("Could not find DOM element with class 'scene'");
    }
    this.container = container;
    this.scene = new Scene();
    this.scene.background = new Color(0xaaaaaa);

    //  camera
    const fov = 35;
    const aspect = this.container.clientWidth / this.container.clientHeight;
    const near = 10; // set to max to avoid z-buffer fights
    const far = 8000;

    this.camera = new AgentCamera(fov, aspect, near, far);
    this.camera.aim(200, -100, 300, 200, 100, 0);
    // this.camera.position.set(300, 400, 500);
    // this.camera.lookAt(0, 0, 0);

    // lights
    const ambientLight = new AmbientLight(0xffffff, 0.3);
    this.scene.add(ambientLight);

    const spotLight = new DirectionalLight(0xffffff, 1.2);
    spotLight.position.set(50, -100, 300);
    this.scene.add(spotLight.target);

    // spotLight.target.position.set(50, 50, -4);
    spotLight.castShadow = false;
    // spotLight.shadow.radius = 8;

    // pointLight.shadow.bias = -0.0001;
    // super sensitive: a bit too large and an iPhone 11 will kick into 10x slower
    // spotLight.shadow.mapSize.width = 8 * 512; // 1024 * 8;
    // spotLight.shadow.mapSize.height = 8 * 512; // 1024 * 8;

    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 2500;

    spotLight.shadow.camera.left = 0;
    spotLight.shadow.camera.right = columns * 1.2; // this.map.cellSize * this.map.columns * 1.2;
    spotLight.shadow.camera.top = 0;
    spotLight.shadow.camera.bottom = rows * 1.2; // this.map.cellSize * this.map.rows * 1.2;

    spotLight.shadow.camera.updateProjectionMatrix();

    this.scene.add(spotLight);

    // helpers
    /*
    const lightHelper = new DirectionalLightHelper(spotLight);
    this.scene.add(lightHelper);

    const cameraHelper = new CameraHelper(spotLight.shadow.camera);
    this.scene.add(cameraHelper);
 */

// renderer
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: false,
      logarithmicDepthBuffer: false,
    });
    // this.renderer.outputEncoding = sRGBEncoding;
    this.renderer.physicallyCorrectLights = false; // we use phong shading )-:

    this.renderer.sortObjects = false; // to work with disabled depth testing
    this.renderer.setClearColor(0xff0000, 0);
    this.renderer.autoClear = true;
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    // FIXME: Threejs community strongly recommends NOT TO SET THIS.
    this.renderer.setPixelRatio(window.devicePixelRatio);

// shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = BasicShadowMap;

    this.container.appendChild(this.renderer.domElement);

    const axesHelper = new AxesHelper(100);
    axesHelper.position.x = 0;
    axesHelper.position.y = 0;
    axesHelper.position.z = 50;
    this.scene.add(axesHelper);
  }

  threeResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.render();
  }

  getIntersections(x: number, y: number): Array<Intersection> {
    this.raycaster.setFromCamera(new Vector2(x, y), this.camera);
    return this.raycaster.intersectObjects(this.scene.children, true);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}
