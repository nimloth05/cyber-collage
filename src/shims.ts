import {Emitter} from "mitt";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $eventBus: Emitter;
  }
}
