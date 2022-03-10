<template>
  <path
    :stroke-width="strokeWidth"
    :stroke="stroke"
    :fill="fill"
    :d="`M ${start.x},${start.y} Q ${controlPoint.x},${controlPoint.y} ${
      (end.x + start.x) / 2
    },${(end.y + start.y) / 2} T ${end.x},${end.y}`"
    marker-start="url(#arrow)"
    marker-end="url(#arrow)"
  />
</template>
<script lang="ts">
import Vue from "vue";
import { Coordinate } from "@/models";

export default Vue.extend({
  name: "relationship-svg",
  props: {
    start: {
      type: Object as () => Coordinate,
      required: true,
    },
    end: {
      type: Object as () => Coordinate,
      required: true,
    },
    isHighlighted: {
      type: Boolean,
      required: true,
    },
  },
  components: {},
  data: () => ({
    fill: "none",
  }),
  computed: {
    controlPoint(): Coordinate {
      const c = 10;
      const vectorX = this.end.x - this.start.x;
      const vectorY = this.end.y - this.start.y;
      const raise = -1 / (vectorY / vectorX);
      return {
        x: (2 * this.start.x + vectorX / 2) / 2 + c,
        y: (2 * this.start.y + vectorY / 2) / 2 + c * raise,
      };
    },
    strokeWidth(): number {
      if (this.isHighlighted) return 2;
      return 1;
    },
    stroke(): string {
      if (this.isHighlighted) return "black";
      return "#919191";
    },
  },
  watch: {},
  methods: {
  },
});
</script>
<style lang="scss">
</style>
