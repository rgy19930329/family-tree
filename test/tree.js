/*
 * @Desc: test
 * @Author: ranguangyu
 * @Date: 2019-12-04 15:15:32
 */

var width = 1200,
  height = 400;

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
  .attr("transform", "translate(0,30)")

//读取json文件，进行绘图
d3.json("./city.json", function (error, root) {
  console.log(root);
  var nodes = tree.nodes(root);
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
    .attr("width", 40)
    .attr("height", 40)
    .attr("x", -20)
    .attr("y", 0)

  //加文字
  node.append("text")
    // .attr("dx", function (d) { return d.children ? -8 : 8; })
    .attr("dx", 0)
    .attr("dy", 25)
    // .style("text-anchor", function (d) { return d.children ? "end" : "start" })
    .style("text-anchor", "middle")
    .text(function (d) { return d.name })

  // //画线
  // var line = svg.selectAll("link")
  //   .data(links)
  //   .enter()
  //   .append("path")
  //   .attr("class", "link")
  //   .attr("d", diagonal)

  drawLine(links)

});


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
      sourceY = d.source.y + 40,
      targetX = d.target.x,
      targetY = d.target.y;

    return "M" + sourceX + "," + sourceY +
      "V" + ((targetY - sourceY) / 2 + sourceY) +
      "H" + targetX +
      "V" + targetY;
  }
}