<template>
  <div v-if="visible" class="backdrop" @click="close()"/>
  <div v-if="visible" class="inline-editor">
    <div class="container-fluid">
      <div
        v-for="option in options()"
        :key="option.instructionValue"
        @click="handleClick(option)"
      >
        <span>{{ option.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ListSelectionEntry} from "@/engine/instruction-value";

export default defineComponent({
  name: "OverlayListSelectionEditor",
  components: {},
  props: {
    visible: Boolean,
  },
  data(props) {
    return {
      visible: props.visiible,
    };
  },
  watch: {},
  methods: {
    close() {
      this.$emit("update:visible", false);
    },

    handleClick(option: ListSelectionEntry): void {
      this.$emit("option-selected", option);
      this.close();
    },
  },
});
</script>
