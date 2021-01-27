//* **************************************************
// V A L U E   E D I T O R
//* **************************************************

import * as uuid from "uuid";
import {Arguments, InstructionDeclaration} from "@/model/InstructionDeclaration";
import {InstructionValue} from "@/engine/instruction-value";

export interface ASTNode {
  explanation: string;

  compile(): string;
}

// ***************************************************
// I N S T R U C T I O N
// ***************************************************

export class Instruction implements ASTNode {
  declaration: InstructionDeclaration;
  args: Arguments;

  constructor(declaration: InstructionDeclaration, args: Arguments) {
    this.declaration = declaration;
    this.args = args;
    // create parameter objects
    // Object.assign(this.parameterObjects, this.parameters);
    // for (const parameter in this.parameterObjects) {
    //   // console.log(definition.parameters[parameter]);
    //   this.parameterObjects[parameter] = new declaration.parameters[parameter](parameters[parameter]);
    // }
  }

  getArgumentValue<T extends InstructionValue>(name: string): T | undefined {
    console.log("instruction args", this.args);
    return this.args[name] as T;
  }

  setArgumentValue(name: string, value: InstructionValue) {
    if (value == null) {
      throw new Error(`tried to set ${name} to undefined|null`);
    }
    this.args[name] = value;
    console.log("this updated", this, value);
  }

  get name() {
    return this.declaration.name;
  }

  serialize() {
    // write as 2 element array: [<nameString>, <parameterProperties>]
    return `["${this.declaration.name}", ${JSON.stringify(this.declaration.parameters, null, 2)}]`;
  }

  compile() {
    return this.declaration.code(this);
  }

  execute() {
    // eslint-disable-next-line
    return eval(this.compile());
  }

  get explanation() {
    return "compute explanation string";
  }

  toJson() {
    return Object.keys(this.declaration.parameters).map(k => ({[k]: JSON.parse(JSON.stringify(this.getArgumentValue(k)))}));
  }
}

export class Condition extends Instruction {
  isTrue() {
    return this.execute() === true;
  }
}

export class Action extends Instruction {

}

export abstract class ASTNodeList<T extends ASTNode> implements ASTNode {
  id = uuid.v4(); // FIXME: This is just a test
  instructionObjects: Array<T>;

  constructor(instructionDefs: Array<T>) {
    this.instructionObjects = instructionDefs;
    // this.instructionObjects = instructionDefs.map((idef: any) => createInstruction(idef[0], idef[1]));
  }

  get length() {
    return this.instructionObjects.length;
  }

  add(node: T) {
    this.instructionObjects.push(node);
  }

  abstract compile(): string

  explanation = "SHOULD BE OVERRIDDEN BY SUBCLASSES";

  getChild(index: number): ASTNode {
    return this.instructionObjects[index];
  }

  map<E>(handler: (node: T) => E): Array<E> {
    return this.instructionObjects.map(handler);
  }
}

export class Behavior {

}

// ***************************************************
// I N S T R U C T I O N   L I S T
// ***************************************************

export class AndConditionList extends ASTNodeList<Condition> {
  compile(): string {
    // "<c1> && <c2> && ... <cn>"
    const conditions = this.instructionObjects;
    let code;
    if (conditions.length === 0) {
      code = "true";
    } else {
      code = `${conditions[0].compile()}`;
    }
    for (let i = 1; i < conditions.length; i++) {
      code += ` && ${conditions[i].compile()}`;
    }
    return code;
  }
}

export class ActionList extends ASTNodeList<Action> {
  compile(): string {
    // {<a1>; <a2>; ... <an>}

    return this.instructionObjects
      .map(it => it.compile())
      .join(";\n");

    // let code = "";
    // // FIXME: use reduce here
    // this.instructionObjects.forEach((action: any) => {
    //   code += `${action.compile()}; `;
    // });
    // return code;
  }
}

export class Rule implements ASTNode {
  id = uuid.v4(); // FIXME For testing
  conditions: ASTNodeList<Condition> = new AndConditionList([]);
  actions: ASTNodeList<Action> = new ActionList([]);

  compile(): string {
    return `if (${this.conditions.compile()}) { \r\n ${this.actions.compile()} \r\n}\r\n`;
  }

  explanation = "Sind alle Bedingungen wahr führe aktionen aus.";
}

export class RuleList extends ASTNodeList<Rule> {
  compile(): string {
    // if <conditions1> <actions2>
    // else if <conditions1> <actions2>
    // ...
    // else if <conditions_n> <actions_n>
    // let code = "";
    // for (let i = 0; i < this.instructionObjects.length; i++) {
    //   if (i === 0) {
    //     code += `${this.instructionObjects[i].compile()}`;
    //   } else {
    //     code += `else ${this.instructionObjects[i].compile()}`;
    //   }
    // }
    return this.instructionObjects
      .map(i => i.compile())
      .join(" else ");
  }
}

export class Method implements ASTNode {
  private _name = "step";
  rules = new RuleList([]);
  explanation = `I'm method ${this.name}`;

  set name(value: string) {
    // FIXME: Implement assertions that name is a valid JS method name
    this._name = value;
  }

  get name(): string {
    return this._name;
  }

  compile(): string {
    return `${this.rules.compile()}`;
  }
}

export class MethodList extends ASTNodeList<Method> {
  compile(): string {
    // <methodName1>() {<rules>}
    const methods = this.instructionObjects;

    return methods
      .map(it => it.compile())
      .join("\n");
  }
}

// ***************************************************
//  T E S T    C A S E S
// ***************************************************

// let instructionString = '{ "name": "see", "parameters": { "direction": [0, 1], "shape": "dog" } }'; // too much
// let instructionString = '["see", [[0, 1], "dog" ]';  // too little

const instructionString = "[\"see\", { \"direction\": [0, 1], \"shape\": \"dog\" }]";

// console.log(deserializeInstruction(instructionString));

// console.log(deserializeInstruction(instructionString).serialize());

// console.log(deserializeInstruction(deserializeInstruction(instructionString).serialize()));

// console.log(deserializeInstruction(instructionString).expand());

// const seeInstruction = deserializeInstruction(instructionString);

// console.log(seeInstruction);

// console.log(deserializeInstruction("[\"move\", {\"direction\": [0, 1]}]"));

console.time("deserialize");
// const repeatInstruction = Instruction.deserialize("[\"repeat\", {\"times\": 10, \"actions\": [[\"move\", {\"direction\": [0, 1]}], [\"move\", {\"direction\": [-1, 1]}]]}]");
console.timeEnd("deserialize");

// console.log(repeatInstruction);

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

// const method = Instruction.deserialize(JSON.stringify(methodDefinition));

// let behavior;

// fetch("projects/hourglass/agents/sandcorn/behavior.json").then(response => response.text().then((jsonString: string) => {
//   behavior = Instruction.deserialize(jsonString);
// }));
//
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
//
// const rule = Instruction.deserialize(`["rule", {
//                     "conditions": [["see", { "direction": [0, 1], "shape": "dog" }],
//                     ["see", { "direction": [0, -1], "shape": "cat" }]], "actions": [["move", { "direction": [0, 1] }], ["playSound", { "sound": "boing" }]]
//                 }]`);

// console.log(rule);

// const projectManager = new ProjectManager("hourglass");

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

// createAgentSubClass("Sandcorn", classString);
