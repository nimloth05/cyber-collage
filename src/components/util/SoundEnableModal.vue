<template>
  <div>
    <span>Möchten Sie Musik/Geräusche (Sound) aktivieren?</span>
    <div class="text-end">
      <button class="btn btn-dark" @click="okClicked">Ja</button>
      <button class="btn btn-dark" @click="cancelClicked">Nein</button>
    </div>
  </div>
</template>
<script lang="ts">
import {defineComponent, PropType} from "vue";

export default defineComponent({
  name: "SoundEnableModal",
  props: {
    okHandler: Function as PropType<() => void>,
  },
  methods: {
    okClicked() {
      if (this.okHandler != null) {
        this.okHandler();
      }
      this.hide();
    },
    cancelClicked() {
      this.hide();
    },
    hide() {
      this.$emit("on-close");
    },
  },
});
</script>
