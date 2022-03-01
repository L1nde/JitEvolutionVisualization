<template>
  <svg></svg>
</template>
<script lang="ts">
import Vue from "vue";
import * as d3 from "d3";
import { AppDetailDto, ClassDetailDto } from "@/models";

interface Coordinate {
  x: number;
  y: number;
}

export default Vue.extend({
  name: "app-svg",
  props: {
    app: {
      type: Object as () => AppDetailDto
    },
  },
  components: {},
  data: () => ({
    width: 50000,
    height: 50000,
    classesMetaInfo: {} as {
      [id: string]: { coords: Coordinate; width: number; height: number };
    },
  }),
  computed: {},
  watch: {
    app(newApp, oldApp) {
      if (newApp) {
        const start = Date.now();
        this.generate();
        console.log(Date.now() - start);
      }
    }
  },
  methods: {
    classId(id: string) {
      return "class-" + id;
    },
    methodId(id: string) {
      return "method-" + id;
    },
    variableId(id: string) {
      return "variable-" + id;
    },
    addedColor(appVersion: number, version: number): string {
      return `rgb(0, ${(version / appVersion) * 255}, 0)`;
    },
    rowColor(index: number) {
      return index % 2 == 0 ? "#b2e7e8" : "#d8f3f3";
    },
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

      d3.select("#moveable-panel").select("svg").selectChildren().remove();
      const svg = d3
        .select("#moveable-panel")
        .select("svg")
        .attr("width", w)
        .attr("height", h);

      svg
        .append("defs")
        .append("marker")
        .attr("id", "arrow")
        .attr("markerUnits", "strokeWidth")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .attr("viewBox", "0 0 12 12")
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
        .style("fill", "black");

      for (const [i, class1] of this.app.classes!.entries()) {
        const classWidth = 250;
        const classPadding = 10;
        const classWidthWithPadding = classWidth + classPadding * 2;
        const classHeight =
          ((class1.variables?.length ?? 0) +
            (class1.methods?.length ?? 0) +
            2) *
            rowHeight +
          titleRowHeight;

        const classX = i * classSpaceX + classWidthWithPadding;
        const classY = i % 2 == 0 ? 0 : classSpaceY;
        this.classesMetaInfo[this.classId(class1.id!)] = {
          coords: { x: classX, y: classY },
          width: classWidthWithPadding,
          height: classHeight,
        };

        const g = svg
          .selectAll(`#${this.classId(class1.id!)}`)
          .data([class1])
          .enter()
          .append("g")
          .attr("transform", `translate(${classX},${classY})`)
          .attr("id", this.classId(class1.id!));

        g.append("rect")
          .style("fill", "#B2E7E8")
          .attr("width", classWidthWithPadding)
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
          .attr(
            "transform",
            `translate(${classWidthWithPadding / 2},${titleRowHeight})`
          );

        const gTitle = g
          .selectAll(`#class-title-${class1.id}`)
          .data([class1])
          .enter()
          .append("g")
          .attr("transform", `translate(0,0)`);

        gTitle
          .append("rect")
          .style("fill", "#8FB9AA")
          .attr("width", classWidthWithPadding)
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
          .attr(
            "transform",
            `translate(${classWidthWithPadding / 2},${titleRowHeight})`
          );

        for (const [i, variable] of class1.variables!.entries()) {
          const gVariables = g
            .selectAll(`#${this.variableId(variable.id!)}`)
            .data([variable])
            .enter()
            .append("g");

          const rowColor = this.rowColor(i);

          const coords = {
            start: {
              x: 0,
              y: rowHeight * (i + 1) + titleRowHeight,
            },
            end: {
              x: classWidth,
              y: rowHeight * (i + 1) + titleRowHeight,
            },
          };

          gVariables
            .append("rect")
            .style("fill", rowColor)
            .attr("width", classWidth)
            .attr("height", rowHeight)
            .attr(
              "transform",
              `translate(${coords.start.x + classPadding}, ${
                coords.start.y - rowHeight / 2
              })`
            )
            .on("mouseenter", function () {
              d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "yellow");
            })
            .on("mouseout", function () {
              d3.select(this)
                .transition()
                .duration(200)
                .style("fill", rowColor);
            });

          gVariables
            .append("image")
            .attr("width", prependIconWidth)
            .attr("height", prependIconHeight)
            .attr(
              "transform",
              `translate(${coords.start.x + classPadding}, ${
                coords.start.y - rowHeight / 2
              })`
            )
            .attr("xlink:href", "instanceVariable.png");

          gVariables
            .append("text")
            .text(function (d) {
              return d.name!;
            })
            .style(
              "fill",
              this.addedColor(this.app.addedOn!, variable.addedOn!)
            )
            .attr("dominant-baseline", "central")
            .attr(
              "transform",
              `translate(${coords.start.x + prependIconWidth + classPadding},${
                coords.start.y
              })`
            );

          gVariables
            .append("line")
            .style("fill", "black")
            .attr("x1", coords.start.x + classPadding)
            .attr("x2", coords.start.x + classWidth + classPadding)
            .attr("y1", coords.start.y + rowHeight / 2)
            .attr("y2", coords.start.y + rowHeight / 2)
            .attr("stroke", "black");
        }
        const variablesCount = class1.variables?.length ?? 0;

        for (const [i, method] of class1.methods!.entries()) {
          const gMethods = g
            .selectAll(`#${this.methodId(method.id!)}`)
            .data([method])
            .enter()
            .append("g");

          const coords = {
            start: {
              x: 0,
              y: rowHeight * (i + 2 + variablesCount) + titleRowHeight,
            },
            end: {
              x: classWidth,
              y: rowHeight * (i + 2 + variablesCount) + titleRowHeight,
            },
          };

          const absCoords = {
            start: {
              x: coords.start.x + classX + classPadding / 2,
              y: coords.start.y + classY,
            },
            end: {
              x: coords.end.x + classX + classPadding + classPadding / 2,
              y: coords.end.y + classY,
            },
          };

          methodsCoordinates[method.id!] = absCoords;

          const rowColor = this.rowColor(i);

          gMethods
            .append("rect")
            .style("fill", rowColor)
            .attr("width", classWidth)
            .attr("height", rowHeight)
            .attr(
              "transform",
              `translate(${coords.start.x + classPadding}, ${
                coords.start.y - rowHeight / 2
              })`
            )
            .on("mouseenter", function () {
              d3.select(this)
                .transition()
                .duration(200)
                .style("fill", "yellow");
            })
            .on("mouseout", function () {
              d3.select(this)
                .transition()
                .duration(200)
                .style("fill", rowColor);
            });

          gMethods
            .append("image")
            .attr("width", prependIconWidth)
            .attr("height", prependIconHeight)
            .attr(
              "transform",
              `translate(${coords.start.x + classPadding}, ${
                coords.start.y - rowHeight / 2
              })`
            )
            .attr("xlink:href", "method2.png");

          gMethods
            .append("text")
            .text(function (d) {
              return d.name!;
            })
            .style("fill", this.addedColor(this.app.addedOn!, method.addedOn!))
            .attr("dominant-baseline", "central")
            .attr(
              "transform",
              `translate(${coords.start.x + prependIconWidth + classPadding}, ${
                coords.start.y
              })`
            );

          gMethods
            .append("line")
            .style("fill", "black")
            .attr("x1", coords.start.x + classPadding)
            .attr("x2", coords.start.x + classWidth + classPadding)
            .attr("y1", coords.start.y + rowHeight / 2)
            .attr("y2", coords.start.y + rowHeight / 2)
            .attr("stroke", "black");

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
          )
          .attr("marker-start", "url(#arrow)")
          .attr("marker-end", "url(#arrow)");
      }
    },
  },
});
</script>
<style lang="scss">
</style>
