<template>
  <div class="modal fade agent-class-modal" tabindex="-1" aria-labelledby="agent-class-modal"
       aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <agent-list @agent-clicked="agentSelected"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {Modal as BModal} from "bootstrap";
import {Options, Vue} from "vue-class-component";
import AgentList from "@/components/hud/AgentList.vue";
import {AgentClass} from "@/engine/agent/AgentClass";

@Options({
  name: "AgentClassModal",
  emits: [
    "agent-clicked",
  ],
  components: {
    AgentList,
  },
})
export default class AgentClassModal extends Vue {
  private _instance?: BModal;

  get modalInstance() {
    return this._instance != null ? this._instance : new BModal(document.getElementById(this.$el.getAttribute("id"))!);
  }

  hide(): void {
    this.modalInstance.hide();
  }

  show(): void {
    this.modalInstance.show();
  }

  agentSelected(event: AgentClass): void {
    this.$emit("agent-clicked", event);
    this.hide();
  }
}
</script>
