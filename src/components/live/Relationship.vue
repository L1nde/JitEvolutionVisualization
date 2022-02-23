<template>
  <svg v-if="start && end"
    :style="{position: 'fixed', left: start.x + 'px', top: start.y + 'px', right: end.x + 'px', bottom: end.y + 'px'}"
  >
    <defs>
      <marker
        id="arrowhead"
        markerWidth="5"
        markerHeight="7"
        refX="0"
        refY="1.5"
        orient="auto"
      >
        <polygon points="0 0, 5 1.5, 0 4" />
      </marker>
    </defs>
    <line
      :x1="0"
      :y1="0"
      :x2="end.x - start.x"
      :y2="end.y - start.y"
      stroke="black"
      stroke-width="1"
      marker-end="url(#arrowhead)"
    />
  </svg>
</template>

<script lang="ts">
import Vue from "vue";

interface Coordinate {
  x: number;
  y: number;
}

export default Vue.extend({
  name: "relationship",
  props: {
    start: {
      type: Object
    },
    end: {
      type: Object
    },
  },
  components: {},

  data: () => ({}),

  computed: {},
  watch: {},
  methods: {},
});
</script>
<style lang="scss">
</style>
