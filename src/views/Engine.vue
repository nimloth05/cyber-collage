<template>
  <button onclick="askOrientationPermission">enable tilt sensor</button>
  <div class="scene" />
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

async function promptUserforOrientationPermission() {
  if (
    DeviceOrientationEvent &&
    typeof DeviceOrientationEvent.requestPermission === "function"
  ) {
    const permissionState = await DeviceOrientationEvent.requestPermission();
    if (permissionState === "granted") {
      // Permission granted
      return true;
    } else {
      // Permission denied
      return false;
    }
  }
}

function askOrientationPermission() {
  promptUserforOrientationPermission().then((enabled) => console.log("orientation is", enabled));
}
</script>

<style>
.scene,
canvas {
  position: absolute;
  background-color: gray;
  width: 100%;
  height: 100%;
}
</style>
