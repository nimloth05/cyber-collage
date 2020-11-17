
//* **************************************************
// V A L U E   E D I T O R
//* **************************************************

class ValueEditor {
    constructor(value) {
        if (value) this.value = value;
    }

    get value() {
        return this._value;
    }

    set value(value) {
        this._value = value;
    }

    get explanation() {
        return "explain your value as string";
    }

    static deserialize(jsString) {
        return new this(JSON.parse(jsString));
    }

    serialize() {
        return JSON.stringify(this.value);
    }
}


class DirectionEditor extends ValueEditor {

}

class ShapeNameEditor extends ValueEditor {

}

class FormulaEditor extends ValueEditor {

}

class SoundEditor extends ValueEditor {

}

class MethodNameEditor extends ValueEditor {

}

// ***************************************************
// I N S T R U C T I O N
// ***************************************************

function createInstruction(name, parameters) {
    // console.log("createInstruction name: ", name, "parameters: ", parameters);
    const definiton = InstructionDefinitions.findDefinition(name);
    return new definiton.class(name, parameters);
}


class Instruction {
    constructor(name, parameters) {
        this.name = name;
        this.parameters = parameters; // properties {<parameter>: <value>}
        this.parameterObjects = {}; // properties {<parameter>: <ValueEditor or <Instruction>}
        const definition = InstructionDefinitions.findDefinition(name);

        // create parameter objects
        Object.assign(this.parameterObjects, this.parameters);
        for (const parameter in this.parameterObjects) {
            // console.log(definition.parameters[parameter]);
            this.parameterObjects[parameter] = new definition.parameters[parameter](parameters[parameter]);
        }
    }

    static deserialize(jsString) {
        // a serialization string is an array [<nameString>, <parameterProperties>]
        const [name, parameters] = JSON.parse(jsString);
        return createInstruction(name, parameters);
    }

    serialize() {
        // write as 2 element array: [<nameString>, <parameterProperties>]
        return `["${this.name}", ${JSON.stringify(this.parameters, null, 2)}]`;
    }

    expand() {
        return InstructionDefinitions.findDefinition(this.name).code(this);
    }

    execute() {
        return eval(this.expand());
    }

    get explanation() {
        return "compute explanation string"
    }
}


class Condition extends Instruction {

    isTrue() {
        return this.execute() === true;
    }
}

class Action extends Instruction {

}


class Rule extends Instruction {

}


class Behavior extends Instruction {

}

// ***************************************************
// I N S T R U C T I O N   L I S T
// ***************************************************

class InstructionList {
    constructor(instructions) {
        this.instructions = instructions;
        this.instructionObjects = instructions.map(idef => createInstruction(idef[0], idef[1]));
    }
}

class AndConditionList extends InstructionList {
    expand() {
        // "<c1> && <c2> && ... <cn>"
        const conditions = this.instructionObjects;
        let code;
        if (conditions.length === 0)
            code = "true"
        else
            code = `${conditions[0].expand()}`
        for (let i = 1; i < conditions.length; i++) {
            code += ` && ${conditions[i].expand()}`;
        }
        return code;
    }
}

class ActionList extends InstructionList {
    expand() {
        // {<a1>; <a2>; ... <an>}
        let code = "";
        this.instructionObjects.forEach(action => code += `${action.expand()}; `)
        return code;
    }
}

class RuleList extends InstructionList {
    expand() {
        // if <conditions1> <actions2>
        // else if <conditions1> <actions2>
        // ...
        // else if <conditions_n> <actions_n>
        let code = "";
        for (let i = 0; i < this.instructionObjects.length; i++) {
            if (i === 0)
                code += `${this.instructionObjects[i].expand()}`
            else
                code += `else ${this.instructionObjects[i].expand()}`
        }
        return code;
    }
}


class MethodList extends InstructionList {
    expand() {
        // <methodName1>() {<rules>}
        const methods = this.instructionObjects;
        let code = "";
        methods.forEach(method => code += `${method.expand()}`)
        return code;
    }
}
// ***************************************************
// I N S T R U C T I O N   D E F I N I T I O N S
// ***************************************************

const instructionDefinitions = [
    // Conditions
    {
        name: "see",
        class: Condition,
        parameters: {
            direction: DirectionEditor,
            shape: ShapeNameEditor,
        },
        code(instruction) {
            const { shape, direction } = instruction.parameterObjects;
            return `this.see('${shape.value}', ${direction.value[0]}, ${direction.value[1]})`
        },
        icon: "see.png",
        explanation({ shape, direction }) {
            return `True if I see to ${direction.explain} an ${shape.explain}.`
        }
    },
    {
        name: "percentChance",
        class: Condition,
        parameters: {
            chance: FormulaEditor,
        },
        code(instruction) {
            return `this.percentChance(${instruction.parameterObjects.chance.value})`
        },
        icon: "percentChance.png",
        explanation: `True with a ${chance.explain} percent chance.`
    },
    // Actions
    {
        name: "move",
        class: Action,
        parameters: {
            direction: DirectionEditor
        },
        code(instruction) {
            let {direction} = instruction.parameterObjects;
            return `this.move(${direction.value[0]}, ${direction.value[1]})`
        },
        icon: "move.png",
        explanation({ direction }) {
            return `I move to the ${direction.explain}`
        }
    },
    {
        name: "playSound",
        class: Action,
        parameters: {
            sound: SoundEditor
        },
        code(instruction) {
            let { sound } = instruction.parameterObjects;
            return `this.playSound('${sound.value}')`
        },
        icon: "move.png",
        explanation({ direction }) {
            return `I move to the ${direction.explain}`
        }
    },
    {
        name: "rule",
        class: Rule,
        parameters: {
            conditions: AndConditionList,
            actions: ActionList
        },
        code(instruction) {
            let { conditions, actions } = instruction.parameterObjects;
            return `if (${conditions.expand()}) \r\n    {${actions.expand()}}\r\n`
        },
        icon: "rule.png",
        explanation({ conditions, actions }) {
            return "if all the conditions are true then I run my actions"
        }
    },
    {
        name: "method",
        class: Action,
        parameters: {
            name: MethodNameEditor,
            rules: RuleList
        },
        code(instruction) {
            let { name, rules } = instruction.parameterObjects;
            return `\r\n${name.value}() {\r\n${rules.expand()}}`
        },
        icon: "method.png",
        explanation(instruction) {
            return "I check my rules from top to bottom"
        }
    },
    {
        name: "behavior",
        class: Behavior,
        parameters: {
            methods: MethodList
        },
        code(instruction) {
            let { methods } = instruction.parameterObjects;
            return `${methods.expand()}`
        },
        icon: "behavior.png",
        explanation(instruction) {
            return "I have a number of methods"
        }
    },
    {
        name: "repeat",
        class: Action,
        parameters: {
            times: FormulaEditor,
            actions: ActionList,
        },
        code(instruction) {
            const { times, actions } = instruction.parameterObjects;
            return `for (let i = 0; i < ${times.value}) {${actions.expand()}};`;
        },
        icon: "repeat.png",
        explanation: "I execute all actions first to last"
    }
];


class InstructionDefinitions {
    // eslint-disable-next-line no-useless-constructor
    constructor() {

    }

    static findDefinition(name) {
        const definition = instructionDefinitions.find(definition => name === definition.name);
        if (!definition) console.trace(`cannot find definition ${name} `);
        return definition;
    }
}

// ***************************************************
//  P R O J E C T    M A N A G E R
// ***************************************************

const projectManifestFileName = "project.json";
const behaviorFileName = "behavior.json";
const projectsPath = "projects";
const agentsFolderName = "agents";


class ProjectManager {
    constructor(name) {
        this.name = name;
        this.openProject(this.projectPath);
        console.log(1);
    }

    get projectPath() {
        return `${projectsPath}/${this.name}`;
    }

    get agentsPath() {
        return `${projectsPath}/${this.name}/${agentsFolderName}`;
    }

    async openProject(path) {
        const manifestPath = `${path}/${projectManifestFileName}`;
        const response = await fetch(manifestPath);
        const projectProperties = await response.json();
        this.agentFolderNames = projectProperties.agents;
        console.log(this.agentFolderNames);
        console.log(2);
        await this.loadBehaviors();
        this.defineClasses();
    }

    /* async loadBehaviors() {
        console.log("folder: ", this.agentFolderNames)
        this.behaviors =
            this.agentFolderNames
                .map(async name => fetch(`${this.agentsPath}/${name}/${behaviorFileName}`))
                .map(async promise => { console.log(promise); return await promise })
                .map(async response => { console.log(response); return await response.text() })
    } */
    async loadBehaviors() {
        console.log("folder: ", this.agentFolderNames);
        this.behaviors =
            await Promise.all(
                this.agentFolderNames
                    .map(name => fetch(`${this.agentsPath}/${name}/${behaviorFileName}`))
                    .map(async promise => {
                        const response = await promise;
                        const text = await response.text();
                        return Instruction.deserialize(text).expand();
                    })
            )
        // this.defineClasses();
    }

    defineClasses() {
        for (let i = 0; i < this.behaviors.length; i++) {
            const code = `class ${this.agentFolderNames[i]} { ${this.behaviors[i]} \r\n}`;
            console.log(code);
        }
    }
}

// ***************************************************
//  T E S T    C A S E S
// ***************************************************


// let instructionString = '{ "name": "see", "parameters": { "direction": [0, 1], "shape": "dog" } }'; // too much
// let instructionString = '["see", [[0, 1], "dog" ]';  // too little

const instructionString = '["see", { "direction": [0, 1], "shape": "dog" }]';


// console.log(Instruction.deserialize(instructionString));

// console.log(Instruction.deserialize(instructionString).serialize());

// console.log(Instruction.deserialize(Instruction.deserialize(instructionString).serialize()));

// console.log(Instruction.deserialize(instructionString).expand());

const seeInstruction = Instruction.deserialize(instructionString);

console.log(seeInstruction);

console.log(Instruction.deserialize('["move", {"direction": [0, 1]}]'));

console.time("deserialize")
const repeatInstruction = Instruction.deserialize('["repeat", {"times": 10, "actions": [["move", {"direction": [0, 1]}], ["move", {"direction": [-1, 1]}]]}]');
console.timeEnd("deserialize")

console.log(repeatInstruction);





const methodDefinition = ["method",
    {
        name: "whileRunning",
        rules: [
            ["rule",
                {
                    conditions: [
                        ["see", { direction: [0, 1], shape: "dog" }],
                        ["see", { direction: [0, -1], shape: "cat" }]
                    ],
                    actions: [
                        ["move", { direction: [0, 1] }],
                        ["playSound", { sound: "boing" }]
                    ]
                }
            ],
            ["rule",
                {
                    conditions: [
                        ["see", { direction: [0, 1], shape: "dog" }],
                        ["see", { direction: [0, -1], shape: "cat" }]
                    ],
                    actions: [
                        ["move", { direction: [0, 1] }],
                        ["playSound", { sound: "boing" }]
                    ]
                }
            ]
        ]
    }
]

const method = Instruction.deserialize(JSON.stringify(methodDefinition))

let behavior;

fetch("projects/hourglass/agents/sandcorn/behavior.json").then(response => response.text().then(jsonString => behavior = Instruction.deserialize(jsonString)));


/*

console.log(JSON.stringify(method))

console.log(JSON.stringify(["rule",
    {
        conditions: [
            ["see", { direction: [0, 1], shape: "dog" }],
            ["see", { direction: [0, -1], shape: "cat" }]
        ],
        actions: [
            ["move", { direction: [0, 1] }],
            ["playSound", { sound: "boing" }]
        ]
    }
]))

*/

const rule = Instruction.deserialize(`["rule", {
                    "conditions": [["see", { "direction": [0, 1], "shape": "dog" }],
                    ["see", { "direction": [0, -1], "shape": "cat" }]], "actions": [["move", { "direction": [0, 1] }], ["playSound", { "sound": "boing" }]]
                }]`)

console.log(rule);



const projectManager = new ProjectManager("hourglass");


function createAgentSubClass(name, behavior) {
    /// Hack: https://stackoverflow.com/questions/39298985/using-eval-method-to-get-class-from-string-in-firefox 
    window[name] = eval(`(${behavior})`)
}


const classString = `(
class Sandcorn extends Agent { 
    whileRunning() {
    if (this.see('dog', 0, 1) && this.see('cat', 0, -1)) 
        {this.move(0, 1); this.playSound('boing'); }
    else if (this.see('dog', 0, 1) && this.see('cat', 0, -1)) 
        {this.move(0, 1); this.playSound('boing'); }
    }
    mouseClick() {
    if (this.see('dog', 0, 1) && this.see('cat', 0, -1)) 
        {this.move(0, 1); this.playSound('boing'); }
    else if (this.see('dog', 0, 1) && this.see('cat', 0, -1)) 
        {this.move(0, 1); this.playSound('boing'); }
    else if (this.see('dog', 0, 1)) 
        {this.playSound('boing'); }
    } 
    } )`

createAgentSubClass("Sandcorn", classString);