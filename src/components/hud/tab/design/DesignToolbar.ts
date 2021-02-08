import {Dictionary, keyBy} from "lodash";
import {PenTool} from "@/engine/tool/PenTool";
import {ArrowTool} from "@/engine/tool/ArrowTool";
import {EraseTool} from "@/engine/tool/EraseTool";
import {Tool} from "@/engine/tool/Tool";
import {ClearAllTool} from "@/engine/tool/ClearAllTool";

export class DesignToolbar {
  tools: Dictionary<Tool> = keyBy([new ArrowTool(), new PenTool(), new EraseTool(), new ClearAllTool()], "id");

  getTools(): Array<Tool> {
    return Object.values(this.tools);
  }

  getTool(id: string): Tool {
    return this.tools[id];
  }
}
