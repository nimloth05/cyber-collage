<template>
  <button class="add-operation" @click="click">+</button>
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
    console.log("emit click");
    this.$emit("click");
  }
}
</script>

<style lang="less">
.add-operation {
  display: inline-block;
  padding: 0;
  margin-left: 1.5rem;
  border-radius: 50%;
  border: 1px solid white;
  text-decoration: none;
  background: none;
  color: #ffffff;
  font-family: sans-serif;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 1.6rem;
}

.add-operation:hover {
  color: darkgray;
  border-color: darkgray;
}

.rules > div > .add-operation {
  color: black;
  border-color: black;
}
</style>
