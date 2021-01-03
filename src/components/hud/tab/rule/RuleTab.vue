<template>
  <div>
    <rule-list/>
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
import RuleList from "@/components/RuleList.vue";
import {Options, Vue} from "vue-class-component";

@Options({
  name: "RuleTab",
  components: {
    RuleList,
  },
})
export default class RuleTab extends Vue {
}
</script>
