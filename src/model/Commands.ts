import {InstructionDeclaration, CommandType} from "@/model/InstructionDeclaration";

const seeCondition: InstructionDeclaration = {
  name: "see",
  type: CommandType.CONDITION,
  icon: "see.png",
  parameters: {},
  explanation: "",
  compile: () => {
    return "";
  },
}

const moveAction: InstructionDeclaration = {
  name: "move",
  type: CommandType.ACTION,
  icon: "move.png",
  parameters: {},
  explanation: "",
  compile() {
    return "";
  },
}
