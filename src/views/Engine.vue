<template>
  <div class="scene-container">
    <div class="scene"/>
    <h-u-d-top/>
    <h-u-d/>
  </div>
</template>

<script type="ts">

import {init} from "@/engine/app";
import HUD from "@/components/hud/HUD.vue";
import HUDTop from "@/components/hud/HUDTop.vue";

export default {
  components: {
    HUD,
    HUDTop,
  },
  async mounted() {
    await init();
  },
};

</script>

<style>
.scene-container, .scene, canvas {
  position: absolute;
  background-color: gray;
  width: 100%;
  height: 100%;
}
</style>
