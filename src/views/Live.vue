<template>
  <div>
    <div class="panel">
      <PanZoomComponent
        selector="#moveable-panel"
        :options="{ bounds: false, zoomSpeed: 0.05 }"
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
            v-for="(classDetail, i) in app.classes"
            :style="{
              left: i * 350 + 'px',
              top: (i % 2 == 0 ? (-100 * i) / 2 : 350 - (100 * i) / 2) + 'px',
            }"
            :key="classDetail.id"
            class="class-container"
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
import { AppDetailDto } from "@/models";
import PanZoomComponent from "@/components/pan-zoom/component.vue";

export default Vue.extend({
  name: "Live",

  components: {
    // VueDragResize,
    PanZoomComponent,
  },

  data: () => ({
    app: [] as null | AppDetailDto,
    genX: 0,
    genY: 0,
    links: [] as { start: Coordinate; end: Coordinate }[],
  }),
  async created() {
    this.app = await API.app.get(44282);
    this.createLinks();
  },
  methods: {
    createLinks() {
      this.$nextTick(() => {
        if (this.app?.classes) {
          for (const class1 of this.app?.classes) {
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

        console.log(this.$refs["method-43375"][0].getBoundingClientRect());
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

.panel {
  width: 100vw;
  height: 90vh;
  position: relative;
  margin: auto;
  overflow: hidden;
}
</style>