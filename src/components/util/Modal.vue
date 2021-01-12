<template>
  <div class="modal fade" id="agent-class-modal" tabindex="-1" aria-labelledby="agent-class-modal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <agent-list @agent-clicked="hide"/>
        </div>
      </div>
    </div>
  </div>

  <!--  &lt;!&ndash; Modal &ndash;&gt;-->
  <!--  <div class="modal fade" id="agentClassModal" tabindex="-1" aria-labelledby="agentClassModal" aria-hidden="true">-->
  <!--    <div class="modal-dialog">-->
  <!--      <div class="modal-content">-->
  <!--        <div class="modal-body">-->
  <!--          <agent-list/>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->
</template>

<script lang="ts">
import {Modal as BModal} from "bootstrap";
import {Options, Vue} from "vue-class-component";
import {ActionInstance} from "@/model/ActionInstance";
import AddCommandButton from "@/components/AddCommandButton.vue";
import AgentList from "@/components/hud/AgentList.vue";

@Options({
  name: "Modal",
  components: {
    AddCommandButton,
    AgentList,
  },
})
export default class Modal extends Vue {
  actions!: Array<ActionInstance>;

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
