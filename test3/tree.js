/*
 * @Desc: test
 * @Author: ranguangyu
 * @Date: 2019-12-04 15:15:32
 */

var width = 1200,
  height = 400;

var cell = 60;
var defaultPortrait = "http://img01.sogoucdn.com/app/a/10010016/abb1e5968c5db5711cdfa2dd3fd63fe1";

//定义数据转换函数
var tree = d3.layout.tree()
  .size([width, height - 100])
// .separation(function (a, b) {
//   return (a.parent == b.parent ? 1 : 2);
// })

//定义对角线生成器diagonal
var diagonal = d3.svg.diagonal()
  .projection(function (d) { return [d.x, d.y] })

// 用来拖拽图以及扩大缩放
let zoom = d3.behavior.zoom()
  .scaleExtent([.5, 5])
  .on("zoom", () => {
    this.svg.attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
  });

//定义svg
var svg = d3.select("#app").append("svg")
  .attr("width", width)
  .attr("height", height)
  .call(zoom)
  .append("g")
  .attr("transform", "translate(0,10)")


console.log(dataSource);
var nodes = tree.nodes(dataSource);
console.log(nodes);
var links = tree.links(nodes);
console.log(links);

//画点
var node = svg.selectAll(".node")
  .data(nodes)
  .enter()
  .append("g")
  .attr("class", "node")
  .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")" })

//加圈圈
// node.append("circle")
//   .attr("r", 20)

node.append("rect")
  .attr("width", d => d.person ? d.person.length * cell : cell)
  .attr("height", cell)
  .attr("x", d => d.person ? d.person.length * (-cell / 2) : (-cell / 2))
  .attr("y", 0)

// 加图片
node.append("image")
  .attr("width", cell)
  .attr("height", cell)
  .attr("x", -cell/2)
  .attr("x", d => {
    if (d.person && d.person.length === 1) {
      return -cell / 2;
    } else if (d.person && d.person.length === 2) {
      return -cell;
    }
  })
  .attr("xlink:href", d => {
    if (d.person && d.person.length > 0) {
      return d.person[0].portrait;
    } else {
      return defaultPortrait;
    }
  })

node.append("image")
  .attr("width", cell)
  .attr("height", cell)
  .attr("x", 0)
  .attr("xlink:href", d => {
    if (d.person && d.person.length === 2) {
      return d.person[1].portrait;
    } else {
      return "";
    }
  })

//加文字
node.append("text")
  // .attr("dx", function (d) { return d.children ? -8 : 8; })
  .attr("dx", 0)
  .attr("dy", cell + 15)
  // .style("text-anchor", function (d) { return d.children ? "end" : "start" })
  .style("text-anchor", "middle")
  .text(function (d) {
    if (d.person && d.person.length > 0) {
      return d.person.map(item => item.name).join("-");
      // return `${d.person[0].name}`
    } else {
      return "";
    }
  })

// //画线
// var line = svg.selectAll("link")
//   .data(links)
//   .enter()
//   .append("path")
//   .attr("class", "link")
//   .attr("d", diagonal)

drawLine(links)


function drawLine(links) {

  var link = svg.selectAll("path.link")

    // The function we are passing provides d3 with an id
    // so that it can track when data is being added and removed.
    // This is not necessary if the tree will only be drawn once
    // as in the basic example.
    .data(links);

  // Add new links    
  link.enter().append("path")
    .attr("class", "link");

  // Remove any links we don't need anymore
  // if part of the tree was collapsed
  link.exit().remove();

  // Update the links positions (old and new)
  link.attr("d", elbow);

  function elbow(d) {
    let sourceX = d.source.x,
      sourceY = d.source.y + cell,
      targetX = d.target.x,
      targetY = d.target.y;

    return "M" + sourceX + "," + sourceY +
      "V" + ((targetY - sourceY) / 2 + sourceY) +
      "H" + targetX +
      "V" + targetY;
  }
}