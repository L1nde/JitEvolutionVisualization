<template>
    <div class="container">
        <div class="container-title">
            Analysis queue
        </div>  
        <div class="container-item" v-for="(item, i) in queueItems" :key="`${item.projectId}-${i}`">
            {{item.projectId}}
            <duration :date="item.changedAtUtc" />
            <b-icon v-if="item.isActive" icon="arrow-clockwise" animation="spin"></b-icon>
            <b-icon v-else icon="hourglass-split" animation="fade"></b-icon>
        </div>
    </div>
</template>
<script lang="ts">
import { QueueItemDto } from "@/models";
import Vue from "vue";
import { Duration } from "../shared";

export default Vue.extend({
  name: "in-progress-analysis",
  props: {
  },
  components: {
    Duration
  },
  data: () => ({
  }),
  computed: {
      queueItems(): QueueItemDto[] {
      return this.$store.state.live.queueItems.map((x: QueueItemDto) => { 
          const firstHypho = x.projectId?.indexOf("-");
          return { projectId: x.projectId?.substring(0, firstHypho && firstHypho != -1 ? firstHypho : 15 ), isActive: x.isActive, changedAtUtc: x.changedAtUtc }
          });
    }
  },
  watch: {},
  methods: {
  },
});
</script>
<style lang="scss" scoped>
@import "@/assets/scss/_variables.scss";
.container {
    position: absolute;
    left: 0;
    border: 1px solid darken($bg, 5%);
    background-color: transparentize(lighten($bg, 10%), 0.5);
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    width: inherit;
    z-index: 1000;

    &-title {
        border-bottom: 3px solid darken($bg, 5%);
        font-size: large;
    }
}
</style>
