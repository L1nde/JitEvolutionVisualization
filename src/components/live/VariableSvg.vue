<template>
  <g>
    <rect
      :width="width"
      :height="height"
      :transform="`translate(${x}, ${y - height / 2})`"
      :fill="color"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    />
    <prepend-icon-svg
      v-for="(icon, i) in prependIcons"
      :key="`${id}-${icon}`"
      :icon="icon"
      :size="iconSize"
      :x="x + i * iconSize"
      :y="y - height / 2"
      @onMouseEnter="onMouseEnter"
      @onMouseLeave="onMouseLeave"
    />
    <text
      :fill="textColor"
      v-text="variable.name"
      dominant-baseline="central"
      :transform="`translate(${x + 20}, ${y})`"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    />
    <button-svg
      v-model="showRelationships"
      :height="height - 4"
      :width="height - 4"
      :x="width - x - (height - 4)"
      :y="y - height / 2 + 2"
      @onMouseEnter="onMouseEnter"
      @onMouseLeave="onMouseLeave"
    />
    <button-svg
      v-model="showDetails"
      :height="height - 4"
      :width="height - 4"
      :x="width - x + 2"
      :y="y - height / 2 + 2"
      @onMouseEnter="onMouseEnter"
      @onMouseLeave="onMouseLeave"
    />
    <line
      :x1="x"
      :x2="x + width"
      :y1="y + height / 2"
      :y2="y + height / 2"
      :stroke="lineColor"
    />
    <variable-detail-svg
      :id="variableDetailId"
      v-if="showDetails || highlight"
      :variable="variable"
      :x="x + width + 100"
      :y="y"
      :originPosition="{ x: x + width, y: y }"
    />
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { Coordinate, VariableDetailDto, VariableKind } from "@/models";
import {
  PrependIconSvg,
  VariableDetailSvg,
  ButtonSvg,
} from "@/components/live";

export default Vue.extend({
  name: "variable-svg",
  props: {
    variable: {
      type: Object as () => VariableDetailDto,
      required: true,
    },
    appAddedOn: {
      type: Number,
      required: true,
    },
    odd: {
      type: Boolean,
      required: true,
    },
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
    classPosition: {
      type: Object as () => Coordinate,
      required: true,
    },
  },
  components: {
    PrependIconSvg,
    VariableDetailSvg,
    ButtonSvg,
  },
  data: () => ({
    lineColor: "black",
    highlight: false,
    iconSize: 20,
    showDetails: false,
    showRelationships: false,
  }),
  computed: {
    id() {
      return `variable-${this.variable.id}`;
    },
    textColor(): string {
      if (this.appAddedOn - this.variable.addedOn! > 3) return `rgb(0, 0, 0)`;
      return `rgb(0, ${(this.variable.addedOn! / this.appAddedOn) * 255}, 0)`;
    },
    color() {
      if (this.highlight) return "yellow";
      return this.odd ? "#d8f3f3" : "#b2e7e8";
    },
    variableDetailId() {
      return `variable-detail-${this.variable.id}`;
    },
    prependIcons() {
      const icons: string[] = [];
      if (this.variable.kind == VariableKind.InstanceVariable)
        icons.push("variable");
      if (this.variable.kind == VariableKind.StaticVariable)
        icons.push("staticVariable");
      return icons;
    },
  },
  watch: {},
  methods: {
    d(appVersion: number, version: number): string {
      return `rgb(0, ${(version / appVersion) * 255}, 0)`;
    },
    onMouseEnter() {
      this.highlight = true;
      this.$store.dispatch("live/addOverlayComponent", {
        id: this.variableDetailId,
        position: { x: this.classPosition.x, y: this.classPosition.y },
      });
      this.$store.dispatch("live/setRelationshipHighlight", {
        id: this.variable.id,
        isHighlighted: true,
        highlightInitiator: this.variable.id
      });

      this.$store.dispatch("live/addRelationshipToOverlayComponent", {
        id: this.variable.id,
        position: { x: 0, y: 0 },
        initiator: this.variable.id
      });
    },
    onMouseLeave() {
      this.highlight = false;
      if (!this.showDetails) {
        this.$store.dispatch("live/removeOverlayComponent", {
          id: this.variableDetailId,
        });
      }

      if (!this.showRelationships) {
        this.$store.dispatch("live/setRelationshipHighlight", {
          id: this.variable.id,
          isHighlighted: false,
          highlightInitiator: this.variable.id
        });

        this.$store.dispatch("live/removeRelationshipFromOverlayComponent", {
          id: this.variable.id,
          initiator: this.variable.id
        });
      }
    },
  },
  async mounted() {
    await this.$store.dispatch("live/saveCoordinates", {
      id: this.variable.id,
      coords: {
        start: {
          x: this.x + this.classPosition.x,
          y: this.y + this.classPosition.y,
        },
        end: {
          x: this.x + this.classPosition.x + this.width,
          y: this.y + this.classPosition.y,
        },
      },
    });
  },
});
</script>
<style lang="scss">
</style>
