
<script lang="ts">
import Vue from "vue";
import * as d3 from "d3";
import { ClassDetailDto, MethodDetailDto } from "@/models";

interface Coordinate {
  x: number;
  y: number;
}

interface Method {
  detail: MethodDetailDto;
  index: number;
  appAddedOn: number;
}

export default Vue.extend({
  name: "method",
  props: {
    svg: {
      type: Object as () => d3.Selection<
        SVGSVGElement,
        unknown,
        HTMLElement,
        any
      >,
      required: true,
    },
    method: {
      type: Object as () => Method,
      required: true,
    },
  },
  render: function (h) {
    return h(); // avoid warning message
  },
  components: {},
  data: () => ({}),
  computed: {},
  watch: {},
  methods: {
    id(id: string) {
      return "method-" + id;
    },
    addedColor(appVersion: number, version: number): string {
      return `rgb(0, ${(version / appVersion) * 255}, 0)`;
    },
    rowColor(index: number) {
      return index % 2 == 0 ? "#b2e7e8" : "#d8f3f3";
    },
  },
  mounted() {
    const titleRowHeight = 30;
    const rowHeight = 20;
    const cornerRadius = 6;
    const prependIconWidth = 20;
    const prependIconHeight = 20;

    const classSpaceX = 350;
    const classSpaceY = 350;

    const classWidth = 250;
    const classPadding = 10;
    const classWidthWithPadding = classWidth + classPadding * 2;
    const classHeight =
      ((this.method.detail.variables?.length ?? 0) +
        (this.method.detail.methods?.length ?? 0) +
        2) *
        rowHeight +
      titleRowHeight;

    const classX = this.class1.index * classSpaceX + classWidthWithPadding;
    const classY = this.class1.index % 2 == 0 ? 0 : classSpaceY;

    // this.classesMetaInfo[this.classId(class1.id!)] = {
    //   coords: { x: classX, y: classY },
    //   width: classWidthWithPadding,
    //   height: classHeight,
    // };

    const g = this.svg
      .selectAll(`#${this.id(this.class1.detail.id!)}`)
      .data([this.class1.detail])
      .enter()
      .append("g")
      .attr("transform", `translate(${classX},${classY})`)
      .attr("id", this.id(this.class1.detail.id!));

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
      .selectAll(`#class-title-${this.class1.detail.id}`)
      .data([this.class1.detail])
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

    for (const [i, variable] of this.class1.detail.variables!.entries()) {
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
          d3.select(this).transition().duration(200).style("fill", "yellow");
        })
        .on("mouseout", function () {
          d3.select(this).transition().duration(200).style("fill", rowColor);
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
          this.addedColor(this.class1.appAddedOn, variable.addedOn!)
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
    const variablesCount = this.class1.detail.variables?.length ?? 0;

    for (const [i, method] of this.class1.detail.methods!.entries()) {
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

      // methodsCoordinates[method.id!] = absCoords;

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
          d3.select(this).transition().duration(200).style("fill", "yellow");
        })
        .on("mouseout", function () {
          d3.select(this).transition().duration(200).style("fill", rowColor);
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
        .style("fill", this.addedColor(this.class1.appAddedOn, method.addedOn!))
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

      // for (const call of method.calls!) {
      //   methodsCalls.push({ startId: method.id!, endId: call });
      // }
    }
  },
});
</script>
<style lang="scss">
</style>
