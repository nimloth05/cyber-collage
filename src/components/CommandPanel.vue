<template>
  <div>
    <rule-list/>
  </div>
</template>

<script lang="ts">
import RuleList from "./RuleList.vue";
import {Options, Vue} from "vue-class-component";

@Options({
  name: "CommandPanel",
  components: {
    RuleList,
  },
})
export default class CommandPanel extends Vue {
}
</script>
