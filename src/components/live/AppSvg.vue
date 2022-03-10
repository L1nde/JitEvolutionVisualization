<template>
  <svg :width="width" :height="height" v-if="app">
    <defs>
      <marker
        id="arrow"
        markerUnits="strokeWidth"
        refX="6"
        refY="6"
        markerWidth="12"
        markerHeight="12"
        viewBox="0 0 12 12"
        orient="auto"
      >
        <path d="M2,2 L10,6 L2,10 L6,6 L2,2" fill="black" />
      </marker>
    </defs>
    <g>
      <relationship-svg
        v-for="r in validRelationships"
        :key="r.id"
        :start="r.start"
        :end="r.end"
        :id="r.id"
        :isHighlighted="r.isHighlighted"
      />
    </g>
    <class-svg
      v-for="(class1, i) in app.classes"
      :key="class1.id"
      :class1="class1"
      :index="i"
      :appAddedOn="app.addedOn"
    />
    <use
      v-for="component in overlayComponents"
      :key="component.id"
      :href="`#${component.id}`"
      :x="component.position.x"
      :y="component.position.y"
    />
  </svg>
</template>
<script lang="ts">
import Vue from "vue";
import { ClassSvg, RelationshipSvg } from "@/components/live";
import { AppDetailDto } from "@/models";

export default Vue.extend({
  name: "app-svg",
  props: {
    app: {
      type: Object as () => AppDetailDto,
    },
  },
  components: {
    ClassSvg,
    RelationshipSvg,
  },
  data: () => ({
    width: 50000,
    height: 5000,
  }),
  computed: {
    validRelationships() {
      const coordinates = this.$store.state.live.coordinates;
      const validRelationships = this.$store.state.live.relationships.filter(
        (x: any) => !!coordinates[x.startId] && !!coordinates[x.endId]
      );

      return validRelationships.map((x: any) => {
        return {
          id: x.id,
          isHighlighted: x.isHighlighted,
          start: coordinates[x.startId].end,
          end: coordinates[x.endId].start,
        };
      });
    },
    overlayComponents() {
      return this.$store.state.live.overlayComponents;
    },
  },
  watch: {},
  methods: {
    relationshipId(startId: number, endId: number) {
      return `${startId}-${endId}`;
    },
  },
});
</script>
<style lang="scss">
</style>
