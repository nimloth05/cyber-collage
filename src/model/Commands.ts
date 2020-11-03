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
  name: "move",
  type: CommandType.ACTION,
  icon: "move.png",
  parameters: {},
  explanation: "",
  compile() {
    return "";
  },
}
