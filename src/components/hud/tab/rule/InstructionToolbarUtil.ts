import {ASTNodeList, Instruction} from "@/engine/Instruction";
import {app} from "@/engine/app";
import {RemoveASTNodeCommand} from "@/model/commands/instruction/RemoveASTNodeCommand";

export type InstructionToolbarAction = {
  label: string;
  icon: string;
  handler: (instruction: Instruction) => void;
};

export function getDefaultActions<T extends Instruction>(container: ASTNodeList<T>, instruction: T): Array<InstructionToolbarAction> {
  return [
    {
      label: "Entfernen",
      icon: "img/bin.svg",
      handler: () => {
        app.undoManager.execute(new RemoveASTNodeCommand<T>(container, instruction));
      },
    },
  ];
}
