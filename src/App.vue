<template>
  <router-view/>
  <modal-root/>
</template>

<script>
import ModalRoot from "@/components/util/ModalRoot.vue";

export default {
  components: {
    ModalRoot,
  },
};
</script>

<style lang="less">
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
