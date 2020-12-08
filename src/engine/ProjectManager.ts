// ***************************************************
//  P R O J E C T    M A N A G E R
// ***************************************************

import {Instruction} from "@/engine/Instruction";

const projectManifestFileName = "project.json";
const behaviorFileName = "behavior.json";
const projectsPath = "projects";
const agentsFolderName = "agents";

export class ProjectManager {
  name: string;
  agentFolderNames: any;
  behaviors: any;

  constructor(name: string) {
    this.name = name;
    this.openProject(this.projectPath);
    console.log(1);
  }

  get projectPath() {
    return `${projectsPath}/${this.name}`;
  }

  get agentsPath() {
    return `${projectsPath}/${this.name}/${agentsFolderName}`;
  }

  async openProject(path: string) {
    const manifestPath = `${path}/${projectManifestFileName}`;
    const response = await fetch(manifestPath);
    const projectProperties = await response.json();
    this.agentFolderNames = projectProperties.agents;
    console.log(this.agentFolderNames);
    console.log(2);
    await this.loadBehaviors();
    this.defineClasses();
  }

  /* async loadBehaviors() {
      console.log("folder: ", this.agentFolderNames)
      this.behaviors =
          this.agentFolderNames
              .map(async name => fetch(`${this.agentsPath}/${name}/${behaviorFileName}`))
              .map(async promise => { console.log(promise); return await promise })
              .map(async response => { console.log(response); return await response.text() })
  } */
  async loadBehaviors() {
    console.log("folder: ", this.agentFolderNames);
    this.behaviors =
      await Promise.all(
        this.agentFolderNames
          .map((name: string) => fetch(`${this.agentsPath}/${name}/${behaviorFileName}`))
          .map(async (promise: Promise<Response>) => {
            const response = await promise;
            const text = await response.text();
            return Instruction.deserialize(text).expand();
          }),
      );
    // this.defineClasses();
  }

  defineClasses() {
    for (let i = 0; i < this.behaviors.length; i++) {
      const code = `class ${this.agentFolderNames[i]} { ${this.behaviors[i]} \r\n}`;
      console.log(code);
    }
  }
}
