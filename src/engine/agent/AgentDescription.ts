import {Agent} from "@/engine/Agent";
import {Shape, ShapeRef} from "@/engine/Shape";

export class AgentDescription implements ShapeRef {
  shape: Shape;

  constructor(shape: Shape) {
    this.shape = shape;
  }

  createAgent(): Agent {
    return new Agent(this.shape.id);
  }
}
