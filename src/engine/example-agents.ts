import {Agent} from "@/engine/Agent";

export class ChickenAgent extends Agent {
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

export class SandGrain extends Agent {
  step() {
    // super.step();
    if (this.empty(-1, 0)) {
      this.move(-1, 0);
    } else if (this.empty(-1, -1)) {
      this.move(-1, -1);
    } else if (this.empty(-1, 1)) {
      this.move(-1, 1);
    }
  }
}
