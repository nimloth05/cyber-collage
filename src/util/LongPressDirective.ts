import {DirectiveBinding, ObjectDirective} from "vue";

export function createLongPressDirective(): ObjectDirective {
  return {
    beforeMount(el: any, binding: DirectiveBinding): void {
      const vm = binding.instance as any;
      //
      // vm._longPress = {
      //   timeOut: -1,
      //   preventMouseUp: false,
      //   onMouseUp: function (e: Event) {
      //     clearTimeout(vm._longPress.timeOut);
      //     if (vm._longPress.preventMouseUp) {
      //       e.preventDefault();
      //     }
      //     vm._longPress.preventMouseUp = false;
      //   },
      //   onMouseDown: function (e: Event) {
      //     vm._longPress.timeOut = setTimeout(() => {
      //       // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      //       // @ts-ignore
      //       binding.value.call(this, e);
      //       vm._longPress.preventMouseUp = true;
      //     }, 300);
      //   },
      // };
      //
      // el.addEventListener("mousedown", vm._longPress.onMouseDown);
      // document.addEventListener("mouseup", vm._longPress.onMouseUp);

      vm._longPress = {};
      vm._longPress.handler = function (e: Event) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const instance = this as any;
        binding.value.call(instance, e);
      };

      el.addEventListener("long-press", vm._longPress.handler);
    },

    beforeUnmount(el: any, binding: DirectiveBinding): void {
      const instance = binding.instance as any;
      el.removeEventListener("long-press", instance._longPress.handler);
      // clearTimeout(instance._timeOut);
      // el.removeEventListener("mousedown", instance._longPress.onMouseDown);
      // document.removeEventListener("mouseup", instance._longPress.onMouseUp);
    },
  };
}
