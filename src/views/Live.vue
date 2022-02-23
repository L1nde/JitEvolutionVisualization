<template>
  <div>
    <div class="panel" v-if="app">
      <PanZoomComponent
        ref="panzoom"
        selector="#moveable-panel"
        :options="{ bounds: false, zoomSpeed: 0.05, transformOrigin: null }"
      >
        <div id="moveable-panel">
          <div
            v-for="(classDetail, i) in app.classes"
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
                          v-for="variableDetail in classDetail.variables"
                          :key="variableDetail.id"
                        >
                          <span
                            :style="{
                              color: addedColor(
                                app.addedOn,
                                variableDetail.addedOn
                              ),
                            }"
                            >{{ variableDetail.name }}</span
                          >
                        </li>
                      </ul>

                      <hr />
                      <ul class="class-content bullet-image">
                        <li
                          v-for="methodDetail in classDetail.methods"
                          :key="methodDetail.id"
                          :ref="methodId(methodDetail.id)"
                        >
                          <span
                            :style="{
                              color: addedColor(
                                $store.state.live.app.addedOn,
                                methodDetail.addedOn
                              ),
                            }"
                            >{{ methodDetail.name }}</span
                          >
                          <relationship
                            v-for="call in methodDetail.calls"
                            :key="'method-' + methodDetail.id + '-' + call"
                            :start="methodCoordinate(methodDetail.id)"
                            :end="methodCoordinate(call)"
                          />
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
import Relationship from "@/components/live/Relationship.vue";
import * as d3 from "d3";

export default Vue.extend({
  name: "Live",

  components: {
    PanZoomComponent,
    Relationship,
  },
  
  data: () => ({
    methodCoordinates: {} as { [id: string]: Coordinate },
    recalculateRelationships: false,
    gdp: [
        {country: "USA", value: 20.5 },
        {country: "China", value: 13.4 },
        {country: "Germany", value: 4.0 },
        {country: "Japan", value: 4.9 },
        {country: "France", value: 2.8 }
      ]
  }),
  updated() {
    if (this.recalculateRelationships) {
      this.methodCoordinates = Object.assign({}, this.calculateRelationships());
      this.recalculateRelationships = false;
    }
  },
  computed: {
    selectedClass() {
      const selectedClass =
        "class-" +
        this.$store.state.live.app?.classes?.find((x: ClassDetailDto) =>
          x.path?.endsWith(this.$store.state.live.fileUri)
        )?.id;
      (this as any).moveTo(selectedClass);
      return selectedClass;
    },
    app() {
      this.generate();
      return this.$store.state.live.app;
    },
  },
  watch: {
    app(newApp: AppDetailDto, oldApp: AppDetailDto) {
      this.recalculateRelationships = true;
    },
  },
  methods: {
    generate(){
    const w = 500;
      const h = 500;

      const svg = d3
        .select("#app")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      const sortedGDP = this.gdp.sort((a, b) => (a.value > b.value ? 1 : -1));
      const color = d3.scaleOrdinal(d3.schemeDark2);

      const max_gdp = d3.max(sortedGDP, o => o.value);

      const angleScale = d3
        .scaleLinear()
        .domain([0, max_gdp])
        .range([0, 1.5 * Math.PI]);

      const arc = d3
        .arc()
        .innerRadius((d, i) => (i + 1) * 25)
        .outerRadius((d, i) => (i + 2) * 25)
        .startAngle(angleScale(0))
        .endAngle(d => angleScale(d.value));

      const g = svg.append("g");

      g.selectAll("path")
        .data(sortedGDP)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d, i) => color(i))
        .attr("stroke", "#FFF")
        .attr("stroke-width", "1px")
        .on("mouseenter", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", 0.5);
        })
        .on("mouseout", function() {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("opacity", 1);
        });

      g.selectAll("text")
        .data(this.gdp)
        .enter()
        .append("text")
        .text(d => `${d.country} -  ${d.value} Trillion`)
        .attr("x", -150)
        .attr("dy", -8)
        .attr("y", (d, i) => -(i + 1) * 25);

      g.attr("transform", "translate(200,300)");

      console.log(34)
  },
    methodCoordinate(id: string) {
      return this.methodCoordinates[this.methodId(id)];
    },
    methodId(id: string) {
      return "method-" + id;
    },
    addedColor(appVersion: number, version: number): string {
      return `rgb(0, ${(version / appVersion) * 255}, 0)`;
    },
    moveTo(elementRef: string): any {
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
      return;
    },
    calculateRelationships() {
      let relationships: { [id: string]: Coordinate } = {};
      for (let class1 of this.app.classes!) {
        for (let method of class1.methods!) {
          let ref = this.$refs[this.methodId(method.id!)] as Element[];
          if (ref && ref[0]) {
            console.log(3);
            let rect = ref[0].getBoundingClientRect();
            relationships[this.methodId(method.id!)] = {
              x: rect.left + rect.width,
              y: rect.top + rect.height / 2,
            };
          }
        }
      }

      return relationships;
    },
    createLinks(): any {
      this.$nextTick(() => {
        if (this.$store.state.live?.app?.classes) {
          for (const class1 of this.$store.state.live?.app?.classes) {
            if (class1.methodsCalls) {
              for (const call of class1.methodsCalls) {
                if (
                  this.$refs["method-" + call.start] &&
                  this.$refs["method-" + call.end]
                ) {
                  const rectStart = (
                    this.$refs["method-" + call.start] as Element[]
                  )[0].getBoundingClientRect();
                  const rectEnd = (
                    this.$refs["method-" + call.end] as Element[]
                  )[0].getBoundingClientRect();
                  // this.links.push({
                  //   start: {
                  //     x: rectStart.left + rectStart.width,
                  //     y: rectStart.top + rectStart.height / 2,
                  //   },
                  //   end: {
                  //     x: rectEnd.left,
                  //     y: rectEnd.top + rectEnd.height / 2,
                  //   },
                  // });
                }
              }
            }
          }
        }
      });
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
