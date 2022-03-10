<template>
  <g>
    <rect
    :width="width"
      :height="height"
      :transform="`translate(${x}, ${y})`"
      :fill="color"
      @click="onClick"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"/>
  </g>
</template>
<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "button-svg",
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
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
    value: {
        type: Boolean,
        required: true
    }
  },
  components: {
  },
  data: () => ({
  }),
  computed: {
    color() {
        return this.value ? "#27cd88" : "#72d3d5";
    },
  },
  watch: {},
  methods: {
    d(appVersion: number, version: number): string {
      return `rgb(0, ${(version / appVersion) * 255}, 0)`;
    },
    onClick() {
        this.$emit("input", !this.value)
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
