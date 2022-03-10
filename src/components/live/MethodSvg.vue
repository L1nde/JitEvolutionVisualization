<template>
  <g :id="id">
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
      v-text="method.name"
      dominant-baseline="central"
      :transform="`translate(${x + prependIcons.length * iconSize}, ${y})`"
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
    <method-detail-svg
      :id="methodDetailId"
      v-if="showDetails || highlight"
      :method="method"
      :x="x + width + 100"
      :y="y"
      :originPosition="{ x: x + width, y: y }"
    />
  </g>
</template>
<script lang="ts">
import Vue from "vue";
import { Coordinate, MethodDetailDto, MethodKind, Modifier } from "@/models";
import { PrependIconSvg, MethodDetailSvg, ButtonSvg } from "@/components/live";

export default Vue.extend({
  name: "method-svg",
  props: {
    method: {
      type: Object as () => MethodDetailDto,
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
    MethodDetailSvg,
    ButtonSvg,
  },
  data: () => ({
    lineColor: "black",
    showDetails: false,
    showRelationships: false,
    highlight: false,
    iconSize: 20,
  }),
  computed: {
    id() {
      return `method-${this.method.id}`;
    },
    textColor(): string {
      if (this.appAddedOn - this.method.addedOn! > 3) return `rgb(0, 0, 0)`;
      return `rgb(0, ${(this.method.addedOn! / this.appAddedOn) * 255}, 0)`;
    },
    color() {
      if (this.highlight) return "yellow";
      return this.odd ? "#d8f3f3" : "#b2e7e8";
    },
    methodDetailId() {
      return `method-detail-${this.method.id}`;
    },
    prependIcons() {
      const icons: string[] = [];
      if (this.method.modifier == Modifier.Public) icons.push("public");
      if (this.method.modifier == Modifier.Protected) icons.push("protected");
      if (this.method.modifier == Modifier.Private) icons.push("private");
      if (this.method.kind == MethodKind.InstanceMethod) icons.push("method");
      if (this.method.kind == MethodKind.Constructor) icons.push("constructor");
      if (this.method.kind == MethodKind.StaticMethod)
        icons.push("staticMethod");
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
        id: this.methodDetailId,
        position: { x: this.classPosition.x, y: this.classPosition.y },
      });

      this.$store.dispatch("live/addRelationshipToOverlayComponent", {
        id: this.method.id,
        position: { x: 0, y: 0 },
        initiator: this.method.id
      });

      this.$store.dispatch("live/setRelationshipHighlight", {
        id: this.method.id,
        isHighlighted: true,
        highlightInitiator: this.method.id
      });
    },
    onMouseLeave() {
      this.highlight = false;
      if (!this.showDetails) {
        this.$store.dispatch("live/removeOverlayComponent", {
          id: this.methodDetailId,
        });
      }

      if (!this.showRelationships) {
        this.$store.dispatch("live/removeRelationshipFromOverlayComponent", {
          id: this.method.id,
          initiator: this.method.id
        });

        this.$store.dispatch("live/setRelationshipHighlight", {
          id: this.method.id,
          isHighlighted: false,
          highlightInitiator: this.method.id
        });
      }
    },
  },
  async mounted() {
    // Method calls
    await this.$store.dispatch("live/saveCoordinates", {
      id: this.method.id,
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
    for (const call of this.method.calls!) {
      await this.$store.dispatch("live/createRelationship", {
        id: `${this.method.id}-${call}`,
        startId: this.method.id,
        endId: call,
      });
    }

    // Variable uses
    for (const call of this.method.uses!) {
      await this.$store.dispatch("live/createRelationship", {
        id: `${this.method.id}-${call}`,
        startId: this.method.id,
        endId: call,
      });
    }
  },
});
</script>
<style lang="scss">
</style>
