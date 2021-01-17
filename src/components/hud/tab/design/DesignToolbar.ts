import {Dictionary, keyBy} from "lodash";
import {PenTool} from "@/engine/tool/PenTool";
import {ArrowTool} from "@/engine/tool/ArrowTool";
import {EraseTool} from "@/engine/tool/EraseTool";
import {Tool} from "@/engine/tool/Tool";

export class DesignToolbar {
  tools: Dictionary<Tool> = keyBy([new ArrowTool(), new PenTool(), new EraseTool()], "id");

  getTools(): Array<Tool> {
    return Object.values(this.tools);
  }

  getIds(): Array<string> {
    return Object.keys(this.tools);
  }

  getTool(id: string): Tool {
    return this.tools[id];
  }
}
