//* **************************************************
// V A L U E   E D I T O R
//* **************************************************

import {Parameters} from "@/model/InstructionDeclaration";
import {ProjectManager} from "@/engine/ProjectManager";
import {InstructionDefinitions} from "@/engine/instruction-definitions";

function createInstruction(name: string, parameters: any): Instruction {
  // console.log("createInstruction name: ", name, "parameters: ", parameters);
  const definiton = InstructionDefinitions.findDefinition(name);
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line
  return new definiton.class(name, parameters);
}

// ***************************************************
// I N S T R U C T I O N
// ***************************************************

export class Instruction {
  name: string;
  parameters: Parameters
  parameterObjects: any = {};

  constructor(name: string, parameters: Record<string, any>) {
    this.name = name;
    this.parameters = parameters; // properties {<parameter>: <value>}
    const definition = InstructionDefinitions.findDefinition(name);
    if (definition == null) {
      throw new Error(`Definition not found: ${name}`);
    }

    // create parameter objects
    Object.assign(this.parameterObjects, this.parameters);
    for (const parameter in this.parameterObjects) {
      // console.log(definition.parameters[parameter]);
      // FIXME: Makes no sense: Why copy an object and then replace every property of it with a new value?
      this.parameterObjects[parameter] = new definition.parameters[parameter](parameters[parameter]);
    }
  }

  static deserialize(jsString: string) {
    // a serialization string is an array [<nameString>, <parameterProperties>]
    const [name, parameters] = JSON.parse(jsString);
    return createInstruction(name, parameters);
  }

  serialize() {
    // write as 2 element array: [<nameString>, <parameterProperties>]
    return `["${this.name}", ${JSON.stringify(this.parameters, null, 2)}]`;
  }

  expand() {
    return InstructionDefinitions.findDefinition(this.name)!.code(this);
  }

  execute() {
    // eslint-disable-next-line
    return eval(this.expand());
  }

  get explanation() {
    return "compute explanation string";
  }
}

export class Condition extends Instruction {
  isTrue() {
    return this.execute() === true;
  }
}

export class Action extends Instruction {

}

export class Rule extends Instruction {

}

export class Behavior extends Instruction {

}

// ***************************************************
// I N S T R U C T I O N   L I S T
// ***************************************************

class InstructionList {
  instructions: any;
  instructionObjects: any;

  constructor(instructions: any) {
    this.instructions = instructions;
    this.instructionObjects = instructions.map((idef: any) => createInstruction(idef[0], idef[1]));
  }
}

export class AndConditionList extends InstructionList {
  expand() {
    // "<c1> && <c2> && ... <cn>"
    const conditions = this.instructionObjects;
    let code;
    if (conditions.length === 0) {
      code = "true";
    } else {
      code = `${conditions[0].expand()}`;
    }
    for (let i = 1; i < conditions.length; i++) {
      code += ` && ${conditions[i].expand()}`;
    }
    return code;
  }
}

export class ActionList extends InstructionList {
  expand() {
    // {<a1>; <a2>; ... <an>}
    let code = "";
    // FIXME: use reduce here
    this.instructionObjects.forEach((action: any) => {
      code += `${action.expand()}; `;
    });
    return code;
  }
}

export class RuleList extends InstructionList {
  expand() {
    // if <conditions1> <actions2>
    // else if <conditions1> <actions2>
    // ...
    // else if <conditions_n> <actions_n>
    let code = "";
    for (let i = 0; i < this.instructionObjects.length; i++) {
      if (i === 0) {
        code += `${this.instructionObjects[i].expand()}`;
      } else {
        code += `else ${this.instructionObjects[i].expand()}`;
      }
    }
    return code;
  }
}

export class MethodList extends InstructionList {
  expand() {
    // <methodName1>() {<rules>}
    const methods = this.instructionObjects;
    let code = "";
    // FIXME: use reduce here
    methods.forEach((method: any) => {
      // FIXME: Newline or semi?
      code += `${method.expand()}`;
    });
    return code;
  }
}

// ***************************************************
//  T E S T    C A S E S
// ***************************************************

// let instructionString = '{ "name": "see", "parameters": { "direction": [0, 1], "shape": "dog" } }'; // too much
// let instructionString = '["see", [[0, 1], "dog" ]';  // too little

const instructionString = "[\"see\", { \"direction\": [0, 1], \"shape\": \"dog\" }]";

// console.log(Instruction.deserialize(instructionString));

// console.log(Instruction.deserialize(instructionString).serialize());

// console.log(Instruction.deserialize(Instruction.deserialize(instructionString).serialize()));

// console.log(Instruction.deserialize(instructionString).expand());

const seeInstruction = Instruction.deserialize(instructionString);

console.log(seeInstruction);

console.log(Instruction.deserialize("[\"move\", {\"direction\": [0, 1]}]"));

console.time("deserialize");
const repeatInstruction = Instruction.deserialize("[\"repeat\", {\"times\": 10, \"actions\": [[\"move\", {\"direction\": [0, 1]}], [\"move\", {\"direction\": [-1, 1]}]]}]");
console.timeEnd("deserialize");

console.log(repeatInstruction);

const methodDefinition = ["method",
  {
    name: "whileRunning",
    rules: [
      ["rule",
        {
          conditions: [
            ["see", {direction: [0, 1], shape: "dog"}],
            ["see", {direction: [0, -1], shape: "cat"}],
          ],
          actions: [
            ["move", {direction: [0, 1]}],
            ["playSound", {sound: "boing"}],
          ],
        },
      ],
      ["rule",
        {
          conditions: [
            ["see", {direction: [0, 1], shape: "dog"}],
            ["see", {direction: [0, -1], shape: "cat"}],
          ],
          actions: [
            ["move", {direction: [0, 1]}],
            ["playSound", {sound: "boing"}],
          ],
        },
      ],
    ],
  },
];

const method = Instruction.deserialize(JSON.stringify(methodDefinition));

let behavior;

fetch("projects/hourglass/agents/sandcorn/behavior.json").then(response => response.text().then((jsonString: string) => {
  behavior = Instruction.deserialize(jsonString);
}));

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
                }]`);

console.log(rule);

const projectManager = new ProjectManager("hourglass");

function createAgentSubClass(name: string, behavior: any) {
  /// Hack: https://stackoverflow.com/questions/39298985/using-eval-method-to-get-class-from-string-in-firefox
  // eslint-disable-next-line
  // @ts-ignore
  // eslint-disable-next-line no-eval
  window[name] = eval(`(${behavior})`);
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
    } )`;

createAgentSubClass("Sandcorn", classString);
