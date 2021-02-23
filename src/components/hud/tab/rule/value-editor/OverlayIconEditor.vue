<template>
  <div v-if="visible" class="backdrop" @click="close()"/>
  <div v-if="visible" class="inline-editor">
    <div class="container-fluid">
      <div
        v-for="(_, row) in getRowCount()"
        :key="row"
        class="row"
      >
        <div
          v-for="(_, column) in getColumnCount()"
          :key="column"
          class="col sizeable-ui-element m-1"
        >
          <!--          <span>{{ nRow }}, {{ nColumn }}, {{ row }} {{ column }}</span>-->
          <img
            class="tool-icon"
            :src="getIcon(row, column)"
            :alt="getIcon(row, column)"
            @click="handleClick(row, column)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {IconLayoutOptions} from "@/components/hud/tab/rule/InstructionToolbarUtil";

@Options({
  name: "OverlayIconEditor",
  props: {
    visible: Boolean,
    iconLayoutOptions: /* IconLayoutOptions */ Object,
  },
  emits: [
    "update:visible",
    "icon-selected",
  ],
})
export default class OverlayIconEditor extends Vue {
  visible!: boolean;
  iconLayoutOptions!: IconLayoutOptions;

  getRowCount(): number {
    return this.iconLayoutOptions.rowCount;
  }

  getColumnCount(): number {
    return this.iconLayoutOptions.rowCount;
  }

  getIcon(row: number, column: number): string {
    const index = Math.min(this.iconLayoutOptions.icons.length - 1, this._getIndex(row, column));
    return this.iconLayoutOptions.icons[index];
  }

  handleClick(row: number, column: number): void {
    const icon = this.getIcon(row, column);
    const index = this._getIndex(row, column);
    this.$emit("icon-selected", {icon, index, row, column});
    this.close();
  }

  _getIndex(row: number, column: number): number {
    return this.getColumnCount() * row + column;
  }

  close() {
    this.$emit("update:visible", false);
  }
}
</script>
