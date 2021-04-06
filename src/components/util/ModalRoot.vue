<template>
  <modal-component :title="title" @onClose="handleClose">
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
    this.$eventBus.on("open", ({component = null, title = "", props = null}) => {
      this.component = component;
      this.title = title;
      this.props = props;
    });
    // document.addEventListener('keyup', this.handleKeyup);
  }

  beforeDestroy() {
    // document.removeEventListener('keyup', this.handleKeyup);
  }

  handleClose() {
    this.component = null;
  }

  // handleKeyup(e) {
  //   if (e.keyCode === 27) this.handleClose();
  // }
}

</script>
