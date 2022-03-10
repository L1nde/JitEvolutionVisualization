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
      <text class="title" v-text="class1.name" :transform="titleTransform" />
    </g>
    <variable-svg
      v-for="(variable, i) in class1.variables"
      :key="variable.id"
      :appAddedOn="appAddedOn"
      :height="rowHeight"
      :width="width"
      :variable="variable"
      :odd="i % 2 != 0"
      :x="padding"
      :y="rowHeight * (i + 1) + titleRowHeight"
      :classPosition="{ x: x, y: y }"
    />

    <method-svg
      v-for="(method, i) in class1.methods"
      :key="method.id"
      :appAddedOn="appAddedOn"
      :height="rowHeight"
      :width="width"
      :method="method"
      :odd="i % 2 != 0"
      :x="padding"
      :y="rowHeight * (i + 2 + variablesCount) + titleRowHeight"
      :classPosition="{ x: x, y: y }"
    />
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { ClassDetailDto } from "@/models";
import { VariableSvg, MethodSvg } from "@/components/live";

export default Vue.extend({
  name: "class-svg",
  props: {
    class1: {
      type: Object as () => ClassDetailDto,
      required: true,
    },
    appAddedOn: {
      type: Number,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  components: {
    VariableSvg,
    MethodSvg,
  },
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
      return `class-${this.class1.id}`;
    },
    x() {
      return this.index * this.spaceX + this.width + this.padding * 2;
    },
    y(): number {
      return this.index % 2 == 0 ? 0 : this.spaceY;
    },
    height() {
      return (
        ((this.class1.variables?.length ?? 0) +
          (this.class1.methods?.length ?? 0) +
          2) *
          this.rowHeight +
        this.titleRowHeight
      );
    },
    titleTransform() {
      return `translate(${this.width / 2 + this.padding}, ${
        this.titleRowHeight
      })`;
    },
    variablesCount() {
      return this.class1.variables?.length ?? 0;
    },
  },
  watch: {},
  methods: {
    d(index: number) {
      return "";
    },
  },
  async mounted() {
    await this.$store.dispatch("live/saveCoordinates", {
      id: this.class1.id,
      coords: {
        start: {
          x: this.x,
          y: this.y,
        },
        end: {
          x: this.x + this.width,
          y: this.y + this.height,
        },
      },
    });
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
