//***************************************************
// A G E N T 
//***************************************************

class Agent {
    constructor(shapeName = "defaultShape", row = 0, column = 0, layer = 0) {
        this.row = row;
        this.column = column;
        this.layer = layer;
        this.shapeName = shapeName;

        // define shape as mesh and add clone of mesh to scene
        // NEED to check if this clone copies the geometry which is SHOULD NOT
        // use THREE.SkeletonUtils.clone instead? https://discourse.threejs.org/t/solved-issue-with-gltfloader-and-reusing-geometry/6697 

        this.shape = app.gallery.findShape(shapeName).clone();
        this.shape.agent = this; // need to be able to trace back shapes to agents

        // Probably should do all this to the original only once and not the clones
        centerMeshGeometryOnGround(this.shape);
        normalizeGeometry(this.shape, app.agentCube.cellSize);

        // shadows
        this.shape.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                // child.receiveShadow = true;  // good idea but looks crappy
            }
        });

        // compute bounds
        const box = new THREE.Box3();
        box.setFromObject(this.shape);
        this.depth = box.max.z - box.min.z;

        app.agentCube.scene.add(this.shape);

        // selection and hover boxes: 
        // warn: it would be possible to share a single set of boxes reduce memory but this would not work if multiple selections will be allowed
        this.hoverBox = new THREE.BoxHelper(this.shape, hoverBoxColor);
        this.hoverBox.agent = this;
        this.selectionBox = new THREE.BoxHelper(this.shape, selectionBoxColor);
        this.selectionBox.agent = this;

        // Selection and Hovering
        this.isHovered = false;
        this.isSelected = false;
        this.whenCreatingNewAgent();
    }
    // Getters & Setters
    get x() {
        return this.shape.position.x;
    }
    set x(x) {
        this.shape.position.x = x;
        if (this.isHovered) this.hoverBox.update();
        if (this.isSelected) this.selectionBox.update();
    }
    get y() {
        return this.shape.position.y;
    }
    set y(y) {
        this.shape.position.y = y;
        if (this.isHovered) this.hoverBox.update();
        if (this.isSelected) this.selectionBox.update();
    }
    get z() {
        return this.shape.position.z;
    }
    set z(z) {
        this.shape.position.z = z;
        if (this.isHovered) this.hoverBox.update();
        if (this.isSelected) this.selectionBox.update();
    }
    get roll() {
        return this.shape.rotation.z;
    }
    set roll(roll) {
        this.shape.rotation.z = roll;
        if (this.isHovered) this.hoverBox.update();
        if (this.isSelected) this.selectionBox.update();
    }
    get pitch() {
        return this.shape.rotation.y;
    }
    set pitch(pitch) {
        this.shape.rotation.y = pitch;
        if (this.isHovered) this.hoverBox.update();
        if (this.isSelected) this.selectionBox.update();
    }
    get heading() {
        return this.shape.rotation.x;
    }
    set heading(heading) {
        this.shape.rotation.x = heading;
        if (this.isHovered) this.hoverBox.update();
        if (this.isSelected) this.selectionBox.update();
    }
    whenCreatingNewAgent() {
        this.rotationSpeed = {};
        this.rotationSpeed.x = 0.1 * (Math.random() - 0.5);
        this.rotationSpeed.y = 0.1 * (Math.random() - 0.5);
        this.rotationSpeed.z = 0.1 * (Math.random() - 0.5);
        // detault rotation
        this.roateTo(Math.PI * -0.5, Math.PI * 1.0, 0);
    }
    draw() {
        console.log(`drawing agent: ${this.shapeName} @[${this.row}, ${this.column}]`);
    }
    step() { // Step your behavior
        //console.log(`stepping agent: ${this.shapeName} @[${this.row}, ${this.column}]`);
        this.rotateBy(this.rotationSpeed.x)
    }
    mouseClick() {
        console.log(`clicked @ ${this.shapeName}`);
    }
    hover() {
        this.isHovered = true;
        app.agentCube.scene.add(this.hoverBox);
        this.hoverBox.update();
    }
    unhover() {
        this.isHovered = false;
        app.agentCube.scene.remove(this.hoverBox);
    }
    select() {
        console.log(`selected ${this.shapeName}`);
        this.isSelected = true;
        app.agentCube.scene.add(this.selectionBox);
        this.selectionBox.update();
    }
    deselect() {
        this.isSelected = false;
        app.agentCube.scene.remove(this.selectionBox);
    }
    // Querys
    isValidCoordinate(row, column, layer = 0) {
        return !(row < 0 ||
            row >= app.agentCube.rows ||
            column < 0 ||
            column >= app.agentCube.columns ||
            layer < 0 ||
            layer >= app.agentCube.layers)
    }
    agentRelative(deltaRow, deltaColumn, deltaLayer = 0) {
        // return agent or null
        let row = this.row + deltaRow;
        let column = this.column + deltaColumn;
        let layer = this.layer + deltaLayer;

        //console.log(`accessing row, column, layer: ${row}, ${column}, ${layer}`)
        if (!this.isValidCoordinate(row, column, layer)) return null;
        let agents = app.agentCube.grid[layer][row][column];
        let agent = agents[agents.length - 1];
        if (agent == undefined)
            return null
        else
            return agent;
    }
    removeFromAgentCube() {
        let agents = app.agentCube.grid[this.layer][this.row][this.column];
        let index = agents.indexOf(this);
        if (index == -1) console.err(`cannot remove agent: ${this} from AgentCube`);
        agents.splice(index, 1);
        // adjust z values of all the agents that used to be above me   
        for (let i = index; i < agents.length; i++) {
            agents[i].z -= this.depth;
        }
    }
    // C O N D I T I O N S
    see(shapeName, deltaRow, deltaColumn, deltaLayer = 0) {
        let agent = this.agentRelative(deltaRow, deltaColumn, deltaLayer);
        //console.log(`agent: ${agent}`);
        return (agent != null && agent.shapeName == shapeName);
    }
    percentChance(chance) {
        return (chance / 100.0 > Math.random())
    }
    empty(deltaRow, deltaColumn, deltaLayer = 0) {
        const row = this.row + deltaRow;
        const column = this.column + deltaColumn;
        const layer = this.layer + deltaLayer;
        if (!this.isValidCoordinate(row, column, layer)) return false;
        //console.log(app.agentCube.grid[layer][row][column].length);
        return app.agentCube.grid[layer][row][column].length == 0;
    }
    // A C T I O N S
    move(deltaRow, deltaColumn, deltaLayer = 0) {
        const row = this.row + deltaRow;
        const column = this.column + deltaColumn;
        const layer = this.layer + deltaLayer;
        if (!this.isValidCoordinate(row, column, layer)) return null;
        this.removeFromAgentCube();
        app.agentCube.pushAgent(this, row, column, layer);
    }
    moveRandom() {
        const max = 1;
        const min = -1;
        let deltaRow = Math.floor(Math.random() * (max - min + 1)) + min;
        let deltaColumn = Math.floor(Math.random() * (max - min + 1)) + min;
        // ignore layers for now
        if (this.isValidCoordinate(this.row + deltaRow, this.column + deltaColumn))
            this.move(deltaRow, deltaColumn)
    }
    rotateBy(deltaRoll = 0.0, deltaPitch = 0.0, deltaHeading = 0.0) {
        this.roll += deltaRoll;
        this.pitch += deltaPitch;
        this.heading += deltaHeading;
    }
    roateTo(deltaRoll = 0.0, deltaPitch = 0.0, deltaHeading = 0.0) {
        this.roll = deltaRoll;
        this.pitch = deltaPitch;
        this.heading = deltaHeading;
    }
}