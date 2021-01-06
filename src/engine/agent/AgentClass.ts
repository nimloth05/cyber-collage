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

  methods = AgentClass.createMethodList();

  constructor(shape: Shape, name: string) {
    this.shape = shape;
    this.name = name;
  }

  createAgent(): Agent {
    return new Agent(this.shape.id);
  }

}
