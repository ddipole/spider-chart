import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme/theme.service';
import * as d3 from "d3";


@Component({
  selector: 'app-spider-chart',
  templateUrl: './spider-chart.component.html',
  styleUrl: './spider-chart.component.css'
})

export class SpiderChartComponent implements OnInit {
  title = 'coding-assessment';
  constructor(public readonly themeService: ThemeService) { }
  width: any = 600;
  height: any = 600;
  data: any = [];
  radialScale: any;
  features: any = ["CO", "W", "H", "B", "O", "F", "CH", "I"];
  
  colorStops:any = [
    { color: "rgba(255,255,255,1)", position: 0 },
    { color: "rgba(255,255,255,1)", position: 21.86 },
    { color: "rgba(255,255,255,1)", position: 10.43 },
    { color: "rgba(255,255,255,1)", position: 70 },
    { color: "rgba(255,255,255,1)", position: 50 }
  ];

  colorStops1:any = [
    { color: "rgba(255, 88, 180, 0)", position: 0 },
    { color: "rgba(255, 88, 180, 0)", position: 2 },
    { color: "rgba(255, 88, 180, 1)", position: 100 },
    { color: "rgba(255, 88, 180, 1)", position: 10.43 }
  ];


  ngOnInit(): void {
    this.initGraph();
  }

  initGraph() {
    for (var i = 0; i < 2; i++) {
      var point = {}
      this.features.forEach(f => point[f] = 1 + Math.random() * 9.2);
      this.data.push(point);
    }

    let svg = d3.select("body").append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    this.radialScale = d3.scaleLinear()
      .domain([0, 10])
      .range([0, 250]);
    let ticks = [10];

    let gradient = svg.append("defs")
      .append("linearGradient")
      .attr("id", "gridGradient")
      .attr("gradientTransform", "rotate(90)");

    gradient.selectAll("stop")
      .data([
        { offset: "8%", color: "#fff" },
        { offset: "20%", color: "#FF58B4" },
        { offset: "80%", color: "#FF58B4" },
        { offset: "100%", color: "#fff" },
      ])
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color)
      .attr("stop-opacity", d => d.opacity);
    var circles = svg.selectAll("g")
      .data(ticks)
      .enter()
      .append("g");
    circles.append("circle")
      .attr("cx", this.width / 2)
      .attr("cy", this.height / 2)
      .attr("fill", "#27242c")
      .attr("stroke-width", 2)
      .attr("r", d => this.radialScale(d))

    let featureData = this.features.map((f, i) => {
      let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
      return {
        "name": f,
        "angle": angle,
        "line_coord": this.angleToCoordinate(angle, 12),
        "label_coord": this.angleToCoordinate(angle, 10.9),
        "labelPointer": this.angleToCoordinate(angle, 12.5)
      };
    });

    svg.selectAll(".circularGrid")
      .data(featureData)
      .join(
        enter => enter.append("line")
          .attr("x2", this.width / 2)
          .attr("y2", this.height / 2)
          .attr("x1", d => d.line_coord.x)
          .attr("y1", d => d.line_coord.y)
          .attr("stroke", (d, i) => {
            const length = 100;
            const position = (i / featureData.length) * length;
            const color1 = "#f777bd";
            const color2 = "#fff";
            const interpolatedColor = d3.interpolate(color1, color2);
            return interpolatedColor(position / 100);
          })
          .attr("stroke-width", 2)
      );

    svg.selectAll(".circularGrid")
      .data(featureData)
      .join(
        enter => enter.append("line")
          .attr("x1", this.width / 2)
          .attr("y1", this.height / 2)
          .attr("x2", d => d.labelPointer.x)
          .attr("y2", d => d.labelPointer.y)
          .attr("stroke", "url(#gridGradient)")
          .attr("stroke-width", 2)
      );

    svg.selectAll(".axislabel")
      .data(featureData)
      .join(
        enter => enter.append("text")
          .attr("x", d => d.label_coord.x)
          .attr("y", d => d.label_coord.y)
          .attr("fill", "#d2326a")
          .text(d => d.name)
          .style("font-size", "20px")
          .on("mouseover", (event, d) => this.showTooltip(event, d.name))
          .on("mouseout", () => this.hideTooltip())

      );

    let line = d3.line()
      .x(d => d.x)
      .y(d => d.y);    


    let averageColorArray1 = this.colorStops1.reduce((acc, { color, position }) => {
      let [r, g, b, a] = color.match(/\d+/g)!.map(Number);
      let weight = position / 100;
      return [
        acc[0] + r * weight,
        acc[1] + g * weight,
        acc[2] + b * weight,
        acc[3] + a * weight
      ];
    }, [0, 0, 0, 0]);
    let averageColor1 = d3.color(`rgba(${averageColorArray1.map(Math.round)})`).hex();
    let averageColorArray = this.colorStops.reduce((acc, { color, position }) => {
      let [r, g, b, a] = color.match(/\d+/g)!.map(Number);
      let weight = position / 100;
      return [
        acc[0] + r * weight,
        acc[1] + g * weight,
        acc[2] + b * weight,
        acc[3] + a * weight
      ];
    }, [0, 0, 0, 0]);

    let averageColor = d3.color(`rgba(${averageColorArray.map(Math.round)})`).hex();

    svg.selectAll(".radar-path")
      .data(this.data)
      .join(
        enter => enter.append("path")
          .attr("class", "radar-path")
          .datum(d => this.getPathCoordinates(d))
          .attr("d", line)
          .attr("stroke-width", 2)
          .attr("stroke", (_, i) => averageColor)
          .attr("fill", (_, i) => averageColor1)
          .attr("stroke-opacity", 1)
          .attr("opacity", 0.2)
      );

    svg.selectAll(".data-point")
      .data(this.data)
      .join(
        enter => enter.selectAll("circle")
          .data(d => this.getPathCoordinates(d))
          .join(
            innerEnter => innerEnter.append("circle")
              .attr("cx", d => d.x)
              .attr("cy", d => d.y)
              .attr("r", 3)
              .attr("fill", "pink")
          )
      );

    svg.append("defs")
      .append("radialGradient")
      .attr("id", "innerCircleGradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "black" },
        { offset: "100%", color: "transparent" }
      ])
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    svg.insert("circle")
      .attr("cx", this.width / 2)
      .attr("cy", this.height / 2)
      .style("fill", "url(#innerCircleGradient)")
      .attr("r", 150)
      .raise();
  }
  
  getPathCoordinates(data_point) {
    let coordinates = [];
    for (var i = 0; i < this.features.length; i++) {
      let ft_name = this.features[i];
      let angle = (Math.PI / 2) + (2 * Math.PI * i / this.features.length);
      coordinates.push(this.angleToCoordinate(angle, data_point[ft_name]));
    }
    return coordinates;
  }

  angleToCoordinate(angle, value) {
    let x = Math.cos(angle) * this.radialScale(value);
    let y = Math.sin(angle) * this.radialScale(value);
    return { "x": this.width / 2 + x, "y": this.height / 2 - y };
  }

  private showTooltip(event, label) {
    const tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("background", "#fff")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("pointer-events", "none")
      .html(`<strong>${label}</strong>`);

    const mouseX = event.pageX;
    const mouseY = event.pageY;
    const tooltipTop = mouseY - 50;
    tooltip.style("left", mouseX + "px")
      .style("top", tooltipTop + "px");
  }

  private hideTooltip() {
    d3.select(".tooltip").remove();
  }

}
