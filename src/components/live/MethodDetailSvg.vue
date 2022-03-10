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
      <text class="title" v-text="method.name" :transform="titleTransform" />
    </g>
    <g>
      <text
        v-text="`Modifier: ${method.modifier}`"
        :transform="`translate(${padding}, ${rowHeight + titleRowHeight})`"
      />
      <text
        v-text="`Start line: ${method.startLine}`"
        :transform="`translate(${padding}, ${rowHeight * 2 + titleRowHeight})`"
      />
      <text
        v-text="`End line: ${method.endLine}`"
        :transform="`translate(${padding}, ${rowHeight * 3 + titleRowHeight})`"
      />
      <text
        v-text="`Kind: ${method.kind}`"
        :transform="`translate(${padding}, ${rowHeight * 4 + titleRowHeight})`"
      />
      <text
        v-text="`Getter: ${method.isGetter}`"
        :transform="`translate(${padding}, ${rowHeight * 5 + titleRowHeight})`"
      />
      <text
        v-text="`Setter: ${method.isSetter}`"
        :transform="`translate(${padding}, ${rowHeight * 6 + titleRowHeight})`"
      />
      <text
        v-text="`Instructions: ${method.numberOfInstructions}`"
        :transform="`translate(${padding}, ${rowHeight * 7 + titleRowHeight})`"
      />
      <text
        v-text="`Type: ${method.type}`"
        :transform="`translate(${padding}, ${rowHeight * 8 + titleRowHeight})`"
      />
      <text
        v-text="`Cyclomatic complexity: ${method.cyclomaticComplexity}`"
        :transform="`translate(${padding}, ${rowHeight * 9 + titleRowHeight})`"
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
import { Coordinate, MethodDetailDto } from "@/models";

export default Vue.extend({
  name: "method-detail-svg",
  props: {
    method: {
      type: Object as () => MethodDetailDto,
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
      return `method-${this.method.id}`;
    },
    height() {
      return this.rowHeight * 9 + this.titleRowHeight + this.padding;
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
