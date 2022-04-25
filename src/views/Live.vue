<template>
  <div>
    <in-progress-analysis />
    <loading-layer :isLoading="isLoading" />
    <div class="panel">
      <PanZoomComponent
        ref="panzoom"
        selector="#moveable-panel"
        :options="{ bounds: false, zoomSpeed: 0.05, transformOrigin: null }"
      >
        <div id="moveable-panel">
          <app-svg :app="app" />
        </div>
      </PanZoomComponent>
    </div>
  </div>
</template>

<script lang="ts">

import Vue from "vue";
import { AppDetailDto, ClassDetailDto } from "@/models";
import PanZoomComponent from "@/components/pan-zoom/component.vue";
import { AppSvg } from "@/components/live";
import {LoadingLayer} from "@/components/shared";
import {InProgressAnalysis} from "@/components/live";

export default Vue.extend({
  name: "Live",

  components: {
    PanZoomComponent,
    AppSvg,
    LoadingLayer,
    InProgressAnalysis
  },

  data: () => ({
  }),
  computed: {
    app(): AppDetailDto {
      return this.$store.state.live.app;
    },
    fileUri(): string {
      return this.$store.state.live.fileUri;
    },
    isLoading(): boolean {
      return this.$store.state.live.isLoading;
    }
  },
  watch: {
    fileUri(newFileUri: string, oldFileUri: string) {
      const selectedClassId = 
        this.$store.state.live.app?.classes?.find((x: ClassDetailDto) =>
          x.path?.endsWith(newFileUri)
        )?.id;
      this.moveTo(selectedClassId);
    },
  },
  methods: {
    moveTo(elementRef: number): any {
      const panzoom = this.$refs.panzoom as any;
      const panzoomInstance = panzoom?.$panZoomInstance;
      var classCoordinates = this.$store.state.live.coordinates[elementRef];

      if (!classCoordinates) return;
      if (panzoom && panzoomInstance) {
        panzoomInstance.pause();

        const parentContainer = panzoom.$el.getBoundingClientRect();
        const scale = panzoomInstance.getTransform().scale;
        panzoomInstance.smoothMoveTo(
          -((classCoordinates.start.x + classCoordinates.end.x) / 2) * scale +
            parentContainer.width / 2,
          -((classCoordinates.start.y + classCoordinates.end.y) / 2) * scale +
            parentContainer.height / 2
        );

        panzoomInstance.resume();
      }
      return;
    },
  },
});
</script>
<style lang="scss">
.class {
  &-container {
    width: 300px;
    height: 50px;
    position: absolute;
    border-top: 5px solid transparent;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;

    &__selected {
      border-top: 5px solid yellow;
      border-left: 5px solid yellow;
      border-right: 5px solid yellow;
    }
  }

  &-content {
    line-height: 1rem;
    margin-left: 0;
    padding-left: 0;
    text-align: left;
  }
}

.bullet-image {
  //list-style-image: url("~@/assets/images/method.png");
}

// #moveable-panel {
//   width: 500px;
//   height: 500px;
// }

.panel {
  width: 100vw;
  height: 90vh;
  position: relative;
  margin: auto;
  overflow: hidden;
}
</style>
