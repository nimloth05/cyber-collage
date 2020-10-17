import {CommandDeclaration, CommandType} from "@/model/CommandDeclaration";

const seeCondition: CommandDeclaration = {
  name: "see",
  type: CommandType.CONDITION,
  icon: "see.png",
  parameters: {},
  explanation: "",
  compile: () => {
    return "";
  },
}

const moveAction: CommandDeclaration = {
  type: CommandType.ACTION,
  name: "move",
  icon: "move.png",
  parameters: {},
  explanation: "",
  compile() {
    return "";
  },
}
