import {Agent} from "@/engine/Agent";
import {Shape, ShapeRef} from "@/engine/Shape";

export class AgentDescription implements ShapeRef {
  shape: Shape;
  private name: string;

  constructor(shape: Shape, name: string) {
    this.shape = shape;
    this.name = name;
  }

  createAgent(): Agent {
    return new Agent(this.shape.id);
  }
}
