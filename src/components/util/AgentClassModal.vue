<template>
  <div class="modal fade agent-class-modal" id="agent-class-modal" tabindex="-1" aria-labelledby="agent-class-modal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <agent-list ref="agentList" @agent-clicked="hide"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Modal as BModal} from "bootstrap";
import {Options, Vue} from "vue-class-component";
import AddCommandButton from "@/components/AddCommandButton.vue";
import AgentList from "@/components/hud/AgentList.vue";

@Options({
  name: "AgentClassModal",
  components: {
    AddCommandButton,
    AgentList,
  },
})
export default class AgentClassModal extends Vue {
  private _instance?: BModal;

  get modalInstance() {
    return this._instance != null ? this._instance : new BModal(document.getElementById("agent-class-modal")!);
  }

  hide() {
    this.modalInstance.hide();
  }

  show() {
    this.modalInstance.show();
  }
}
</script>
