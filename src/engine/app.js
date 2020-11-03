
//***************************************************
// A P P  
//***************************************************

class ChickenAgent extends Agent {
    constructor(shapeName = "chicken", row = 0, column = 0, layer = 0) {
        super(shapeName, row, column, layer)
    }
    step() {
        super.step(); /*
        if (this.percentChance(25))
            this.move(0, 1)
        else if (this.percentChance(33.333))
            this.move(1, 0)
        else if (this.percentChance(50))
            this.move(0, -1)
        else
            this.move(-1, 0) */
    }
}

class SandGrain extends Agent {
    constructor(shapeName = "cobble_wall", row = 0, column = 0, layer = 0) {
        super(shapeName, row, column, layer)
    }
    step() {
        //super.step();
        if (this.empty(-1, 0))
            this.move(-1, 0);
        else if (this.empty(-1, - 1))
            this.move(-1, -1);
        else if (this.empty(-1, 1))
            this.move(-1, 1)
    }
}


//***************************************************
// T E S T I N G
//***************************************************

let app = { name: "Cyber Collage" };

let shapeNames = ["Sheep", "Rabbit", "Pig", "Penguin", "Panda", "Monkey", "Ostrich", "Lion", "Hippo", "Giraffe", "Elephant", "Dog", "Frog", "Deer", "Cat", "Chicken", "Crocodile", "Cow", "Rooster", "Bear", "cobble_wall"];

app.gallery = new Gallery(shapeNames);

app.agentCube = new AgentCube(app.gallery, 60, 20);

function animate() {
    requestAnimationFrame(animate);
    app.agentCube.step();
    app.agentCube.render();
}

let r1;
let r2;
let r3;
let r4;
let c1;


app.gallery.ifShapesReadyThen(shapes => {
    console.log(shapes);
    app.gallery.shapes = shapes;  // this is pretty sneaky

    // add agents

    r1 = new ChickenAgent("Giraffe");
    r2 = new ChickenAgent("Giraffe");
    r3 = new ChickenAgent("Dog");
    r4 = new ChickenAgent("Rooster");
    c1 = new ChickenAgent("Elephant");


    app.agentCube.pushAgent(r1, 0, 0);
    app.agentCube.pushAgent(c1, 0, 0);
    app.agentCube.pushAgent(r2, 0, 0);
    app.agentCube.pushAgent(r3, 0, 0);
    app.agentCube.pushAgent(r4, 5, 5);


    for (let i = 0; i < 0; i++)
        app.agentCube.pushAgent(new ChickenAgent("Dog"), 0, 0);

    for (let i = 0; i < 0; i++)
        app.agentCube.pushAgent(new ChickenAgent("Rabbit"), 0, 0);

    //console.log(app.agentCube);
    //console.log(`does the chicken see the rooster: ${chickenAgent.see("Rooster", 0, -1)}`);
    //console.log(`does the rooster see the chicken: ${roosterAgent.see("Chicken", 0, 1)}`);


    //for (let row = 0; row < app.agentCube.rows; row++)
    //    for (let column = 0; column < app.agentCube.columns; column++)
    //        app.agentCube.pushAgent(new ChickenAgent(), row, column);

    for (let i = 0; i < 50; i++) {
        app.agentCube.pushAgent(new ChickenAgent(oneOf(shapeNames)),
            Math.floor(Math.random() * app.agentCube.rows),
            Math.floor(Math.random() * app.agentCube.columns))
    }

    //app.agentCube.broadcast("whenCreatingNewAgent");

    animate();

    //app.agentCube.draw();

})






