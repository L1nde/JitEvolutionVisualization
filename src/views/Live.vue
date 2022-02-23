<template>
  <div>
    <div class="panel" v-if="app">
      <PanZoomComponent
        ref="panzoom"
        selector="#moveable-panel"
        :options="{ bounds: false, zoomSpeed: 0.05, transformOrigin: null }"
      >
        <div id="moveable-panel"></div>
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
import * as d3 from "d3";

export default Vue.extend({
  name: "Live",

  components: {
    PanZoomComponent,
    //Relationship,
  },

  data: () => ({
    methodCoordinates: {} as { [id: string]: Coordinate },
    recalculateRelationships: false,
    gdp: [
      { country: "USA", value: 20.5 },
      { country: "China", value: 13.4 },
      { country: "Germany", value: 4.0 },
      { country: "Japan", value: 4.9 },
      { country: "France", value: 2.8 },
    ],
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
    app(): AppDetailDto {
      return this.$store.state.live.app;
    },
  },
  watch: {
    app(newApp: AppDetailDto, oldApp: AppDetailDto) {
      this.$nextTick(() => {
        this.generate();
      });
      this.recalculateRelationships = true;
    },
  },
  methods: {
    generate() {
      const w = 50000;
      const h = 50000;
      const classSpaceX = 350;
      const classSpaceY = 350;
      const titleRowHeight = 30;
      const rowHeight = 20;
      const prependIconWidth = 20;
      const prependIconHeight = 20;

      const cornerRadius = 6;

      const methodsCoordinates: {
        [id: string]: { start: Coordinate; end: Coordinate };
      } = {};

      const methodsCalls: { startId: string; endId: string }[] = [];

      d3.select("#moveable-panel").selectChildren().remove();
      const svg = d3
        .select("#moveable-panel")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

      for (const [i, class1] of this.app.classes!.entries()) {
        const classWidth = 250;
        const classHeight =
          ((class1.variables?.length ?? 0) +
            (class1.methods?.length ?? 0) +
            1) *
            rowHeight +
          titleRowHeight;

        const classX = i * classSpaceX + classWidth;
        const classY = i % 2 == 0 ? 0 : classSpaceY;

        const g = svg
          .selectAll(`#class-${class1.id}`)
          .data([class1])
          .enter()
          .append("g")
          .attr("transform", `translate(${classX},${classY})`);

        g.append("rect")
          .style("fill", "#B2E7E8")
          .attr("width", classWidth)
          .attr("height", classHeight)
          .attr("transform", `translate(0,0)`)
          .attr("rx", cornerRadius)
          .attr("ry", cornerRadius);

        g.append("text")
          .text(function (d) {
            return d.name!;
          })
          .style("fill", "black")
          .style("font-size", "1.5rem")
          .style("text-anchor", "middle")
          .attr("transform", `translate(${classWidth / 2},${titleRowHeight})`);

        const gTitle = g
          .selectAll(`#class-title-${class1.id}`)
          .data([class1])
          .enter()
          .append("g")
          .attr("transform", `translate(0,0)`);

        gTitle
          .append("rect")
          .style("fill", "#8FB9AA")
          .attr("width", classWidth)
          .attr("height", titleRowHeight)
          .attr("rx", cornerRadius)
          .attr("ry", cornerRadius);

        gTitle
          .append("text")
          .text(function (d) {
            return d.name!;
          })
          .style("fill", "black")
          .style("font-size", "1.5rem")
          .style("text-anchor", "middle")
          .attr("transform", `translate(${classWidth / 2},${titleRowHeight})`);

        for (const [i, variable] of class1.variables!.entries()) {
          const gVariables = g
            .selectAll(`#variable-${variable.id}`)
            .data([variable])
            .enter()
            .append("g");

          gVariables
            .append("text")
            .text(function (d) {
              return d.name!;
            })
            .style("fill", "black")
            .attr(
              "transform",
              "translate(" +
                0 +
                "," +
                (rowHeight * (i + 1) + titleRowHeight) +
                ")"
            )
            .on("mouseenter", function () {
              d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "yellow");
            })
            .on("mouseout", function () {
              d3.select(this).transition().duration(200).style("fill", "black");
            });
        }
        const variablesCount = class1.variables?.length ?? 0;

        for (const [i, method] of class1.methods!.entries()) {
          const gMethods = g
            .selectAll(`#method-${method.id}`)
            .data([method])
            .enter()
            .append("g");

          const coords = {
            start: {
              x: 0,
              y: rowHeight * (i + 1 + variablesCount) + titleRowHeight,
            },
            end: {
              x: 0 + 250,
              y: rowHeight * (i + 1 + variablesCount) + titleRowHeight,
            },
          };

          const absCoords = {
            start: {
              x: coords.start.x + classX,
              y: coords.start.y + classY,
            },
            end: {
              x: coords.end.x + classX,
              y: coords.end.y + classY,
            },
          };

          methodsCoordinates[method.id!] = absCoords;

          gMethods
            .append("image")
            .attr("width", prependIconWidth)
            .attr("height", prependIconHeight)
            .attr(
              "transform",
              `translate(${coords.start.x}, ${coords.start.y - rowHeight / 2})`
            )
            .attr("xlink:href", "method.png");

          gMethods
            .append("text")
            .text(function (d) {
              return d.name!;
            })
            .style("fill", "black")
            .attr("dominant-baseline", "central")
            .attr(
              "transform",
              `translate(${coords.start.x + prependIconWidth}, ${
                coords.start.y
              })`
            )
            .on("mouseenter", function () {
              d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "yellow");
            })
            .on("mouseout", function () {
              d3.select(this).transition().duration(200).style("fill", "black");
            });

          for (const call of method.calls!) {
            methodsCalls.push({ startId: method.id!, endId: call });
          }
        }
      }

      const gCalls = svg.selectAll(`#calls`).enter().append("g");

      for (const call of methodsCalls) {
        const start = methodsCoordinates[call.startId];
        const end = methodsCoordinates[call.endId];
        if (!start || !end) continue;

        const c = 1;
        const vectorX = end.end.x - start.start.x;
        const vectorY = end.end.y - start.start.y;
        const raise = -1 / (vectorY / vectorX);
        const controlPoint = {
          x: (2 * start.start.x + vectorX / 2) / 2 + c,
          y: (2 * start.start.y + vectorY / 2) / 2 + c * raise,
        };
        svg
          .append("path")
          .style("stroke-width", "1")
          .style("stroke", "black")
          .attr("fill", "none")
          .attr(
            "d",
            `M ${start.start.x},${start.start.y} Q ${controlPoint.x},${
              controlPoint.y
            } ${(end.end.x + start.start.x) / 2},${
              (end.start.y + start.start.y) / 2
            } T ${end.end.x},${end.end.y}`
          );
      }
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
