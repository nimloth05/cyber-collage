<template>
  <span> {{ value }}</span>
</template>

<script lang="ts">

import {Options, Vue} from "vue-class-component";

@Options({
  name: "ArgumentEditor",
  props: {
    name: String,
  },
  components: {},
})
export default class ArgumentEditor extends Vue {
  name!: string;
}
</script>
