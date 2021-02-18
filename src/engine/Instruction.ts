//* **************************************************
// V A L U E   E D I T O R
//* **************************************************

import * as uuid from "uuid";
import {fromPairs, mapValues} from "lodash";
import {Arguments, InstructionDeclaration} from "@/model/InstructionDeclaration";
import {InstructionValue} from "@/engine/instruction-value";
import {InstructionEntry, MethodListEntry, RuleEntry} from "@/engine/tool/SaveModel";
import {InstructionDefinitions} from "@/engine/instruction-definitions";

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
  }

  getArgumentValue<T extends InstructionValue>(name: string): T | undefined {
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

  toJson(): InstructionEntry {
    return {
      name: this.declaration.name,
      arguments: fromPairs(
        Object
          .keys(this.declaration.parameters)
          .map(k => ([k, JSON.parse(JSON.stringify(this.getArgumentValue(k))) as Record<string, any>])),
      ),
    };
  }

  static deserializeInstruction(entry: InstructionEntry): { decl: InstructionDeclaration; args: Arguments } {
    const decl = InstructionDefinitions.findDefinition(entry.name);
    if (decl == null) {
      throw new Error(`No instruction declaration with name ${entry.name} found`);
    }
    const args: Arguments = {};
    Object.keys(decl.parameters)
      .forEach(argName => {
        const parameterType = decl.parameters[argName];
        if (parameterType.deserialize == null) {
          throw new Error(`Type of ${argName} has not serialize method`);
        }
        args[argName] = parameterType.deserialize(entry.arguments[argName]);
        console.log("deserialized", argName, args[argName]);
      });
    return {
      decl,
      args,
    };
  }

  static createNewInstruction<T extends Instruction>(Ctor: { new(decl: InstructionDeclaration, args: Arguments): T }, decl: InstructionDeclaration): T {
    const args: Arguments = mapValues(decl.parameters, (value, key) => decl.defaultArguments(key, decl.parameters[key]));
    return new Ctor(decl, args);
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

  addCondition(condition: Condition): void {
    this.conditions.add(condition);
  }

  addAction(action: Action): void {
    this.actions.add(action);
  }

  explanation = "Führe alle Aktionen aus, wenn alle Bedingungen erfüllt sind.";

  static deserialize(ruleEntry: RuleEntry): Rule {
    const result = new Rule();
    ruleEntry.actions.forEach(entry => {
      const {decl, args} = Instruction.deserializeInstruction(entry);
      result.addAction(new Action(decl, args));
    });
    ruleEntry.conditions.forEach(conditionEntry => {
      const {decl, args} = Instruction.deserializeInstruction(conditionEntry);
      result.addCondition(new Condition(decl, args));
    });
    return result;
  }
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

  static deserialize(methodName: string, ruleEntries: Array<RuleEntry>): Method {
    const m = new Method();
    m.name = methodName;
    // FIXME: Move to RuleList
    ruleEntries.forEach(ruleEntry => {
      const rule = Rule.deserialize(ruleEntry);
      m.rules.add(rule);
    });
    return m;
  }
}

export class MethodList extends ASTNodeList<Method> {
  addMethod(m: Method): void {
    const index = this.instructionObjects.findIndex(it => it.name === m.name);
    if (index > -1) {
      this.instructionObjects.splice(index, 1);
    }
    this.instructionObjects.push(m);
  }

  compile(): string {
    // <methodName1>() {<rules>}
    const methods = this.instructionObjects;

    return methods
      .map(it => it.compile())
      .join("\n");
  }

  static deserialize(methods: MethodListEntry): MethodList {
    const result = new MethodList([]);
    Object.keys(methods).forEach((methodName) => {
      const ruleEntry = methods[methodName];
      const m = Method.deserialize(methodName, ruleEntry);
      result.addMethod(m);
    });
    return result;
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
