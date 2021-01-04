<template>
  <div>
    <rule-list-panel/>
  </div>
  <!--  <div class="container">-->
  <!--    <div class="row">-->
  <!--      <div class="col-12">-->
  <!--        while running-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div class="row">-->
  <!--      <div class="col-1">-->
  <!--        Wenn-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<script lang="ts">
import RuleListPanel from "@/components/hud/tab/rule/RuleListPanel.vue";
import {Options, Vue} from "vue-class-component";

@Options({
  name: "RuleTab",
  components: {
    RuleListPanel,
  },
})
export default class RuleTab extends Vue {
}
</script>
