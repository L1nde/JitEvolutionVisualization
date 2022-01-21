<template>
  <div>
    <div class="panel" v-if="$store.state.live.app">
      <PanZoomComponent
        ref="panzoom"
        selector="#moveable-panel"
        :options="{ bounds: false, zoomSpeed: 0.05, transformOrigin: null }"
      >
        <div id="moveable-panel">
          <!-- Todo: Fix width and height -->
          <svg
            width="10000%"
            height="10000%"
            style="position: absolute; top: 0; left: 0; z-index: 0"
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
              v-for="link in links"
              :key="
                link.start.x +
                ' ' +
                link.end.x +
                ' ' +
                link.start.y +
                ' ' +
                link.end.y
              "
              :x1="link.start.x"
              :y1="link.start.y"
              :x2="link.end.x"
              :y2="link.end.y"
              stroke="black"
              stroke-width="1"
              marker-end="url(#arrowhead)"
            />
          </svg>
          <div
            v-for="(classDetail, i) in $store.state.live.app.classes"
            :style="{
              left: i * 350 + 'px',
              top: (i % 2 == 0 ? (-100 * i) / 2 : 350 - (100 * i) / 2) + 'px',
            }"
            :key="classDetail.id"
            class="class-container"
            :ref="'class-' + classDetail.id"
            :class="{
              'class-container__selected':
                'class-' + classDetail.id === selectedClass,
            }"
          >
            <div class="accordion" role="tablist">
              <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-button
                    block
                    v-b-toggle="'accordion-' + classDetail.id"
                    variant="info"
                    >{{ classDetail.name }}</b-button
                  >
                </b-card-header>
                <b-collapse
                  :id="'accordion-' + classDetail.id"
                  visible
                  :accordion="'accordion-' + classDetail.id"
                  role="tabpanel"
                >
                  <b-card-body>
                    <b-card-text>
                      <ul class="class-content">
                        <li
                          v-for="methodDetail in classDetail.variables"
                          :key="methodDetail.id"
                        >
                          {{ methodDetail.name }}
                        </li>
                      </ul>

                      <hr />
                      <ul class="class-content bullet-image">
                        <li
                          v-for="methodDetail in classDetail.methods"
                          :key="methodDetail.id"
                          :ref="'method-' + methodDetail.id"
                        >
                          {{ methodDetail.name }}
                        </li>
                      </ul>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </div>
        </div>
      </PanZoomComponent>
      <!-- </div> -->

      <!-- </VueDragResize> -->
    </div>
  </div>
</template>

<script lang="ts">
interface Coordinate {
  x: number;
  y: number;
}

import Vue from "vue";
import API from "@/api";
import { AppDetailDto, ClassDetailDto } from "@/models";
import PanZoomComponent from "@/components/pan-zoom/component.vue";

export default Vue.extend({
  name: "Live",

  components: {
    PanZoomComponent,
  },

  data: () => ({
    links: [] as { start: Coordinate; end: Coordinate }[],
  }),

  async mounted() {
    if(this.$store.state.live.projectId){
      this.createLinks();
    }
  },
  computed:{
    selectedClass() {
      const selectedClass = 'class-' + this.$store.state.live.app?.classes?.find((x: ClassDetailDto) => x.path?.endsWith(this.$store.state.live.fileUri))?.id;
      this.moveTo(selectedClass);
      return selectedClass;
    },
  },
  methods: {
    moveTo(elementRef: string) {
      const panzoom = this.$refs.panzoom as any;
      const panzoomInstance = panzoom?.$panZoomInstance;
      if (!this.$refs[elementRef]) return;
      const elem = (this.$refs[elementRef] as Element[])[0];

      if (panzoom && panzoomInstance && elem) {
        panzoomInstance.pause();
        const clientRect = elem.getBoundingClientRect();
        const parentContainer = panzoom.$el.getBoundingClientRect();
        const container = elem.parentElement!.getBoundingClientRect();
        panzoomInstance.smoothMoveTo(
          container.left -
            clientRect.left +
            (parentContainer.width / 2 - clientRect.width / 2),
          container.top -
            clientRect.top +
            (parentContainer.height / 2 - clientRect.height / 2)
        );

        panzoomInstance.resume();
      }
    },
    createLinks() {
      this.$nextTick(() => {
        if (this.$store.state.live?.app?.classes) {
          for (const class1 of this.$store.state.live?.app?.classes) {
            if (class1.methodsCalls) {
              for (const call of class1.methodsCalls) {
                if (
                  this.$refs["method-" + call.start] &&
                  this.$refs["method-" + call.end]
                ) {
                  const rectStart =
                    this.$refs[
                      "method-" + call.start
                    ][0].getBoundingClientRect();
                  const rectEnd =
                    this.$refs["method-" + call.end][0].getBoundingClientRect();
                  this.links.push({
                    start: {
                      x: rectStart.left + rectStart.width,
                      y: rectStart.top + rectStart.height / 2,
                    },
                    end: {
                      x: rectEnd.left,
                      y: rectEnd.top + rectEnd.height / 2,
                    },
                  });
                }
              }
            }
          }
        }
      });
    },
  },
});
</script>
<style lang="scss">
.class {
  &-container {
    width: 300px;
    height: 50px;
    position: relative;
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
  list-style-image: url("~@/assets/images/method.png");
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