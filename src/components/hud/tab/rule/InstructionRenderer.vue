<template>
  <div class="btn instruction" @click="e => $emit('click', e)" v-long-press="longPress">
    <img v-if="declaration.icon != null" class="sizeable-ui-element" :src="declaration.icon"
         :alt="declaration.name"/>
    <span v-if="declaration.icon == null">{{ declaration.name }}</span>
    <div class="argument">
      <parameter-renderer
        v-for="([name, paramType]) in parameters"
        :key="name"
        :param="paramType"
        :argument="getArgumentValue(name, paramType)"
        :id="getEditorId(name)"
        :read-only="isReadOnly()"
        @arg-changed="v => setArgumentValue(name, v)"
      />
    </div>
    <div v-if="toolBarVisible" class="instruction-toolbar">
      <button
        v-for="action in finalToolbarActions"
        :key="action.label"
        class="btn sizeable-ui-element"
        @click="() => {action.handler(); closeToolbar()}">
        <img class="tool-icon" :src="action.icon" :alt="action.label"/>
      </button>
    </div>
  </div>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";
import ParameterRenderer from "./ParameterRenderer.vue";
import {InstructionDeclaration, ParameterType} from "@/model/InstructionDeclaration";
import {InstructionValue} from "@/engine/instruction-value";
import {InstructionToolbarAction} from "@/components/hud/tab/rule/InstructionToolbarUtil";

@Options({
  name: "InstructionRenderer",
  props: {
    id: String,
    declaration: /* InstructionDeclaration */ Object,
    argumentResolver: Function,
    readOnly: Boolean,
    toolbarActions: Array,
  },
  emits: [
    "click",
    "arg-changed",
  ],
  components: {
    ParameterRenderer,
  },
})
export default class InstructionRenderer extends Vue {
  id!: string;
  declaration!: InstructionDeclaration;
  argumentResolver!: (name: string, type: ParameterType) => InstructionValue;
  readOnly = true;
  toolBarVisible = false;
  toolbarActions!: Array<InstructionToolbarAction>;

  get parameters(): Array<[string, ParameterType]> {
    return Object.entries(this.declaration.parameters);
  }

  get finalToolbarActions(): Array<InstructionToolbarAction> {
    if (this.toolbarActions == null || this.toolbarActions.length === 0) {
      console.log("no actions registered", this.toolbarActions);
      return [];
    }
    return [...this.toolbarActions, {
      label: "Schliessen",
      icon: "img/aux/close.svg",
      handler: () => {
        console.log("this", this);
        this.toolBarVisible = false;
      },
    }];
  }

  getArgumentValue(name: string, type: ParameterType): InstructionValue {
    if (this.argumentResolver === null) {
      throw new Error("ArgumentResolver not provided");
    }
    return this.argumentResolver(name, type);
  }

  setArgumentValue(name: string, value: InstructionValue): void {
    this.$emit("arg-changed", {name, value});
  }

  getEditorId(name: string): string {
    return `${this.id}-${name}-param-renderer`;
  }

  isReadOnly() {
    return this.readOnly || this.toolBarVisible;
  }

  longPress() {
    this.toolBarVisible = true;
  }

  closeToolbar() {
    this.toolBarVisible = false;
  }
}
</script>
