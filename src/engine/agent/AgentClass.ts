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
  readonly name: string;
  private readonly AgentType: any;

  methods = AgentClass.createMethodList();

  constructor(shape: Shape, name: string) {
    this.shape = shape;
    this.name = name;
    this.AgentType = this.generateAgentClass(name);
  }

  private generateAgentClass(name: string): any {
    return class SubAgent extends Agent {
    };
  }

  createAgent(): Agent {
    return new this.AgentType(this.shape.id, this);
  }

  compile() {
    // FIXME: Remove old methods from class
    this.methods.instructions
      .map((m: Method) => {
        const code = m.compile();
        console.log("code for ", code);
        // eslint-disable-next-line
        return [m.name, new Function(code)];
      })
      .forEach(([name, functionObject]) => {
        // eslint-disable-next-line
        // @ts-ignore
        this.AgentType.prototype[name] = functionObject;
      });

    console.log("agentClass", this.AgentType.prototype);
  }
}
