<template>
  <div class="hud-overlay">
    <div class="m-auto">
      <div class="d-flex">
        <div>Play</div>
<!--        <div class=".d-sm-none .d-md-block">-->
<!--          <span>UNDO</span>-->
<!--        </div>-->
      </div>
    </div>
    <h-u-d/>
  </div>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import HUD from "@/components/hud/HUD.vue";

@Options({
  name: "HUDOverlay",
  components: {
    HUD,
  },
})
export default class HUDOverlay extends Vue {
}
</script>

<style>
.hud-overlay {
  position: relative;
  height: 100%;
}
</style>
