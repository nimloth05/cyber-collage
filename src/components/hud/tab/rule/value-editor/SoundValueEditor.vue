<template>
  <span @click="openModal" style="min-width: 2em">{{ soundName }}</span>
  <sound-modal :id="id + '-sound-modal'" ref="soundModal" @ok="soundValueChanged"/>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import {SoundValue} from "@/engine/instruction-value";
import SoundModal from "@/components/util/SoundModal.vue";

@Options({
  name: "SoundValueEditor",
  props: {
    argument: SoundValue,
    readOnly: Boolean,
    id: String,
  },
  emits: [
    "arg-changed",
  ],
  components: {
    SoundModal,
  },
})
export default class SoundValueEditor extends Vue {
  argument!: SoundValue;
  readOnly!: boolean;
  formula = "";

  get soundName(): string {
    // FIXME: Cut off extension and such
    return this.argument.fileName;
  }

  openModal(): void {
    if (this.readOnly) {
      return;
    }
    (this.$refs.soundModal as any).show(this.argument);
  }

  soundValueChanged(args: SoundValue): void {
    this.$emit("arg-changed", args);
  }
}
</script>
