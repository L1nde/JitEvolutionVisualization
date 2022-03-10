<template>
  <g :transform="`translate(${x}, ${y})`" :id="id">
    <rect
      :width="width + padding * 2"
      :height="height"
      :fill="color"
      :rx="cornerRadius"
      :ry="cornerRadius"
      stroke="black"
      stroke-width="1"
    />
    <g>
      <rect
        :width="width + padding * 2"
        :height="titleRowHeight"
        :fill="titleColor"
        :rx="cornerRadius"
        :ry="cornerRadius"
        stroke="black"
        stroke-width="1"
      />
      <text class="title" v-text="variable.name" :transform="titleTransform" />
    </g>
    <g>
      <text
        v-text="`Kind: ${variable.kind}`"
        :transform="`translate(${padding}, ${rowHeight + titleRowHeight})`"
      />
      <text
        v-text="`Start line: ${variable.startLine}`"
        :transform="`translate(${padding}, ${rowHeight * 2 + titleRowHeight})`"
      />
      <text
        v-text="`Type: ${variable.type}`"
        :transform="`translate(${padding}, ${rowHeight * 3 + titleRowHeight})`"
      />
      <text
        v-text="`Usr: ${variable.usr}`"
        :transform="`translate(${padding}, ${rowHeight * 4 + titleRowHeight})`"
      />
    </g>
    <line
      :x1="originPosition.x - x"
      :x2="0"
      :y1="originPosition.y - y"
      :y2="0"
      stroke="black"
    />
    <line
      :x1="originPosition.x - x"
      :x2="0"
      :y1="originPosition.y - y"
      :y2="height"
      stroke="black"
    />
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { Coordinate, VariableDetailDto } from "@/models";

export default Vue.extend({
  name: "variable-detail-svg",
  props: {
    variable: {
      type: Object as () => VariableDetailDto,
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
    originPosition: {
      type: Object as () => Coordinate,
      required: true,
    },
  },
  components: {},
  data: () => ({
    color: "#B2E7E8",
    titleColor: "#8FB9AA",
    spaceX: 350,
    spaceY: 350,
    titleRowHeight: 30,
    rowHeight: 20,
    cornerRadius: 6,
    width: 250,
    padding: 10,
  }),
  computed: {
    id() {
      return `variable-${this.variable.id}`;
    },
    height() {
      return this.rowHeight * 4 + this.titleRowHeight + this.padding;
    },
    titleTransform() {
      return `translate(${this.width / 2 + this.padding}, ${
        this.titleRowHeight
      })`;
    },
  },
  watch: {},
  methods: {
    d(index: number) {
      return "";
    },
  },
});
</script>
<style lang="scss">
.title {
  fill: black;
  font-size: 1.5rem;
  text-anchor: middle;
}
</style>
