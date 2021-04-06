<template>
  <modal-component ref="modalComponent" :title="title" @onClose="handleClose">
    <component :is="component" @onClose="handleClose" v-bind="props"/>
  </modal-component>
</template>

<script lang="ts">
import {Options, Vue} from "vue-class-component";
import ModalComponent from "@/components/util/ModalComponent.vue";
import "@/shims";

@Options({
  name: "ModalRoot",
  components: {
    ModalComponent,
  },
})
export default class ModalRoot extends Vue {
  private component: any = null;
  private title = "";
  private props: any = null;

  created() {
    this.$eventBus.on("open", (data: any) => {
      this.component = data.component;
      this.title = data.title ?? "";
      this.props = data.props ?? {};
      (this.$refs.modalComponent as any).show();
    });
  }

  handleClose() {
    this.component = null;
    this.props = null;
    (this.$refs.modalComponent as any).hide();
  }
}

</script>
