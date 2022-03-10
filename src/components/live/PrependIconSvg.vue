<template>
  <image
    :width="size"
    :height="size"
    :href="iconSrc"
    :transform="`translate(${x}, ${y})`"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  />
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "method-svg",
  props: {
    icon: {
      type: String as () =>
        | "variable"
        | "method"
        | "constructor"
        | "staticMethod"
        | "public"
        | "protected"
        | "private"
        | "staticVariable",
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  components: {},
  data: () => ({}),
  computed: {
    iconSrc() {
      const icon = {
        variable: () => require("@/assets/images/instanceVariable.png"),
        method: () => require("@/assets/images/method.png"),
        constructor: () => require("@/assets/images/constructor.png"),
        staticMethod: () => require("@/assets/images/staticMethod.png"),
        public: () => require("@/assets/images/public.png"),
        protected: () => require("@/assets/images/protected.png"),
        private: () => require("@/assets/images/private.png"),
        staticVariable: () => require("@/assets/images/staticVariable.png")
      }[this.icon];

      return icon != null ? icon() : null;
    },
  },
  watch: {},
  methods: {
    d(d: number) {
      return;
    },
    onMouseEnter() {
      this.$emit("onMouseEnter");
    },
    onMouseLeave() {
      this.$emit("onMouseLeave");
    }
  },
});
</script>
<style lang="scss">
</style>
