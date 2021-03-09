<template>
  <div class="aux-bar">
    <button @click="fullScreen" class="btn sizeable-ui-element hud-toolbar-button">
      <img class="tool-icon" v-if="!isFullscreen" src="img/aux/fullscreen.svg" alt="Vollbildschirm"/>
      <img class="tool-icon" v-if="isFullscreen" src="img/aux/close.svg" alt="Vollbildschirm Beenden"/>
    </button>
    <button @click="openProjectStringPrompt">
      Project
    </button>
    <button @click="requestPermission">
      Permission
    </button>
  </div>
</template>

<script lang="ts">
import * as Tone from "tone";
import {Options, Vue} from "vue-class-component";
import {SaveTool} from "@/engine/tool/SaveTool";

@Options({
  name: "AuxToolbar",
  components: {},
})
export default class AuxToolbar extends Vue {
  private isFullscreen = false;

  fullScreen() {
    if (!this.isFullscreen) {
      AuxToolbar.requestFullscreen();
    } else {
      AuxToolbar.exitFullscreen();
    }
    this.isFullscreen = !this.isFullscreen;
  }

  openProjectStringPrompt() {
    const value = window.prompt("Local storage string:  Open Dev Tools, locate local storage, search for 'project', copy value.", "");
    if (value == null || value === "") {
      return;
    }

    SaveTool.storeString(value);
  }

  requestPermission() {
    let count = 0;

    const osc = new Tone.Oscillator().toDestination();
    // osc.frequency.value = "C3";

    const highFreq = osc.frequency.toFrequency("C5");
    const lowFreq = osc.frequency.toFrequency("C1");
    const freq = osc.frequency.toFrequency("C3");

    console.log("C5", highFreq, "C1", lowFreq);

// ramp to "C2" over 2 seconds
//     osc.frequency.rampTo("C2", 2);
// start the oscillator for 2 seconds
    osc.start();

    function map(x: number, inMin: number, inMax: number, outMin: number, outMax: number) {
      return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    function handleOrientation(event: any) {
      // console.log("event", event);
      count += 1;
      if ((count % 10) === 0) {
        const x = event.gamma;
        osc.frequency.value = map(x, -90, 90, lowFreq, highFreq);
      }
    }

    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // handle regular non iOS 13+ devices
      window.addEventListener("deviceorientation", handleOrientation);
    }
  }

  private static requestFullscreen(): void {
    const elem: any = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE10 */
      elem.msRequestFullscreen();
    }
  }

  private static exitFullscreen(): void {
    const doc: any = document;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }
}
</script>
