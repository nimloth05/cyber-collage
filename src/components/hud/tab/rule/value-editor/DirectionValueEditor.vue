<template>
  <overlay-icon-editor
    v-model:visible="directionEditorVisible"
    @icon-selected="directionIconClicked"
    :iconLayoutOptions="getIconLayoutOptions()"
  />
  <img
    class="sizeable-ui-element"
    @click="changeDirectionValue"
    :src="'img/instructions/parameters/' + getDirectionValueImage()" :alt="getDirectionValueImage()"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {DirectionValue} from "@/engine/instruction-value";
import {IconLayoutOptions} from "@/components/hud/tab/rule/InstructionToolbarUtil";
import OverlayIconEditor from "@/components/hud/tab/rule/value-editor/OverlayIconEditor.vue";

@Options({
  name: "DirectionValueEditor",
  props: {
    argument: DirectionValue,
    readOnly: Boolean,
    id: String,
  },
  emits: [
    "arg-changed",
  ],
  components: {
    OverlayIconEditor,
  },
})
export default class DirectionValueEditor extends Vue {
  directionEditorVisible = false;
  argument!: DirectionValue;
  readOnly!: boolean;

  getIconLayoutOptions(): IconLayoutOptions {
    return {
      rowCount: 3,
      columnCount: 3,
      icons: [
        "img/instructions/parameters/arrow-north-west.svg",
        "img/instructions/parameters/arrow-up.svg",
        "img/instructions/parameters/arrow-north-east.svg",
        "img/instructions/parameters/arrow-left.svg",
        "img/bin.svg",
        "img/instructions/parameters/arrow-right.svg",
        "img/instructions/parameters/arrow-south-west.svg",
        "img/instructions/parameters/arrow-down.svg",
        "img/instructions/parameters/arrow-south-east.svg",
      ],
    };
  }

  changeDirectionValue() {
    if (this.readOnly) {
      return;
    }

    this.directionEditorVisible = true;
  }

  directionIconClicked(eventData: { icon: string; index: number; row: number; column: number }): void {
    console.log("direction changed", eventData);
    // Middle icon pressed, no change
    if (eventData.row === 1 && eventData.column === 1) {
      return;
    }

    const directionRow = eventData.row === 0 ? 1 : eventData.row === 1 ? 0 : -1;
    const directionColumn = eventData.column === 0 ? -1 : eventData.column === 1 ? 0 : 1;
    this.$emit("arg-changed", new DirectionValue(directionRow, directionColumn));
  }

  getDirectionValueImage(): string {
    const directionValue = this.argument as DirectionValue;
    if (directionValue.row === 1 && directionValue.column === 0) {
      return "arrow-up.svg";
    } else if (directionValue.row === 1 && directionValue.column === 1) {
      return "arrow-north-east.svg";
    } else if (directionValue.row === 0 && directionValue.column === 1) {
      return "arrow-right.svg";
    } else if (directionValue.row === -1 && directionValue.column === 1) {
      return "arrow-south-east.svg";
    } else if (directionValue.row === -1 && directionValue.column === 0) {
      return "arrow-down.svg";
    } else if (directionValue.row === -1 && directionValue.column === -1) {
      return "arrow-south-west.svg";
    } else if (directionValue.row === 0 && directionValue.column === -1) {
      return "arrow-left.svg";
    } else if (directionValue.row === 1 && directionValue.column === -1) {
      return "arrow-north-west.svg";
    }
    return "arrow-left.svg";
  }
}
</script>
