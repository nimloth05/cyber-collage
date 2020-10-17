<template>
  <command-panel/>
</template>

<script type="ts">

import CommandPanel from "../components/CommandPanel.vue";
import {Options, Vue} from "vue-class-component";

@Options({
  components: {
    CommandPanel,
  },
})
export default class About extends Vue {

}

</script>
