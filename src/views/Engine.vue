<template>
  <div class="scene"/>
</template>

<script type="ts">
export default {
  mounted() {
    this.$nextTick(async () => {
      await import("../engine/app");
      await import("../engine/navigationevents");
    });
  },
};

</script>

<style>
.scene, canvas {
  position: absolute;
  background-color: gray;
  width: 100%;
  height: 100%;
}
</style>
