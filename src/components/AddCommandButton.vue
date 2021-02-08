<template>
  <button class="sizeable-ui-element add-operation" @click="click">+</button>
  <!--  <button class="add-operation">&#8853;</button>-->
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";

@Options({
  emits: {
    click: () => {
      console.log("emit on click?");
    },
  },
})
export default class AddCommandButton extends Vue {
  click() {
    this.$emit("click");
  }
}
</script>
