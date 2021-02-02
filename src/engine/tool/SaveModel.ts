import {Dictionary} from "lodash";

export type ArgEntry = Record<string, any>;
export type InstructionEntry = { name: string; arguments: Dictionary<ArgEntry> }
export type RuleEntry = { conditions: Array<InstructionEntry>; actions: Array<InstructionEntry> };
export type MethodEntry = { [name: string]: Array<RuleEntry> };
export type ClassStoreEntry = { name: string; shapeId: string; methods: Array<MethodEntry> };
export type WorldEntry = { agentClass: string; column: number; row: number; layer: number };
export type ProjectData = { classStore: Array<ClassStoreEntry>; worldData: Array<WorldEntry> };
