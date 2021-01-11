import {Agent} from "@/engine/Agent";
import {Shape, ShapeRef} from "@/engine/Shape";
import {Method, MethodList} from "@/engine/Instruction";

export class AgentClass implements ShapeRef {
  static createMethodList(): MethodList {
    const result = new MethodList([]);
    result.add(new Method());
    return result;
  }

  shape: Shape;
  private name: string;
  private readonly AgentClass: any;

  methods = AgentClass.createMethodList();

  constructor(shape: Shape, name: string) {
    this.shape = shape;
    this.name = name;
    this.AgentClass = this.generateAgentClass(name);
  }

  private generateAgentClass(name: string): any {
    return class SubAgent extends Agent {
    };
  }

  createAgent(): Agent {
    return new this.AgentClass(this.shape.id);
  }

  compile() {
    // FIXME: Remove old methods from class
    this.methods.instructionObjects
      .map((m: Method) => {
        const code = m.compile();
        // eslint-disable-next-line
        return [m.name, new Function(code)];
      })
      .forEach(([name, functionObject]) => {
        // eslint-disable-next-line
        // @ts-ignore
        this.AgentClass.prototype[name] = functionObject;
      });

    console.log("agentClass", this.AgentClass.prototype);
  }
}
